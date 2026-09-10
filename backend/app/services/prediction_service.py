from typing import Dict, Any, Optional
from datetime import datetime, timezone
import uuid
from app.ml.predictor import predictor_engine
from app.services.alert_service import alert_service
from app.integrations.supabase_client import get_supabase_client
from app.core.logging import logger


class PredictionService:

    async def create_prediction(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes prediction, records database entry, and generates alert if risk is VERY HIGH.
        """
        prob, risk_level, confidence, feat_importances, contributing_factors = predictor_engine.predict(payload)

        pred_id = f"pred-{uuid.uuid4().hex[:8]}"
        created_at = datetime.now(timezone.utc)

        alert_triggered = False
        alert_id = None

        # Auto-trigger alert if risk level is VERY HIGH (probability >= 0.80)
        if risk_level == "VERY HIGH":
            alert_triggered = True
            loc_id = payload.get("location_id") or "loc-wayanad-01"
            loc_name = payload.get("location_name") or f"Zone ({payload.get('latitude')}, {payload.get('longitude')})"
            
            alert_obj = await alert_service.trigger_auto_alert(
                location_id=loc_id,
                location_name=loc_name,
                risk_level=risk_level,
                risk_score=prob,
                prediction_id=pred_id,
                message=f"CRITICAL: Extreme landslide threat detected! Risk score: {prob:.2f}. Immediate action required."
            )
            alert_id = alert_obj.get("id")

        pred_record = {
            "id": pred_id,
            "location_id": payload.get("location_id"),
            "latitude": payload.get("latitude"),
            "longitude": payload.get("longitude"),
            "probability": prob,
            "risk_level": risk_level,
            "confidence": confidence,
            "feature_importances": feat_importances,
            "contributing_factors": contributing_factors,
            "alert_triggered": alert_triggered,
            "alert_id": alert_id,
            "created_at": created_at
        }

        # Save to database if Supabase client is present
        client = get_supabase_client()
        if client:
            try:
                db_payload = {
                    "id": pred_id,
                    "location_id": payload.get("location_id"),
                    "latitude": payload.get("latitude"),
                    "longitude": payload.get("longitude"),
                    "risk_score": prob,
                    "risk_level": risk_level,
                    "confidence_score": confidence,
                    "feature_values": payload,
                    "created_at": created_at.isoformat()
                }
                client.table("predictions").insert(db_payload).execute()
            except Exception as e:
                logger.error(f"Failed to persist prediction {pred_id} to Supabase: {str(e)}")

        return pred_record


prediction_service = PredictionService()
