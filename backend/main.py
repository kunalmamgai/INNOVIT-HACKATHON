from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from data import HeritageStore
from delhi_places import delhi_places
from india_places import india_places

from user import (
    create_user,
    find_user_by_email,
    find_user_by_name,
    get_user
)

from chatbot import get_ai_response
from bookings import create_booking, get_user_bookings
from payments import process_payment
from auth import create_access_token, verify_password, get_current_user
from recommend import generate_recommendations


app = FastAPI(title="Delhi Heritage Backend")


# =========================
# MODELS
# =========================

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


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://heritage-and-culture-portal.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# STATIC EXPLORE DATA
# =========================

store = HeritageStore()
store.add_bulk(delhi_places)
store.add_bulk(india_places)


@app.get("/")
def home():
    return {"message": "Delhi Heritage Backend running"}


@app.get("/places")
def get_places():
    return store.get_all()


@app.get("/places/{place_key}")
def get_place(place_key: str):
    place = store.get_place(place_key)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place


# =========================
# AUTH (Mongo)
# =========================

@app.post("/register")
async def register(data: RegisterRequest):

    name = data.name
    if not name and data.email:
        name = data.email.split("@")[0]

    if data.email:
        existing_email = await find_user_by_email(data.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already in use")

    if name:
        existing_name = await find_user_by_name(name)
        if existing_name:
            raise HTTPException(status_code=400, detail="Name already in use")

    user = await create_user(
        name=name,
        password=data.password,
        email=data.email,
        user_type=data.user_type,
        interests=data.interests
    )

    return {
        "message": "User registered successfully",
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user.get("email")
        }
    }


@app.post("/login")
async def login(data: LoginRequest):

    user = None

    if data.email:
        user = await find_user_by_email(data.email)
        if not user:
            raise HTTPException(
                status_code=401, detail="Account does not exist with this email")

    elif data.name:
        user = await find_user_by_name(data.name)
        if not user:
            raise HTTPException(
                status_code=401, detail="Account does not exist with this name")

    else:
        raise HTTPException(status_code=400, detail="Name or email required")

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


# =========================
# CHAT
# =========================

@app.post("/chat")
async def chat_endpoint(data: dict):
    message = data.get("message", "")
    history = data.get("conversation_history", [])
    resp = get_ai_response(message, conversation_history=history)
    return {"response": resp}


# =========================
# BOOKINGS (Mongo)
# =========================

@app.post("/bookings")
async def create_booking_endpoint(data: dict):
    booking = await create_booking(**data)
    return booking


@app.get("/bookings")
async def get_bookings(user_id: str | None = None):
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    return await get_user_bookings(user_id)


# =========================
# PAYMENTS (Mongo)
# =========================

@app.post("/payments")
async def process_payment_endpoint(data: dict):
    payment = await process_payment(**data)
    return payment


# =========================
# RECOMMEND
# =========================

@app.post("/recommend")
async def recommend(data: RecommendRequest, user_id: str = Depends(get_current_user)):

    user = await get_user(user_id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    all_places = store.get_all()

    recommended = generate_recommendations(
        user=user,
        places=all_places,
        time_available=data.time
    )

    return {"recommended_places": recommended}
