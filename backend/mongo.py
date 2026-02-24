from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

# If Mongo is unavailable (missing URL, no network, etc.) we gracefully
# fall back to file-based storage in user.py. Keep collections optional.
client = None
users_collection = None
bookings_collection = None
places_collection = None
payments_collection = None

if MONGO_URL:
    try:
        client = AsyncIOMotorClient(
            MONGO_URL,
            serverSelectionTimeoutMS=4000,
            connectTimeoutMS=4000,
        )
        db = client["heritage_db"]
        users_collection = db["users"]
        bookings_collection = db["bookings"]
        places_collection = db["places"]
        payments_collection = db["payments"]
        print("Connected to MongoDB")
    except Exception as exc:  # pragma: no cover - network/credential errors
        # Log and continue; user.py will switch to file storage.
        print(f"Mongo connection failed, using file storage fallback: {exc}")
else:
    print("MONGO_URL not set; using file storage fallback for user data")
