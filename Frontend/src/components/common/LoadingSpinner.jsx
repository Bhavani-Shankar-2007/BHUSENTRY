import React from 'react';

export const LoadingSpinner = ({ label = 'Loading telemetry data...', size = 'md' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <div className="w-10 h-10 border-3 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-600 rounded-full" />
        </div>
      </div>
      {label && (
        <p className="mt-3 text-sm font-medium text-slate-500 animate-pulse tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
};
