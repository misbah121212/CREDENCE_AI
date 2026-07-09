from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.api import deps
from app.db.session import get_db
from app.crud import loan as crud_loan
from app.schemas.loan import LoanCreate, LoanOut, LoanListOut, EMIHistoryCreate, EMIHistoryOut
from app.models.user import User
from typing import List

router = APIRouter()

@router.get("/", response_model=LoanListOut)
def read_loans(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    total, loans = crud_loan.get_loans(db, skip=skip, limit=limit)
    return {"total": total, "loans": loans}

@router.post("/", response_model=LoanOut, status_code=status.HTTP_201_CREATED)
def create_loan(
    loan_in: LoanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_loan.create_loan(db, loan_in=loan_in)

@router.get("/customer/{customer_id}", response_model=List[LoanOut])
def read_customer_loans(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_loan.get_customer_loans(db, customer_id=str(customer_id))

@router.get("/{loan_id}/emi-history", response_model=List[EMIHistoryOut])
def read_emi_history(
    loan_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_loan.get_loan_emi_history(db, loan_id=str(loan_id))

@router.post("/emi", response_model=EMIHistoryOut, status_code=status.HTTP_201_CREATED)
def create_emi_history(
    emi_in: EMIHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    return crud_loan.create_emi_history(db, emi_in=emi_in)
