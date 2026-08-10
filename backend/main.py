from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi import Response
from fastapi import Depends
from fastapi.responses import JSONResponse
import requests
import json
from pathlib import Path
from datetime import datetime
from data import HeritageStore
from delhi_places import delhi_places
from india_places import india_places
from chatbot import get_ai_response
from bookings import create_booking, get_user_bookings
from recommend import generate_recommendations
from payments import process_payment
from user import create_user, get_user, find_user_by_name, find_user_by_email
from auth import verify_password, create_access_token, get_current_user


app = FastAPI(title="Delhi Heritage Backend")

# Unified file-based state store (used when MongoDB is unavailable).
DATA_DIR = Path(__file__).resolve().parent / "data"
LIKES_FILE = DATA_DIR / "likes.json"
COMMENTS_FILE = DATA_DIR / "comments.json"
GOV_REPORTS_FILE = DATA_DIR / "gov_reports.json"


def _read_json_file(file_path: Path, default):
    try:
        if not file_path.exists():
            return default
        with file_path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except Exception:
        return default


def _write_json_file(file_path: Path, payload):
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with file_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)


def get_likes(discussion_id: int):
    likes_map = _read_json_file(LIKES_FILE, {})
    return len(likes_map.get(str(discussion_id), []))


def increment_like(discussion_id: int, user_id: str):
    likes_map = _read_json_file(LIKES_FILE, {})
    key = str(discussion_id)
    users = likes_map.get(key, [])
    if user_id not in users:
        users.append(user_id)
    likes_map[key] = users
    _write_json_file(LIKES_FILE, likes_map)
    return len(users)


def get_comments(discussion_id: int | None = None):
    comments = _read_json_file(COMMENTS_FILE, [])
    if discussion_id is None:
        return comments
    return [c for c in comments if int(c.get("discussion_id", 0)) == int(discussion_id)]


def add_comment(discussion_id: int, author: str, text: str):
    comments = _read_json_file(COMMENTS_FILE, [])
    comment = {
        "comment_id": f"CMT_{int(datetime.utcnow().timestamp() * 1000)}_{len(comments)}",
        "discussion_id": int(discussion_id),
        "author": author,
        "text": text,
        "created_at": datetime.utcnow().isoformat(),
    }
    comments.append(comment)
    _write_json_file(COMMENTS_FILE, comments)
    return comment


def delete_comment(comment_id: str):
    comments = _read_json_file(COMMENTS_FILE, [])
    updated = [c for c in comments if str(
        c.get("comment_id")) != str(comment_id)]
    if len(updated) == len(comments):
        return False
    _write_json_file(COMMENTS_FILE, updated)
    return True


def get_gov_reports(status: str | None = None):
    reports = _read_json_file(GOV_REPORTS_FILE, [])
    if status:
        return [r for r in reports if str(r.get("status", "")).lower() == status.lower()]
    return reports


def add_gov_report(payload: dict):
    reports = _read_json_file(GOV_REPORTS_FILE, [])
    report = {
        "report_id": f"RPT_{int(datetime.utcnow().timestamp() * 1000)}",
        "site_name": payload.get("site_name"),
        "issue_type": payload.get("issue_type", "other"),
        "description": payload.get("description", ""),
        "reported_by": payload.get("reported_by", "anonymous"),
        "status": "open",
        "priority": payload.get("priority", "medium"),
        "created_at": datetime.utcnow().isoformat(),
    }
    reports.append(report)
    _write_json_file(GOV_REPORTS_FILE, reports)
    return report


def update_gov_report_status(report_id: str, status: str, reviewed_by: str | None = None):
    reports = _read_json_file(GOV_REPORTS_FILE, [])
    allowed = {"open", "closed"}
    normalized_status = str(status or "").strip().lower()
    if normalized_status not in allowed:
        return None

    updated_report = None
    for report in reports:
        if str(report.get("report_id")) == str(report_id):
            report["status"] = normalized_status
            report["updated_at"] = datetime.utcnow().isoformat()
            if reviewed_by:
                report["reviewed_by"] = reviewed_by
            updated_report = report
            break

    if not updated_report:
        return False

    _write_json_file(GOV_REPORTS_FILE, reports)
    return updated_report


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://ar-vr-explore.vercel.app",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


store = HeritageStore()
store.add_bulk(delhi_places)
store.add_bulk(india_places)

discussions = [
    {"id": 1, "communityId": 2, "author": "Ananya",
        "text": "What are your favorite cultural events to attend in winter?", "likes": 32, "comments": 11},
    {"id": 2, "communityId": 4, "author": "Rahul",
        "text": "Looking for authentic food routes during upcoming festivals. Suggestions?", "likes": 21, "comments": 8},
    {"id": 3, "communityId": 5, "author": "Sanya",
        "text": "Which apps are best for documenting local heritage sites with photos?", "likes": 18, "comments": 6},
    {"id": 4, "communityId": 1, "author": "Vivek",
        "text": "Any ideas for a health awareness campaign at the neighborhood level?", "likes": 26, "comments": 13},
]


@app.get("/")
def home():
    return {"message": "Delhi Heritage Backend running"}


@app.get("/places")
def get_all_places():
    return store.get_all()


@app.get("/places/{place_key}")
def get_place(place_key: str):
    place = store.get_place(place_key)
    if not place:
        return {"error": "Place not found"}
    return place


@app.get("/proxy-image")
def proxy_image(url: str):
    if not url:
        return Response(status_code=400, content=b"url query param is required")
    try:
        parsed_host = url.split("//")[-1].split("/")[0].lower()
        headers = {"User-Agent": "Mozilla/5.0", "Accept": "image/*,*/*;q=0.8"}
        if "unsplash.com" in parsed_host or "images.unsplash.com" in parsed_host:
            headers["Referer"] = "https://unsplash.com"
        resp = requests.get(url, headers=headers, timeout=20, stream=True)
        resp.raise_for_status()
        content = resp.content
        ctype = resp.headers.get("Content-Type", "image/jpeg")
        return Response(content=content, media_type=ctype, headers={"Access-Control-Allow-Origin": "*"})
    except requests.exceptions.RequestException as e:
        return Response(status_code=502, content=str(e).encode("utf-8"))


@app.post("/login")
async def login(data: dict):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not password:
        return JSONResponse(status_code=400, content={"error": "Password is required"})
    if not name and not email:
        return JSONResponse(status_code=400, content={"error": "Email is required"})

    user = await find_user_by_email(email) if email else await find_user_by_name(name)

    if not user:
        return JSONResponse(status_code=404, content={"error": "No account found with that email"})
    if not verify_password(password, user["password"]):
        return JSONResponse(status_code=401, content={"error": "Incorrect password"})

    token = create_access_token(user["user_id"])

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user_id": user["user_id"],
        "name": user["name"],
        "email": user.get("email"),
    }


@app.post("/signup")
async def signup(data: dict):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return JSONResponse(status_code=400, content={"error": "Name, email, and password are required"})

    user, conflict = await create_user(
        name=name,
        password=password,
        email=email,
        user_type=data.get("user_type", "indian"),
        interests=data.get("interests", [])
    )

    if not user:
        if conflict == "email":
            return JSONResponse(status_code=409, content={"error": "An account with that email already exists"})
        if conflict == "name":
            return JSONResponse(status_code=409, content={"error": "That username is already taken"})
        return JSONResponse(status_code=500, content={"error": "Unable to create account"})

    return {"message": "User created successfully"}


@app.post("/recommend")
async def recommend(data: dict, user_id: str = Depends(get_current_user)):
    time_limit = data.get("time", 6)
    user = await get_user(user_id)
    if not user:
        return {"error": "User not found"}
    places = store.get_all()
    itinerary = generate_recommendations(
        user=user, places=places, time_available=int(float(time_limit)))
    return itinerary


@app.post("/chat")
async def chat_endpoint(data: dict):
    message = data.get("message", "")
    history = data.get("conversation_history", [])
    # Async: the Gemini call yields to the event loop instead of blocking it,
    # and get_ai_response serves common queries from a TTL cache.
    resp = await get_ai_response(message, conversation_history=history)
    return {"response": resp}


# FIX: changed from `def` to `async def` and added `await` — create_booking is async (uses Motor/MongoDB)
@app.post("/bookings")
async def create_booking_endpoint(data: dict):
    user_id = data.get("user_id")
    place_key = data.get("place_key")
    visit_date = data.get("visit_date")
    num_tickets = int(data.get("num_tickets", 1))
    ticket_type = data.get("ticket_type", "indian")

    if not user_id or not place_key or not visit_date:
        return {"error": "user_id, place_key and visit_date are required"}

    place = store.get_place(place_key)
    if not place:
        for item in store.get_all():
            item_name = (item.get("name") or "").lower().replace(" ", "_")
            if item_name == str(place_key).lower().replace(" ", "_"):
                place = item
                break

    if not place:
        return {"error": "Place not found"}

    tickets = place.get("tickets", {}) if isinstance(place, dict) else {}
    price = float(tickets.get(ticket_type, 0))

    booking = await create_booking(
        user_id=user_id,
        place_name=place.get("name", place_key),
        place_key=place_key,
        visit_date=visit_date,
        num_tickets=num_tickets,
        ticket_type=ticket_type,
        price=price,
    )
    return booking


# FIX: changed from `def` to `async def` and added `await` — get_user_bookings is async
@app.get("/bookings")
async def get_bookings(user_id: str | None = None):
    if user_id:
        return await get_user_bookings(user_id)
    return {"error": "user_id query param is required"}


# FIX: changed from `def` to `async def` and added `await` — process_payment is async
@app.post("/payments")
async def process_payment_endpoint(data: dict):
    booking_id = data.get("booking_id")
    user_id = data.get("user_id")
    amount = data.get("amount")
    payment_method = data.get("payment_method", "card")
    upi_id = data.get("upi_id")

    if not booking_id or not user_id or amount is None:
        return {"error": "booking_id, user_id and amount are required"}

    payment = await process_payment(
        booking_id=booking_id,
        user_id=user_id,
        amount=float(amount),
        payment_method=payment_method,
        upi_id=upi_id,
    )
    return payment


@app.get("/discussions")
def get_discussions():
    merged = []
    for d in discussions:
        d_copy = d.copy()
        stored_likes = get_likes(d["id"]) or 0
        baseline_likes = int(d_copy.get("likes", 0))
        d_copy["likes"] = baseline_likes + int(stored_likes)
        d_copy["comments"] = len(get_comments(d["id"]))
        merged.append(d_copy)
    return merged


@app.post("/like")
def like_endpoint(data: dict):
    discussion_id = data.get("discussion_id")
    user_id = data.get("user_id")
    if not discussion_id:
        return {"error": "discussion_id is required"}
    if not user_id:
        return {"error": "user_id is required to like"}
    new_stored_total = increment_like(discussion_id, str(user_id))
    baseline = 0
    for d in discussions:
        if int(d["id"]) == int(discussion_id):
            baseline = int(d.get("likes", 0))
            break
    total = baseline + int(new_stored_total)
    return {"discussion_id": int(discussion_id), "likes": total}


@app.get("/comments")
def comments_get(discussion_id: int | None = None):
    return get_comments(discussion_id)


@app.post("/comments")
def comments_post(data: dict):
    discussion_id = data.get("discussion_id")
    author = data.get("author", "anonymous")
    text = data.get("text", "")
    if not discussion_id or not text:
        return {"error": "discussion_id and text are required"}
    comment = add_comment(discussion_id=discussion_id,
                          author=author, text=text)
    return comment


@app.delete("/comments")
def comments_delete(comment_id: str | None = None):
    if not comment_id:
        return {"error": "comment_id is required"}
    deleted = delete_comment(comment_id)
    if not deleted:
        return {"error": "comment not found"}
    return {"deleted": comment_id}


@app.get("/gov/metrics")
def gov_metrics():
    places = store.get_all()
    reports = get_gov_reports()
    open_reports = [r for r in reports if r.get("status") == "open"]
    closed_reports = [r for r in reports if r.get("status") == "closed"]
    comments = get_comments()
    likes_map = _read_json_file(LIKES_FILE, {})
    total_likes = sum(len(v) for v in likes_map.values())
    return {
        "total_places": len(places),
        "total_discussions": len(discussions),
        "total_comments": len(comments),
        "total_likes": total_likes,
        "total_reports": len(reports),
        "open_reports": len(open_reports),
        "closed_reports": len(closed_reports),
        "updated_at": datetime.utcnow().isoformat(),
    }


@app.get("/gov/reports")
def gov_reports(status: str | None = None):
    return get_gov_reports(status=status)


@app.post("/gov/reports")
def gov_reports_create(data: dict):
    site_name = data.get("site_name")
    description = data.get("description")
    if not site_name or not description:
        return {"error": "site_name and description are required"}
    return add_gov_report(data)


@app.patch("/gov/reports/{report_id}/status")
def gov_reports_update_status(report_id: str, data: dict):
    status = data.get("status")
    reviewed_by = data.get("reviewed_by")
    if not status:
        return {"error": "status is required"}
    updated = update_gov_report_status(
        report_id=report_id, status=status, reviewed_by=reviewed_by)
    if updated is None:
        return {"error": "status must be open or closed"}
    if updated is False:
        return {"error": "report not found"}
    return updated
