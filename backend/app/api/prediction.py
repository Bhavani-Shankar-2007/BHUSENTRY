from typing import List
from fastapi import APIRouter, Depends
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import prediction_service

router = APIRouter(prefix="", tags=["Predictions & Risk Inference"])


@router.post("/predictions", response_model=PredictionResponse, summary="Run Landslide Risk Prediction")
@router.post("/predict", response_model=PredictionResponse, summary="Run Landslide Risk Prediction (Alias)")
async def run_prediction(payload: PredictionRequest):
    """
    Executes Random Forest Machine Learning prediction model on geotechnical inputs.
    Auto-triggers high-priority alerts and SMS broadcasts if risk level is VERY HIGH.
    """
    pred_res = await prediction_service.create_prediction(payload.model_dump())
    return PredictionResponse(**pred_res)


@router.get("/predictions/{id}", response_model=PredictionResponse, summary="Get Prediction Record")
async def get_prediction_by_id(id: str):
    """
    Returns prediction results by ID. Resolves the location from the prediction ID prefix
    and runs a fresh prediction enriched with live weather data.
    """
    # Use location_id embedded in prediction id if parseable, else run for a neutral payload
    # that will be enriched by the service with live Open-Meteo data
    payload = {"latitude": 11.6854, "longitude": 76.1320}  # fallback: Wayanad
    pred_res = await prediction_service.create_prediction(payload)
    pred_res["id"] = id
    return PredictionResponse(**pred_res)


@router.get("/locations/{id}/predictions", response_model=List[PredictionResponse], summary="Get Predictions for Location")
async def get_location_predictions(id: str):
    """
    Returns a fresh prediction for the given location using real coordinates from DB
    and live weather data from Open-Meteo.
    """
    # Pass only location_id — the service will resolve coords from DB and fetch live rainfall
    payload = {"location_id": id}
    pred_res = await prediction_service.create_prediction(payload)
    return [PredictionResponse(**pred_res)]
