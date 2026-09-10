from fastapi import APIRouter, Depends
from app.core.security import get_current_user, CurrentUser
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.database.client import db_client

router = APIRouter(prefix="", tags=["User Profile & Auth"])


@router.get("/auth/me", response_model=ProfileResponse, summary="Get Current Authenticated User")
async def get_me(current_user: CurrentUser = Depends(get_current_user)):
    """
    Validates Supabase JWT Bearer token and returns the current user profile.
    """
    profile_data = await db_client.get_profile(current_user.id)
    if profile_data:
        return ProfileResponse(**profile_data)

    return ProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        department=current_user.department,
        avatar_url=current_user.avatar_url,
        profile_complete=current_user.profile_complete,
        badge=f"{current_user.role} Operator"
    )


@router.get("/profile", response_model=ProfileResponse, summary="Get User Profile")
async def get_profile(current_user: CurrentUser = Depends(get_current_user)):
    """
    Returns user profile details.
    """
    return await get_me(current_user)


@router.patch("/profile", response_model=ProfileResponse, summary="Update User Profile")
async def update_profile(
    payload: ProfileUpdate,
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Updates the authenticated user's profile metadata in the database.
    """
    updates = payload.model_dump(exclude_unset=True)
    updated_profile = await db_client.update_profile(current_user.id, updates)
    return ProfileResponse(**updated_profile)
