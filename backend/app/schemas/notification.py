from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class NotificationTestRequest(BaseModel):
    phone_number: str = Field(..., example="+919876543210")
    message: str = Field("BHUSENTRY TEST ALERT: Critical landslide risk alert testing system.", example="BHUSENTRY TEST")


class NotificationLogItem(BaseModel):
    id: str
    recipient_phone: str
    message: str
    status: str = Field("DELIVERED", example="DELIVERED")  # SENT, DELIVERED, FAILED
    provider: str = Field("Fast2SMS", example="Fast2SMS")
    sent_at: datetime


class NotificationLogsResponse(BaseModel):
    total: int
    logs: List[NotificationLogItem]
