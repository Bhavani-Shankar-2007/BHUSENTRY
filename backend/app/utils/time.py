from datetime import datetime, timezone


def utc_now() -> datetime:
    """Returns current UTC datetime object"""
    return datetime.now(timezone.utc)


def format_iso(dt: datetime) -> str:
    """Formats datetime object to standard ISO 8601 string format"""
    if dt is None:
        return ""
    return dt.isoformat()
