"""
Simple payment processing module.
Simulates a payment gateway (like Razorpay, Stripe, etc.)
"""
import json
import os
from datetime import datetime
from typing import Dict
from bookings import load_bookings, save_bookings


PAYMENTS_FILE = "payments.json"


def load_payments() -> list:
    """Load payments from file."""
    if os.path.exists(PAYMENTS_FILE):
        try:
            with open(PAYMENTS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_payments(payments: list) -> None:
    """Save payments to file."""
    with open(PAYMENTS_FILE, "w") as f:
        json.dump(payments, f, indent=2)


def process_payment(
    booking_id: str,
    user_id: str,
    amount: float,
    payment_method: str = "card",
    upi_id: str | None = None,
) -> Dict:
    """Process a payment for a booking."""
    payments = load_payments()
    
    # Simulate payment processing (in real world, integrate with Razorpay/Stripe)
    payment = {
        "payment_id": f"PAY_{datetime.now().strftime('%Y%m%d%H%M%S')}_{len(payments)}",
        "booking_id": booking_id,
        "user_id": user_id,
        "amount": amount,
        "payment_method": payment_method,
        "upi_id": upi_id,
        "status": "completed",  # In real world: pending -> completed/failed
        "timestamp": datetime.now().isoformat(),
    }
    
    payments.append(payment)
    save_payments(payments)
    
    # Mark booking as paid
    bookings = load_bookings()
    for booking in bookings:
        if booking["booking_id"] == booking_id:
            booking["payment_id"] = payment["payment_id"]
            booking["payment_status"] = "completed"
            booking["paid_amount"] = amount
            if upi_id:
                booking["upi_id"] = upi_id
            break
    save_bookings(bookings)
    
    return payment


def get_payment(payment_id: str) -> Dict:
    """Get payment details."""
    payments = load_payments()
    for p in payments:
        if p["payment_id"] == payment_id:
            return p
    return None


def get_booking_payment(booking_id: str) -> Dict:
    """Get payment for a booking."""
    payments = load_payments()
    for p in payments:
        if p["booking_id"] == booking_id:
            return p
    return None
