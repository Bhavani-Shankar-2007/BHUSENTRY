import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const DisclaimerBanner = ({
  level = 'info',
  customText,
  className = ''
}) => {
  const defaultDisclaimer =
    'This system is a monitoring tool and should not be considered an official disaster warning. Refer to NDMA / SDMA bulletins for statutory advisories.';

  if (level === 'critical') {
    return (
      <div className={`rounded-xl border border-red-300 bg-red-50 p-4 text-red-950 flex items-start gap-3 shadow-sm ${className}`}>
        <div className="p-1 bg-red-600 text-white rounded-lg shrink-0 animate-pulse mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-sm">
          <div className="font-bold flex items-center gap-2 uppercase tracking-wide text-red-900">
            <span>Critical Landslide Hazard Warning</span>
            <span className="text-[10px] bg-red-200 px-2 py-0.5 rounded text-red-800">VERY HIGH RISK</span>
          </div>
          <p className="mt-1 text-red-800 leading-relaxed font-medium">
            {customText || 'Precipitation and geological slope instability thresholds have been breached for this zone. Immediate precautionary protocols advised.'}
          </p>
          <p className="mt-2 text-xs text-red-600/90 italic">* Disclaimer: {defaultDisclaimer}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-amber-900 flex items-start gap-2.5 text-xs ${className}`}>
      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div className="leading-normal">
        <span className="font-semibold text-amber-900">Notice: </span>
        <span className="text-amber-800">{customText || defaultDisclaimer}</span>
      </div>
    </div>
  );
};