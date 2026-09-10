from typing import Dict, Any
from app.integrations.open_topography import open_topography_client
from app.services.location_service import location_service


class ElevationService:

    async def get_terrain_data(self, location_id: str) -> Dict[str, Any]:
        loc = await location_service.get_location_by_id(location_id)
        lat = loc["latitude"] if loc else 11.6854
        lon = loc["longitude"] if loc else 76.1320

        dem_data = await open_topography_client.get_elevation_and_slope(lat, lon)
        return {
            "location_id": location_id,
            "latitude": lat,
            "longitude": lon,
            "elevation_meters": dem_data.get("elevation_meters", loc.get("elevation", 780.0)),
            "slope_degrees": dem_data.get("slope_degrees", loc.get("slope", 34.5)),
            "aspect_degrees": dem_data.get("aspect_degrees", 180.0),
            "curvature": 0.014,
            "soil_type": loc.get("soil_type", dem_data.get("soil_type", "Lateritic Clay")),
            "geological_unit": dem_data.get("geological_unit", "Precambrian Gneiss")
        }


elevation_service = ElevationService()
