import React from 'react';
import { useRegion, REGIONS_CONFIG } from '../../context/RegionContext';
import { Compass, Sparkles, Globe, Mountain } from 'lucide-react';

export const RegionScopeSelector = ({ className = '', compact = false, showDescription = false }) => {
  const { activeRegion, setActiveRegion, currentRegionMeta } = useRegion();

  const regions = [
    { id: 'NER', label: 'NER', fullLabel: 'North Eastern Region', icon: Mountain, primary: true },
    { id: 'WESTERN_GHATS', label: 'Western Ghats', fullLabel: 'Western Ghats', icon: Compass, primary: false },
    { id: 'NORTHERN_HIMALAYAS', label: 'N-Himalayas', fullLabel: 'Northern Himalayas', icon: Mountain, primary: false },
    { id: 'ALL_INDIA', label: 'Pan-India', fullLabel: 'All India (Pan-India)', icon: Globe, primary: false }
  ];

  if (compact) {
    return (
      <div className={`inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 text-xs shadow-2xs ${className}`}>
        {regions.map((reg) => {
          const isActive = activeRegion === reg.id;
          const Icon = reg.icon;
          return (
            <button
              key={reg.id}
              onClick={() => setActiveRegion(reg.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                isActive
                  ? 'bg-white text-emerald-950 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title={reg.fullLabel}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? (reg.primary ? 'text-emerald-700' : 'text-sky-700') : 'text-slate-400'}`} />
              <span>{reg.label}</span>
              {reg.primary && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  NER
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50/90 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
            NER
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Geographic Scope
              </span>
              {currentRegionMeta.isPrimary && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-700" /> Primary Focus
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {currentRegionMeta.description}
            </p>
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          {regions.map((reg) => {
            const isActive = activeRegion === reg.id;
            const Icon = reg.icon;
            return (
              <button
                key={reg.id}
                onClick={() => setActiveRegion(reg.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{reg.fullLabel}</span>
                {reg.primary && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight ${
                      isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    FOCUS
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
