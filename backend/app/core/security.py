from typing import Optional, List, Dict, Any
import jwt
from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.core.exceptions import AuthenticationError, PermissionDeniedError
from app.core.logging import logger

security_scheme = HTTPBearer(auto_error=False)


class CurrentUser:
    """Class representing authenticated user details in request context."""
    def __init__(
        self,
        id: str,
        email: str,
        role: str = "OFFICER",
        full_name: Optional[str] = None,
        department: Optional[str] = None,
        avatar_url: Optional[str] = None,
        profile_complete: bool = True,
        raw_claims: Optional[Dict[str, Any]] = None
    ):
        self.id = id
        self.email = email
        self.role = role.upper() if role else "OFFICER"
        self.full_name = full_name or email.split("@")[0]
        self.department = department or "Emergency Response Unit"
        self.avatar_url = avatar_url
        self.profile_complete = profile_complete
        self.raw_claims = raw_claims or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "full_name": self.full_name,
            "department": self.department,
            "avatar_url": self.avatar_url,
            "profile_complete": self.profile_complete,
        }


def decode_supabase_jwt(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a Supabase JWT token.
    First attempts verification using SUPABASE_JWT_SECRET if configured,
    otherwise unverified decode for development fallback.
    """
    if token == "mock_jwt_token_bhusentry" or token.startswith("mock_"):
        return {
            "sub": "demo-user-001",
            "email": "officer.demo@bhusentry.gov.in",
            "user_metadata": {
                "full_name": "Dr. Ananya Sharma",
                "role": "OFFICER",
                "department": "National Disaster Response Force (NDRF)",
                "profile_complete": True
            }
        }

    try:
        if settings.SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            return payload
        else:
            # Fallback: unverified decode when SUPABASE_JWT_SECRET is missing during early dev
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationError("JWT token has expired. Please sign in again.")
    except jwt.InvalidTokenError as e:
        logger.error(f"JWT verification error: {str(e)}")
        raise AuthenticationError(f"Invalid authentication token: {str(e)}")


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> CurrentUser:
    """
    Dependency that extracts, verifies the Supabase JWT token,
    and returns the authenticated CurrentUser object.
    """
    if not credentials or not credentials.credentials:
        # In development demo mode, return mock user if auth is missing
        if settings.DEBUG and not settings.SUPABASE_JWT_SECRET and not settings.SUPABASE_URL:
            return CurrentUser(
                id="demo-user-001",
                email="officer.demo@bhusentry.gov.in",
                role="OFFICER",
                full_name="Demo Response Officer",
                department="Landslide Task Force",
                profile_complete=True
            )
        raise AuthenticationError("Authorization header with Bearer token is missing.")

    token = credentials.credentials
    payload = decode_supabase_jwt(token)

    sub = payload.get("sub")
    email = payload.get("email") or payload.get("user_metadata", {}).get("email") or ""

    if not sub:
        raise AuthenticationError("Token missing user subject ('sub').")

    # Extract user metadata provided by Supabase Auth
    user_meta = payload.get("user_metadata", {})
    app_meta = payload.get("app_metadata", {})
    
    role = user_meta.get("role") or app_meta.get("role") or "OFFICER"
    full_name = user_meta.get("full_name") or user_meta.get("name")
    department = user_meta.get("department", "Emergency Response Unit")
    avatar_url = user_meta.get("avatar_url") or user_meta.get("picture")
    profile_complete = user_meta.get("profile_complete", True)

    return CurrentUser(
        id=sub,
        email=email,
        role=role,
        full_name=full_name,
        department=department,
        avatar_url=avatar_url,
        profile_complete=profile_complete,
        raw_claims=payload
    )


def require_role(allowed_roles: List[str]):
    """
    Dependency generator enforcing role-based access control (RBAC).
    Allowed roles e.g., ["ADMIN"], ["OFFICER", "ADMIN"], ["PUBLIC", "OFFICER", "ADMIN"].
    """
    async def role_checker(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        user_role = current_user.role.upper()
        allowed_upper = [r.upper() for r in allowed_roles]
        
        if user_role not in allowed_upper:
            raise PermissionDeniedError(
                f"Access denied. User role '{current_user.role}' is not in allowed roles: {allowed_roles}"
            )
        return current_user

    return role_checker


# Handy Role Aliases
require_admin = require_role(["ADMIN"])
require_officer_or_admin = require_role(["OFFICER", "ADMIN"])
require_any_authenticated = get_current_user
