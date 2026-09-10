from typing import Dict, Any, Optional
from datetime import datetime, timezone
import uuid
from app.ml.predictor import predictor_engine
from app.services.alert_service import alert_service
from app.integrations.supabase_client import get_supabase_client
from app.integrations.open_meteo import open_meteo_client
from app.services.location_service import location_service
from app.core.logging import logger


class PredictionService:

    async def _enrich_with_live_weather(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        If rainfall is not supplied in the payload, fetch live rainfall from Open-Meteo
        using the payload's coordinates (or the location's coordinates from DB).
        Also enriches slope/elevation from the location record if available.
        """
        enriched = dict(payload)

        # Resolve coordinates: prefer explicit lat/lon, else look up the location
        lat = enriched.get("latitude")
        lon = enriched.get("longitude")
        loc_data = None

        loc_id = enriched.get("location_id")
        if loc_id and (lat is None or lon is None):
            try:
                loc_data = await location_service.get_location_by_id(loc_id)
                if loc_data:
                    lat = lat or loc_data.get("latitude")
                    lon = lon or loc_data.get("longitude")
                    enriched["latitude"] = lat
                    enriched["longitude"] = lon
            except Exception as e:
                logger.warning(f"Could not resolve location {loc_id}: {e}")

        # Back-fill slope and elevation from location DB record if not provided in payload
        if loc_data:
            if enriched.get("slope_deg") is None and enriched.get("slope") is None:
                enriched["slope_deg"] = loc_data.get("slope")
            if enriched.get("elevation_m") is None and enriched.get("elevation") is None:
                enriched["elevation_m"] = loc_data.get("elevation")
            if enriched.get("ndvi") is None:
                # Derive NDVI proxy from vegetation_cover if available (vegetation_cover is 0-1 fraction)
                vc = loc_data.get("vegetation_cover")
                if vc is not None:
                    enriched["ndvi"] = float(vc)

        # Fetch live rainfall from Open-Meteo if not already provided
        rainfall_missing = (
            enriched.get("rainfall_24h_mm") is None
            and enriched.get("rainfall") is None
        )
        if rainfall_missing and lat is not None and lon is not None:
            try:
                weather = await open_meteo_client.get_current_and_forecast(float(lat), float(lon))
                enriched["rainfall_24h_mm"] = weather.get("rainfall_24h_mm")
                enriched["rainfall_72h_mm"] = enriched.get("rainfall_72h_mm") or weather.get("rainfall_72h_mm")
                logger.info(
                    f"Live weather enrichment for ({lat},{lon}): "
                    f"24h={weather.get('rainfall_24h_mm')}mm, 72h={weather.get('rainfall_72h_mm')}mm"
                )
            except Exception as e:
                logger.warning(f"Open-Meteo enrichment failed for ({lat},{lon}): {e}")

        return enriched

    async def create_prediction(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Enriches payload with live weather data where missing, then executes
        prediction, records database entry, and generates alert if risk is VERY HIGH.
        """
        # Auto-enrich with live weather before inference
        payload = await self._enrich_with_live_weather(payload)

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
