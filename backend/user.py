from datetime import datetime
import json
import uuid
from pathlib import Path

from pymongo.errors import PyMongoError

from auth import hash_password
from mongo import users_collection

# File fallback (used when MongoDB is unavailable)
DATA_DIR = Path(__file__).resolve().parent / "data"
USER_FILE = DATA_DIR / "user.json"


def _read_user_file():
    if not USER_FILE.exists():
        return {}
    try:
        with USER_FILE.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except Exception:
        return {}


def _write_user_file(data: dict):
    USER_FILE.parent.mkdir(parents=True, exist_ok=True)
    with USER_FILE.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=False)


async def _create_user_in_mongo(user_data: dict):
    await users_collection.insert_one(user_data)


def _create_user_in_file(user_data: dict):
    data = _read_user_file()
    data[user_data["user_id"]] = {
        "user_id": user_data["user_id"],
        "name": user_data["name"],
        "email": user_data.get("email"),
        "password": user_data["password"],
        "user_type": user_data.get("user_type", "indian"),
        "interests": user_data.get("interests", []),
        "created_at": user_data.get("created_at", datetime.utcnow().isoformat()),
    }
    _write_user_file(data)


def _find_user_in_file(predicate):
    data = _read_user_file()
    for user in data.values():
        if predicate(user):
            return user
    return None


# ----------------------------
# Create User
# returns (user_data, None) on success, (None, "name"|"email") on conflict
# ----------------------------


async def create_user(name: str, password: str, email: str = None,
                      user_type="indian", interests=None):

    if interests is None:
        interests = []

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)
    user_data = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "interests": interests,
        "created_at": datetime.utcnow().isoformat(),
    }

    # Prefer Mongo if available, otherwise fall back to file storage to avoid hanging requests.
    if users_collection is not None:
        try:
            if await users_collection.find_one({"name": name}):
                return None, "name"
            if email and await users_collection.find_one({"email": email}):
                return None, "email"
            await _create_user_in_mongo(user_data)
            return user_data, None
        except PyMongoError as exc:
            print(f"Mongo error, using file storage for user create: {exc}")
        except Exception as exc:  # pragma: no cover - unexpected DB issues
            print(f"Unexpected Mongo issue, using file storage: {exc}")

    # File-based fallback
    existing_by_name = _find_user_in_file(lambda u: u.get("name") == name)
    if existing_by_name:
        return None, "name"
    if email:
        existing_by_email = _find_user_in_file(lambda u: u.get("email") == email)
        if existing_by_email:
            return None, "email"
    _create_user_in_file(user_data)
    return user_data, None


# ----------------------------
# Get User by ID
# ----------------------------


async def get_user(user_id: str):
    if users_collection is not None:
        try:
            return await users_collection.find_one({"user_id": user_id})
        except PyMongoError as exc:
            print(f"Mongo error when fetching user by id: {exc}")
    return _find_user_in_file(lambda u: u.get("user_id") == user_id)


# ----------------------------
# Find User by Name
# ----------------------------


async def find_user_by_name(name: str):
    if users_collection is not None:
        try:
            return await users_collection.find_one({"name": name})
        except PyMongoError as exc:
            print(f"Mongo error when fetching user by name: {exc}")
    return _find_user_in_file(lambda u: u.get("name") == name)


# ----------------------------
# Find User by Email
# ----------------------------


async def find_user_by_email(email: str):
    if users_collection is not None:
        try:
            return await users_collection.find_one({"email": email})
        except PyMongoError as exc:
            print(f"Mongo error when fetching user by email: {exc}")
    return _find_user_in_file(lambda u: u.get("email") == email)
