from fastapi import APIRouter
from app.schemas.satellite import SatelliteObservationResponse
from app.services.satellite_service import satellite_service

router = APIRouter(tags=["Satellite & Earth Observation"])


@router.get("/satellite/{location_id}", response_model=SatelliteObservationResponse, summary="Get Satellite Earth Observations")
async def get_satellite(location_id: str):
    """
    Returns Sentinel-2 / Sentinel-1 SAR vegetation indices (NDVI, NDWI) and InSAR ground deformation readings.
    """
    res = await satellite_service.get_satellite_data(location_id)
    return SatelliteObservationResponse(**res)


@router.get("/satellite/{location_id}/latest", response_model=SatelliteObservationResponse, summary="Get Latest Satellite Pass")
async def get_satellite_latest(location_id: str):
    return await get_satellite(location_id)
