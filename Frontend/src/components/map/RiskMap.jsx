import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RiskBadge } from '../common/RiskBadge';
import { Droplets, Mountain, Compass, ArrowUpRight, Layers, Satellite, MountainSnow, Flame, CloudRain, Maximize, Minimize } from 'lucide-react';
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
  const [showGibsTrueColor, setShowGibsTrueColor] = useState(false);
  const [showNasaRain, setShowNasaRain] = useState(false);

  const currentCenter = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : defaultCenter;

  const currentZoom = selectedLocation ? 9 : defaultZoom;
  const mapContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const baseLayer = MAP_LAYERS[activeBase] || MAP_LAYERS.osm;

  return (
    <div ref={mapContainerRef} className={`relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm ${isFullscreen ? 'bg-slate-900' : ''}`} style={{ height: isFullscreen ? '100vh' : height, width: isFullscreen ? '100vw' : '100%' }}>
      {/* Layer Toggle Controls */}
      {showLayerControls && (
        <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveBase('osm')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeBase === 'osm' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="OpenStreetMap"
            >
              <Layers className="w-3.5 h-3.5" /> OSM
            </button>
            <button
              type="button"
              onClick={() => setActiveBase('satellite')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeBase === 'satellite' ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-900 dark:text-sky-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Satellite Imagery"
            >
              <Satellite className="w-3.5 h-3.5" /> Satellite
            </button>
            <button
              type="button"
              onClick={() => setActiveBase('openTopo')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeBase === 'openTopo' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="OpenTopography Elevation"
            >
              <MountainSnow className="w-3.5 h-3.5" /> OpenTopo
            </button>
            <button
              type="button"
              onClick={() => setShowGibsTrueColor((v) => !v)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                showGibsTrueColor ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="NASA GIBS Daily Earth Observation True-Color"
            >
              <Satellite className="w-3.5 h-3.5 text-blue-600" /> NASA GIBS
            </button>
            <button
              type="button"
              onClick={() => setShowNasaRain((v) => !v)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                showNasaRain ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="NASA GPM IMERG Real-Time Precipitation Rate"
            >
              <CloudRain className="w-3.5 h-3.5 text-indigo-600" /> NASA Rain
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Toggle */}
      <div className="absolute top-3 right-3 z-[1000]">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

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

        {/* NASA GIBS Daily Earth Observation True-Color */}
        {showGibsTrueColor && (
          <TileLayer
            attribution={MAP_LAYERS.nasaGibsTrueColor.attribution}
            url={MAP_LAYERS.nasaGibsTrueColor.url}
            maxNativeZoom={MAP_LAYERS.nasaGibsTrueColor.maxNativeZoom}
            maxZoom={MAP_LAYERS.nasaGibsTrueColor.maxZoom || 18}
            opacity={MAP_LAYERS.nasaGibsTrueColor.opacity || 0.85}
          />
        )}

        {/* NASA GPM IMERG Precipitation Rate Overlay */}
        {showNasaRain && (
          <TileLayer
            attribution={MAP_LAYERS.nasaGibsPrecipitation.attribution}
            url={MAP_LAYERS.nasaGibsPrecipitation.url}
            maxNativeZoom={MAP_LAYERS.nasaGibsPrecipitation.maxNativeZoom}
            maxZoom={MAP_LAYERS.nasaGibsPrecipitation.maxZoom || 18}
            opacity={MAP_LAYERS.nasaGibsPrecipitation.opacity || 0.65}
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
