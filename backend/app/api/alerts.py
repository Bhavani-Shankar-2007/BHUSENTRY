from typing import List, Optional
from fastapi import APIRouter, Depends
from app.core.security import require_officer_or_admin, CurrentUser
from app.schemas.alert import AlertResponse, AlertAcknowledgeRequest, AlertResolveRequest
from app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["Alerts & Early Warnings"])


@router.get("", response_model=List[AlertResponse], summary="List All Alerts")
async def list_alerts():
    """
    Returns all triggered alerts across monitored locations.
    """
    alerts = await alert_service.get_alerts(active_only=False)
    return [AlertResponse(**a) for a in alerts]


@router.get("/active", response_model=List[AlertResponse], summary="List Active Urgent Alerts")
async def list_active_alerts():
    """
    Returns active alerts requiring officer attention.
    """
    alerts = await alert_service.get_alerts(active_only=True)
    return [AlertResponse(**a) for a in alerts]


@router.get("/{id}", response_model=AlertResponse, summary="Get Alert Details")
async def get_alert(id: str):
    """
    Returns alert details for a specific alert ID.
    """
    alert = await alert_service.get_alert_by_id(id)
    return AlertResponse(**alert)


@router.put("/{id}/acknowledge", response_model=AlertResponse, summary="Acknowledge Alert")
async def acknowledge_alert(
    id: str,
    payload: Optional[AlertAcknowledgeRequest] = None,
    current_user: CurrentUser = Depends(require_officer_or_admin)
):
    """
    Officer/Admin endpoint to mark an alert as ACKNOWLEDGED.
    """
    note = payload.note if payload else None
    updated = await alert_service.acknowledge_alert(id, current_user.email, note)
    return AlertResponse(**updated)


@router.put("/{id}/resolve", response_model=AlertResponse, summary="Resolve Alert")
async def resolve_alert(
    id: str,
    payload: Optional[AlertResolveRequest] = None,
    current_user: CurrentUser = Depends(require_officer_or_admin)
):
    """
    Officer/Admin endpoint to mark an active alert as RESOLVED.
    """
    resolution_notes = payload.resolution_notes if payload else None
    updated = await alert_service.resolve_alert(id, current_user.email, resolution_notes)
    return AlertResponse(**updated)
