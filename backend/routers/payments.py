import hmac
import hashlib
import os
import random
import string
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/payments", tags=["Payments"])

class CreateOrderRequest(BaseModel):
    items: List[dict]
    totalAmount: float
    currency: Optional[str] = "USD"

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

# Razorpay Service Interface (Production Gateway Ready)
class RazorpayPaymentService:
    """
    Architecture abstraction for Razorpay Payments Gateway.
    When ready to connect live Razorpay API:
      1. Set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in backend environment variables.
      2. Initialize razorpay.Client(auth=(KEY_ID, KEY_SECRET))
    """
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_fitted_mock_key")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET", "mock_secret")

    def create_razorpay_order(self, amount: float, currency: str = "USD") -> dict:
        # Generate mock order ID formatted like real Razorpay order_...
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
        order_id = f"order_{random_suffix}"
        
        return {
            "orderId": order_id,
            "amount": amount,
            "currency": currency,
            "key": self.key_id,
            "status": "created"
        }

    def verify_razorpay_signature(self, payment_id: str, order_id: str, signature: str) -> bool:
        """
        Validates SHA256 HMAC signature against key_secret when connected to production.
        """
        if not self.key_secret or self.key_secret == "mock_secret":
            return True  # Sandbox test mode passes

        generated_signature = hmac.new(
            self.key_secret.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        return generated_signature == signature

razorpay_service = RazorpayPaymentService()

@router.post("/create-order")
async def create_order(req: CreateOrderRequest):
    return razorpay_service.create_razorpay_order(req.totalAmount, req.currency or "USD")

@router.post("/verify")
async def verify_payment(req: VerifyPaymentRequest):
    is_valid = razorpay_service.verify_razorpay_signature(
        req.razorpay_payment_id,
        req.razorpay_order_id,
        req.razorpay_signature
    )

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid Razorpay Payment Signature")

    return {
        "success": True,
        "transactionId": f"TXN_{req.razorpay_payment_id.upper()}",
        "status": "verified"
    }
