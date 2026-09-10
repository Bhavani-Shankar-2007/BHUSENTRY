/**
 * Realistic Mock Alerts for Landslide Risk Early Warning System
 * Statuses: "Active", "Acknowledged", "Resolved"
 * Risk Levels: "LOW", "MODERATE", "HIGH", "VERY HIGH"
 */

export const MOCK_ALERTS = [
  {
    id: "ALT-2026-081",
    location_id: 2,
    location_name: "Cherrapunji (Sohra) Escarpment",
    district: "East Khasi Hills",
    state: "Meghalaya",
    risk_level: "VERY HIGH",
    risk_score: 0.89,
    alert_type: "Extreme Rainfall & Debris Flow Warning",
    message: "Rainfall exceeded 280mm in 24h. Soil saturation index at 94%. High probability of catastrophic debris slide along gorge edge.",
    created_time: "10 mins ago",
    timestamp: "2026-09-04 15:22:00",
    status: "Active",
    recommended_action: "Issue immediate red alert to local disaster response units. Restrict heavy vehicle movement along cliff roads."
  },
  {
    id: "ALT-2026-079",
    location_id: 6,
    location_name: "Aizawl Durtlang Hills",
    district: "Aizawl",
    state: "Mizoram",
    risk_level: "VERY HIGH",
    risk_score: 0.84,
    alert_type: "High Pore-Pressure & Tension Cracks",
    message: "Critical displacement sensors report 4.8mm shear movement in 6 hours. High risk of progressive slope failure on eastern residential ridge.",
    created_time: "24 mins ago",
    timestamp: "2026-09-04 15:08:00",
    status: "Active",
    recommended_action: "Advise precautionary evacuation for lower slope settlements. Deploy drone surveillance team."
  },
  {
    id: "ALT-2026-074",
    location_id: 1,
    location_name: "Gangtok Hillside Corridor",
    district: "East Sikkim",
    state: "Sikkim",
    risk_level: "HIGH",
    risk_score: 0.76,
    alert_type: "Continuous Precipitation Warning",
    message: "Rainfall reached 142mm. Loose phyllitic scree exhibits accelerated runoff. Highway perimeter integrity stressed.",
    created_time: "48 mins ago",
    timestamp: "2026-09-04 14:44:00",
    status: "Acknowledged",
    recommended_action: "SDRF units alerted. Border Roads Organisation (BRO) placed on standby with earthmoving equipment."
  },
  {
    id: "ALT-2026-068",
    location_id: 4,
    location_name: "Tawang High-Pass Ridge",
    district: "Tawang",
    state: "Arunachal Pradesh",
    risk_level: "HIGH",
    risk_score: 0.72,
    alert_type: "Talus Slope Instability",
    message: "Heavy snowmelt runoff coupled with cloud cover rain causing minor rockfall on hairpin curve 14.",
    created_time: "2 hours ago",
    timestamp: "2026-09-04 13:30:00",
    status: "Acknowledged",
    recommended_action: "Traffic slowed to single-lane convoy. Warning signs illuminated."
  },
  {
    id: "ALT-2026-052",
    location_id: 10,
    location_name: "Namchi Tendong Hill",
    district: "South Sikkim",
    state: "Sikkim",
    risk_level: "HIGH",
    risk_score: 0.74,
    alert_type: "Overburden Saturation",
    message: "Rainfall crossed 130mm threshold. Moisture sensors show elevated saturation in topsoil horizon.",
    created_time: "4 hours ago",
    timestamp: "2026-09-04 11:30:00",
    status: "Resolved",
    recommended_action: "Geotechnical clearance completed. Drainage culverts cleared. Status restored to normal watch."
  },
  {
    id: "ALT-2026-041",
    location_id: 3,
    location_name: "Guwahati - Khanapara Slopes",
    district: "Kamrup Metropolitan",
    state: "Assam",
    risk_level: "MODERATE",
    risk_score: 0.52,
    alert_type: "Urban Surface Runoff",
    message: "Moderate hillside drainage overflow. Retaining walls functioning within safe deflection margins.",
    created_time: "1 day ago",
    timestamp: "2026-09-03 14:15:00",
    status: "Resolved",
    recommended_action: "Municipal storm drains desilted. Advisory withdrawn."
  }
];
