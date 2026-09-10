from typing import Any, Dict, List, Optional
from app.integrations.supabase_client import get_supabase_client, get_supabase_admin_client
from app.core.logging import logger

# In-memory mock database state for local development when Supabase URL is not populated
_MOCK_PROFILES: Dict[str, Dict[str, Any]] = {
    "demo-user-001": {
        "id": "demo-user-001",
        "email": "officer.demo@bhusentry.gov.in",
        "full_name": "Dr. Ananya Sharma",
        "role": "OFFICER",
        "department": "National Disaster Response Force (NDRF)",
        "phone_number": "+919876543210",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
        "profile_complete": True,
        "status": "Active",
        "badge": "OFFICER Operator"
    }
}


class DatabaseClient:
    """Central interface executing queries against PostgreSQL tables via Supabase SDK"""

    def __init__(self):
        pass

    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("profiles").select("*").eq("id", user_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error fetching profile for {user_id} from Supabase: {str(e)}")

        return _MOCK_PROFILES.get(user_id)

    async def update_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        client = get_supabase_admin_client() or get_supabase_client()
        if client:
            try:
                res = client.table("profiles").update(updates).eq("id", user_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error updating profile for {user_id} in Supabase: {str(e)}")

        existing = _MOCK_PROFILES.get(user_id, {
            "id": user_id,
            "email": "user@bhusentry.gov.in",
            "role": "OFFICER",
            "department": "Emergency Response Unit",
            "profile_complete": True
        })
        existing.update(updates)
        _MOCK_PROFILES[user_id] = existing
        return existing


db_client = DatabaseClient()
