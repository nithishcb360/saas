from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.billing import Subscription, Invoice, PaymentMethod

router = APIRouter()

@router.get("/subscription", response_model=Subscription)
async def get_subscription():
    """
    Get current subscription details.
    """
    # TODO: Implement get subscription logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get subscription not implemented yet"
    )

@router.post("/subscription")
async def create_subscription(plan_id: str):
    """
    Create or update subscription.
    """
    # TODO: Implement subscription creation with Stripe
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Subscription creation not implemented yet"
    )

@router.delete("/subscription")
async def cancel_subscription():
    """
    Cancel current subscription.
    """
    # TODO: Implement subscription cancellation
    return {"message": "Subscription cancelled successfully"}

@router.get("/invoices", response_model=List[Invoice])
async def list_invoices(skip: int = 0, limit: int = 100):
    """
    List all invoices.
    """
    # TODO: Implement list invoices logic
    return []

@router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str):
    """
    Get invoice by ID.
    """
    # TODO: Implement get invoice logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get invoice not implemented yet"
    )

@router.get("/payment-methods", response_model=List[PaymentMethod])
async def list_payment_methods():
    """
    List payment methods.
    """
    # TODO: Implement list payment methods logic
    return []

@router.post("/payment-methods")
async def add_payment_method(payment_method_id: str):
    """
    Add payment method.
    """
    # TODO: Implement add payment method logic
    return {"message": "Payment method added successfully"}

@router.delete("/payment-methods/{payment_method_id}")
async def remove_payment_method(payment_method_id: str):
    """
    Remove payment method.
    """
    # TODO: Implement remove payment method logic
    return {"message": "Payment method removed successfully"}

@router.post("/webhook")
async def stripe_webhook():
    """
    Handle Stripe webhooks.
    """
    # TODO: Implement Stripe webhook handling
    return {"message": "Webhook received"}
