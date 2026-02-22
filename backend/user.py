from bson import ObjectId
from datetime import datetime
import uuid

from auth import hash_password
from mongo import users_collection


# ----------------------------
# Create User
# ----------------------------

async def create_user(name: str, password: str, email: str = None,
                      user_type="indian", interests=None):

    if interests is None:
        interests = []

    # Check if name exists
    existing_name = await users_collection.find_one({"name": name})
    if existing_name:
        return None

    # Check if email exists
    if email:
        existing_email = await users_collection.find_one({"email": email})
        if existing_email:
            return None

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)

    user_data = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "interests": interests,
        "created_at": datetime.utcnow()
    }

    await users_collection.insert_one(user_data)

    return user_data


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
