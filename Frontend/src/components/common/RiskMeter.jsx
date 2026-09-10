import React from 'react';

/**
 * RiskMeter Component
 * Semi-circular radial gauge showing Landslide Risk Score (0.00 to 1.00)
 * Visual segments: LOW (0-0.29), MODERATE (0.30-0.59), HIGH (0.60-0.79), VERY HIGH (0.80-1.00)
 */
export const RiskMeter = ({ score = 0, level = 'LOW', size = 'lg' }) => {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 1);
  // Calculate angle between -90 deg (0%) and 90 deg (100%)
  const needleRotation = -90 + safeScore * 180;

  const getLevelColor = () => {
    const l = (level || '').toUpperCase();
    if (l === 'VERY HIGH') return '#DC2626';
    if (l === 'HIGH') return '#F97316';
    if (l === 'MODERATE') return '#EAB308';
    return '#16A34A';
  };

  return (
    <div className="flex flex-col items-center justify-center p-3">
      {/* Gauge Arc & Needle Display */}
      <div className="relative w-64 h-32 flex items-end justify-center">
        {/* SVG Semi-Circle Track */}
        <svg viewBox="0 0 220 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16A34A" />     {/* Low */}
              <stop offset="35%" stopColor="#EAB308" />    {/* Moderate */}
              <stop offset="70%" stopColor="#F97316" />    {/* High */}
              <stop offset="100%" stopColor="#DC2626" />   {/* Very High */}
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 30 110 A 80 80 0 0 1 190 110"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored Risk Gradient Arc */}
          <path
            d="M 30 110 A 80 80 0 0 1 190 110"
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Outer Tick Indicators at Base */}
          <text x="18" y="114" fill="#64748B" fontSize="10" fontWeight="bold" textAnchor="middle">0.0</text>
          <text x="202" y="114" fill="#64748B" fontSize="10" fontWeight="bold" textAnchor="middle">1.0</text>

          {/* Center Pivot Base */}
          <circle cx="110" cy="110" r="9" fill="#0F172A" />
          <circle cx="110" cy="110" r="4" fill="#FFFFFF" />

          {/* Animated Needle */}
          <g
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: '110px 110px',
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <polygon points="108,110 112,110 110,32" fill="#0F172A" />
            <circle cx="110" cy="32" r="3.5" fill={getLevelColor()} />
          </g>
        </svg>
      </div>

      {/* Straight, Clear Risk Level Scale Bar */}
      <div className="w-full max-w-xs mt-3 grid grid-cols-4 gap-1.5 text-center">
        <div
          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
            safeScore < 0.3
              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-xs ring-2 ring-emerald-400/30 font-extrabold'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span className="block text-[9px] text-emerald-700 font-mono">0.0–0.3</span>
          <span>LOW</span>
        </div>

        <div
          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
            safeScore >= 0.3 && safeScore < 0.6
              ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-400/30 font-extrabold'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span className="block text-[9px] text-amber-700 font-mono">0.3–0.6</span>
          <span>MOD</span>
        </div>

        <div
          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
            safeScore >= 0.6 && safeScore < 0.8
              ? 'bg-orange-100 border-orange-400 text-orange-950 shadow-xs ring-2 ring-orange-400/30 font-extrabold'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span className="block text-[9px] text-orange-700 font-mono">0.6–0.8</span>
          <span>HIGH</span>
        </div>

        <div
          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
            safeScore >= 0.8
              ? 'bg-red-100 border-red-400 text-red-950 shadow-xs ring-2 ring-red-400/30 font-extrabold'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span className="block text-[9px] text-red-700 font-mono">0.8+</span>
          <span>CRITICAL</span>
        </div>
      </div>

      {/* Numerical Risk Value and Category Badge */}
      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {safeScore.toFixed(2)}
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">/ 1.00 index</span>
        </div>
        <div
          className="mt-2 inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs"
          style={{ backgroundColor: getLevelColor() }}
        >
          {level} RISK LEVEL
        </div>
      </div>
    </div>
  );
};
