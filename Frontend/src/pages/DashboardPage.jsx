import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  AlertTriangle,
  Droplets,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Radio,
  Clock
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskMap } from '../components/map/RiskMap';
import { RainfallTrendChart } from '../components/charts/RainfallTrendChart';
import { RiskDonutChart } from '../components/charts/RiskDonutChart';
import { RegionScopeSelector } from '../components/common/RegionScopeSelector';
import { useRegion } from '../context/RegionContext';
import { locationService } from '../services/locationService';
import { alertService } from '../services/alertService';
import { analyticsService } from '../services/analyticsService';
import {
  MOCK_SUMMARY_METRICS,
  MOCK_RAINFALL_RISK_TREND,
  MOCK_RISK_DISTRIBUTION
} from '../data/mockAnalytics';
import { AIAssistantDrawer } from '../components/common/AIAssistantDrawer';
import { MOCK_ENVIRONMENTAL_METRICS } from '../services/mockData';
import { useTranslation } from 'react-i18next';

export const DashboardPage = () => {
  const { activeRegion, currentRegionMeta, filterLocationsByRegion } = useRegion();
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [summaryMetrics, setSummaryMetrics] = useState(MOCK_SUMMARY_METRICS);
  const [riskDistribution, setRiskDistribution] = useState(MOCK_RISK_DISTRIBUTION);
  const [rainfallTrend, setRainfallTrend] = useState(MOCK_RAINFALL_RISK_TREND);
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [locRes, alertRes, sumRes, distRes, rainRes] = await Promise.all([
          locationService.getLocations(),
          alertService.getAlerts(),
          analyticsService.getSummary(),
          analyticsService.getRiskDistribution(),
          analyticsService.getRainfallRiskTrend()
        ]);
        if (locRes.success) {
          setLocations(locRes.data);
          // Default select the highest risk station
          const critical = locRes.data.find((l) => l.risk_level === 'VERY HIGH') || locRes.data[0];
          setSelectedLoc(critical);
        }
        if (alertRes.success) {
          setAlerts(alertRes.data);
        }
        if (sumRes.success && sumRes.data) {
          setSummaryMetrics(sumRes.data);
        }
        if (distRes.success && distRes.data) {
          setRiskDistribution(distRes.data);
        }
        if (rainRes.success && rainRes.data) {
          setRainfallTrend(rainRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Filter locations dynamically by active region (defaults to NER!)
  const regionalLocations = useMemo(() => {
    return filterLocationsByRegion(locations, activeRegion);
  }, [locations, activeRegion, filterLocationsByRegion]);

  // Keep selected location valid within active region
  useEffect(() => {
    if (regionalLocations.length > 0) {
      const isStillPresent = regionalLocations.some((l) => l.id === selectedLoc?.id);
      if (!isStillPresent) {
        const critical =
          regionalLocations.find((l) => l.risk_level === 'VERY HIGH') ||
          regionalLocations.find((l) => l.risk_level === 'HIGH') ||
          regionalLocations[0];
        setSelectedLoc(critical);
      }
    }
  }, [regionalLocations, selectedLoc]);

  // Filter alerts by active region
  const regionalAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (activeRegion === 'ALL_INDIA') return true;
      const alertState = (a.state || '').trim().toLowerCase();
      const targetStates = currentRegionMeta.states || [];
      return targetStates.some((s) => s.toLowerCase() === alertState);
    });
  }, [alerts, activeRegion, currentRegionMeta]);

  const lowCount = regionalLocations.filter((l) => l.risk_level === 'LOW').length;
  const moderateCount = regionalLocations.filter((l) => l.risk_level === 'MODERATE').length;
  const highCount = regionalLocations.filter((l) => l.risk_level === 'HIGH').length;
  const veryHighCount = regionalLocations.filter((l) => l.risk_level === 'VERY HIGH').length;

  const dynamicRiskDistribution = useMemo(() => {
    return [
      { name: 'LOW', value: lowCount, color: '#16A34A' },
      { name: 'MODERATE', value: moderateCount, color: '#EAB308' },
      { name: 'HIGH', value: highCount, color: '#F97316' },
      { name: 'VERY HIGH', value: veryHighCount, color: '#DC2626' }
    ];
  }, [lowCount, moderateCount, highCount, veryHighCount]);

  const summaryCards = [
    {
      title: t('locations'),
      value: regionalLocations.length || (currentRegionMeta.isPrimary ? 12 : locations.length),
      unit: t('active_stations'),
      sub: currentRegionMeta.isPrimary ? 'Across 8 NER States' : `Scope: ${currentRegionMeta.shortName}`,
      icon: MapPin,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: t('low_risk'),
      value: lowCount,
      unit: 'Zones',
      sub: 'Stable gradient & soil',
      riskText: 'LOW',
      iconBg: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: t('moderate_risk'),
      value: moderateCount,
      unit: 'Zones',
      sub: 'Surveillance active',
      riskText: 'MODERATE',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: t('high_risk'),
      value: highCount,
      unit: 'Zones',
      sub: 'Precipitation watch',
      riskText: 'HIGH',
      iconBg: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      title: t('very_high_risk'),
      value: veryHighCount,
      unit: 'Zones',
      sub: 'Immediate action threshold',
      riskText: 'VERY HIGH',
      iconBg: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      title: t('alerts'),
      value: regionalAlerts.filter((a) => a.status === 'Active').length || regionalAlerts.length,
      unit: 'Immediate',
      sub: 'Disaster cells alerted',
      icon: AlertTriangle,
      iconBg: 'bg-red-100 text-red-800 border-red-300 animate-pulse'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t('title')}
            </h1>
            <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {currentRegionMeta.shortName} Realtime
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time geospatial intelligence, slope stability indicators, and AI early warnings for {currentRegionMeta.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/predict">
            <Button variant="primary" size="sm" icon={Cpu}>
              AI Risk Simulator
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="techBlue" size="sm" icon={Layers}>
              Full GIS Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Regional Scope Switcher Banner */}
      <RegionScopeSelector />

      {/* 6 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {card.title}
                </span>
                {card.riskText && <RiskBadge level={card.riskText} size="sm" dotOnly />}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                  {card.value}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  {card.unit}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-100 pt-2 line-clamp-1">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Middle Section: GIS Map + Station Quick Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Preview (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Interactive Geospatial Monitoring ({currentRegionMeta.shortName})
              </h2>
              <span className="text-xs text-slate-400 font-mono">{regionalLocations.length} Active Stations</span>
            </div>
            <Link to="/map" className="text-xs font-semibold text-[#0284C7] hover:underline flex items-center gap-1">
              <span>Expand Fullscreen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RiskMap
            locations={regionalLocations}
            selectedLocation={selectedLoc}
            onSelectLocation={(loc) => setSelectedLoc(loc)}
            height="440px"
          />
        </div>

        {/* Selected Station Telemetry Card (1 Column) */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Station Telemetry</h2>
              {selectedLoc && <RiskBadge level={selectedLoc.risk_level} size="sm" />}
            </div>

            {selectedLoc ? (
              <Card className="h-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {selectedLoc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedLoc.district}, {selectedLoc.state}
                    </p>
                  </div>

                  {/* AI Risk Meter Score Preview */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        AI Predicted Risk Index
                      </span>
                      <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                        {selectedLoc.risk_score || selectedLoc.current_risk_score} <span className="text-xs font-normal text-slate-500">/ 1.00</span>
                      </div>
                    </div>
                    <RiskBadge level={selectedLoc.risk_level} size="md" />
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-sky-50/50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30">
                      <span className="text-[11px] text-sky-800 dark:text-sky-300 font-medium block">24h Rainfall</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedLoc.rainfall || '94.2'} mm</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium block">Slope Angle</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedLoc.slope || '32.0'}° Deg</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                      <span className="text-[11px] text-slate-500 font-medium block">Elevation</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedLoc.elevation || '1420'} m</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                      <span className="text-[11px] text-slate-500 font-medium block">Last Updated</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedLoc.last_updated || 'Live Stream'}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Soil:</span> {selectedLoc.soil_type || 'Residual Metamorphic'}</p>
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Cover:</span> {selectedLoc.land_cover || 'Vegetated Escarpment'}</p>
                  </div>

                  <Link to={`/locations/${selectedLoc.id}`} className="block pt-2">
                    <Button variant="primary" size="sm" className="w-full">
                      <span>View Historical Data & Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                Click any marker on the map to inspect telemetry.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Charts + Active Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rainfall vs Risk Trend Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="7-Day Observed Rainfall vs Hazard Index"
            subtitle={`Hydrological correlation for ${currentRegionMeta.name}`}
          >
            <RainfallTrendChart data={MOCK_RAINFALL_RISK_TREND} height={260} />
          </Card>
        </div>

        {/* Overall Risk Distribution Donut (1 Col) */}
        <div>
          <Card
            title={`${currentRegionMeta.shortName} Risk Distribution`}
            subtitle={`Current classification across ${regionalLocations.length} monitored sectors`}
          >
            <RiskDonutChart data={dynamicRiskDistribution} />
          </Card>
        </div>
      </div>

      {/* Active Alerts Table Preview */}
      <Card
        title={`Active Early Warning Bulletins (${currentRegionMeta.shortName})`}
        subtitle="Priority warnings requiring administrative verification & field dispatch"
        action={
          <Link to="/alerts">
            <Button variant="outline" size="sm">
              Manage All Alerts
            </Button>
          </Link>
        }
      >
        <div className="overflow-x-auto">
          {regionalAlerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active warnings in {currentRegionMeta.name}. Slope stability indicators normal.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50/50">
                  <th className="py-3 px-4">Alert ID</th>
                  <th className="py-3 px-4">Sector / Station</th>
                  <th className="py-3 px-4">Hazard Classification</th>
                  <th className="py-3 px-4">Alert Description</th>
                  <th className="py-3 px-4">Issued</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {regionalAlerts.slice(0, 4).map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {alert.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{alert.location_name}</div>
                      <div className="text-xs font-normal text-slate-500">{alert.state}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={alert.risk_level} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">
                      {alert.message}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {alert.created_time}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          alert.status === 'Active'
                            ? 'bg-red-100 text-red-800'
                            : alert.status === 'Acknowledged'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Floating AI Explainer Button */}
      <button
        type="button"
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-700 transition font-semibold text-sm"
      >
        <Sparkles className="w-5 h-5" />
        AI Risk Explainer
      </button>
      <AIAssistantDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        locationName={selectedLoc?.name || 'NER Aggregate'}
        riskScore={selectedLoc?.risk_score || 0.72}
      />
    </div>
  );
};

