import { apiClient, USE_MOCK } from './api';
import {
  MOCK_SUMMARY_METRICS,
  MOCK_RISK_DISTRIBUTION,
  MOCK_STATE_RISK_DATA,
  MOCK_RAINFALL_RISK_TREND,
  MOCK_HISTORICAL_MONTHLY
} from '../data/mockAnalytics';

export const analyticsService = {
  async getSummary() {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/analytics/summary');
        if (res.data) {
          return {
            success: true,
            data: {
              ...MOCK_SUMMARY_METRICS,
              ...res.data,
              total_locations: res.data.total_monitored_zones ?? MOCK_SUMMARY_METRICS.total_locations,
              active_alerts: res.data.active_alerts_count ?? MOCK_SUMMARY_METRICS.active_alerts,
              very_high_risk: res.data.critical_zones_count ?? MOCK_SUMMARY_METRICS.very_high_risk,
              moderate_risk: res.data.moderate_zones_count ?? MOCK_SUMMARY_METRICS.moderate_risk
            }
          };
        }
      } catch (err) {
        console.warn('Failed to load summary analytics from API, using fallback:', err.message);
      }
    }
    return { success: true, data: MOCK_SUMMARY_METRICS };
  },

  async getRiskDistribution() {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/analytics/risk-distribution');
        if (res.data) {
          let formattedData = res.data;
          if (!Array.isArray(res.data) && typeof res.data === 'object') {
            const COLOR_MAP = {
              LOW: '#16A34A',
              MODERATE: '#EAB308',
              HIGH: '#F97316',
              VERY_HIGH: '#DC2626',
              'VERY HIGH': '#DC2626'
            };
            formattedData = [
              { name: 'LOW', value: Number(res.data.LOW) || 0, color: COLOR_MAP.LOW },
              { name: 'MODERATE', value: Number(res.data.MODERATE) || 0, color: COLOR_MAP.MODERATE },
              { name: 'HIGH', value: Number(res.data.HIGH) || 0, color: COLOR_MAP.HIGH },
              {
                name: 'VERY HIGH',
                value: Number(res.data.VERY_HIGH ?? res.data['VERY HIGH']) || 0,
                color: COLOR_MAP.VERY_HIGH
              }
            ];
          }
          return { success: true, data: formattedData };
        }
      } catch (err) {
        console.warn('Failed to load risk distribution from API:', err.message);
      }
    }
    return { success: true, data: MOCK_RISK_DISTRIBUTION };
  },

  async getStateRisk() {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/analytics/state-risk');
        if (res.data?.states && Array.isArray(res.data.states)) {
          // Normalize state risk items so they contain low/moderate/high/veryHigh keys
          const normalized = res.data.states.map((s) => ({
            state: s.state,
            low: s.low ?? 0,
            moderate: s.moderate ?? 0,
            high: s.high ?? s.high_risk_count ?? 0,
            veryHigh: s.veryHigh ?? 0,
            total_locations: s.total_locations ?? 0,
            avg_risk_score: s.avg_risk_score ?? 0
          }));
          return { success: true, data: normalized };
        }
      } catch (err) {
        console.warn('Failed to load state risk from API:', err.message);
      }
    }
    return { success: true, data: MOCK_STATE_RISK_DATA };
  },

  async getRainfallRiskTrend() {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/analytics/rainfall-risk');
        if (res.data?.correlations) {
          return { success: true, data: res.data.correlations };
        }
      } catch (err) {
        console.warn('Failed to load rainfall risk from API:', err.message);
      }
    }
    return { success: true, data: MOCK_RAINFALL_RISK_TREND };
  },

  async getHistoricalData() {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/analytics/historical');
        if (Array.isArray(res.data) && res.data.length > 0) {
          return { success: true, data: res.data };
        }
      } catch (err) {
        console.warn('Failed to load historical analytics from API:', err.message);
      }
    }
    return { success: true, data: MOCK_HISTORICAL_MONTHLY };
  }
};
