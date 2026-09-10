from typing import List, Dict, Any
from fastapi import APIRouter
from app.schemas.analytics import (
    AnalyticsSummaryResponse,
    RiskDistributionResponse,
    StateRiskResponse,
    TopRiskLocationItem,
    HistoricalLandslideItem
)
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics & Risk Intelligence"])


@router.get("/summary", response_model=AnalyticsSummaryResponse, summary="Overall Risk Analytics Summary")
async def get_summary():
    data = await analytics_service.get_summary()
    return AnalyticsSummaryResponse(**data)


@router.get("/risk-distribution", response_model=RiskDistributionResponse, summary="Risk Level Distribution")
async def get_risk_distribution():
    data = await analytics_service.get_risk_distribution()
    return RiskDistributionResponse(**data)


@router.get("/state-risk", response_model=StateRiskResponse, summary="State-by-State Landslide Vulnerability")
async def get_state_risk():
    states_data = await analytics_service.get_state_risk()
    return StateRiskResponse(states=states_data)


@router.get("/rainfall-risk", summary="Rainfall vs Landslide Risk Correlation")
async def get_rainfall_risk():
    return await analytics_service.get_rainfall_risk_correlation()


@router.get("/historical", response_model=List[HistoricalLandslideItem], summary="Historical Disaster Records")
async def get_historical():
    records = await analytics_service.get_historical_landslides()
    return [HistoricalLandslideItem(**r) for r in records]


@router.get("/top-risk", response_model=List[TopRiskLocationItem], summary="Top Vulnerable Zones")
async def get_top_risk():
    top_zones = await analytics_service.get_top_risk_locations()
    return [TopRiskLocationItem(**z) for z in top_zones]
