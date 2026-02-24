from datetime import datetime
import uuid

from auth import hash_password
from mongo import users_collection

# NOTE: removed unused `from bson import ObjectId`


# ----------------------------
# Create User
# FIX: returns (user_data, None) on success, (None, "name"|"email") on conflict
# so the caller can give a specific error message to the user
# ----------------------------

async def create_user(name: str, password: str, email: str = None,
                      user_type="indian", interests=None):

    if interests is None:
        interests = []

    # Check if name is taken
    if await users_collection.find_one({"name": name}):
        return None, "name"

    # Check if email is taken
    if email and await users_collection.find_one({"email": email}):
        return None, "email"

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)

    user_data = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "interests": interests,
        "created_at": datetime.utcnow(),
    }

    await users_collection.insert_one(user_data)

    return user_data, None


# ----------------------------
# Get User by ID
# ----------------------------

async def get_user(user_id: str):
    return await users_collection.find_one({"user_id": user_id})


# ----------------------------
# Find User by Name
# ----------------------------

async def find_user_by_name(name: str):
    return await users_collection.find_one({"name": name})


# ----------------------------
# Find User by Email
# ----------------------------

async def find_user_by_email(email: str):
    return await users_collection.find_one({"email": email})
