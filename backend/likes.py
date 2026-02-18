import json
import os

LIKES_FILE = "likes.json"


def load_likes():
    if os.path.exists(LIKES_FILE):
        try:
            with open(LIKES_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    return {}


def save_likes(likes):
    with open(LIKES_FILE, "w") as f:
        json.dump(likes, f, indent=2)


def _normalize_list(val):
    # if value is int (legacy), convert to list of placeholders
    if isinstance(val, int):
        return [f"__legacy_{i}" for i in range(val)]
    if isinstance(val, list):
        return val
    return []


def increment_like(discussion_id, user_id: str):
    """Add a like from `user_id` for discussion. Returns total likes after operation.
    If the user already liked, the count is unchanged.
    """
    likes = load_likes()
    key = str(discussion_id)
    current = likes.get(key)
    if current is None:
        likes[key] = [user_id]
        save_likes(likes)
        return 1

    # normalize legacy int to list of placeholders
    if isinstance(current, int):
        current = _normalize_list(current)

    # ensure list
    if isinstance(current, list):
        if user_id in current:
            return len(current)
        current.append(user_id)
        likes[key] = current
        save_likes(likes)
        return len(current)

    # fallback
    likes[key] = [user_id]
    save_likes(likes)
    return 1


def get_likes(discussion_id=None):
    likes = load_likes()
    if discussion_id is None:
        # return counts mapping
        return {k: (v if isinstance(v, int) else len(v)) for k, v in likes.items()}
    val = likes.get(str(discussion_id))
    if val is None:
        return 0
    if isinstance(val, int):
        return val
    if isinstance(val, list):
        return len(val)
    return 0
