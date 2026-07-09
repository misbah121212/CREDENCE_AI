import uuid
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    loan_type = Column(String, nullable=False)
    principal_amount = Column(Numeric(15, 2), nullable=False)
    interest_rate = Column(Numeric(5, 2), nullable=False)
    emi_amount = Column(Numeric(12, 2), nullable=False)
    tenure_months = Column(Integer, nullable=False)
    remaining_balance = Column(Numeric(15, 2), nullable=False)
    status = Column(String, index=True, default="Active")
    start_date = Column(Date)
    end_date = Column(Date)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="loans")
    emi_history = relationship("EMIHistory", back_populates="loan", cascade="all, delete-orphan")

class EMIHistory(Base):
    __tablename__ = "emi_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    loan_id = Column(UUID(as_uuid=True), ForeignKey("loans.id"), nullable=False)
    payment_date = Column(Date, nullable=False)
    amount_paid = Column(Numeric(12, 2), nullable=False)
    status = Column(String, nullable=False) # e.g., Paid, Missed, Late
    remarks = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    loan = relationship("Loan", back_populates="emi_history")
