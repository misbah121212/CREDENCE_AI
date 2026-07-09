import uuid
from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

def get_customer(db: Session, customer_id: str) -> Customer:
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    return db.query(Customer).filter(Customer.id == cust_uuid).first()

def get_customer_by_string_id(db: Session, customer_id_string: str) -> Customer:
    return db.query(Customer).filter(Customer.customer_id_string == customer_id_string).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    from sqlalchemy import func
    query = db.query(Customer)
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(Customer.first_name).like(search_term)) |
            (func.lower(Customer.last_name).like(search_term)) |
            (func.lower(Customer.customer_id_string).like(search_term))
        )
    total = query.count()
    return total, query.offset(skip).limit(limit).all()

def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    db_cust = Customer(
        customer_id_string=customer_in.customer_id_string,
        first_name=customer_in.first_name,
        last_name=customer_in.last_name,
        dob=customer_in.dob,
        occupation=customer_in.occupation,
        employer=customer_in.employer,
        monthly_salary=customer_in.monthly_salary,
        other_income=customer_in.other_income,
        credit_score=customer_in.credit_score,
        family_dependents=customer_in.family_dependents
    )
    db.add(db_cust)
    db.commit()
    db.refresh(db_cust)
    return db_cust

def update_customer(db: Session, db_customer: Customer, customer_in: CustomerUpdate) -> Customer:
    update_data = customer_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_customer, field, value)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: str) -> bool:
    db_cust = get_customer(db, customer_id)
    if not db_cust:
        return False
    db.delete(db_cust)
    db.commit()
    return True
