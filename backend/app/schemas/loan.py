import uuid
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel

# ── Loan Schemas ───────────────────────────────────────────────────────────────
class LoanCreate(BaseModel):
    customer_id: uuid.UUID
    loan_type: str
    principal_amount: Decimal
    interest_rate: Decimal
    emi_amount: Decimal
    tenure_months: int
    remaining_balance: Decimal
    status: str = "Active"
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class LoanOut(BaseModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    loan_type: str
    principal_amount: Decimal
    interest_rate: Decimal
    emi_amount: Decimal
    tenure_months: int
    remaining_balance: Decimal
    status: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class LoanListOut(BaseModel):
    total: int
    loans: List[LoanOut]

# ── EMI Schemas ────────────────────────────────────────────────────────────────
class EMIHistoryCreate(BaseModel):
    loan_id: uuid.UUID
    payment_date: date
    amount_paid: Decimal
    status: str
    remarks: Optional[str] = None

class EMIHistoryOut(BaseModel):
    id: uuid.UUID
    loan_id: uuid.UUID
    payment_date: date
    amount_paid: Decimal
    status: str
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True
