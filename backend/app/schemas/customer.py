import uuid
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel

# ── Customer Schemas ───────────────────────────────────────────────────────────
class CustomerCreate(BaseModel):
    customer_id_string: str
    first_name: str
    last_name: str
    dob: Optional[date] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    monthly_salary: Optional[Decimal] = None
    other_income: Optional[Decimal] = 0
    credit_score: Optional[int] = None
    family_dependents: Optional[int] = 0

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[date] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    monthly_salary: Optional[Decimal] = None
    other_income: Optional[Decimal] = None
    credit_score: Optional[int] = None
    family_dependents: Optional[int] = None

class CustomerOut(BaseModel):
    id: uuid.UUID
    customer_id_string: str
    first_name: str
    last_name: str
    dob: Optional[date] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    monthly_salary: Optional[Decimal] = None
    other_income: Optional[Decimal] = None
    credit_score: Optional[int] = None
    family_dependents: Optional[int] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class CustomerListOut(BaseModel):
    total: int
    customers: List[CustomerOut]
