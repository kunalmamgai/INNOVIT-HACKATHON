from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL not set in environment")

client = AsyncIOMotorClient(MONGO_URL)

db = client["heritage_db"]

users_collection = db["users"]
bookings_collection = db["bookings"]
places_collection = db["places"]
payments_collection = db["payments"]

print("Connected to MongoDB Atlas")
