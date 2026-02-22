from datetime import datetime
import uuid
from mongo import payments_collection, bookings_collection


async def process_payment(
    booking_id: str,
    user_id: str,
    amount: float,
    payment_method: str = "card",
    upi_id: str = None,
):

    payment = {
        "payment_id": str(uuid.uuid4()),
        "booking_id": booking_id,
        "user_id": user_id,
        "amount": amount,
        "payment_method": payment_method,
        "upi_id": upi_id,
        "status": "completed",
        "timestamp": datetime.utcnow(),
    }

    await payments_collection.insert_one(payment)

    # Update booking payment status
    await bookings_collection.update_one(
        {"booking_id": booking_id},
        {
            "$set": {
                "payment_status": "completed",
                "paid_amount": amount,
            }
        },
    )

    return payment
