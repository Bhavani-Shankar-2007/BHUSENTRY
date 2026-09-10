-- ====================================================================
-- BHUSENTRY Landslide Early Warning System - PostgreSQL / PostGIS Schema
-- Database: Supabase PostgreSQL + PostGIS Extension
-- ====================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'OFFICER' CHECK (role IN ('PUBLIC', 'OFFICER', 'ADMIN')),
    department TEXT DEFAULT 'Emergency Response Unit',
    phone_number TEXT,
    avatar_url TEXT,
    profile_complete BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on Supabase auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, profile_complete)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'OFFICER'),
        COALESCE((NEW.raw_user_meta_data->>'profile_complete')::boolean, FALSE)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Locations (Monitored Zones) Table
CREATE TABLE IF NOT EXISTS public.locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    elevation DOUBLE PRECISION,
    slope DOUBLE PRECISION,
    soil_type TEXT,
    vegetation_cover DOUBLE PRECISION,
    risk_level TEXT DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'VERY HIGH')),
    current_risk_score DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update PostGIS geometry column automatically
CREATE OR REPLACE FUNCTION public.update_location_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_location_geom ON public.locations;
CREATE TRIGGER set_location_geom
    BEFORE INSERT OR UPDATE OF latitude, longitude ON public.locations
    FOR EACH ROW EXECUTE FUNCTION public.update_location_geom();

-- 4. Environmental Observations (Sensors)
CREATE TABLE IF NOT EXISTS public.environmental_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id TEXT REFERENCES public.locations(id) ON DELETE CASCADE,
    soil_moisture DOUBLE PRECISION,
    pore_water_pressure_kpa DOUBLE PRECISION,
    ground_water_level_m DOUBLE PRECISION,
    tilt_x_deg DOUBLE PRECISION,
    tilt_y_deg DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Weather Observations (Open-Meteo)
CREATE TABLE IF NOT EXISTS public.weather_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id TEXT REFERENCES public.locations(id) ON DELETE CASCADE,
    temperature_c DOUBLE PRECISION,
    humidity_percent DOUBLE PRECISION,
    rainfall_24h_mm DOUBLE PRECISION,
    rainfall_72h_mm DOUBLE PRECISION,
    wind_speed_kmh DOUBLE PRECISION,
    weather_condition TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Terrain Data (Digital Elevation Model)
CREATE TABLE IF NOT EXISTS public.terrain_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id TEXT REFERENCES public.locations(id) ON DELETE CASCADE,
    elevation_meters DOUBLE PRECISION,
    slope_degrees DOUBLE PRECISION,
    aspect_degrees DOUBLE PRECISION,
    curvature DOUBLE PRECISION,
    soil_type TEXT,
    geological_unit TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Satellite Observations (NASA GIBS / Earth Observation)
CREATE TABLE IF NOT EXISTS public.satellite_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id TEXT REFERENCES public.locations(id) ON DELETE CASCADE,
    satellite_source TEXT,
    ndvi DOUBLE PRECISION,
    ndwi DOUBLE PRECISION,
    soil_moisture_index DOUBLE PRECISION,
    surface_displacement_mm DOUBLE PRECISION,
    image_url TEXT,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Predictions (Machine Learning Inferences)
CREATE TABLE IF NOT EXISTS public.predictions (
    id TEXT PRIMARY KEY,
    location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    risk_level TEXT NOT NULL,
    confidence_score DOUBLE PRECISION,
    feature_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY,
    location_id TEXT REFERENCES public.locations(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
    prediction_id TEXT REFERENCES public.predictions(id) ON DELETE SET NULL,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMPTZ,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Notification Subscribers
CREATE TABLE IF NOT EXISTS public.notification_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    location_id TEXT REFERENCES public.locations(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notification Logs (MSG91 Transmissions)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id TEXT PRIMARY KEY,
    recipient_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'SENT',
    provider TEXT DEFAULT 'MSG91',
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Historical Landslides Catalog
CREATE TABLE IF NOT EXISTS public.historical_landslides (
    id TEXT PRIMARY KEY,
    location_name TEXT NOT NULL,
    state TEXT NOT NULL,
    event_date DATE NOT NULL,
    fatalities INT DEFAULT 0,
    damage_severity TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

-- 13. AI Conversations & Messages
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id TEXT REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
-- Safe to re-run: DROP IF EXISTS before each policy
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- locations policies
DROP POLICY IF EXISTS "Locations viewable by everyone" ON public.locations;
CREATE POLICY "Locations viewable by everyone" ON public.locations FOR SELECT USING (true);

-- alerts policies
DROP POLICY IF EXISTS "Alerts viewable by everyone" ON public.alerts;
CREATE POLICY "Alerts viewable by everyone" ON public.alerts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Officers can update alerts" ON public.alerts;
CREATE POLICY "Officers can update alerts" ON public.alerts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Officers can insert alerts" ON public.alerts;
CREATE POLICY "Officers can insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);

-- predictions policies
DROP POLICY IF EXISTS "Predictions viewable by authenticated users" ON public.predictions;
CREATE POLICY "Predictions viewable by authenticated users" ON public.predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Predictions insertable by authenticated users" ON public.predictions;
CREATE POLICY "Predictions insertable by authenticated users" ON public.predictions FOR INSERT WITH CHECK (true);

-- notification_logs policies
DROP POLICY IF EXISTS "Notification logs viewable by officers" ON public.notification_logs;
CREATE POLICY "Notification logs viewable by officers" ON public.notification_logs FOR SELECT USING (true);
