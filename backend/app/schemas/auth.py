from enum import Enum
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field


class UserRole(str, Enum):
    PUBLIC = "PUBLIC"
    OFFICER = "OFFICER"
    ADMIN = "ADMIN"


class TokenData(BaseModel):
    sub: str
    email: Optional[str] = None
    role: UserRole = UserRole.OFFICER
    exp: Optional[int] = None


class UserAuthInfo(BaseModel):
    id: str
    email: str
    role: UserRole
    full_name: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    profile_complete: bool = True
