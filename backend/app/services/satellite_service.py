from typing import Dict, Any
from datetime import datetime, timezone
from app.integrations.satellite_imagery import satellite_imagery_client
from app.services.location_service import location_service


class SatelliteService:

    async def get_satellite_data(self, location_id: str) -> Dict[str, Any]:
        loc = await location_service.get_location_by_id(location_id)
        lat = loc["latitude"] if loc else 11.6854
        lon = loc["longitude"] if loc else 76.1320

        indices = await satellite_imagery_client.get_indices(lat, lon)
        return {
            "location_id": location_id,
            "latitude": lat,
            "longitude": lon,
            "satellite_source": indices.get("satellite_source", "NASA GIBS (EOSDIS) / ESRI World Imagery"),
            "ndvi": indices.get("ndvi", 0.52),
            "ndwi": indices.get("ndwi", 0.31),
            "soil_moisture_index": indices.get("soil_moisture_index", 0.68),
            "surface_displacement_mm": indices.get("surface_displacement_mm", 12.4),
            "image_url": indices.get("image_url"),
            "nasa_gibs_url": indices.get("nasa_gibs_url"),
            "nasa_precipitation_url": indices.get("nasa_precipitation_url"),
            "captured_at": datetime.now(timezone.utc)
        }


satellite_service = SatelliteService()
