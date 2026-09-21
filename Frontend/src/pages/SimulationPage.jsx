import React, { useEffect, useState, useRef } from 'react';
import { Viewer, Entity, PointGraphics, CameraFlyTo } from 'resium';
import { Cartesian3, Color, Math as CesiumMath, createWorldTerrainAsync, CameraEventType, KeyboardEventModifier } from 'cesium';
import { MOCK_LOCATIONS } from '../data/mockLocations';
import { useRegion } from '../context/RegionContext';
import { Maximize, Minimize } from 'lucide-react';

export const SimulationPage = () => {
  const [terrain, setTerrain] = useState(null);
  const { currentRegionMeta, filterLocationsByRegion, activeRegion } = useRegion();
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setFilteredLocations(filterLocationsByRegion(MOCK_LOCATIONS, activeRegion));
  }, [activeRegion, filterLocationsByRegion]);

  useEffect(() => {
    const loadTerrain = async () => {
      try {
        const terrainProvider = await createWorldTerrainAsync();
        setTerrain(terrainProvider);
      } catch (err) {
        console.error('Failed to load terrain:', err);
      }
    };
    loadTerrain();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Customize camera controls to feel more like standard maps/devices
  useEffect(() => {
    if (viewerRef.current && viewerRef.current.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      const controller = viewer.scene.screenSpaceCameraController;
      
      controller.translateEventTypes = [
        { eventType: CameraEventType.RIGHT_DRAG }
      ];
      
      controller.zoomEventTypes = [
        { eventType: CameraEventType.WHEEL },
        { eventType: CameraEventType.PINCH }
      ];

      controller.rotateEventTypes = [
        { eventType: CameraEventType.LEFT_DRAG }
      ];
      
      controller.tiltEventTypes = [
        { eventType: CameraEventType.MIDDLE_DRAG },
        { eventType: CameraEventType.RIGHT_DRAG, modifier: KeyboardEventModifier.CTRL }
      ];
    }
  }, [terrain]);

  const getRiskColor = (level) => {
    switch (level) {
      case 'VERY HIGH': return Color.RED.withAlpha(0.9);
      case 'HIGH': return Color.ORANGE.withAlpha(0.9);
      case 'MODERATE': return Color.YELLOW.withAlpha(0.9);
      case 'LOW': return Color.GREEN.withAlpha(0.9);
      default: return Color.GRAY.withAlpha(0.9);
    }
  };

  const [lat, lon] = currentRegionMeta.center;
  const altitude = Math.max(100000, 15000000 / Math.pow(2, currentRegionMeta.zoom));

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-black border border-slate-200/90 dark:border-slate-800 shadow-sm ${isFullscreen ? '' : 'rounded-2xl'}`}
      style={{ 
        height: isFullscreen ? '100vh' : 'calc(100vh - 8rem)', 
        width: isFullscreen ? '100vw' : '100%' 
      }}
    >
      <Viewer
        full
        ref={viewerRef}
        terrainProvider={terrain}
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        infoBox={true}
        sceneModePicker={false}
        navigationHelpButton={false}
        fullscreenButton={false} // Use our custom fullscreen button instead
        style={{ width: '100%', height: '100%' }}
      >
        <CameraFlyTo
          duration={2.5}
          destination={Cartesian3.fromDegrees(lon, lat, altitude)}
          orientation={{
            heading: CesiumMath.toRadians(0.0),
            pitch: CesiumMath.toRadians(-45.0),
            roll: 0.0,
          }}
        />

        {filteredLocations.map((loc) => (
          <Entity
            key={loc.id}
            name={loc.name}
            description={`
              <p><strong>District:</strong> ${loc.district}, ${loc.state}</p>
              <p><strong>Risk Level:</strong> ${loc.risk_level}</p>
              <p><strong>Rainfall:</strong> ${loc.rainfall} mm</p>
              <p><strong>Elevation:</strong> ${loc.elevation} m</p>
              <p><strong>Alert:</strong> ${loc.alert_message || 'None'}</p>
            `}
            position={Cartesian3.fromDegrees(loc.longitude, loc.latitude, loc.elevation || 2000)}
          >
            <PointGraphics
              pixelSize={18}
              color={getRiskColor(loc.risk_level)}
              outlineColor={Color.WHITE}
              outlineWidth={2}
            />
          </Entity>
        ))}
      </Viewer>

      {/* Fullscreen Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-black/60 backdrop-blur-sm rounded-lg border border-zinc-700 shadow-lg text-white hover:bg-black/80 transition"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur text-white px-4 py-3 rounded-xl border border-zinc-700 shadow-xl pointer-events-none">
        <h2 className="font-bold text-lg text-emerald-400">Live 3D Terrain Simulation</h2>
        <p className="text-[11px] sm:text-xs text-slate-300 mt-2 leading-relaxed">
          • Swipe / Left-Drag: <b>Pan</b><br/>
          • Pinch / Scroll: <b>Zoom</b><br/>
          • 2-Finger Drag / Right-Drag: <b>Tilt</b>
        </p>
      </div>
    </div>
  );
};
