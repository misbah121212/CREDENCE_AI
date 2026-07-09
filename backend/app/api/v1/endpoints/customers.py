from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.api import deps
from app.db.session import get_db
from app.crud import customer as crud_customer
from app.crud import loan as crud_loan
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerOut, CustomerListOut
from app.schemas.loan import LoanOut
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=CustomerListOut)
def read_customers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user)
):
    total, customers = crud_customer.get_customers(db, skip=skip, limit=limit, search=search)
    return {"total": total, "customers": customers}

@router.post("/", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    db_customer = crud_customer.get_customer_by_string_id(db, customer_id_string=customer_in.customer_id_string)
    if db_customer:
        raise HTTPException(
            status_code=400,
            detail="A customer with this ID already exists."
        )
    return crud_customer.create_customer(db, customer_in=customer_in)

@router.get("/{customer_id}", response_model=CustomerOut)
def read_customer(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    db_customer = crud_customer.get_customer(db, customer_id=str(customer_id))
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: uuid.UUID,
    customer_in: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    db_customer = crud_customer.get_customer(db, customer_id=str(customer_id))
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return crud_customer.update_customer(db, db_customer=db_customer, customer_in=customer_in)

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    success = crud_customer.delete_customer(db, customer_id=str(customer_id))
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return None

@router.get("/{customer_id}/loans", response_model=List[LoanOut])
def read_customer_loans(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    db_customer = crud_customer.get_customer(db, customer_id=str(customer_id))
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return crud_loan.get_customer_loans(db, customer_id=str(customer_id))

