"""
Simple in-memory and file-based booking management.
"""
import json
import os
from datetime import datetime
from typing import List, Dict

BOOKINGS_FILE = "bookings.json"


def load_bookings() -> List[Dict]:
    """Load bookings from file."""
    if os.path.exists(BOOKINGS_FILE):
        try:
            with open(BOOKINGS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_bookings(bookings: List[Dict]) -> None:
    """Save bookings to file."""
    with open(BOOKINGS_FILE, "w") as f:
        json.dump(bookings, f, indent=2)


def create_booking(
    user_id: str,
    place_name: str,
    place_key: str,
    visit_date: str,
    num_tickets: int,
    ticket_type: str,  # "indian", "foreigner", "student"
    price: float,
) -> Dict:
    """Create a new booking."""
    bookings = load_bookings()
    
    booking = {
        "booking_id": f"BOOK_{datetime.now().strftime('%Y%m%d%H%M%S')}_{len(bookings)}",
        "user_id": user_id,
        "place_name": place_name,
        "place_key": place_key,
        "visit_date": visit_date,
        "num_tickets": num_tickets,
        "ticket_type": ticket_type,
        "price_per_ticket": price,
        "total_price": price * num_tickets,
        "booking_date": datetime.now().isoformat(),
        "status": "confirmed",
    }
    
    bookings.append(booking)
    save_bookings(bookings)
    return booking


def get_user_bookings(user_id: str) -> List[Dict]:
    """Get all bookings for a user."""
    bookings = load_bookings()
    return [b for b in bookings if b["user_id"] == user_id]


def get_all_bookings() -> List[Dict]:
    """Get all bookings."""
    return load_bookings()


def get_booking(booking_id: str) -> Dict:
    """Get a single booking by ID."""
    bookings = load_bookings()
    for b in bookings:
        if b["booking_id"] == booking_id:
            return b
    return None
