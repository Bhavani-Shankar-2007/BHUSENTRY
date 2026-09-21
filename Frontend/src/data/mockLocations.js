/**
 * Realistic Mock Data for North Eastern Region (NER), India
 * Covers the 8 states: Sikkim, Meghalaya, Assam, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura.
 * Each location has geological, environmental, and AI-predicted risk attributes.
 */

export const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Gangtok Hillside Corridor",
    district: "East Sikkim",
    state: "Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
    risk_level: "HIGH",
    risk_score: 0.76,
    rainfall: 142.5, // mm in last 24h
    elevation: 1650, // meters
    slope: 38.5,     // degrees
    soil_type: "Loamy Skeletal with Phyllite",
    land_cover: "Sparse Forest / Urban Slope",
    geology: "Daling Group - Fragile metamorphic schist",
    last_updated: "12 mins ago",
    active_alert: true,
    alert_message: "Heavy precipitation triggering steep slope displacement warnings.",
    historical_events: [
      { year: 2023, severity: "Moderate", description: "Debris flow near NH-10 corridor." },
      { year: 2020, severity: "Severe", description: "Monsoon rockfall disrupting district bypass." }
    ]
  },
  {
    id: 2,
    name: "Cherrapunji (Sohra) Escarpment",
    district: "East Khasi Hills",
    state: "Meghalaya",
    latitude: 25.2986,
    longitude: 91.5822,
    risk_level: "VERY HIGH",
    risk_score: 0.89,
    rainfall: 285.0,
    elevation: 1430,
    slope: 42.0,
    soil_type: "Lateritic Sandy Loam",
    land_cover: "Grassland & Gorge Valley",
    geology: "Cretaceous-Tertiary Sandstone and Limestone",
    last_updated: "5 mins ago",
    active_alert: true,
    alert_message: "Critical moisture saturation: Exceeds 250mm cumulative threshold.",
    historical_events: [
      { year: 2024, severity: "High", description: "Massive mudslide blocked Mawmluh access road." },
      { year: 2022, severity: "Severe", description: "Flash flooding coupled with slope failure." }
    ]
  },
  {
    id: 3,
    name: "Guwahati - Khanapara Slopes",
    district: "Kamrup Metropolitan",
    state: "Assam",
    latitude: 26.1158,
    longitude: 91.8282,
    risk_level: "MODERATE",
    risk_score: 0.52,
    rainfall: 68.2,
    elevation: 110,
    slope: 24.0,
    soil_type: "Red Residual Soil",
    land_cover: "Semi-urban Degraded Forest",
    geology: "Precambrian Gneissic Complex",
    last_updated: "25 mins ago",
    active_alert: false,
    alert_message: null,
    historical_events: [
      { year: 2021, severity: "Low", description: "Minor earth slip along perimeter wall." }
    ]
  },
  {
    id: 4,
    name: "Tawang High-Pass Ridge",
    district: "Tawang",
    state: "Arunachal Pradesh",
    latitude: 27.5861,
    longitude: 91.8594,
    risk_level: "HIGH",
    risk_score: 0.72,
    rainfall: 115.8,
    elevation: 3048,
    slope: 44.5,
    soil_type: "Morainic Gravel and Silt",
    land_cover: "Alpine Shrub / Mountain Pass",
    geology: "Higher Himalayan Crystalline Rocks",
    last_updated: "18 mins ago",
    active_alert: true,
    alert_message: "Snowmelt runoff combined with heavy rain causing talus slide risk.",
    historical_events: [
      { year: 2023, severity: "High", description: "Military convoy route block at Sela-Tawang axis." }
    ]
  },
  {
    id: 5,
    name: "Kohima Town Ridge",
    district: "Kohima",
    state: "Nagaland",
    latitude: 25.6751,
    longitude: 94.1086,
    risk_level: "MODERATE",
    risk_score: 0.48,
    rainfall: 55.4,
    elevation: 1444,
    slope: 28.0,
    soil_type: "Clayey Loam with Disang Shales",
    land_cover: "Dense Settlement / Terrace",
    geology: "Disang Formation - Highly weathered splintery shales",
    last_updated: "35 mins ago",
    active_alert: false,
    alert_message: null,
    historical_events: [
      { year: 2018, severity: "Moderate", description: "Subsidence on NH-29 Kohima-Dimapur stretch." }
    ]
  },
  {
    id: 6,
    name: "Aizawl Durtlang Hills",
    district: "Aizawl",
    state: "Mizoram",
    latitude: 23.7785,
    longitude: 92.7303,
    risk_level: "VERY HIGH",
    risk_score: 0.84,
    rainfall: 198.4,
    elevation: 1132,
    slope: 46.2,
    soil_type: "Sandy Silt Loam",
    land_cover: "Steep Ridge Urban Habitation",
    geology: "Surma Group - Alternating Sandstone and Shale",
    last_updated: "8 mins ago",
    active_alert: true,
    alert_message: "Deep pore water pressure detected on eastern crest slopes.",
    historical_events: [
      { year: 2024, severity: "Severe", description: "Durtlang quarry road collapse after cyclone Remal." },
      { year: 2017, severity: "High", description: "Multiple landslides isolated northern districts." }
    ]
  },
  {
    id: 7,
    name: "Imphal Valley - Senapati Ghats",
    district: "Senapati",
    state: "Manipur",
    latitude: 25.2688,
    longitude: 94.0189,
    risk_level: "LOW",
    risk_score: 0.22,
    rainfall: 24.1,
    elevation: 1050,
    slope: 16.0,
    soil_type: "Alluvial Clay Loam",
    land_cover: "Agricultural Valley & Forest",
    geology: "Barail Group - Consolidated Sandstone",
    last_updated: "42 mins ago",
    active_alert: false,
    alert_message: null,
    historical_events: []
  },
  {
    id: 8,
    name: "Jampui Hills Ridge",
    district: "North Tripura",
    state: "Tripura",
    latitude: 23.9500,
    longitude: 92.2667,
    risk_level: "LOW",
    risk_score: 0.18,
    rainfall: 18.0,
    elevation: 930,
    slope: 14.5,
    soil_type: "Laterite and Red Gravelly Soil",
    land_cover: "Orange Orchards & Mixed Plantation",
    geology: "Tipam Sandstone Formation",
    last_updated: "1 hour ago",
    active_alert: false,
    alert_message: null,
    historical_events: []
  },
  {
    id: 9,
    name: "Shillong Peak & Upper Shillong",
    district: "East Khasi Hills",
    state: "Meghalaya",
    latitude: 25.5385,
    longitude: 91.8492,
    risk_level: "MODERATE",
    risk_score: 0.58,
    rainfall: 74.0,
    elevation: 1965,
    slope: 30.0,
    soil_type: "Acidic Forest Loam",
    land_cover: "Pine Forest / Semi-Protected",
    geology: "Shillong Group Quartzites",
    last_updated: "15 mins ago",
    active_alert: false,
    alert_message: null,
    historical_events: [
      { year: 2021, severity: "Moderate", description: "Upper Shillong slip during continuous 48h rain." }
    ]
  },
  {
    id: 10,
    name: "Namchi Tendong Hill",
    district: "South Sikkim",
    state: "Sikkim",
    latitude: 27.1667,
    longitude: 88.3500,
    risk_level: "HIGH",
    risk_score: 0.74,
    rainfall: 130.0,
    elevation: 2150,
    slope: 39.0,
    soil_type: "Gravelly Sandy Loam",
    land_cover: "Temperate Broadleaf Reserve",
    geology: "Gondwana Sandstone and Coal Seams",
    last_updated: "20 mins ago",
    active_alert: true,
    alert_message: "High moisture retention in weathered overburden layer.",
    historical_events: [
      { year: 2022, severity: "Moderate", description: "Tendong trekking path washed out." }
    ]
  },
  {
    id: 11,
    name: "Diphu Karbi Hills",
    district: "Karbi Anglong",
    state: "Assam",
    latitude: 25.8450,
    longitude: 93.4320,
    risk_level: "LOW",
    risk_score: 0.28,
    rainfall: 32.5,
    elevation: 320,
    slope: 18.0,
    soil_type: "Red Loamy Soil",
    land_cover: "Bamboo Grove & Forest Fringe",
    geology: "Granite Gneiss Basement",
    last_updated: "50 mins ago",
    active_alert: false,
    alert_message: null,
    historical_events: []
  },
  {
    id: 12,
    name: "Itanagar Papum Pare Slopes",
    district: "Papum Pare",
    state: "Arunachal Pradesh",
    latitude: 27.0844,
    longitude: 93.6053,
    risk_level: "MODERATE",
    risk_score: 0.54,
    rainfall: 82.0,
    elevation: 320,
    slope: 26.5,
    soil_type: "Silty Clay Loam",
    land_cover: "Hill Town Periphery",
    geology: "Siwalik Group - Friable Sandstone",
    last_updated: "28 mins ago",
    active_alert: false,
    alert_message: null,
    historical_events: [
      { year: 2020, severity: "Moderate", description: "Road cutting instability on Itanagar-Hollongi highway." }
    ]
  },
  {
    id: 13,
    name: "Munnar Tea Estates",
    district: "Idukki",
    state: "Kerala",
    latitude: 10.0889,
    longitude: 77.0595,
    risk_level: "VERY HIGH",
    risk_score: 0.88,
    rainfall: 210.5,
    elevation: 1532,
    slope: 35.0,
    soil_type: "Laterite",
    land_cover: "Tea Plantation / Cleared Forest",
    geology: "Precambrian Gneiss",
    last_updated: "2 mins ago",
    active_alert: true,
    alert_message: "High risk of debris flow due to intense monsoon rains.",
    historical_events: [
      { year: 2018, severity: "Severe", description: "Massive landslides during Kerala floods." }
    ]
  },
  {
    id: 14,
    name: "Joshimath Sinking Zone",
    district: "Chamoli",
    state: "Uttarakhand",
    latitude: 30.5506,
    longitude: 79.5660,
    risk_level: "HIGH",
    risk_score: 0.81,
    rainfall: 45.0,
    elevation: 1875,
    slope: 28.5,
    soil_type: "Glacial Moraine",
    land_cover: "Urban Settlement",
    geology: "Vaikrita Group",
    last_updated: "10 mins ago",
    active_alert: true,
    alert_message: "Continuous land subsidence detected by satellite SAR.",
    historical_events: [
      { year: 2023, severity: "High", description: "Widespread structural cracks leading to evacuation." }
    ]
  },
  {
    id: 15,
    name: "Mahabaleshwar Ghats",
    district: "Satara",
    state: "Maharashtra",
    latitude: 17.9307,
    longitude: 73.6477,
    risk_level: "MODERATE",
    risk_score: 0.55,
    rainfall: 120.0,
    elevation: 1353,
    slope: 22.0,
    soil_type: "Red Lateritic",
    land_cover: "Dense Forest",
    geology: "Deccan Traps Basalt",
    last_updated: "1 hr ago",
    active_alert: false,
    alert_message: null,
    historical_events: []
  }
];

export const NER_STATES = [
  "All States",
  "Arunachal Pradesh",
  "Assam",
  "Himachal Pradesh",
  "Kerala",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
  "Uttarakhand",
  "West Bengal"
];

export const RISK_LEVELS = ["All Levels", "LOW", "MODERATE", "HIGH", "VERY HIGH"];
