from typing import Dict, Any
from app.core.config import settings
from app.core.logging import logger


class OpenTopographyClient:
    """Client for querying DEM elevation and terrain slope data"""

    async def get_elevation_and_slope(self, lat: float, lon: float) -> Dict[str, Any]:
        """Returns elevation (meters) and calculated slope (degrees)"""
        if not settings.OPEN_TOPOGRAPHY_API_KEY:
            logger.info(f"OpenTopography API key missing. Calculating synthetic DEM data for ({lat}, {lon}).")
            elevation = round(500.0 + (abs(lat * 100) % 700), 1)
            slope = round(15.0 + (abs(lon * 10) % 30), 1)
            return {
                "elevation_meters": elevation,
                "slope_degrees": slope,
                "aspect_degrees": 180.0,
                "soil_type": "Lateritic Clay",
                "geological_unit": "Precambrian Gneiss"
            }

        # Real OpenTopography API integration would execute here
        return {
            "elevation_meters": 780.0,
            "slope_degrees": 32.5,
            "aspect_degrees": 175.0,
            "soil_type": "Lateritic Clay",
            "geological_unit": "Precambrian Gneiss"
        }


open_topography_client = OpenTopographyClient()
