from datetime import datetime
import uuid
from mongo import bookings_collection


async def create_booking(
    user_id: str,
    place_name: str,
    place_key: str,
    visit_date: str,
    num_tickets: int,
    ticket_type: str,
    price: float,
):
    booking = {
        "booking_id": str(uuid.uuid4()),
        "user_id": user_id,
        "place_name": place_name,
        "place_key": place_key,
        "visit_date": visit_date,
        "num_tickets": num_tickets,
        "ticket_type": ticket_type,
        "price_per_ticket": price,
        "total_price": price * num_tickets,
        "booking_date": datetime.utcnow(),
        "status": "confirmed",
    }

    await bookings_collection.insert_one(booking)
    return booking


async def get_user_bookings(user_id: str):
    bookings = []
    async for booking in bookings_collection.find({"user_id": user_id}):
        booking["_id"] = str(booking["_id"])
        bookings.append(booking)
    return bookings
