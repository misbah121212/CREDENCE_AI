from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core import security
from app.db.session import get_db
from app.crud.user import get_user_by_email, create_user
from app.schemas.user import TokenResponse, LoginRequest, UserCreate
from app.models.user import Role

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=login_data.email)
    if not user or not security.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = security.create_access_token(data={"sub": user.email})
    role_name = user.role.name if user.role else "Bank Manager"
    user_name = f"{user.first_name} {user.last_name}"
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role_name,
        "user_name": user_name
    }

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, email=user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    user = create_user(db, user_in=user_data)
    access_token = security.create_access_token(data={"sub": user.email})
    role_name = user.role.name if user.role else "Bank Manager"
    user_name = f"{user.first_name} {user.last_name}"
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role_name,
        "user_name": user_name
    }

@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Role).all()
    return [{"id": str(r.id), "name": r.name} for r in roles]
