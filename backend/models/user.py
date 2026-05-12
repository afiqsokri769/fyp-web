from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    mfa_enabled: bool
    created_at: datetime
    updated_at: datetime


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class MFAToggleRequest(BaseModel):
    current_password: str
    enable: bool
