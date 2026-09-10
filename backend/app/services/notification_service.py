from typing import Dict, Any, List
from datetime import datetime, timezone
import uuid
from app.integrations.indian_sms import indian_sms_client

MOCK_NOTIFICATION_LOGS = [
    {
        "id": "notif-001",
        "recipient_phone": "+919876543210",
        "message": "BHUSENTRY ALERT [VERY HIGH]: Critical landslide risk alert in Wayanad Zone A.",
        "status": "DELIVERED",
        "provider": "Fast2SMS",
        "sent_at": "2026-09-09T18:30:05Z"
    },
    {
        "id": "notif-002",
        "recipient_phone": "+919876543211",
        "message": "BHUSENTRY ALERT [HIGH]: Landslide hazard rating elevated in Shimla Summer Hill.",
        "status": "DELIVERED",
        "provider": "Fast2SMS",
        "sent_at": "2026-09-09T19:15:10Z"
    }
]


class NotificationService:

    async def get_logs(self) -> List[Dict[str, Any]]:
        return MOCK_NOTIFICATION_LOGS

    async def send_test_notification(self, phone: str, message: str) -> Dict[str, Any]:
        res = await indian_sms_client.send_sms(phone, message)
        log_entry = {
            "id": f"notif-{uuid.uuid4().hex[:6]}",
            "recipient_phone": phone,
            "message": message,
            "status": res.get("status", "DELIVERED"),
            "provider": res.get("provider", "Fast2SMS"),
            "sent_at": datetime.now(timezone.utc).isoformat()
        }
        MOCK_NOTIFICATION_LOGS.insert(0, log_entry)
        return log_entry


notification_service = NotificationService()
