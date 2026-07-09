import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Any
from pydantic import BaseModel

# ── Prediction Schemas ─────────────────────────────────────────────────────────
class PredictionOut(BaseModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    default_probability: Decimal
    risk_score: int
    risk_category: str
    shap_explanations: Optional[Any] = None
    prediction_date: Optional[datetime] = None
    recommendations: Optional[List["RecommendationOut"]] = []
    class Config:
        from_attributes = True

# ── Recommendation Schemas ─────────────────────────────────────────────────────
class RecommendationOut(BaseModel):
    id: uuid.UUID
    prediction_id: uuid.UUID
    action_text: str
    priority: str
    status: str
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# ── Alert Schemas ──────────────────────────────────────────────────────────────
class AlertOut(BaseModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    alert_message: str
    is_read: bool
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class AlertListOut(BaseModel):
    total: int
    alerts: List[AlertOut]

# Resolve forward reference
PredictionOut.model_rebuild()
