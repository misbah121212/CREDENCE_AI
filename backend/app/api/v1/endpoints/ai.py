from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import uuid
import random

from app.api import deps
from app.db.session import get_db
from app.crud import ai as crud_ai
from app.crud import customer as crud_customer
from app.schemas.ai import PredictionOut, AlertOut, AlertListOut
from app.models.user import User
from app.services import ai as ai_service
from app.tasks.recalculate import recalculate_all_risk_scores

router = APIRouter()

@router.post("/recalculate", status_code=status.HTTP_202_ACCEPTED)
def trigger_recalculation(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Triggers a batch recalculation of risk scores for all customers in the database.
    Runs asynchronously in the background.
    """
    background_tasks.add_task(recalculate_all_risk_scores)
    return {"message": "Batch risk score recalculation triggered successfully"}


@router.post("/predict/{customer_id}", response_model=PredictionOut)
def run_prediction(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    customer = crud_customer.get_customer(db, customer_id=str(customer_id))
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    try:
        return ai_service.run_customer_prediction(db, customer_id=str(customer_id))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Prediction Engine failed: {str(e)}"
        )

@router.get("/predictions/customer/{customer_id}", response_model=List[PredictionOut])
def read_customer_predictions(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    preds = crud_ai.get_predictions_by_customer(db, customer_id=str(customer_id))
    if not preds:
        try:
            new_pred = ai_service.run_customer_prediction(db, customer_id=str(customer_id))
            return [new_pred]
        except Exception as e:
            # Fallback in case of prediction failure
            return []
    return preds

@router.get("/alerts", response_model=AlertListOut)
def read_alerts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    total, alerts = crud_ai.get_alerts(db, skip=skip, limit=limit)
    return {"total": total, "alerts": alerts}
