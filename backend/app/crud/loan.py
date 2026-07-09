import uuid
from sqlalchemy.orm import Session
from app.models.loan import Loan, EMIHistory
from app.schemas.loan import LoanCreate, EMIHistoryCreate

def get_loan(db: Session, loan_id: str) -> Loan:
    loan_uuid = uuid.UUID(loan_id) if isinstance(loan_id, str) else loan_id
    return db.query(Loan).filter(Loan.id == loan_uuid).first()

def get_loans(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(Loan)
    total = query.count()
    return total, query.offset(skip).limit(limit).all()

def get_customer_loans(db: Session, customer_id: str):
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    return db.query(Loan).filter(Loan.customer_id == cust_uuid).all()

def create_loan(db: Session, loan_in: LoanCreate) -> Loan:
    db_loan = Loan(
        customer_id=loan_in.customer_id,
        loan_type=loan_in.loan_type,
        principal_amount=loan_in.principal_amount,
        interest_rate=loan_in.interest_rate,
        emi_amount=loan_in.emi_amount,
        tenure_months=loan_in.tenure_months,
        remaining_balance=loan_in.remaining_balance,
        status=loan_in.status,
        start_date=loan_in.start_date,
        end_date=loan_in.end_date
    )
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def create_emi_history(db: Session, emi_in: EMIHistoryCreate) -> EMIHistory:
    db_emi = EMIHistory(
        loan_id=emi_in.loan_id,
        payment_date=emi_in.payment_date,
        amount_paid=emi_in.amount_paid,
        status=emi_in.status,
        remarks=emi_in.remarks
    )
    db.add(db_emi)
    db.commit()
    db.refresh(db_emi)
    return db_emi

def get_loan_emi_history(db: Session, loan_id: str):
    loan_uuid = uuid.UUID(loan_id) if isinstance(loan_id, str) else loan_id
    return db.query(EMIHistory).filter(EMIHistory.loan_id == loan_uuid).order_by(EMIHistory.payment_date.desc()).all()


