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


def increment_like(discussion_id):
    likes = load_likes()
    key = str(discussion_id)
    likes[key] = int(likes.get(key, 0)) + 1
    save_likes(likes)
    return likes[key]


def get_likes(discussion_id=None):
    likes = load_likes()
    if discussion_id is None:
        return likes
    return int(likes.get(str(discussion_id), 0))
