import uuid
from sqlalchemy.orm import Session
from app.models.ai import Prediction, Recommendation, Alert
from app.schemas.ai import PredictionOut

def get_predictions_by_customer(db: Session, customer_id: str):
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    return db.query(Prediction).filter(Prediction.customer_id == cust_uuid).order_by(Prediction.prediction_date.desc()).all()

def get_latest_prediction(db: Session, customer_id: str) -> Prediction:
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    return db.query(Prediction).filter(Prediction.customer_id == cust_uuid).order_by(Prediction.prediction_date.desc()).first()

def create_prediction(db: Session, customer_id: str, default_probability: float, risk_score: int, risk_category: str, shap_explanations: dict) -> Prediction:
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    db_pred = Prediction(
        customer_id=cust_uuid,
        default_probability=default_probability,
        risk_score=risk_score,
        risk_category=risk_category,
        shap_explanations=shap_explanations
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred

def create_recommendation(db: Session, prediction_id: str, action_text: str, priority: str = "Medium") -> Recommendation:
    pred_uuid = uuid.UUID(prediction_id) if isinstance(prediction_id, str) else prediction_id
    rec = Recommendation(
        prediction_id=pred_uuid,
        action_text=action_text,
        priority=priority
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def get_alerts(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(Alert)
    total = query.count()
    return total, query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()

def create_alert(db: Session, customer_id: str, alert_message: str) -> Alert:
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    alert = Alert(customer_id=cust_uuid, alert_message=alert_message)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

