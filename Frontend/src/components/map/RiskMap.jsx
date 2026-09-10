import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RiskBadge } from '../common/RiskBadge';
import { Droplets, Mountain, Compass, ArrowUpRight, Layers, Satellite, MountainSnow, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MAP_LAYERS } from '../../services/mockData';

// Helper component to center map when selected location changes
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 9, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Create custom SVG Leaflet icon for each risk tier
const createCustomMarker = (riskLevel) => {
  const level = (riskLevel || 'LOW').toUpperCase();

  let color = '#16A34A';
  let pulseClass = '';

  if (level === 'VERY HIGH') {
    color = '#DC2626';
    pulseClass = 'pulse-critical';
  } else if (level === 'HIGH') {
    color = '#F97316';
    pulseClass = 'pulse-high';
  } else if (level === 'MODERATE') {
    color = '#EAB308';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform hover:scale-125 ${pulseClass}" style="background-color: ${color};">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const RiskMap = ({
  locations = [],
  selectedLocation = null,
  onSelectLocation,
  height = '560px',
  showLayerControls = true,
  center = null,
  zoom = null
}) => {
  const defaultCenter = center || [26.2006, 92.9376];
  const defaultZoom = zoom || 7;

  const [activeBase, setActiveBase] = useState('osm');
  const [showSentinel, setShowSentinel] = useState(false);

  const currentCenter = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : defaultCenter;

  const currentZoom = selectedLocation ? 9 : defaultZoom;

  const baseLayer = MAP_LAYERS[activeBase] || MAP_LAYERS.osm;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm" style={{ height }}>
      {/* Layer Toggle Controls */}
      {showLayerControls && (
        <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg p-1.5 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveBase('osm')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeBase === 'osm' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title="OpenStreetMap"
            >
              <Layers className="w-3.5 h-3.5" /> OSM
            </button>
            <button
              type="button"
              onClick={() => setActiveBase('satellite')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeBase === 'satellite' ? 'bg-sky-100 text-sky-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title="Satellite Imagery"
            >
              <Satellite className="w-3.5 h-3.5" /> Satellite
            </button>
            <button
              type="button"
              onClick={() => setActiveBase('openTopo')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeBase === 'openTopo' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title="OpenTopography Elevation"
            >
              <MountainSnow className="w-3.5 h-3.5" /> OpenTopo
            </button>
            <button
              type="button"
              onClick={() => setShowSentinel((v) => !v)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                showSentinel ? 'bg-red-100 text-red-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title="Sentinel-2 Heatmap Overlay (Simulated)"
            >
              <Flame className="w-3.5 h-3.5" /> Sentinel-2
            </button>
          </div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={currentCenter} zoom={selectedLocation ? 10 : defaultZoom} />

        {/* Base Tile Layer */}
        <TileLayer
          key={activeBase}
          attribution={baseLayer.attribution}
          url={baseLayer.url}
        />

        {/* Simulated Sentinel-2 heatmap overlay */}
        {showSentinel && (
          <TileLayer
            attribution={MAP_LAYERS.sentinel2.attribution}
            url={MAP_LAYERS.sentinel2.url}
            opacity={0.45}
          />
        )}

        {/* Alert radius circles for high/very high risk */}
        {locations
          .filter((l) => l.risk_level === 'HIGH' || l.risk_level === 'VERY HIGH')
          .map((loc) => (
            <Circle
              key={`circle-${loc.id}`}
              center={[loc.latitude, loc.longitude]}
              radius={loc.risk_level === 'VERY HIGH' ? 8000 : 5000}
              pathOptions={{
                color: loc.risk_level === 'VERY HIGH' ? '#DC2626' : '#F97316',
                fillColor: loc.risk_level === 'VERY HIGH' ? '#DC2626' : '#F97316',
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: '4, 4',
              }}
            />
          ))}

        {/* Location Markers */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={createCustomMarker(loc.risk_level)}
            eventHandlers={{
              click: () => {
                if (onSelectLocation) onSelectLocation(loc);
              },
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                  <RiskBadge level={loc.risk_level} size="sm" />
                </div>

                <div className="text-xs text-slate-600 space-y-1 mb-3">
                  <p>
                    <span className="font-medium text-slate-500">Region:</span> {loc.district}, {loc.state}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>
                      Rainfall: <b>{loc.rainfall} mm</b>
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      Slope: <b>{loc.slope}°</b> | Elev: <b>{loc.elevation}m</b>
                    </span>
                  </p>
                  <p className="font-semibold text-slate-800 pt-1">
                    AI Risk Index:{' '}
                    <span className="font-mono text-emerald-800 font-bold">{loc.risk_score}</span> / 1.00
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {loc.latitude.toFixed(4)}°N, {loc.longitude.toFixed(4)}°E
                  </p>
                </div>

                <Link
                  to={`/locations/${loc.id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#14532D] text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
                >
                  <span>Full Station Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
