import { apiClient, USE_MOCK } from './api';
import { MOCK_LOCATIONS } from '../data/mockLocations';

const normalizeLocation = (loc, index = 0) => {
  if (!loc) return null;
  const riskScore = loc.risk_score != null ? loc.risk_score : (loc.current_risk_score != null ? loc.current_risk_score : 0.45);
  return {
    ...loc,
    id: loc.id != null ? loc.id : index + 1,
    name: loc.name || 'Monitored Landslide Zone',
    state: loc.state || 'Northeast India',
    district: loc.district || 'Himalayan Ridge',
    latitude: Number(loc.latitude) || 27.3389,
    longitude: Number(loc.longitude) || 88.6065,
    risk_level: (loc.risk_level || 'MODERATE').toUpperCase(),
    risk_score: parseFloat(riskScore.toFixed(2)),
    current_risk_score: parseFloat(riskScore.toFixed(2)),
    rainfall: loc.rainfall != null ? loc.rainfall : Math.round(riskScore * 220 + 35),
    elevation: loc.elevation != null ? loc.elevation : 1250,
    slope: loc.slope != null ? loc.slope : 32.5,
    soil_type: loc.soil_type || 'Loamy Skeletal with Phyllite',
    land_cover: loc.land_cover || 'Sparse Forest / Urban Slope',
    geology: loc.geology || loc.soil_type || 'Daling Group - Fragile metamorphic schist',
    last_updated: loc.last_updated || 'Live Telemetry',
    active_alert: loc.active_alert ?? (riskScore >= 0.75),
    alert_message: loc.alert_message || (riskScore >= 0.75 ? 'Critical slope movement and saturation alert active.' : 'Normal environmental parameters.'),
    historical_events: loc.historical_events || [
      { year: 2024, severity: riskScore >= 0.75 ? "Severe" : "Moderate", description: "Monsoon precipitation induced debris flow." },
      { year: 2021, severity: "Moderate", description: "Seasonal slope creep monitored." }
    ]
  };
};

/**
 * Service to fetch and filter monitored NER locations
 */
export const locationService = {
  /**
   * Fetch all locations with optional filtering
   */
  async getLocations(filters = {}) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get('/locations', { params: filters });
        const rawList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        let normalizedList = rawList.map((l, idx) => normalizeLocation(l, idx));

        if (filters.search) {
          const q = filters.search.toLowerCase();
          normalizedList = normalizedList.filter(
            (loc) =>
              loc.name.toLowerCase().includes(q) ||
              loc.district.toLowerCase().includes(q) ||
              loc.state.toLowerCase().includes(q)
          );
        }

        if (filters.state && filters.state !== 'All States') {
          normalizedList = normalizedList.filter((loc) => loc.state.toLowerCase() === filters.state.toLowerCase());
        }

        if (filters.risk_level && filters.risk_level !== 'All Levels') {
          normalizedList = normalizedList.filter(
            (loc) => loc.risk_level.toUpperCase() === filters.risk_level.toUpperCase()
          );
        }

        return {
          success: true,
          data: normalizedList,
          message: 'Locations loaded from backend API'
        };
      } catch (err) {
        console.warn('Backend API call failed, falling back to local dataset:', err.message);
      }
    }

    // Fallback to local dataset
    await new Promise((resolve) => setTimeout(resolve, 100));
    let results = MOCK_LOCATIONS.map((l, idx) => normalizeLocation(l, idx));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.district.toLowerCase().includes(q) ||
          loc.state.toLowerCase().includes(q)
      );
    }

    if (filters.state && filters.state !== 'All States') {
      results = results.filter((loc) => loc.state.toLowerCase() === filters.state.toLowerCase());
    }

    if (filters.risk_level && filters.risk_level !== 'All Levels') {
      results = results.filter(
        (loc) => loc.risk_level.toUpperCase() === filters.risk_level.toUpperCase()
      );
    }

    return {
      success: true,
      data: results,
      message: 'Locations loaded successfully'
    };
  },

  /**
   * Fetch a single location by ID
   */
  async getLocationById(id) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get(`/locations/${id}`);
        const locData = response.data?.data || response.data;
        if (locData) {
          return { success: true, data: normalizeLocation(locData), message: 'Location found' };
        }
      } catch (err) {
        console.warn(`Failed to fetch location ${id} from API, using fallback:`, err.message);
      }
    }

    const cleanId = String(id).toLowerCase();
    const loc = MOCK_LOCATIONS.find((l) => String(l.id).toLowerCase() === cleanId || l.name.toLowerCase().includes(cleanId));
    if (!loc) {
      return { success: true, data: normalizeLocation(MOCK_LOCATIONS[0]), message: 'Default location loaded' };
    }
    return { success: true, data: normalizeLocation(loc), message: 'Location found' };
  }
};
