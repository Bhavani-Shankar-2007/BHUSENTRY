from fastapi import APIRouter
from app.schemas.satellite import SatelliteObservationResponse
from app.services.satellite_service import satellite_service

router = APIRouter(tags=["Satellite & Earth Observation"])


@router.get("/satellite/{location_id}", response_model=SatelliteObservationResponse, summary="Get NASA GIBS Satellite Earth Observations")
async def get_satellite(location_id: str):
    """
    Returns NASA GIBS (EOSDIS) / ESRI Earth Observation readings, vegetation indices (NDVI, NDWI), and ground deformation.
    """
    res = await satellite_service.get_satellite_data(location_id)
    return SatelliteObservationResponse(**res)


@router.get("/satellite/{location_id}/latest", response_model=SatelliteObservationResponse, summary="Get Latest Satellite Pass")
async def get_satellite_latest(location_id: str):
    return await get_satellite(location_id)
