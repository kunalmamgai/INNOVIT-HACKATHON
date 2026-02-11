from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from data import HeritageStore
from delhi_places import delhi_places
from user import create_user, get_user


app = FastAPI(title="Delhi Heritage Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-vercel-app.vercel.app"],  # Add your Vercel URL after deployment
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

    return recommend_places (
        store=store,
        user=user,
        time_limit=time_limit
    )
