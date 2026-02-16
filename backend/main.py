from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from data import HeritageStore
from delhi_places import delhi_places
from user import create_user, get_user
from chatbot import get_ai_response


app = FastAPI(title="Delhi Heritage Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://heritage-and-cultue-portal.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
