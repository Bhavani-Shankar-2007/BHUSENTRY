from fastapi import APIRouter
from app.schemas.elevation import TerrainDataResponse
from app.services.elevation_service import elevation_service

router = APIRouter(prefix="/terrain", tags=["Elevation & DEM Terrain Analysis"])


@router.get("/{location_id}", response_model=TerrainDataResponse, summary="Get DEM Elevation & Slope Data")
async def get_terrain(location_id: str):
    """
    Returns Digital Elevation Model (DEM) data including slope inclination, elevation, and soil composition.
    """
    res = await elevation_service.get_terrain_data(location_id)
    return TerrainDataResponse(**res)
