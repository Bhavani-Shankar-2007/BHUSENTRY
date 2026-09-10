import { apiClient, USE_MOCK } from './api';

/**
 * Weather Service - fetches live weather + xAI Grok meteorological intelligence
 */
export const weatherService = {
  /**
   * Fetch weather data with Grok AI analysis for a location
   * @param {string} locationId
   */
  async getWeather(locationId) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get(`/weather/${locationId}`);
        if (response.data) {
          return { success: true, data: response.data };
        }
      } catch (err) {
        console.warn('Weather API failed, using fallback:', err.message);
      }
    }

    // Fallback mock data
    return {
      success: true,
      data: {
        location_id: locationId,
        latitude: 27.3314,
        longitude: 88.6138,
        current: {
          temperature_c: 23.8,
          humidity_percent: 89.0,
          rainfall_24h_mm: 135.2,
          rainfall_72h_mm: 290.4,
          wind_speed_kmh: 22.0,
          weather_condition: 'Heavy Rain',
          timestamp: new Date().toISOString()
        },
        forecast: [],
        grok_analysis: {
          summary: 'Persistent monsoonal circulation maintaining heavy precipitation over steep hill slopes.',
          precipitation_severity: 'Severe Downpour',
          slope_impact: 'Cumulative antecedent rainfall exceeds critical saturation threshold; pore water pressure building in weathered overburden layers.',
          weather_advisory: 'Issue precautionary red alert to downstream settlements. Inspect culverts, restrict heavy vehicle movement on hill roads.',
          source: 'xAI Grok (Fallback)'
        }
      }
    };
  },

  /**
   * Fetch dedicated Grok meteorological intelligence for a location
   * @param {string} locationId
   */
  async getGrokInsights(locationId) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get(`/weather/${locationId}/grok-insights`);
        if (response.data) {
          return { success: true, data: response.data };
        }
      } catch (err) {
        console.warn('Grok insights API failed, using fallback:', err.message);
      }
    }

    return {
      success: true,
      data: {
        location_id: locationId,
        grok_analysis: {
          summary: 'Active monsoon trough maintaining continuous precipitation across NER hill districts.',
          precipitation_severity: 'Severe Downpour',
          slope_impact: 'Saturated soil profile with reduced shear strength in upper 2m of weathered overburden.',
          weather_advisory: 'Maintain elevated telemetry monitoring; alert district emergency cells.',
          source: 'xAI Grok (Fallback)'
        }
      }
    };
  }
};

export default weatherService;
