import React from 'react';
import { useRegion, REGIONS_CONFIG } from '../../context/RegionContext';
import { Compass, Sparkles, Globe, Mountain } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export const RegionScopeSelector = ({ className = '', compact = false, showDescription = false }) => {
  const { activeRegion, setActiveRegion, currentRegionMeta } = useRegion();
  const { t } = useTranslation();

  const regions = [
    { id: 'NER', label: t('ner') || 'NER', fullLabel: t('ner_full') || 'North Eastern Region', icon: Mountain, primary: true },
    { id: 'WESTERN_GHATS', label: t('western_ghats') || 'Western Ghats', fullLabel: t('western_ghats_full') || 'Western Ghats', icon: Compass, primary: false },
    { id: 'NORTHERN_HIMALAYAS', label: t('n_himalayas') || 'N-Himalayas', fullLabel: t('n_himalayas_full') || 'Northern Himalayas', icon: Mountain, primary: false },
    { id: 'ALL_INDIA', label: t('pan_india') || 'Pan-India', fullLabel: t('pan_india_full') || 'All India (Pan-India)', icon: Globe, primary: false }
  ];

  if (compact) {
    return (
      <div className={`inline-flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/90 dark:border-slate-700/90 text-xs shadow-2xs ${className}`}>
        {regions.map((reg) => {
          const isActive = activeRegion === reg.id;
          const Icon = reg.icon;
          return (
            <button
              key={reg.id}
              onClick={() => setActiveRegion(reg.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-950 text-emerald-950 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
              title={reg.fullLabel}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? (reg.primary ? 'text-emerald-700 dark:text-emerald-400' : 'text-sky-700 dark:text-sky-400') : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{reg.label}</span>
              {reg.primary && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50/90 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            NER
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Geographic Scope
              </span>
              {currentRegionMeta.isPrimary && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-700 dark:text-emerald-400" /> Primary Focus
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {currentRegionMeta.description}
            </p>
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
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
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{reg.fullLabel}</span>
                {reg.primary && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight ${
                      isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
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
