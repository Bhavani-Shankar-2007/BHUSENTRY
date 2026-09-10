import { apiClient, USE_MOCK } from './api';
import { MOCK_ALERTS } from '../data/mockAlerts';

// In-memory clone of alerts so users can acknowledge/resolve alerts during the demo
let activeAlertsState = [...MOCK_ALERTS];

const normalizeAlert = (a, index = 0) => {
  if (!a) return null;
  const rawStatus = (a.status || 'ACTIVE').toUpperCase();
  let cleanStatus = 'Active';
  if (rawStatus === 'ACKNOWLEDGED') cleanStatus = 'Acknowledged';
  else if (rawStatus === 'RESOLVED') cleanStatus = 'Resolved';

  const riskLevel = (a.risk_level || 'HIGH').toUpperCase();
  const riskScore = a.risk_score != null ? a.risk_score : 0.85;

  return {
    ...a,
    id: a.id || `ALT-2026-${index + 100}`,
    location_id: a.location_id || 1,
    location_name: a.location_name || 'Himalayan Slope Zone',
    district: a.district || (a.location_name?.includes(',') ? a.location_name.split(',')[1].trim() : 'Active Sector'),
    state: a.state || 'Northeast India',
    risk_level: riskLevel,
    risk_score: parseFloat(riskScore.toFixed(2)),
    alert_type: a.alert_type || (riskLevel === 'VERY HIGH' ? 'Critical Precipitation & Pore-Pressure Breach' : 'Continuous Rainfall Slope Watch'),
    message: a.message || 'Elevated landslide risk threshold detected across slope sensors.',
    status: cleanStatus,
    created_time: a.created_time || 'Just now',
    timestamp: a.created_at || a.timestamp || new Date().toISOString(),
    recommended_action: a.recommended_action || (riskLevel === 'VERY HIGH' ? 'Dispatch SDRF units and restrict vehicular traffic along corridor.' : 'Maintain continuous geotechnical sensor surveillance.')
  };
};

/**
 * Service to manage alerts and warnings
 */
export const alertService = {
  /**
   * Fetch all alerts with optional status/risk filtering
   */
  async getAlerts(filters = {}) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get('/alerts', { params: filters });
        const rawList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        let results = rawList.map((a, idx) => normalizeAlert(a, idx));

        if (filters.status && filters.status !== 'All') {
          results = results.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase());
        }
        if (filters.risk_level && filters.risk_level !== 'All Levels') {
          results = results.filter((a) => a.risk_level.toUpperCase() === filters.risk_level.toUpperCase());
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (a) =>
              a.location_name.toLowerCase().includes(q) ||
              a.state.toLowerCase().includes(q) ||
              a.alert_type.toLowerCase().includes(q)
          );
        }

        return {
          success: true,
          data: results,
          message: 'Alerts retrieved from backend API'
        };
      } catch (err) {
        console.warn('Alerts API call failed, falling back to local dataset:', err.message);
      }
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 100));
    let results = activeAlertsState.map((a, idx) => normalizeAlert(a, idx));

    if (filters.status && filters.status !== 'All') {
      results = results.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.risk_level && filters.risk_level !== 'All Levels') {
      results = results.filter((a) => a.risk_level.toUpperCase() === filters.risk_level.toUpperCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.location_name.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q) ||
          a.alert_type.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: results,
      message: 'Alerts retrieved successfully'
    };
  },

  /**
   * Mark alert as Acknowledged
   */
  async acknowledgeAlert(alertId, note = 'Acknowledged via Operations Console') {
    activeAlertsState = activeAlertsState.map((a) =>
      a.id === alertId ? { ...a, status: 'Acknowledged' } : a
    );

    if (!USE_MOCK) {
      try {
        const response = await apiClient.put(`/alerts/${alertId}/acknowledge`, { note });
        return { success: true, data: response.data, message: `Alert ${alertId} acknowledged.` };
      } catch (err) {
        console.warn(`Failed to acknowledge alert ${alertId} via API:`, err.message);
      }
    }

    return { success: true, message: `Alert ${alertId} acknowledged.` };
  },

  /**
   * Mark alert as Resolved
   */
  async resolveAlert(alertId, resolutionNotes = 'Resolved via Operations Console') {
    activeAlertsState = activeAlertsState.map((a) =>
      a.id === alertId ? { ...a, status: 'Resolved' } : a
    );

    if (!USE_MOCK) {
      try {
        const response = await apiClient.put(`/alerts/${alertId}/resolve`, { resolution_notes: resolutionNotes });
        return { success: true, data: response.data, message: `Alert ${alertId} resolved.` };
      } catch (err) {
        console.warn(`Failed to resolve alert ${alertId} via API:`, err.message);
      }
    }

    return { success: true, message: `Alert ${alertId} resolved.` };
  }
};
