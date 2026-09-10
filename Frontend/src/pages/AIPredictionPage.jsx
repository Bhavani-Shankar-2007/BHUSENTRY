import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Cpu,
  Droplets,
  Mountain,
  Compass,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskMeter } from '../components/common/RiskMeter';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { predictionService } from '../services/predictionService';
import { MOCK_LOCATIONS } from '../data/mockLocations';

export const AIPredictionPage = () => {
  const [searchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || MOCK_LOCATIONS[0].name;

  // Form inputs
  const [formData, setFormData] = useState({
    location: initialLocation,
    rainfall: 160,
    elevation: 1650,
    slope: 38,
    soil_type: 'Loamy Skeletal with Phyllite',
    land_cover: 'Sparse Forest / Urban Slope'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // Preset scenarios to impress hackathon evaluators
  const applyPreset = (preset) => {
    let presetData = { ...formData };
    if (preset === 'critical') {
      presetData = {
        location: 'Cherrapunji (Sohra) Escarpment',
        rainfall: 280,
        elevation: 1430,
        slope: 44,
        soil_type: 'Lateritic Sandy Loam',
        land_cover: 'Grassland & Gorge Valley'
      };
    } else if (preset === 'moderate') {
      presetData = {
        location: 'Guwahati - Khanapara Slopes',
        rainfall: 75,
        elevation: 110,
        slope: 24,
        soil_type: 'Red Residual Soil',
        land_cover: 'Semi-urban Degraded Forest'
      };
    } else if (preset === 'stable') {
      presetData = {
        location: 'Imphal Valley - Senapati Ghats',
        rainfall: 20,
        elevation: 1050,
        slope: 15,
        soil_type: 'Alluvial Clay Loam',
        land_cover: 'Dense Forest Reserve'
      };
    }
    setFormData(presetData);
    handleRunPrediction(presetData);
  };

  const handleRunPrediction = async (customData = null) => {
    setIsLoading(true);
    try {
      const dataToSubmit = customData || formData;
      const res = await predictionService.predictRisk(dataToSubmit);
      if (res.success) {
        setPredictionResult(res.data);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run default prediction on mount if none exists
  React.useEffect(() => {
    handleRunPrediction();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Cpu className="w-7 h-7 text-emerald-700" />
              <span>AI Landslide Risk Prediction Simulator</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate geotechnical failure conditions by varying precipitation, topography, slope angles, and lithological parameters.
          </p>
        </div>

        {/* SIH Scenario Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Demo Scenarios:
          </span>
          <button
            onClick={() => applyPreset('critical')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Extreme Monsoon
          </button>
          <button
            onClick={() => applyPreset('moderate')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            Moderate Rain
          </button>
          <button
            onClick={() => applyPreset('stable')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            Dry / Stable
          </button>
        </div>
      </div>

      {/* Grid: Form (Left 6 Cols) vs Live Risk Gauge & Output (Right 6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Input Form */}
        <div className="lg:col-span-7">
          <Card
            title="Geotechnical & Environmental Inputs"
            subtitle="Configure environmental parameters for model inference"
            action={
              <button
                onClick={() =>
                  setFormData({
                    location: MOCK_LOCATIONS[0].name,
                    rainfall: 120,
                    elevation: 1200,
                    slope: 30,
                    soil_type: 'Loamy Skeletal with Phyllite',
                    land_cover: 'Sparse Forest / Urban Slope'
                  })
                }
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            }
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunPrediction();
              }}
              className="space-y-5"
            >
              {/* Location Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Target Station / Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                >
                  {MOCK_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.district}, {loc.state})
                    </option>
                  ))}
                  <option value="Custom Himalayan Slope Coordinates">
                    * Custom Coordinates Simulation
                  </option>
                </select>
              </div>

              {/* 24h Rainfall Input (Slider + Number) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    24h Cumulative Rainfall (mm)
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {formData.rainfall} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="5"
                  value={formData.rainfall}
                  onChange={(e) =>
                    setFormData({ ...formData, rainfall: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0 mm (Dry)</span>
                  <span>100 mm (Heavy)</span>
                  <span>200 mm (Critical)</span>
                  <span>350 mm (Extreme)</span>
                </div>
              </div>

              {/* Slope Gradient (Slider + Number) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                    Slope Incline Angle (Degrees)
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {formData.slope}° Incline
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={formData.slope}
                  onChange={(e) =>
                    setFormData({ ...formData, slope: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#14532D]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>5° (Gentle)</span>
                  <span>25° (Moderate)</span>
                  <span>40° (Steep)</span>
                  <span>60° (Precipitous)</span>
                </div>
              </div>

              {/* Elevation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Elevation above Sea Level (Meters)
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="50"
                    max="4500"
                    value={formData.elevation}
                    onChange={(e) =>
                      setFormData({ ...formData, elevation: Number(e.target.value) })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Soil Type & Land Cover in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Lithology & Soil Type
                  </label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) =>
                      setFormData({ ...formData, soil_type: e.target.value })
                    }
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                  >
                    <option value="Loamy Skeletal with Phyllite">Loamy Skeletal with Phyllite</option>
                    <option value="Lateritic Sandy Loam">Lateritic Sandy Loam</option>
                    <option value="Disang Shales - Weathered">Disang Shales - Weathered</option>
                    <option value="Red Residual Clay Soil">Red Residual Clay Soil</option>
                    <option value="Alluvial Clay Loam">Alluvial Clay Loam</option>
                    <option value="Morainic Gravel and Silt">Morainic Gravel and Silt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Land Classification
                  </label>
                  <select
                    value={formData.land_cover}
                    onChange={(e) =>
                      setFormData({ ...formData, land_cover: e.target.value })
                    }
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                  >
                    <option value="Sparse Forest / Urban Slope">Sparse Forest / Urban Slope</option>
                    <option value="Steep Ridge Urban Settlement">Steep Ridge Urban Settlement</option>
                    <option value="Grassland & Gorge Valley">Grassland & Gorge Valley</option>
                    <option value="Dense Forest Reserve">Dense Forest Reserve</option>
                    <option value="Terrace Agriculture">Terrace Agriculture</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  icon={Sparkles}
                >
                  Predict Landslide Risk (AI Inference)
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Prediction Output & Gauge */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title="Model Output & Risk Assessment"
            subtitle={predictionResult ? `Inferred at ${predictionResult.timestamp}` : 'Awaiting inference run'}
            action={
              predictionResult && (
                <RiskBadge level={predictionResult.risk_level} size="md" />
              )
            }
          >
            {predictionResult ? (
              <div className="space-y-4">
                {/* Visual Risk Gauge Meter */}
                <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-2">
                  <RiskMeter
                    score={predictionResult.risk_score}
                    level={predictionResult.risk_level}
                  />
                </div>

                {/* Warning Card if High / Very High */}
                {(predictionResult.risk_level === 'HIGH' ||
                  predictionResult.risk_level === 'VERY HIGH') && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold uppercase tracking-wider text-red-800">
                        Warning Condition Triggered
                      </div>
                      <p className="mt-0.5 leading-relaxed text-red-700">
                        Simulated parameters exceed slope stability tolerance. Recommended protocol: initiate drone reconnaissance and alert district SDMA teams.
                      </p>
                    </div>
                  </div>
                )}

                {/* Factor Contribution Breakdown */}
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Key Feature Weights
                  </h4>
                  <div className="space-y-2">
                    {predictionResult.contributing_factors?.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <span className="font-medium text-slate-700">{f.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500">{f.impact}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              f.status === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : f.status === 'High Incline'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {f.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Summary */}
                <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Evaluated Target:</span>
                    <span className="font-semibold text-slate-800">{predictionResult.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Rainfall:</span>
                    <span className="font-semibold text-slate-800">{predictionResult.input_summary.rainfall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slope / Elev:</span>
                    <span className="font-semibold text-slate-800">
                      {predictionResult.input_summary.slope} / {predictionResult.input_summary.elevation}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                Click "Predict Landslide Risk" to compute geotechnical hazard index.
              </div>
            )}
          </Card>

          {/* SIH Prototype Disclaimer */}
          <DisclaimerBanner
            customText="This prediction is generated for prototype and demonstration purposes using synthetic environmental inputs. It does not replace scientific ground surveys."
          />
        </div>
      </div>
    </div>
  );
};
