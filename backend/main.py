from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from recommend import generate_recommendations

from fastapi import FastAPI
from data import HeritageStore
from delhi_places import delhi_places
from user import create_user, get_user , find_user_by_name
from chatbot import get_ai_response
from bookings import create_booking, get_user_bookings
from payments import process_payment
from comments import add_comment, get_comments, delete_comment
from likes import increment_like, get_likes
from auth import create_access_token, verify_password, get_current_user


app = FastAPI(title="Delhi Heritage Backend")

class RegisterRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: str
    user_type: Optional[str] = "indian"
    interests: Optional[List[str]] = []


class LoginRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: str


class RecommendRequest(BaseModel):
    time: Optional[int] = 6



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://heritage-and-culture-portal.vercel.app",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


store = HeritageStore()


store.add_bulk(delhi_places)

# Simple discussions data exposed to frontend
discussions = [
    {
        "id": 1,
        "communityId": 2,
        "author": "Ananya",
        "text": "What are your favorite cultural events to attend in winter?",
        "likes": 32,
        "comments": 11,
    },
    {
        "id": 2,
        "communityId": 4,
        "author": "Rahul",
        "text": "Looking for authentic food routes during upcoming festivals. Suggestions?",
        "likes": 21,
        "comments": 8,
    },
    {
        "id": 3,
        "communityId": 5,
        "author": "Sanya",
        "text": "Which apps are best for documenting local heritage sites with photos?",
        "likes": 18,
        "comments": 6,
    },
    {
        "id": 4,
        "communityId": 1,
        "author": "Vivek",
        "text": "Any ideas for a health awareness campaign at the neighborhood level?",
        "likes": 26,
        "comments": 13,
    },
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

@app.post("/register")
async def register(data: RegisterRequest):
    # Use provided name or fallback to email local-part
    name = data.name
    if not name and data.email:
        name = data.email.split("@")[0]

    # Check duplicates explicitly to give a helpful message
    from user import find_user_by_email

    if data.email:
        existing_by_email = find_user_by_email(data.email)
        if existing_by_email:
            raise HTTPException(status_code=400, detail="Email already in use")

    if name:
        existing_by_name = find_user_by_name(name)
        if existing_by_name:
            raise HTTPException(status_code=400, detail="Name already in use")

    user = create_user(
        name=name,
        password=data.password,
        email=data.email,
        user_type=data.user_type,
        interests=data.interests
    )

    if user is None:
        # fallback catch-all
        raise HTTPException(status_code=400, detail="User already exists")

    return {"message": "User registered successfully", "user": {"user_id": user["user_id"], "name": user["name"], "email": user.get("email")}}


@app.post("/login")
async def login(data: LoginRequest):
    identifier = data.name or data.email

    if not identifier:
        raise HTTPException(status_code=400, detail="Name or email required")

    from user import find_user_by_email

    # Prefer explicit email flow for clearer messages
    user = None
    if data.email:
        user = find_user_by_email(data.email)
        if not user:
            raise HTTPException(status_code=401, detail="Account does not exist with this email")
        # user exists by email; verify password
        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Password is wrong")
    else:
        # fallback to name-based login
        user = find_user_by_name(data.name)
        if not user:
            raise HTTPException(status_code=401, detail="Account does not exist with this name")
        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Password is wrong")

    token = create_access_token(user["user_id"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user["user_id"],
        "name": user["name"],
        "email": user.get("email")
    }


@app.post("/chat")
def chat_endpoint(data: dict):
    """Chat endpoint that forwards to the chatbot helper."""
    message = data.get("message", "")
    history = data.get("conversation_history", [])
    resp = get_ai_response(message, conversation_history=history)
    return {"response": resp}


@app.post("/bookings")
def create_booking_endpoint(data: dict):
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

    booking = create_booking(
        user_id=user_id,
        place_name=place.get("name", place_key),
        place_key=place_key,
        visit_date=visit_date,
        num_tickets=num_tickets,
        ticket_type=ticket_type,
        price=price,
    )
    return booking


@app.get("/bookings")
def get_bookings(user_id: str | None = None):
    if user_id:
        return get_user_bookings(user_id)
    return {"error": "user_id query param is required"}


@app.post("/payments")
def process_payment_endpoint(data: dict):
    booking_id = data.get("booking_id")
    user_id = data.get("user_id")
    amount = data.get("amount")
    payment_method = data.get("payment_method", "card")
    upi_id = data.get("upi_id")

    if not booking_id or not user_id or amount is None:
        return {"error": "booking_id, user_id and amount are required"}

    payment = process_payment(
        booking_id=booking_id,
        user_id=user_id,
        amount=float(amount),
        payment_method=payment_method,
        upi_id=upi_id,
    )
    return payment


@app.get("/discussions")
def get_discussions():
    # merge persisted likes (stored as deltas) and compute comment counts from storage
    merged = []
    for d in discussions:
        d_copy = d.copy()
        stored_likes = get_likes(d["id"]) or 0
        baseline_likes = int(d_copy.get("likes", 0))
        d_copy["likes"] = baseline_likes + int(stored_likes)
        # compute comments count from persisted comments
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
    # increment stored likes by user id
    new_stored_total = increment_like(discussion_id, str(user_id))
    # find baseline from discussions list
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
    comment = add_comment(discussion_id=discussion_id, author=author, text=text)
    return comment


@app.delete("/comments")
def comments_delete(comment_id: str | None = None):
    if not comment_id:
        return {"error": "comment_id is required"}
    deleted = delete_comment(comment_id)
    if not deleted:
        return {"error": "comment not found"}
    return {"deleted": comment_id}

@app.post("/recommend")
async def recommend(data: RecommendRequest, user_id: str = Depends(get_current_user)):
    user = get_user(user_id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    all_places = store.get_all()

    recommended = generate_recommendations(
        user=user,
        places=all_places,
        time_available=data.time
    )

    return {
        "recommended_places": recommended
    }

