import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RISK_COLORS = {
  LOW: '#16A34A',
  MODERATE: '#EAB308',
  HIGH: '#F97316',
  VERY_HIGH: '#DC2626',
  'VERY HIGH': '#DC2626'
};

export const RiskDonutChart = ({ data = [] }) => {
  // Normalize data safely if an object or non-array is passed
  let chartData = [];
  if (Array.isArray(data)) {
    chartData = data;
  } else if (data && typeof data === 'object') {
    chartData = Object.entries(data).map(([key, val]) => ({
      name: key.replace('_', ' '),
      value: Number(val) || 0,
      color: RISK_COLORS[key] || RISK_COLORS[key.replace(' ', '_')] || '#64748B'
    }));
  }

  const total = chartData.reduce((sum, item) => sum + (Number(item?.value) || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const percent = total > 0 ? Math.round(((Number(entry.value) || 0) / total) * 100) : 0;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-700">
          <p className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.color || '#64748B' }} />
            {entry.name} RISK
          </p>
          <p className="text-slate-300 mt-1">
            {entry.value} stations ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#64748B'} stroke="#FFFFFF" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Statistic */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-2xl font-black text-slate-900">{total}</span>
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          Stations
        </span>
      </div>
    </div>
  );
};

