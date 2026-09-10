from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.auth import UserRole


class ProfileBase(BaseModel):
    full_name: Optional[str] = Field(None, example="Dr. Ananya Sharma")
    role: Optional[UserRole] = Field(UserRole.OFFICER, example=UserRole.OFFICER)
    department: Optional[str] = Field(None, example="National Disaster Response Force (NDRF)")
    phone_number: Optional[str] = Field(None, example="+919876543210")
    avatar_url: Optional[str] = Field(None, example="https://example.com/avatar.png")


class ProfileUpdate(ProfileBase):
    profile_complete: Optional[bool] = True


class ProfileResponse(ProfileBase):
    id: str
    email: str
    role: UserRole
    status: str = "Active"
    badge: str = "OFFICER Operator"
    profile_complete: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
