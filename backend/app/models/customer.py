import uuid
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id_string = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dob = Column(Date)
    occupation = Column(String)
    employer = Column(String)
    monthly_salary = Column(Numeric(12, 2))
    other_income = Column(Numeric(12, 2), default=0)
    credit_score = Column(Integer)
    family_dependents = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    loans = relationship("Loan", back_populates="customer", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="customer", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="customer", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="customer", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    document_type = Column(String, nullable=False) # e.g. Bank Statement, Salary Slip
    file_path = Column(String, nullable=False)
    status = Column(String, default="Pending")
    
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="documents")
