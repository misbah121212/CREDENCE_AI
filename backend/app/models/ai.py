import uuid
from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    default_probability = Column(Numeric(5, 4), nullable=False) # e.g. 0.8500
    risk_score = Column(Integer, nullable=False) # 0 to 100
    risk_category = Column(String, index=True, nullable=False) # Low, Medium, High
    shap_explanations = Column(JSON) # Store JSON of top contributing factors
    
    prediction_date = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="predictions")
    recommendations = relationship("Recommendation", back_populates="prediction", cascade="all, delete-orphan")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prediction_id = Column(UUID(as_uuid=True), ForeignKey("predictions.id"), nullable=False)
    action_text = Column(String, nullable=False)
    priority = Column(String, default="Medium") # High, Medium, Low
    status = Column(String, default="Pending") # Pending, Actioned, Dismissed
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prediction = relationship("Prediction", back_populates="recommendations")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    alert_message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="alerts")
