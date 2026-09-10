from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.schemas.location import LocationResponse
from app.services.location_service import location_service

router = APIRouter(prefix="/locations", tags=["Locations & Monitored Zones"])


@router.get("", response_model=List[LocationResponse], summary="List Monitored Locations")
async def list_locations(region: Optional[str] = Query(None, description="Filter by region (e.g. NER, WESTERN_GHATS, NORTHERN_HIMALAYAS, ALL_INDIA)")):
    """
    Returns monitored landslide vulnerability zones, optionally filtered by geographic region.
    """
    locations = await location_service.get_all_locations()
    if region and region.upper() not in ["ALL", "ALL_INDIA", "PAN_INDIA"]:
        reg_clean = region.strip().upper()
        locations = [l for l in locations if (l.get("region") or "").upper() == reg_clean]
    return [LocationResponse(**loc) for loc in locations]


@router.get("/{id}", response_model=LocationResponse, summary="Get Location Details")
async def get_location_by_id(id: str):
    """
    Returns detailed information for a specific location zone.
    """
    loc = await location_service.get_location_by_id(id)
    return LocationResponse(**loc)
