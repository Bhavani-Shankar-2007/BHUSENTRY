import React from 'react';

export const MapLegend = ({ className = '' }) => {
  const tiers = [
    { label: 'LOW', color: 'bg-emerald-600', range: '0.00 – 0.29', text: 'Minimal geological movement' },
    { label: 'MODERATE', color: 'bg-amber-500', range: '0.30 – 0.59', text: 'Heightened surveillance' },
    { label: 'HIGH', color: 'bg-orange-500', range: '0.60 – 0.79', text: 'Precipitation threshold alert' },
    { label: 'VERY HIGH', color: 'bg-red-600', range: '0.80 – 1.00', text: 'Imminent slope failure hazard' }
  ];

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 shadow-md text-xs ${className}`}>
      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5 flex items-center justify-between">
        <span>Risk Threshold Classification</span>
        <span className="text-[10px] text-slate-400 font-mono">GSI/NDMA Standard</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiers.map((t) => (
          <div key={t.label} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${t.color}`} />
            <div>
              <div className="font-bold text-slate-900 leading-none">{t.label}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">{t.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
