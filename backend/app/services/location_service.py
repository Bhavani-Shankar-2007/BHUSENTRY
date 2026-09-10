from typing import List, Optional, Dict, Any
from app.integrations.supabase_client import get_supabase_client
from app.core.logging import logger

MOCK_LOCATIONS = [
    {
        "id": "loc-gangtok-01",
        "name": "Gangtok Hillside Corridor",
        "state": "Sikkim",
        "district": "East Sikkim",
        "latitude": 27.3389,
        "longitude": 88.6065,
        "elevation": 1650.0,
        "slope": 38.5,
        "soil_type": "Loamy Skeletal with Phyllite",
        "vegetation_cover": 0.55,
        "risk_level": "HIGH",
        "current_risk_score": 0.76,
        "created_at": "2026-01-10T10:00:00Z"
    },
    {
        "id": "loc-cherra-02",
        "name": "Cherrapunji (Sohra) Escarpment",
        "state": "Meghalaya",
        "district": "East Khasi Hills",
        "latitude": 25.2986,
        "longitude": 91.5822,
        "elevation": 1430.0,
        "slope": 42.0,
        "soil_type": "Lateritic Sandy Loam",
        "vegetation_cover": 0.40,
        "risk_level": "VERY HIGH",
        "current_risk_score": 0.89,
        "created_at": "2026-01-11T10:00:00Z"
    },
    {
        "id": "loc-aizawl-03",
        "name": "Aizawl Durtlang Hills",
        "state": "Mizoram",
        "district": "Aizawl",
        "latitude": 23.7744,
        "longitude": 92.7176,
        "elevation": 1132.0,
        "slope": 36.0,
        "soil_type": "Disang Shales - Weathered",
        "vegetation_cover": 0.50,
        "risk_level": "VERY HIGH",
        "current_risk_score": 0.84,
        "created_at": "2026-01-12T10:00:00Z"
    },
    {
        "id": "loc-wayanad-04",
        "name": "Meppadi Hill Slope Zone",
        "state": "Kerala",
        "district": "Wayanad",
        "latitude": 11.5512,
        "longitude": 76.1264,
        "elevation": 780.0,
        "slope": 34.5,
        "soil_type": "Lateritic Clay",
        "vegetation_cover": 0.65,
        "risk_level": "VERY HIGH",
        "current_risk_score": 0.88,
        "created_at": "2026-01-10T10:00:00Z"
    },
    {
        "id": "loc-chamoli-05",
        "name": "Joshimath Ridge Sector 4",
        "state": "Uttarakhand",
        "district": "Chamoli",
        "latitude": 30.5500,
        "longitude": 79.5667,
        "elevation": 1890.0,
        "slope": 41.2,
        "soil_type": "Moraine Debris",
        "vegetation_cover": 0.40,
        "risk_level": "VERY HIGH",
        "current_risk_score": 0.91,
        "created_at": "2026-01-15T10:00:00Z"
    },
    {
        "id": "loc-shimla-06",
        "name": "Summer Hill Watershed",
        "state": "Himachal Pradesh",
        "district": "Shimla",
        "latitude": 31.1048,
        "longitude": 77.1734,
        "elevation": 2200.0,
        "slope": 38.0,
        "soil_type": "Gravelly Loam",
        "vegetation_cover": 0.55,
        "risk_level": "HIGH",
        "current_risk_score": 0.74,
        "created_at": "2026-01-12T10:00:00Z"
    },
    {
        "id": "loc-darjeeling-07",
        "name": "Mirik Teesta Catchment",
        "state": "West Bengal",
        "district": "Darjeeling",
        "latitude": 26.8872,
        "longitude": 88.1813,
        "elevation": 1495.0,
        "slope": 28.0,
        "soil_type": "Silty Clay",
        "vegetation_cover": 0.72,
        "risk_level": "MODERATE",
        "current_risk_score": 0.45,
        "created_at": "2026-01-18T10:00:00Z"
    },
    {
        "id": "loc-kohima-08",
        "name": "Kohima By-pass Slip Area",
        "state": "Nagaland",
        "district": "Kohima",
        "latitude": 25.6751,
        "longitude": 94.1086,
        "elevation": 1444.0,
        "slope": 35.0,
        "soil_type": "Clayey Siltstone",
        "vegetation_cover": 0.58,
        "risk_level": "HIGH",
        "current_risk_score": 0.71,
        "created_at": "2026-01-19T10:00:00Z"
    },
    {
        "id": "loc-guwahati-09",
        "name": "Narakasur Hill Complex",
        "state": "Assam",
        "district": "Kamrup Metropolitan",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "elevation": 240.0,
        "slope": 18.5,
        "soil_type": "Alluvial Red Soil",
        "vegetation_cover": 0.80,
        "risk_level": "LOW",
        "current_risk_score": 0.18,
        "created_at": "2026-01-20T10:00:00Z"
    }
]


NER_STATES = {
    "arunachal pradesh", "assam", "manipur", "meghalaya",
    "mizoram", "nagaland", "sikkim", "tripura", "west bengal"
}
WESTERN_GHATS_STATES = {"kerala", "maharashtra", "karnataka", "tamil nadu", "goa"}
NORTHERN_HIMALAYAS_STATES = {"uttarakhand", "himachal pradesh", "jammu & kashmir", "ladakh"}


def get_region_for_state(state: str) -> str:
    s = (state or "").strip().lower()
    if s in NER_STATES:
        return "NER"
    if s in WESTERN_GHATS_STATES:
        return "WESTERN_GHATS"
    if s in NORTHERN_HIMALAYAS_STATES:
        return "NORTHERN_HIMALAYAS"
    return "PAN_INDIA"


class LocationService:

    async def get_all_locations(self) -> List[Dict[str, Any]]:
        locations = []
        client = get_supabase_client()
        if client:
            try:
                res = client.table("locations").select("*").execute()
                if res.data and len(res.data) > 0:
                    locations = res.data
            except Exception as e:
                logger.error(f"Error fetching locations from Supabase: {str(e)}")

        if not locations:
            locations = [dict(loc) for loc in MOCK_LOCATIONS]

        # Ensure every location is tagged with its geographic region
        for loc in locations:
            if not loc.get("region"):
                loc["region"] = get_region_for_state(loc.get("state"))

        return locations

    async def get_location_by_id(self, location_id: str) -> Optional[Dict[str, Any]]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("locations").select("*").eq("id", location_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error fetching location {location_id}: {str(e)}")

        # Search by id or index or name in mock list
        clean_id = str(location_id).strip().lower()
        for idx, loc in enumerate(MOCK_LOCATIONS):
            if (
                loc["id"].lower() == clean_id
                or str(idx + 1) == clean_id
                or loc["name"].lower() == clean_id
            ):
                return loc

        return MOCK_LOCATIONS[0]


location_service = LocationService()
