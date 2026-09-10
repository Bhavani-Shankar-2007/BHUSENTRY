from typing import Optional
from supabase import create_client, Client
from app.core.config import settings
from app.core.logging import logger

_supabase_client: Optional[Client] = None
_supabase_admin_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Returns initialized standard Supabase client (using anon key).
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        logger.warning("Supabase URL or Anon Key is missing. Operating in mock database mode.")
        return None

    try:
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        logger.info("Supabase client initialized successfully.")
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
        return None


def get_supabase_admin_client() -> Optional[Client]:
    """
    Returns initialized administrative Supabase client (using service role key).
    """
    global _supabase_admin_client
    if _supabase_admin_client is not None:
        return _supabase_admin_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.warning("Supabase Service Role Key is missing.")
        return get_supabase_client()

    try:
        _supabase_admin_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Supabase Admin client initialized successfully.")
        return _supabase_admin_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase Admin client: {str(e)}")
        return get_supabase_client()
