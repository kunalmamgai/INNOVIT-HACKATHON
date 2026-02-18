import json
import os
from datetime import datetime

COMMENTS_FILE = "comments.json"


def load_comments():
    if os.path.exists(COMMENTS_FILE):
        try:
            with open(COMMENTS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_comments(comments):
    with open(COMMENTS_FILE, "w") as f:
        json.dump(comments, f, indent=2)


def add_comment(discussion_id, author, text):
    comments = load_comments()
    comment = {
        "comment_id": f"CMT_{int(datetime.now().timestamp()*1000)}_{len(comments)}",
        "discussion_id": int(discussion_id),
        "author": author,
        "text": text,
        "created_at": datetime.now().isoformat(),
    }
    comments.append(comment)
    save_comments(comments)
    return comment


def get_comments(discussion_id=None):
    comments = load_comments()
    if discussion_id is None:
        return comments
    try:
        did = int(discussion_id)
    except Exception:
        return []
    return [c for c in comments if c.get("discussion_id") == did]


def delete_comment(comment_id):
    """Delete a comment by its comment_id. Returns the deleted comment or None."""
    comments = load_comments()
    for i, c in enumerate(comments):
        if c.get("comment_id") == comment_id:
            deleted = comments.pop(i)
            save_comments(comments)
            return deleted
    return None
