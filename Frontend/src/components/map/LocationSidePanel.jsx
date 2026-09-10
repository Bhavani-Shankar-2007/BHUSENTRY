import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  MapPin,
  Droplets,
  Mountain,
  Compass,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { Button } from '../common/Button';

export const LocationSidePanel = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RiskBadge level={location.risk_level} size="md" />
              <span className="text-[11px] font-mono text-slate-400">
                Score: {location.risk_score}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
              {location.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {location.district}, {location.state}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if High Risk */}
        {(location.risk_level === 'HIGH' || location.risk_level === 'VERY HIGH') && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Active Geotechnical Alert: </span>
              <span>{location.alert_message || 'Heavy precipitation exceeding localized slide threshold.'}</span>
            </div>
          </div>
        )}

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              24h Rainfall
            </span>
            <div className="text-base font-bold text-slate-900">{location.rainfall} mm</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <Mountain className="w-3.5 h-3.5 text-emerald-700" />
              Slope Angle
            </span>
            <div className="text-base font-bold text-slate-900">{location.slope}° Gradient</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              Elevation
            </span>
            <div className="text-base font-bold text-slate-900">{location.elevation} m MSL</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Telemetry Sync
            </span>
            <div className="text-xs font-semibold text-slate-700">{location.last_updated}</div>
          </div>
        </div>

        {/* Geological Overview */}
        <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
          <div>
            <span className="font-semibold text-slate-700">Lithology & Soil:</span>{' '}
            <span>{location.soil_type}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Land Classification:</span>{' '}
            <span>{location.land_cover}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">GPS Coordinates:</span>{' '}
            <span className="font-mono text-slate-500">
              {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
        <Link to={`/locations/${location.id}`} className="w-full">
          <Button variant="primary" className="w-full">
            <span>View Full Station Telemetry</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link to={`/predict?location=${encodeURIComponent(location.name)}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <Cpu className="w-3.5 h-3.5 mr-1 text-[#0284C7]" />
            <span>Simulate AI What-If Scenario</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
