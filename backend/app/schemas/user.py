import uuid
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr

# ── Auth Schemas ───────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_name: str

# ── Role Schemas ───────────────────────────────────────────────────────────────
class RoleOut(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    class Config:
        from_attributes = True

# ── User Schemas ───────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role_id: Optional[uuid.UUID] = None

class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    is_active: bool
    role: Optional[RoleOut] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True
