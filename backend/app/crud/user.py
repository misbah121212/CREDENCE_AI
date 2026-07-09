from sqlalchemy.orm import Session
from app.models.user import User, Role
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_or_create_default_role(db: Session) -> Role:
    """Get the first available role, or create a default 'Manager' role if none exist."""
    role = db.query(Role).first()
    if not role:
        role = Role(name="Manager", description="Default bank manager role")
        db.add(role)
        db.commit()
        db.refresh(role)
    return role

def create_user(db: Session, user_in: UserCreate) -> User:
    role_id = user_in.role_id
    if role_id is None:
        default_role = get_or_create_default_role(db)
        role_id = default_role.id

    db_user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role_id=role_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_role(db: Session, name: str, description: str = "") -> Role:
    role = Role(name=name, description=description)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role
