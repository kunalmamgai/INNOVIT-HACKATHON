from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from data import HeritageStore
from delhi_places import delhi_places
from user import create_user, get_user
from chatbot import get_ai_response
from bookings import create_booking, get_user_bookings
from payments import process_payment


app = FastAPI(title="Delhi Heritage Backend")


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


@app.post("/login")
def login(data: dict):
    user = create_user(
        name=data["name"],
        user_type=data.get("user_type", "indian"),
        interests=data.get("interests", [])
    )
    return user


@app.post("/recommend")
def recommend(data: dict):
    user_id = data.get("user_id")
    time_limit = data.get("time", 6)

    user = get_user(user_id)
    if not user:
        return {"error": "User not logged in"}

    return {"error": "Recommendation feature coming soon"}


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
