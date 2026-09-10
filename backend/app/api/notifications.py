from typing import List
from fastapi import APIRouter, Depends
from app.core.security import require_admin
from app.schemas.notification import NotificationTestRequest, NotificationLogItem, NotificationLogsResponse
from app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["Emergency Alerts & SMS Broadcast"])


@router.get("/logs", response_model=NotificationLogsResponse, summary="Get Notification Transmission Logs")
async def get_notification_logs():
    """
    Returns transmission logs of emergency SMS broadcasts dispatched to response officers in India.
    """
    logs = await notification_service.get_logs()
    return NotificationLogsResponse(
        total=len(logs),
        logs=[NotificationLogItem(**l) for l in logs]
    )


@router.post("/test", response_model=NotificationLogItem, summary="Send Test SMS Notification")
async def send_test_notification(
    payload: NotificationTestRequest,
    current_user=Depends(require_admin)
):
    """
    Admin-only endpoint to dispatch a test SMS alert to verify Indian SMS gateway (Fast2SMS / Telegram).
    """
    res = await notification_service.send_test_notification(payload.phone_number, payload.message)
    return NotificationLogItem(**res)
