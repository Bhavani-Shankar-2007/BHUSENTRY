import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Droplets,
  Mountain,
  Calendar,
  ArrowRight,
  LayoutGrid,
  List,
  Filter,
  RefreshCw,
  Compass
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RiskBadge } from '../components/common/RiskBadge';
import { SearchBar } from '../components/common/SearchBar';
import { locationService } from '../services/locationService';
import { RISK_LEVELS } from '../data/mockLocations';
import { useRegion } from '../context/RegionContext';
import { RegionScopeSelector } from '../components/common/RegionScopeSelector';

export const LocationsPage = () => {
  const [searchParams] = useSearchParams();
  const { activeRegion, currentRegionMeta, filterLocationsByRegion, availableStates, getRegionForState } = useRegion();
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedRisk, setSelectedRisk] = useState('All Levels');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [loading, setLoading] = useState(true);

  // Reset selected state if switched to a region where it's not present
  useEffect(() => {
    if (selectedState !== 'All States' && !availableStates.includes(selectedState)) {
      setSelectedState('All States');
    }
  }, [activeRegion, availableStates, selectedState]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationService.getLocations();
        if (res.success) {
          setLocations(res.data);
        }
      } catch (err) {
        console.error('Failed to load locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Filter locations by regional scope first (defaults to NER!)
  const regionalLocations = filterLocationsByRegion(locations, activeRegion);

  const filteredLocations = regionalLocations.filter((loc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      loc.name.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q);

    const matchesState =
      selectedState === 'All States' ||
      loc.state.toLowerCase() === selectedState.toLowerCase();

    const matchesRisk =
      selectedRisk === 'All Levels' ||
      loc.risk_level.toUpperCase() === selectedRisk.toUpperCase();

    return matchesSearch && matchesState && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Monitored Stations & Sensors
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {currentRegionMeta.shortName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of continuous geotechnical sensing stations, slope gradients, and current hazard classifications across {currentRegionMeta.name}.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link to="/map">
            <Button variant="techBlue" size="sm">
              <Compass className="w-4 h-4 mr-1.5" />
              <span>Map View</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Region Selector */}
      <RegionScopeSelector />

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder={`Search stations in ${currentRegionMeta.shortName}...`}
            />
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {RISK_LEVELS.map((risk) => (
                <option key={risk} value={risk}>
                  {risk === 'All Levels' ? 'All Risk Levels' : `${risk} Risk`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Displaying <b>{filteredLocations.length}</b> locations matching criteria
          </span>
          {(searchQuery || selectedState !== 'All States' || selectedRisk !== 'All Levels') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedState('All States');
                setSelectedRisk('All Levels');
              }}
              className="text-[#0284C7] font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Content: Table View or Card View */}
      {viewMode === 'table' ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50">
                  <th className="py-3 px-4">Station / Corridor</th>
                  <th className="py-3 px-4">State & District</th>
                  <th className="py-3 px-4">Risk Classification</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">24h Rain</th>
                  <th className="py-3 px-4">Slope / Elev</th>
                  <th className="py-3 px-4">Sync</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{loc.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {loc.latitude.toFixed(3)}°N, {loc.longitude.toFixed(3)}°E
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{loc.state}</span>
                      <span className="block text-xs text-slate-500">{loc.district}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={loc.risk_level} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {loc.risk_score}
                      </span>
                      <span className="text-[11px] text-slate-400"> / 1.0</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {loc.rainfall} mm
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{loc.slope}° incline</div>
                      <div className="text-xs text-slate-400">{loc.elevation} m MSL</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {loc.last_updated}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/locations/${loc.id}`}>
                        <Button variant="primary" size="sm">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocations.map((loc) => (
            <Card key={loc.id} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {loc.district}, {loc.state}
                  </span>
                  <RiskBadge level={loc.risk_level} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {loc.name}
                </h3>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Risk Index
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {loc.risk_score}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      24h Rain
                    </span>
                    <span className="text-base font-bold text-sky-700">
                      {loc.rainfall} mm
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Slope
                    </span>
                    <span className="font-semibold text-slate-800">{loc.slope}°</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Elevation
                    </span>
                    <span className="font-semibold text-slate-800">{loc.elevation} m</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-1">
                  <span className="font-semibold">Lithology:</span> {loc.soil_type}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Sync: {loc.last_updated}
                </span>
                <Link to={`/locations/${loc.id}`}>
                  <Button variant="primary" size="sm">
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
