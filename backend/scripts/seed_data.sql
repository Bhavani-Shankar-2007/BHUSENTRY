-- ====================================================================
-- BHUSENTRY - Seed Data: Real Indian High-Risk Landslide Locations
-- Run this AFTER schema.sql in Supabase SQL Editor
-- Source: NDMA, GSI Landslide Atlas, NRSC reports
-- ====================================================================

-- Clear existing seed data first (safe to re-run)
DELETE FROM public.locations WHERE id LIKE 'loc-%';

-- Insert real monitored locations
INSERT INTO public.locations (id, name, state, district, latitude, longitude, elevation, slope, soil_type, vegetation_cover, risk_level, current_risk_score)
VALUES
-- Kerala (Western Ghats - highest risk zone in India)
('loc-wayanad-01',    'Meppadi-Chooralmala Slope Zone',     'Kerala',           'Wayanad',              11.5512,  76.1264,  820.0,  36.5, 'Lateritic Clay',       0.68, 'VERY HIGH', 0.88),
('loc-wayanad-02',    'Vythiri Hill Corridor',               'Kerala',           'Wayanad',              11.5954,  76.0459,  745.0,  28.0, 'Red Laterite',         0.72, 'HIGH',      0.72),
('loc-idukki-01',     'Rajamala Ridge (Eravikulam)',         'Kerala',           'Idukki',               10.1696,  77.0649,  1600.0, 40.0, 'Stony Loam',           0.55, 'VERY HIGH', 0.84),
('loc-idukki-02',     'Munnar Tea Estate Watershed',         'Kerala',           'Idukki',               10.0889,  77.0595,  1340.0, 32.0, 'Sandy Red Soil',       0.60, 'HIGH',      0.70),
('loc-malappuram-01', 'Nilambur Valley Catchment',           'Kerala',           'Malappuram',           11.2789,  76.2276,  380.0,  22.0, 'Alluvial Laterite',    0.78, 'MODERATE',  0.48),

-- Uttarakhand (Himalayan - Tectonically active)
('loc-chamoli-01',    'Joshimath Urban Subsidence Zone',     'Uttarakhand',      'Chamoli',              30.5580,  79.5641,  1895.0, 42.0, 'Moraine Debris',       0.35, 'VERY HIGH', 0.91),
('loc-chamoli-02',    'Tapovan-Reni Glacier Outburst Zone',  'Uttarakhand',      'Chamoli',              30.4752,  79.6833,  2500.0, 48.0, 'Glacial Till',         0.20, 'VERY HIGH', 0.87),
('loc-rudraprayag-01','Kedarnath Valley Corridor',            'Uttarakhand',      'Rudraprayag',          30.7346,  79.0669,  1880.0, 38.5, 'Schistose Rock',       0.30, 'HIGH',      0.76),
('loc-tehri-01',      'Narendranagar Landslide Susceptible', 'Uttarakhand',      'Tehri Garhwal',        30.1631,  78.2934,  790.0,  30.0, 'Clay Schist',          0.50, 'HIGH',      0.68),
('loc-pithoragarh-01','Dharchula-Nepal Border Zone',          'Uttarakhand',      'Pithoragarh',          29.8359,  80.5259,  970.0,  34.0, 'Phyllitic Soil',       0.45, 'MODERATE',  0.52),

-- Himachal Pradesh
('loc-shimla-01',     'Summer Hill Watershed',               'Himachal Pradesh', 'Shimla',               31.1048,  77.1734,  2200.0, 38.0, 'Gravelly Loam',        0.55, 'HIGH',      0.74),
('loc-mandi-01',      'Mandi-Kullu Highway NH-21 Corridor',  'Himachal Pradesh', 'Mandi',                31.7118,  76.9218,  1020.0, 32.0, 'Sandy Silt',           0.48, 'HIGH',      0.66),
('loc-kangra-01',     'Dharamshala Hillside Complex',        'Himachal Pradesh', 'Kangra',               32.2190,  76.3234,  1457.0, 28.5, 'Micaceous Schist',     0.62, 'MODERATE',  0.55),
('loc-kullu-01',      'Solang Valley Debris Flow Zone',      'Himachal Pradesh', 'Kullu',                32.2396,  77.1513,  2480.0, 44.0, 'Morainic Gravel',      0.38, 'VERY HIGH', 0.82),

-- West Bengal / Darjeeling
('loc-darjeeling-01', 'Mirik Tea Garden Catchment',          'West Bengal',      'Darjeeling',           26.8872,  88.1813,  1495.0, 28.0, 'Silty Clay',           0.72, 'MODERATE',  0.45),
('loc-darjeeling-02', 'Kurseong Mass Movement Zone',         'West Bengal',      'Darjeeling',           26.8800,  88.2800,  1458.0, 31.0, 'Colluvial Loam',       0.66, 'HIGH',      0.63),
('loc-kalimpong-01',  'Tistaside Debris Slope, Kalimpong',   'West Bengal',      'Kalimpong',            27.0660,  88.4612,  1247.0, 35.0, 'Sandy Silt Colluvium', 0.58, 'HIGH',      0.71),

-- Assam / Northeast
('loc-guwahati-01',   'Narakasur Hill Complex',              'Assam',            'Kamrup Metropolitan',  26.1445,  91.7362,  240.0,  18.5, 'Alluvial Red Soil',    0.80, 'LOW',       0.18),
('loc-dima-hasao-01', 'Haflong Landslide Corridor',          'Assam',            'Dima Hasao',           25.1620,  93.0195,  680.0,  30.0, 'Weathered Shale',      0.55, 'HIGH',      0.69),
('loc-manipur-01',    'Imphal Valley Eastern Hills',         'Manipur',          'Senapati',             25.0000,  94.0500,  850.0,  32.0, 'Clay Loam',            0.60, 'MODERATE',  0.50),

-- Maharashtra / Konkan Coast
('loc-raigad-01',     'Irshalwadi Plateau Scarp',            'Maharashtra',      'Raigad',               18.5520,  73.2345,  385.0,  34.0, 'Basaltic Debris',      0.62, 'VERY HIGH', 0.83),
('loc-ratnagiri-01',  'Ratnagiri Laterite Plateau Edge',     'Maharashtra',      'Ratnagiri',            17.0000,  73.3000,  180.0,  28.0, 'Laterite',             0.65, 'MODERATE',  0.44),

-- Meghalaya
('loc-meghalaya-01',  'Cherrapunji Steep Slope Zone',        'Meghalaya',        'East Khasi Hills',     25.2800,  91.7200,  1484.0, 36.0, 'Sandy Clay Loam',      0.70, 'HIGH',      0.67),

-- Jammu & Kashmir / Ladakh
('loc-ramban-01',     'Ramban-Banihal NH-44 Landslide Zone', 'Jammu & Kashmir',  'Ramban',               33.2406,  75.2359,  1010.0, 40.0, 'Phyllite-Schist',      0.38, 'VERY HIGH', 0.86),
('loc-doda-01',       'Doda Kishtwar Highway Corridor',      'Jammu & Kashmir',  'Doda',                 33.1456,  75.5480,  1280.0, 38.0, 'Quartzitic Schist',    0.42, 'HIGH',      0.73)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    state = EXCLUDED.state,
    district = EXCLUDED.district,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    elevation = EXCLUDED.elevation,
    slope = EXCLUDED.slope,
    soil_type = EXCLUDED.soil_type,
    vegetation_cover = EXCLUDED.vegetation_cover,
    risk_level = EXCLUDED.risk_level,
    current_risk_score = EXCLUDED.current_risk_score,
    updated_at = NOW();


-- ====================================================================
-- Seed Historical Landslide Events (NDMA / GSI verified incidents)
-- ====================================================================

DELETE FROM public.historical_landslides WHERE id LIKE 'hist-%';

INSERT INTO public.historical_landslides (id, location_name, state, event_date, fatalities, damage_severity, latitude, longitude)
VALUES
('hist-01', 'Chooralmala-Mundakkai, Wayanad',          'Kerala',           '2024-07-30', 231,  'CATASTROPHIC', 11.5342,  76.1432),
('hist-02', 'Irshalwadi Village, Raigad',              'Maharashtra',      '2023-07-19', 28,   'SEVERE',       18.5520,  73.2345),
('hist-03', 'Kedarnath Valley Flash Flood-Landslide',  'Uttarakhand',      '2013-06-16', 5700, 'CATASTROPHIC', 30.7346,  79.0669),
('hist-04', 'Malpa Landslide, Pithoragarh',            'Uttarakhand',      '1998-08-18', 220,  'EXTREME',      29.9123,  80.7512),
('hist-05', 'Dharampur Landslide, Mandi',              'Himachal Pradesh', '2023-08-14', 16,   'SEVERE',       31.6200,  76.9500),
('hist-06', 'Tupul Railway Site Landslide',             'Manipur',          '2022-06-30', 61,   'SEVERE',       24.8200,  93.6000),
('hist-07', 'Noney Landslide',                         'Manipur',          '2022-06-30', 50,   'SEVERE',       24.8214,  93.5800),
('hist-08', 'Jowai Landslide',                         'Meghalaya',        '2022-08-13', 10,   'MODERATE',     25.4500,  92.2000),
('hist-09', 'Ooty Landslide, Nilgiris',                'Tamil Nadu',       '2009-11-01', 275,  'EXTREME',      11.4200,  76.7050),
('hist-10', 'Kotropi Landslide, Mandi',                'Himachal Pradesh', '2017-08-13', 46,   'SEVERE',       31.7400,  76.9800),
('hist-11', 'Malin Village Landslide, Pune',           'Maharashtra',      '2014-07-30', 151,  'EXTREME',      18.9000,  73.7500),
('hist-12', 'Kimghan Landslide, Uttarkashi',           'Uttarakhand',      '2021-08-18', 25,   'SEVERE',       30.7257,  78.4509),
('hist-13', 'Joshimath Subsidence Crisis',             'Uttarakhand',      '2023-01-02', 0,    'SEVERE',       30.5580,  79.5641),
('hist-14', 'Tapovan-Reni Flash Flood & Landslide',    'Uttarakhand',      '2021-02-07', 204,  'CATASTROPHIC', 30.4752,  79.6833),
('hist-15', 'Kurseong Debris Flow',                    'West Bengal',      '2023-10-04', 8,    'MODERATE',     26.8800,  88.2800)

ON CONFLICT (id) DO UPDATE SET
    location_name = EXCLUDED.location_name,
    state = EXCLUDED.state,
    event_date = EXCLUDED.event_date,
    fatalities = EXCLUDED.fatalities,
    damage_severity = EXCLUDED.damage_severity;
