import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Droplets,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card } from '../components/common/Card';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskDonutChart } from '../components/charts/RiskDonutChart';
import { RainfallTrendChart } from '../components/charts/RainfallTrendChart';
import { StateRiskBarChart } from '../components/charts/StateRiskBarChart';
import { RegionScopeSelector } from '../components/common/RegionScopeSelector';
import { useRegion } from '../context/RegionContext';
import {
  MOCK_SUMMARY_METRICS,
  MOCK_RISK_DISTRIBUTION,
  MOCK_STATE_RISK_DATA,
  MOCK_RAINFALL_RISK_TREND,
  MOCK_HISTORICAL_MONTHLY
} from '../data/mockAnalytics';
import { MOCK_LOCATIONS } from '../data/mockLocations';
import { analyticsService } from '../services/analyticsService';
import { locationService } from '../services/locationService';

export const AnalyticsPage = () => {
  const { activeRegion, currentRegionMeta, filterLocationsByRegion } = useRegion();
  const [summary, setSummary] = React.useState(MOCK_SUMMARY_METRICS);
  const [riskDistribution, setRiskDistribution] = React.useState(MOCK_RISK_DISTRIBUTION);
  const [stateRisk, setStateRisk] = React.useState(MOCK_STATE_RISK_DATA);
  const [rainfallTrend, setRainfallTrend] = React.useState(MOCK_RAINFALL_RISK_TREND);
  const [historicalData, setHistoricalData] = React.useState(MOCK_HISTORICAL_MONTHLY);
  const [locations, setLocations] = React.useState(MOCK_LOCATIONS);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [sumRes, distRes, stateRes, rainRes, histRes, locRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getRiskDistribution(),
          analyticsService.getStateRisk(),
          analyticsService.getRainfallRiskTrend(),
          analyticsService.getHistoricalData(),
          locationService.getLocations()
        ]);
        if (sumRes.success && sumRes.data) setSummary(sumRes.data);
        if (distRes.success && distRes.data) setRiskDistribution(distRes.data);
        if (stateRes.success && stateRes.data) setStateRisk(stateRes.data);
        if (rainRes.success && rainRes.data) setRainfallTrend(rainRes.data);
        if (histRes.success && histRes.data) setHistoricalData(histRes.data);
        if (locRes.success && locRes.data?.length) setLocations(locRes.data);
      } catch (err) {
        console.warn('Analytics live sync error:', err);
      }
    };
    loadData();
  }, []);

  // Filter locations by active regional scope (defaults to NER!)
  const regionalLocations = React.useMemo(() => {
    return filterLocationsByRegion(locations, activeRegion);
  }, [locations, activeRegion, filterLocationsByRegion]);

  // Filter state risk bars by active region
  const regionalStateRisk = React.useMemo(() => {
    if (activeRegion === 'ALL_INDIA') return stateRisk;
    const targetStates = currentRegionMeta.states.map((s) => s.toLowerCase());
    return stateRisk.filter((s) => targetStates.includes((s.state || '').toLowerCase()));
  }, [stateRisk, activeRegion, currentRegionMeta]);

  // Dynamic regional risk distribution for donut chart
  const regionalRiskDistribution = React.useMemo(() => {
    const low = regionalLocations.filter((l) => l.risk_level === 'LOW').length;
    const mod = regionalLocations.filter((l) => l.risk_level === 'MODERATE').length;
    const high = regionalLocations.filter((l) => l.risk_level === 'HIGH').length;
    const vhigh = regionalLocations.filter((l) => l.risk_level === 'VERY HIGH').length;
    return [
      { name: 'LOW', value: low, color: '#16A34A' },
      { name: 'MODERATE', value: mod, color: '#EAB308' },
      { name: 'HIGH', value: high, color: '#F97316' },
      { name: 'VERY HIGH', value: vhigh, color: '#DC2626' }
    ];
  }, [regionalLocations]);

  // Sort top 5 high-risk locations for active region
  const topRiskLocations = [...regionalLocations]
    .sort((a, b) => (b.risk_score || b.current_risk_score || 0) - (a.risk_score || a.current_risk_score || 0))
    .slice(0, 5);

  const highAndVeryHighCount =
    regionalLocations.filter((l) => l.risk_level === 'HIGH' || l.risk_level === 'VERY HIGH').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Geotechnical Risk & Precipitation Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {currentRegionMeta.shortName} Insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Correlating regional rainfall metrics, multi-year monsoon hazard trends, and vulnerable slope classifications across {currentRegionMeta.name}.
          </p>
        </div>
      </div>

      {/* Dynamic Regional Scope Selector */}
      <RegionScopeSelector />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Average 24h Rainfall
          </span>
          <div className="text-2xl font-black text-[#0284C7] mt-1">
            {summary.avg_ner_rainfall || '134.2 mm'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {regionalLocations.length} Stations ({currentRegionMeta.shortName})
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Highest Risk Zone
          </span>
          <div className="text-xl font-black text-red-600 mt-1 truncate">
            {topRiskLocations[0]?.name || summary.highest_risk_state || 'Cherrapunji Escarpment'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block truncate">
            {topRiskLocations[0] ? `${topRiskLocations[0].district}, ${topRiskLocations[0].state}` : 'Vulnerable Escarpment Ridge'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            High / Very High Ratio
          </span>
          <div className="text-2xl font-black text-orange-600 mt-1">
            {highAndVeryHighCount} / {regionalLocations.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Active Geotechnical Watch
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Active Warning Bulletins
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {summary.active_alerts ?? 4} Dispatched
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Emergency cells notified
          </span>
        </div>
      </div>

      {/* Row 1: State-wise Bar Chart & Risk Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card
            title={`State-Wise Landslide Risk Breakdown (${currentRegionMeta.shortName})`}
            subtitle={`Risk category distribution across ${currentRegionMeta.name}`}
          >
            <StateRiskBarChart data={regionalStateRisk} height={280} />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card
            title={`${currentRegionMeta.shortName} Risk Distribution`}
            subtitle={`Normalized proportion across ${regionalLocations.length} monitored zones`}
          >
            <RiskDonutChart data={regionalRiskDistribution} />
          </Card>
        </div>
      </div>

      {/* Row 2: Rainfall vs Risk Trend & Annual Monsoon Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card
            title="7-Day Observed Rainfall vs AI Risk Index"
            subtitle="Precipitation correlation against the 0.70 hazard threshold line"
          >
            <RainfallTrendChart data={rainfallTrend} height={270} />
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card
            title="Annual Monsoon Landslide Frequency (NER)"
            subtitle="Monthly incident volume showing peak vulnerability in Jun-Sep"
          >
            <div className="w-full h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
                >
                  <defs>
                    <linearGradient id="incidentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-700">
                            <p className="font-bold text-slate-300">{label}</p>
                            <p className="text-red-400 font-semibold mt-1">
                              {payload[0]?.value} Landslide Events
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#incidentGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Top 5 Critical Vulnerability Sectors Table */}
      <Card
        title="Top Vulnerable Hotspot Sectors (Ranked by AI Index)"
        subtitle="Sectors demanding prioritized geotechnical mitigation and continuous radar surveillance"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50">
                <th className="py-3 px-4">Rank & Location</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">AI Risk Score</th>
                <th className="py-3 px-4">24h Rainfall</th>
                <th className="py-3 px-4">Slope Angle</th>
                <th className="py-3 px-4 text-right">Station Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topRiskLocations.map((loc, idx) => (
                <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{loc.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{loc.state}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={loc.risk_level} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                    {loc.risk_score}
                  </td>
                  <td className="py-3.5 px-4 text-sky-700 font-semibold">{loc.rainfall} mm</td>
                  <td className="py-3.5 px-4">{loc.slope}° incline</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/locations/${loc.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] hover:underline"
                    >
                      <span>Telemetry</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
