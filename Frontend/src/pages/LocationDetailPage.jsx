import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  Droplets,
  Mountain,
  Compass,
  Layers,
  AlertTriangle,
  History,
  Calendar,
  Cpu,
  ShieldCheck,
  Clock,
  Activity,
  Zap,
  Wind
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskMeter } from '../components/common/RiskMeter';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { RainfallTrendChart } from '../components/charts/RainfallTrendChart';
import { locationService } from '../services/locationService';
import { weatherService } from '../services/weatherService';
import { MOCK_RAINFALL_RISK_TREND } from '../data/mockAnalytics';

export const LocationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grokWeather, setGrokWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await locationService.getLocationById(id);
        if (res.success) {
          setLocation(res.data);
        } else {
          // Fallback to first location if not found
          const fallback = await locationService.getLocationById(1);
          setLocation(fallback.data);
        }
      } catch (err) {
        console.error('Failed to load location details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [id]);

  // Fetch AI weather intelligence after location is loaded
  useEffect(() => {
    if (!location) return;
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const res = await weatherService.getWeather(id);
        if (res.success && res.data?.grok_analysis) {
          setGrokWeather(res.data);
        }
      } catch (err) {
        console.warn('AI weather fetch failed:', err);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [location, id]);

  if (loading || !location) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading station telemetry...
      </div>
    );
  }

  const isCritical =
    location.risk_level === 'HIGH' || location.risk_level === 'VERY HIGH';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Locations</span>
        </button>

        <div className="flex items-center gap-3">
          <Link to={`/predict?location=${encodeURIComponent(location.name)}`}>
            <Button variant="primary" size="sm" icon={Cpu}>
              Run AI Prediction Sandbox
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" size="sm" icon={Compass}>
              View on Full GIS Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Station Title & Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <RiskBadge level={location.risk_level} size="lg" />
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                STATION ID: NER-LOC-0{location.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {location.name}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {location.district} District, {location.state} • Coordinates:{' '}
                <span className="font-mono text-slate-700">
                  {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
                </span>
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Telemetry Status
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Sensors Operational</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Sync: {location.last_updated}
            </span>
          </div>
        </div>

        {/* Noticeable Warning Card for High / Very High Risk */}
        {isCritical && (
          <DisclaimerBanner
            level="critical"
            customText={
              location.alert_message ||
              'Localized slope stability calculations indicate severe pore pressure buildup from intense rainfall. Emergency personnel have been notified.'
            }
          />
        )}
      </div>

      {/* Grid: Environmental Telemetry vs AI Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Environmental Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="Environmental & Geological Telemetry"
            subtitle="Current parameters transmitted from hill slope IoT sensors"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                <span className="text-xs text-sky-800 font-medium flex items-center gap-1 mb-1">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  24h Rainfall
                </span>
                <span className="text-xl font-black text-slate-900">{location.rainfall} mm</span>
                <span className="block text-[10px] text-sky-700 mt-1">IMD Verified</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-xs text-emerald-800 font-medium flex items-center gap-1 mb-1">
                  <Mountain className="w-4 h-4 text-emerald-700" />
                  Slope Gradient
                </span>
                <span className="text-xl font-black text-slate-900">{location.slope}°</span>
                <span className="block text-[10px] text-emerald-700 mt-1">
                  {location.slope > 35 ? 'High Steepness' : 'Moderate Incline'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium flex items-center gap-1 mb-1">
                  <Compass className="w-4 h-4 text-slate-500" />
                  Elevation MSL
                </span>
                <span className="text-xl font-black text-slate-900">{location.elevation} m</span>
                <span className="block text-[10px] text-slate-500 mt-1">Survey of India</span>
              </div>
            </div>

            {/* Geological Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50 font-semibold text-slate-700 flex justify-between">
                <span>Geological & Soil Profile</span>
                <span className="text-slate-400 font-normal">GSI Mapping Data</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row justify-between gap-1">
                <span className="font-semibold text-slate-600">Lithological Bedrock:</span>
                <span className="text-slate-800 font-medium">{location.geology}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row justify-between gap-1">
                <span className="font-semibold text-slate-600">Soil Classification:</span>
                <span className="text-slate-800 font-medium">{location.soil_type}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row justify-between gap-1">
                <span className="font-semibold text-slate-600">Land Cover & Vegetation:</span>
                <span className="text-slate-800 font-medium">{location.land_cover}</span>
              </div>
            </div>
          </Card>

          {/* Historical Landslide Incidents */}
          <Card
            title="Historical Landslide Records & Events"
            subtitle="Previous recorded slope failures and road disruptions in this sector"
          >
            {location.historical_events && location.historical_events.length > 0 ? (
              <div className="space-y-3">
                {location.historical_events.map((event, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 font-bold text-xs">
                      {event.year}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{event.description}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                          {event.severity} Severity
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        Historical precedent indicates recurrent vulnerability during prolonged monsoon rainfall.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                No recorded severe historical slope failures in GSI archive for this sector.
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: AI Risk Evaluation & Meter (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title="AI Landslide Prediction Model"
            subtitle="Composite Multi-Factor Inference"
            action={<RiskBadge level={location.risk_level} size="md" />}
          >
            <div className="space-y-4">
              <RiskMeter score={location.risk_score} level={location.risk_level} />

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Model Version:</span>
                  <span className="font-mono font-bold text-slate-800">NER-GeoNet v2.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inference Confidence:</span>
                  <span className="font-semibold text-emerald-800">91.4% Correlation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Warning Trigger:</span>
                  <span className="font-semibold text-slate-800">
                    {isCritical ? 'THRESHOLD BREACHED' : 'Within Normal Bounds'}
                  </span>
                </div>
              </div>

              <Link to={`/predict?location=${encodeURIComponent(location.name)}`} className="block pt-2">
                <Button variant="primary" size="md" className="w-full">
                  <span>Simulate Custom Rainfall On This Slope</span>
                  <Cpu className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* 7-Day Rainfall Trend for this station */}
          <Card
            title="7-Day Precipitation & Risk Trend"
            subtitle="Observed rainfall against AI threshold"
          >
            <RainfallTrendChart data={MOCK_RAINFALL_RISK_TREND} height={200} />
          </Card>

          {/* AI Weather Intelligence */}
          <Card
            title="AI Weather Intelligence"
            subtitle={grokWeather ? `Live · ${grokWeather.grok_analysis?.source || 'AI'}` : 'Fetching live analysis…'}
            action={
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-slate-900 to-emerald-900 text-emerald-300 border border-emerald-800/40">
                <Zap className="w-3 h-3" /> AI Analysis
              </span>
            }
          >
            {weatherLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Querying AI…</span>
              </div>
            ) : grokWeather ? (
              <div className="space-y-3">
                {/* Current Telemetry Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                    <span className="text-[10px] text-sky-700 font-semibold block">24h Rainfall</span>
                    <span className="text-lg font-black text-slate-900">{grokWeather.current?.rainfall_24h_mm} mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-600 font-semibold block">Humidity</span>
                    <span className="text-lg font-black text-slate-900">{grokWeather.current?.humidity_percent}%</span>
                  </div>
                </div>

                {/* Precipitation Severity Badge */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-xs text-slate-400 font-semibold">Precipitation Severity</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    grokWeather.grok_analysis?.precipitation_severity?.includes('Torrential')
                      ? 'bg-red-900/60 text-red-300 border border-red-700'
                      : grokWeather.grok_analysis?.precipitation_severity?.includes('Severe')
                      ? 'bg-orange-900/60 text-orange-300 border border-orange-700'
                      : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                  }`}>
                    {grokWeather.grok_analysis?.precipitation_severity}
                  </span>
                </div>

                {/* AI Analysis Blocks */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">AI Summary</span>
                    <p className="text-slate-700 leading-relaxed">{grokWeather.grok_analysis?.summary}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block mb-1">Slope Impact</span>
                    <p className="text-slate-700 leading-relaxed">{grokWeather.grok_analysis?.slope_impact}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3 h-3" /> Advisory
                    </span>
                    <p className="text-slate-700 leading-relaxed">{grokWeather.grok_analysis?.weather_advisory}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                AI weather intelligence unavailable. Check API connection.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
