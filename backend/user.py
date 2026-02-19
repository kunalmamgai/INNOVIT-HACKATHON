import json
import os
import uuid
from datetime import datetime
from auth import hash_password

USERS_FILE = "user.json"

# ----------------------------
# Load Users Safely
# ----------------------------


def load_users():
    if not os.path.exists(USERS_FILE):
        return {}

    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


users = load_users()

# ----------------------------
# Save Users
# ----------------------------


def save_users():
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

# ----------------------------
# Create User
# ----------------------------


def create_user(name: str, password: str, email: str = None, user_type="indian", interests=None):
    if interests is None:
        interests = []

    # Check if user already exists by name or email
    for user in users.values():
        if user.get("name") == name:
            return None  # user already exists by name
        if email and user.get("email") == email:
            return None  # user already exists by email

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)

    user_data = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "interests": interests,
        "created_at": datetime.utcnow().isoformat()
    }

    users[user_id] = user_data
    save_users()

    return user_data

# ----------------------------
# Get User
# ----------------------------


def get_user(user_id: str):
    return users.get(user_id)

# ----------------------------
# Find User by Name
# ----------------------------


def find_user_by_name(name: str):
    for user in users.values():
        if user["name"] == name:
            return user
    return None


def find_user_by_email(email: str):
    for user in users.values():
        if user.get("email") == email:
            return user
    return None
