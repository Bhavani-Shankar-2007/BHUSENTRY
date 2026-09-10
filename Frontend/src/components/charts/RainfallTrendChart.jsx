import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const RainfallTrendChart = ({ data = [], height = 280 }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="mm"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1]}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
                    <p className="font-bold text-slate-300 mb-1">{label}</p>
                    <p className="text-sky-400 font-semibold">
                      Rainfall: {payload[0]?.value} mm
                    </p>
                    <p className="text-amber-400 font-semibold">
                      Risk Index: {payload[1]?.value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px' }}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-600 capitalize">
                {value === 'rainfall' ? 'Daily Rainfall (mm)' : 'AI Risk Score'}
              </span>
            )}
          />
          <ReferenceLine
            yAxisId="right"
            y={0.70}
            stroke="#DC2626"
            strokeDasharray="4 4"
            label={{ value: 'Warning 0.70', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }}
          />
          <Bar
            yAxisId="left"
            dataKey="rainfall"
            fill="#0284C7"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
            opacity={0.85}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="riskScore"
            stroke="#F97316"
            strokeWidth={3}
            dot={{ fill: '#F97316', r: 4, strokeWidth: 1.5, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: '#EA580C' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
