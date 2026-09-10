/**
 * Mock Analytics & Chart Datasets
 * Designed for Recharts components
 */

export const MOCK_SUMMARY_METRICS = {
  total_locations: 12,
  low_risk: 3,
  moderate_risk: 4,
  high_risk: 3,
  very_high_risk: 2,
  active_alerts: 2,
  acknowledged_alerts: 2,
  resolved_alerts: 2,
  avg_ner_rainfall: "117.8 mm",
  highest_risk_state: "Meghalaya (0.89)"
};

// Donut Chart: Risk Distribution
export const MOCK_RISK_DISTRIBUTION = [
  { name: "LOW", value: 3, color: "#16A34A" },
  { name: "MODERATE", value: 4, color: "#EAB308" },
  { name: "HIGH", value: 3, color: "#F97316" },
  { name: "VERY HIGH", value: 2, color: "#DC2626" }
];

// Bar Chart: Risk breakdown across NER States
export const MOCK_STATE_RISK_DATA = [
  { state: "Meghalaya", low: 0, moderate: 1, high: 0, veryHigh: 1 },
  { state: "Sikkim", low: 0, moderate: 0, high: 2, veryHigh: 0 },
  { state: "Mizoram", low: 0, moderate: 0, high: 0, veryHigh: 1 },
  { state: "Arunachal", low: 0, moderate: 1, high: 1, veryHigh: 0 },
  { state: "Assam", low: 1, moderate: 1, high: 0, veryHigh: 0 },
  { state: "Nagaland", low: 0, moderate: 1, high: 0, veryHigh: 0 },
  { state: "Manipur", low: 1, moderate: 0, high: 0, veryHigh: 0 },
  { state: "Tripura", low: 1, moderate: 0, high: 0, veryHigh: 0 }
];

// Line/Area Chart: 7-Day Rainfall (mm) vs Predicted Risk Score Trend
export const MOCK_RAINFALL_RISK_TREND = [
  { day: "Aug 29", rainfall: 42, riskScore: 0.35, alertThreshold: 0.70 },
  { day: "Aug 30", rainfall: 58, riskScore: 0.42, alertThreshold: 0.70 },
  { day: "Aug 31", rainfall: 95, riskScore: 0.58, alertThreshold: 0.70 },
  { day: "Sep 01", rainfall: 140, riskScore: 0.74, alertThreshold: 0.70 },
  { day: "Sep 02", rainfall: 190, riskScore: 0.86, alertThreshold: 0.70 },
  { day: "Sep 03", rainfall: 220, riskScore: 0.89, alertThreshold: 0.70 },
  { day: "Sep 04 (Today)", rainfall: 185, riskScore: 0.82, alertThreshold: 0.70 }
];

// Historical Monsoon Landslide Frequency across NER (Annual overview)
export const MOCK_HISTORICAL_MONTHLY = [
  { month: "Jan", incidents: 1, avgRainfall: 15 },
  { month: "Feb", incidents: 0, avgRainfall: 22 },
  { month: "Mar", incidents: 2, avgRainfall: 65 },
  { month: "Apr", incidents: 6, avgRainfall: 140 },
  { month: "May", incidents: 14, avgRainfall: 290 },
  { month: "Jun", incidents: 42, avgRainfall: 680 },
  { month: "Jul", incidents: 58, avgRainfall: 850 },
  { month: "Aug", incidents: 51, avgRainfall: 790 },
  { month: "Sep", incidents: 34, avgRainfall: 520 },
  { month: "Oct", incidents: 11, avgRainfall: 180 },
  { month: "Nov", incidents: 2, avgRainfall: 35 },
  { month: "Dec", incidents: 0, avgRainfall: 10 }
];
