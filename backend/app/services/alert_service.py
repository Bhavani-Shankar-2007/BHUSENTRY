from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid
from app.integrations.supabase_client import get_supabase_client
from app.integrations.indian_sms import indian_sms_client
from app.core.logging import logger

MOCK_ALERTS = [
    {
        "id": "alt-8821",
        "location_id": "loc-wayanad-01",
        "location_name": "Meppadi Hill Slope Zone, Wayanad",
        "risk_level": "VERY HIGH",
        "risk_score": 0.88,
        "message": "CRITICAL: Torrential rainfall (145mm/24h) triggered acute shear stress failure warning.",
        "status": "ACTIVE",
        "prediction_id": "pred-001",
        "created_at": "2026-09-09T18:30:00Z"
    },
    {
        "id": "alt-8822",
        "location_id": "loc-chamoli-03",
        "location_name": "Joshimath Ridge Sector 4, Chamoli",
        "risk_level": "VERY HIGH",
        "risk_score": 0.91,
        "message": "URGENT: Subsidence rate reached 14mm/day with saturated soil slope.",
        "status": "ACTIVE",
        "prediction_id": "pred-002",
        "created_at": "2026-09-09T19:15:00Z"
    },
    {
        "id": "alt-8820",
        "location_id": "loc-shimla-02",
        "location_name": "Summer Hill Watershed, Shimla",
        "risk_level": "HIGH",
        "risk_score": 0.74,
        "message": "WARNING: Continuous rainfall increasing landslide likelihood.",
        "status": "ACKNOWLEDGED",
        "acknowledged_by": "officer.demo@bhusentry.gov.in",
        "acknowledged_at": "2026-09-09T15:00:00Z",
        "prediction_id": "pred-000",
        "created_at": "2026-09-09T12:00:00Z"
    }
]


class AlertService:

    async def get_alerts(self, active_only: bool = False) -> List[Dict[str, Any]]:
        client = get_supabase_client()
        if client:
            try:
                q = client.table("alerts").select("*")
                if active_only:
                    q = q.eq("status", "ACTIVE")
                res = q.order("created_at", desc=True).execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                logger.error(f"Error fetching alerts from Supabase: {str(e)}")

        if active_only:
            return [a for a in MOCK_ALERTS if a["status"] == "ACTIVE"]
        return MOCK_ALERTS

    async def get_alert_by_id(self, alert_id: str) -> Optional[Dict[str, Any]]:
        for a in MOCK_ALERTS:
            if a["id"] == alert_id:
                return a
        return MOCK_ALERTS[0]

    async def acknowledge_alert(self, alert_id: str, user_id: str, note: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        client = get_supabase_client()
        if client:
            try:
                res = client.table("alerts").update({
                    "status": "ACKNOWLEDGED",
                    "acknowledged_by": user_id,
                    "acknowledged_at": now
                }).eq("id", alert_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Failed to acknowledge alert in Supabase: {str(e)}")

        for a in MOCK_ALERTS:
            if a["id"] == alert_id:
                a["status"] = "ACKNOWLEDGED"
                a["acknowledged_by"] = user_id
                a["acknowledged_at"] = now
                return a

        return MOCK_ALERTS[0]

    async def resolve_alert(self, alert_id: str, user_id: str, notes: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        client = get_supabase_client()
        if client:
            try:
                res = client.table("alerts").update({
                    "status": "RESOLVED",
                    "resolved_by": user_id,
                    "resolved_at": now
                }).eq("id", alert_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Failed to resolve alert in Supabase: {str(e)}")

        for a in MOCK_ALERTS:
            if a["id"] == alert_id:
                a["status"] = "RESOLVED"
                a["resolved_by"] = user_id
                a["resolved_at"] = now
                return a

        return MOCK_ALERTS[0]

    async def trigger_auto_alert(
        self,
        location_id: str,
        location_name: str,
        risk_level: str,
        risk_score: float,
        prediction_id: str,
        message: str
    ) -> Dict[str, Any]:
        alert_id = f"alt-{uuid.uuid4().hex[:8]}"
        created_at = datetime.now(timezone.utc).isoformat()

        alert_obj = {
            "id": alert_id,
            "location_id": location_id,
            "location_name": location_name,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "message": message,
            "status": "ACTIVE",
            "prediction_id": prediction_id,
            "created_at": created_at
        }
        MOCK_ALERTS.insert(0, alert_obj)

        # Dispatch SMS Alert Broadcast via MSG91
        sms_res = await indian_sms_client.send_sms(
            recipient_phone="+919876543210",
            message=f"BHUSENTRY ALERT [{risk_level}]: {message}"
        )
        logger.info(f"Auto SMS alert dispatch result: {sms_res}")

        return alert_obj


alert_service = AlertService()
