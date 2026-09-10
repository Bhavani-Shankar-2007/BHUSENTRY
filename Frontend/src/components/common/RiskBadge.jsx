import React from 'react';

/**
 * High-contrast risk status badges:
 * Low Risk (Green), Moderate Risk (Yellow/Orange), High/Critical Risk (Red)
 * Always includes text label — never color alone.
 */
export const RiskBadge = ({ level = 'LOW', size = 'md', dotOnly = false, className = '' }) => {
  const normalized = (level || 'LOW').toUpperCase();

  const configs = {
    LOW: {
      bg: 'bg-emerald-100 border-emerald-400 text-emerald-900',
      dot: 'bg-emerald-600',
      label: 'LOW RISK'
    },
    MODERATE: {
      bg: 'bg-amber-100 border-amber-400 text-amber-950',
      dot: 'bg-amber-500',
      label: 'MODERATE RISK'
    },
    HIGH: {
      bg: 'bg-orange-100 border-orange-500 text-orange-950',
      dot: 'bg-orange-600 animate-pulse',
      label: 'HIGH RISK'
    },
    'VERY HIGH': {
      bg: 'bg-red-100 border-red-500 text-red-950',
      dot: 'bg-red-600 animate-ping-slow',
      label: 'CRITICAL RISK'
    }
  };

  const config = configs[normalized] || configs.LOW;

  if (dotOnly) {
    return (
      <span
        title={config.label}
        aria-label={config.label}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border shadow-2xs transition-transform hover:scale-110 cursor-default shrink-0 ${
          config.bg
        } ${className}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
      </span>
    );
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase transition-all shadow-sm ${
        config.bg
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
