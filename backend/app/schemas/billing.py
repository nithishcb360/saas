from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class SubscriptionBase(BaseModel):
    plan_id: str
    status: str

class Subscription(SubscriptionBase):
    id: str
    user_id: str
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Invoice(BaseModel):
    id: str
    user_id: str
    amount: Decimal
    status: str
    invoice_url: Optional[str] = None
    created_at: datetime
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PaymentMethod(BaseModel):
    id: str
    type: str
    last4: str
    brand: Optional[str] = None
    exp_month: int
    exp_year: int
    is_default: bool

    class Config:
        from_attributes = True
