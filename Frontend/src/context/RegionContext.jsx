import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const REGIONS_CONFIG = {
  NER: {
    id: 'NER',
    name: 'North Eastern Region (NER)',
    shortName: 'NER (Primary Focus)',
    badgeText: 'Primary Focus',
    description: 'The 8 North Eastern States & Eastern Himalayan Corridors',
    isPrimary: true,
    center: [26.2006, 92.9376],
    zoom: 7,
    states: [
      'Arunachal Pradesh',
      'Assam',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Sikkim',
      'Tripura',
      'West Bengal' // Darjeeling/Teesta Himalayan belt
    ]
  },
  WESTERN_GHATS: {
    id: 'WESTERN_GHATS',
    name: 'Western Ghats',
    shortName: 'Western Ghats',
    badgeText: 'Secondary Zone',
    description: 'Western Ghats Escarpment (Wayanad, Idukki, Sahyadri)',
    isPrimary: false,
    center: [12.5, 76.0],
    zoom: 7,
    states: ['Kerala', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Goa']
  },
  NORTHERN_HIMALAYAS: {
    id: 'NORTHERN_HIMALAYAS',
    name: 'Northern Himalayas',
    shortName: 'Northern Himalayas',
    badgeText: 'Secondary Zone',
    description: 'High-Altitude Himalayan Slopes (Joshimath, Shimla, J&K)',
    isPrimary: false,
    center: [31.5, 78.0],
    zoom: 7,
    states: ['Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh']
  },
  ALL_INDIA: {
    id: 'ALL_INDIA',
    name: 'Pan-India',
    shortName: 'All India',
    badgeText: 'Nationwide',
    description: 'National Geotechnical Monitoring Network across all Indian states',
    isPrimary: false,
    center: [22.5, 82.5],
    zoom: 5,
    states: [] // All
  }
};

/**
 * Determines which region a given state belongs to
 */
export const getRegionForState = (stateName = '') => {
  if (!stateName) return 'NER';
  const clean = stateName.trim().toLowerCase();

  for (const [regId, reg] of Object.entries(REGIONS_CONFIG)) {
    if (regId === 'ALL_INDIA') continue;
    if (reg.states.some((s) => s.toLowerCase() === clean)) {
      return regId;
    }
  }
  return 'ALL_INDIA';
};

const RegionContext = createContext(null);

export const RegionProvider = ({ children }) => {
  // Default to NER (Primary Focus)
  const [activeRegion, setActiveRegionState] = useState(() => {
    try {
      const saved = localStorage.getItem('bhusentry_active_region');
      return saved && REGIONS_CONFIG[saved] ? saved : 'NER';
    } catch {
      return 'NER';
    }
  });

  const setActiveRegion = (regionId) => {
    if (REGIONS_CONFIG[regionId]) {
      setActiveRegionState(regionId);
      try {
        localStorage.setItem('bhusentry_active_region', regionId);
      } catch {
        // ignore
      }
    }
  };

  const currentRegionMeta = REGIONS_CONFIG[activeRegion] || REGIONS_CONFIG.NER;

  // Check if a single location belongs to the active region
  const isLocationInRegion = (location, regionId = activeRegion) => {
    if (!location) return false;
    if (regionId === 'ALL_INDIA') return true;

    const targetStates = REGIONS_CONFIG[regionId]?.states || [];
    const locState = (location.state || '').trim().toLowerCase();

    // Check if location has an explicit region field matching
    if (location.region && location.region.toUpperCase() === regionId) {
      return true;
    }

    return targetStates.some((s) => s.toLowerCase() === locState);
  };

  // Filter an array of locations by region
  const filterLocationsByRegion = (locationsList = [], regionId = activeRegion) => {
    if (!Array.isArray(locationsList)) return [];
    if (regionId === 'ALL_INDIA') return locationsList;
    return locationsList.filter((loc) => isLocationInRegion(loc, regionId));
  };

  // Compute available states list for dropdown filter based on active region
  const availableStates = useMemo(() => {
    if (activeRegion === 'ALL_INDIA') {
      return [
        'All States',
        'Arunachal Pradesh',
        'Assam',
        'Himachal Pradesh',
        'Jammu & Kashmir',
        'Kerala',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Sikkim',
        'Tripura',
        'Uttarakhand',
        'West Bengal'
      ];
    }
    const regionStates = REGIONS_CONFIG[activeRegion]?.states || [];
    return ['All States', ...regionStates];
  }, [activeRegion]);

  return (
    <RegionContext.Provider
      value={{
        activeRegion,
        setActiveRegion,
        currentRegionMeta,
        REGIONS_CONFIG,
        isLocationInRegion,
        filterLocationsByRegion,
        getRegionForState,
        availableStates
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return ctx;
};
