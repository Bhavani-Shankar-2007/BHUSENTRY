from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_admin, CurrentUser
from app.schemas.profile import ProfileResponse

router = APIRouter(prefix="/admin", tags=["Admin User Management & Diagnostics"])

MOCK_USERS_DB = [
    {
        "id": "demo-user-001",
        "email": "officer.demo@bhusentry.gov.in",
        "full_name": "Dr. Ananya Sharma",
        "role": "OFFICER",
        "department": "National Disaster Response Force (NDRF)",
        "phone_number": "+919876543210",
        "avatar_url": None,
        "profile_complete": True,
        "status": "Active",
        "badge": "OFFICER Operator"
    },
    {
        "id": "demo-admin-002",
        "email": "admin.master@bhusentry.gov.in",
        "full_name": "Commander Rajesh Verma",
        "role": "ADMIN",
        "department": "Geological Survey of India (GSI)",
        "phone_number": "+919876543211",
        "avatar_url": None,
        "profile_complete": True,
        "status": "Active",
        "badge": "ADMIN Operator"
    }
]


@router.get("/users", response_model=List[ProfileResponse], summary="List System Users")
async def list_users(current_user: CurrentUser = Depends(require_admin)):
    """
    Admin-only endpoint listing registered users and operators.
    """
    return [ProfileResponse(**u) for u in MOCK_USERS_DB]


@router.post("/users", response_model=ProfileResponse, summary="Create System User")
async def create_user(
    payload: Dict[str, Any],
    current_user: CurrentUser = Depends(require_admin)
):
    new_user = {
        "id": f"usr-{len(MOCK_USERS_DB)+1:03d}",
        "email": payload.get("email", "newuser@bhusentry.gov.in"),
        "full_name": payload.get("full_name", "Operator User"),
        "role": payload.get("role", "OFFICER"),
        "department": payload.get("department", "Disaster Response Unit"),
        "phone_number": payload.get("phone_number"),
        "avatar_url": None,
        "profile_complete": True,
        "status": "Active",
        "badge": f"{payload.get('role', 'OFFICER')} Operator"
    }
    MOCK_USERS_DB.append(new_user)
    return ProfileResponse(**new_user)


@router.patch("/users/{id}", response_model=ProfileResponse, summary="Update System User")
async def update_user(
    id: str,
    payload: Dict[str, Any],
    current_user: CurrentUser = Depends(require_admin)
):
    for u in MOCK_USERS_DB:
        if u["id"] == id:
            u.update(payload)
            return ProfileResponse(**u)
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.delete("/users/{id}", summary="Delete System User")
async def delete_user(
    id: str,
    current_user: CurrentUser = Depends(require_admin)
):
    global MOCK_USERS_DB
    MOCK_USERS_DB = [u for u in MOCK_USERS_DB if u["id"] != id]
    return {"success": True, "message": f"User {id} deleted successfully"}


@router.get("/system-health", summary="Detailed System Diagnostic Metrics")
async def get_system_health(current_user: CurrentUser = Depends(require_admin)):
    return {
        "status": "healthy",
        "cpu_usage_percent": 14.2,
        "memory_usage_mb": 342.1,
        "active_db_connections": 8,
        "ml_model_status": "LOADED_AND_READY",
        "registered_alert_webhooks": 3
    }
