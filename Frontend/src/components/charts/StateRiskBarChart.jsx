import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const StateRiskBarChart = ({ data = [], height = 280 }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="state"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
                    <p className="font-bold text-slate-200 mb-1">{label} Stations</p>
                    {payload.map((entry) => (
                      <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
                        {entry.name.toUpperCase()}: {entry.value}
                      </p>
                    ))}
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
              <span className="text-xs font-semibold text-slate-600 uppercase">
                {value} Risk
              </span>
            )}
          />
          <Bar dataKey="low" name="low" stackId="a" fill="#16A34A" radius={[0, 0, 0, 0]} />
          <Bar dataKey="moderate" name="moderate" stackId="a" fill="#EAB308" />
          <Bar dataKey="high" name="high" stackId="a" fill="#F97316" />
          <Bar dataKey="veryHigh" name="very high" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
