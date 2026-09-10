import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RiskMap } from '../components/map/RiskMap';
import { MapLegend } from '../components/map/MapLegend';
import { LocationSidePanel } from '../components/map/LocationSidePanel';
import { SearchBar } from '../components/common/SearchBar';
import { locationService } from '../services/locationService';
import { RISK_LEVELS } from '../data/mockLocations';
import { useRegion } from '../context/RegionContext';
import { RegionScopeSelector } from '../components/common/RegionScopeSelector';
import { Layers, Filter, Compass, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const RiskMapPage = () => {
  const [searchParams] = useSearchParams();
  const { activeRegion, currentRegionMeta, filterLocationsByRegion, availableStates } = useRegion();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedRisk, setSelectedRisk] = useState('All Levels');
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
          // Auto-select first high risk location or first location
          const highRisk = res.data.find((l) => l.risk_level === 'VERY HIGH') || res.data[0];
          setSelectedLocation(highRisk);
        }
      } catch (err) {
        console.error('Error loading locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Filter logic: apply region filter first (defaults to NER!)
  useEffect(() => {
    let result = filterLocationsByRegion(locations, activeRegion);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.district.toLowerCase().includes(q) ||
          loc.state.toLowerCase().includes(q)
      );
    }

    if (selectedState !== 'All States') {
      result = result.filter(
        (loc) => loc.state.toLowerCase() === selectedState.toLowerCase()
      );
    }

    if (selectedRisk !== 'All Levels') {
      result = result.filter(
        (loc) => loc.risk_level.toUpperCase() === selectedRisk.toUpperCase()
      );
    }

    setFilteredLocations(result);
  }, [locations, activeRegion, filterLocationsByRegion, searchQuery, selectedState, selectedRisk]);

  // If selected location is not in filtered locations, update it
  useEffect(() => {
    if (filteredLocations.length > 0) {
      const isPresent = filteredLocations.some((l) => l.id === selectedLocation?.id);
      if (!isPresent) {
        setSelectedLocation(filteredLocations[0]);
      }
    }
  }, [filteredLocations, selectedLocation]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('All States');
    setSelectedRisk('All Levels');
  };

  return (
    <div className="space-y-4">
      {/* Header & Scope Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentRegionMeta.shortName} Geospatial Hazard & Risk Map
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                GIS Live View
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live OpenStreetMap telemetry layer showing slope gradients, rainfall thresholds, and hazard alert radii across {currentRegionMeta.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Showing <b>{filteredLocations.length}</b> Stations
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Dynamic Regional Scope Selector */}
        <RegionScopeSelector />

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Search Bar */}
          <div className="sm:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder={`Search stations in ${currentRegionMeta.shortName}...`}
            />
          </div>

          {/* State Filter */}
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

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {RISK_LEVELS.map((risk) => (
                <option key={risk} value={risk}>
                  {risk === 'All Levels' ? 'All Risk Levels' : `Filter: ${risk} Risk`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Workspace with Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map (8 cols on desktop or 12 if no selection) */}
        <div className={selectedLocation ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="space-y-3">
            <RiskMap
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              center={currentRegionMeta.center}
              zoom={currentRegionMeta.zoom}
              height="620px"
            />
            {/* Risk Legend bar underneath map */}
            <MapLegend />
          </div>
        </div>

        {/* Location Telemetry Side Panel (4 cols) */}
        {selectedLocation && (
          <div className="lg:col-span-4">
            <LocationSidePanel
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
