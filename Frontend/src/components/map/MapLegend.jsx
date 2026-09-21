import React from 'react';

export const MapLegend = ({ className = '' }) => {
  const tiers = [
    { label: 'LOW', color: 'bg-emerald-600', range: '0.00 – 0.29', text: 'Minimal geological movement' },
    { label: 'MODERATE', color: 'bg-amber-500', range: '0.30 – 0.59', text: 'Heightened surveillance' },
    { label: 'HIGH', color: 'bg-orange-500', range: '0.60 – 0.79', text: 'Precipitation threshold alert' },
    { label: 'VERY HIGH', color: 'bg-red-600', range: '0.80 – 1.00', text: 'Imminent slope failure hazard' }
  ];

  return (
    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 dark:border-slate-800/90 shadow-md text-xs ${className}`}>
      <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center justify-between">
        <span>Risk Threshold Classification</span>
        <span className="text-[10px] text-slate-400 font-mono">GSI/NDMA Standard</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiers.map((t) => (
          <div key={t.label} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${t.color}`} />
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 leading-none">{t.label}</div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{t.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
