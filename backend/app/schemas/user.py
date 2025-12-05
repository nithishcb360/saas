from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None

class UserProfileUpdate(BaseModel):
    """Schema for updating user profile information."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    company_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)

class PasswordChange(BaseModel):
    """Schema for changing user password."""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)

class User(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    role: str
    created_at: datetime
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True
