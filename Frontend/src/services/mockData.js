/**
 * Central mock data hub.
 * All hardcoded JSON / simulated states live here (or are re-exported from data/).
 * Switching to real FastAPI endpoints later only requires changing service layers.
 */

export { MOCK_LOCATIONS, NER_STATES, RISK_LEVELS } from '../data/mockLocations';
export { MOCK_ALERTS } from '../data/mockAlerts';
export {
  MOCK_SUMMARY_METRICS,
  MOCK_RISK_DISTRIBUTION,
  MOCK_STATE_RISK_DATA,
  MOCK_RAINFALL_RISK_TREND,
  MOCK_HISTORICAL_MONTHLY,
} from '../data/mockAnalytics';
export { DEMO_USERS } from '../data/mockUsers';

/** Environmental metrics for dashboard gauges (per-location or aggregate) */
export const MOCK_ENVIRONMENTAL_METRICS = {
  rainfall_mm: 142.5,
  soil_moisture_pct: 78,
  slope_angle_deg: 38.5,
  ndvi: 0.42,
  last_updated: '8 mins ago',
};

/** Simulated AI risk explanations (chat responses) */
export const MOCK_AI_EXPLANATIONS = [
  {
    id: 1,
    role: 'assistant',
    content:
      'The elevated risk score (0.89) at Cherrapunji is driven primarily by extreme 24-hour rainfall (285 mm) saturating lateritic soils on steep escarpment slopes (42°). NDVI of 0.31 indicates sparse protective vegetation, amplifying surface runoff. Historical debris-flow events in 2024 corroborate the current threshold breach.',
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    role: 'assistant',
    content:
      'Gangtok Hillside Corridor shows HIGH risk (0.76) due to continuous precipitation (142 mm) on fragile Daling Group phyllite. Slope angle of 38.5° combined with soil moisture at 81% creates elevated pore-pressure conditions. Recommend continuous monitoring of NH-10 corridor sensors.',
    timestamp: new Date().toISOString(),
  },
];

/** SMS notification log (Fast2SMS & Telegram emergency gateway) */
export const MOCK_SMS_LOG = [
  {
    id: 'SMS-001',
    to: '+91 98765 43210',
    message:
      'RED ALERT: Cherrapunji Escarpment – Extreme rainfall. Evacuate low-lying areas. - NER Disaster Control',
    status: 'Delivered',
    provider: 'Fast2SMS',
    timestamp: '2026-09-04 15:25:12',
  },
  {
    id: 'SMS-002',
    to: '+91 94361 11223',
    message:
      'HIGH RISK: Gangtok Hillside – Continuous precip. Restrict heavy vehicles on NH-10. - NER Control',
    status: 'Delivered',
    provider: 'Fast2SMS',
    timestamp: '2026-09-04 14:50:03',
  },
  {
    id: 'SMS-003',
    to: '+91 70052 88901',
    message:
      'MODERATE: Aizawl Durtlang – Displacement sensors active. Monitor tension cracks. - NER Control',
    status: 'Delivered',
    provider: 'Telegram Bot',
    timestamp: '2026-09-04 13:15:44',
  },
];

/** Phone number subscriber management list */
export const MOCK_SUBSCRIBERS = [
  {
    id: 1,
    name: 'District Collector – East Khasi Hills',
    phone: '+91 98765 43210',
    role: 'Authority',
    active: true,
  },
  {
    id: 2,
    name: 'SDRF Unit Gangtok',
    phone: '+91 94361 11223',
    role: 'Response',
    active: true,
  },
  {
    id: 3,
    name: 'BRO NH-10 Control',
    phone: '+91 70052 88901',
    role: 'Infrastructure',
    active: true,
  },
  {
    id: 4,
    name: 'Local Village Head – Sohra',
    phone: '+91 98620 33445',
    role: 'Community',
    active: false,
  },
];

/** Map layer definitions (tile URLs for toggle) */
export const MAP_LAYERS = {
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  openTopo: {
    id: 'openTopo',
    name: 'OpenTopography Elevation',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
  },
  nasaGibsTrueColor: {
    id: 'nasaGibsTrueColor',
    name: 'NASA GIBS Daily True-Color',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
    attribution: 'Imagery &copy; NASA EOSDIS GIBS',
    maxNativeZoom: 9,
    maxZoom: 18,
    opacity: 0.85,
  },
  nasaGibsPrecipitation: {
    id: 'nasaGibsPrecipitation',
    name: 'NASA GPM IMERG Precipitation Rate',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png',
    attribution: 'Precipitation &copy; NASA GPM IMERG / GIBS',
    maxNativeZoom: 6,
    maxZoom: 18,
    opacity: 0.65,
  },
  sentinel2: {
    id: 'sentinel2',
    name: 'NASA GIBS Daily Earth Obs',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
    attribution: 'Imagery &copy; NASA EOSDIS GIBS',
    maxNativeZoom: 9,
    maxZoom: 18,
    opacity: 0.85,
  },
};
