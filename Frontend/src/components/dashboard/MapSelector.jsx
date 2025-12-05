import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PAKISTAN_BOUNDS } from '../../data/pakistanCities';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * MapSelector - Fixed version that doesn't remove markers
 */
const MapSelector = ({ selectedLocation, citiesWeather = [], onLocationSelect }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const cityMarkersRef = useRef([]);
  const lastPositionRef = useRef(null); // Track last position to prevent unnecessary updates

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showCityMarkers, setShowCityMarkers] = useState(true);
  const [error, setError] = useState(null);

  // Initialize map ONCE
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      try {
        const map = L.map(mapContainer.current, {
          zoomControl: false,
          attributionControl: true
        }).setView(
          [PAKISTAN_BOUNDS.center.latitude, PAKISTAN_BOUNDS.center.longitude],
          PAKISTAN_BOUNDS.zoom
        );

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          minZoom: 5
        }).addTo(map);

        mapRef.current = map;
        setMapLoaded(true);

        // Map click handler
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (onLocationSelect) {
            onLocationSelect(lat, lng, `Custom (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
          }
        });

        return () => {
          if (map) {
            map.remove();
            mapRef.current = null;
          }
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err.message);
      }
    }
  }, []); // Empty deps - only run once

  // Update marker - ONLY when coordinates actually change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedLocation) return;

    const posKey = `${selectedLocation.latitude.toFixed(6)},${selectedLocation.longitude.toFixed(6)}`;

    // Don't update if position hasn't changed
    if (lastPositionRef.current === posKey) {
      return;
    }

    lastPositionRef.current = posKey;

    // Remove old marker
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    // Add new marker
    try {
      const marker = L.marker([selectedLocation.latitude, selectedLocation.longitude])
        .bindPopup(`
          <div style="padding: 8px;">
            <strong style="color:#2563eb;">${selectedLocation.name}</strong><br/>
            <small>${selectedLocation.latitude.toFixed(4)}°N, ${selectedLocation.longitude.toFixed(4)}°E</small>
          </div>
        `)
        .addTo(mapRef.current);

      markerRef.current = marker;
      marker.openPopup();
    } catch (err) {
      console.error('Error adding marker:', err);
    }
  }, [selectedLocation?.latitude, selectedLocation?.longitude, selectedLocation?.name, mapLoaded]);

  // City markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !showCityMarkers) {
      cityMarkersRef.current.forEach(m => {
        try { mapRef.current?.removeLayer(m); } catch (e) { }
      });
      cityMarkersRef.current = [];
      return;
    }

    if (!Array.isArray(citiesWeather) || citiesWeather.length === 0) return;

    try {
      cityMarkersRef.current.forEach(m => {
        try { mapRef.current.removeLayer(m); } catch (e) { }
      });
      cityMarkersRef.current = [];

      const majorCities = citiesWeather.filter(city =>
        ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Rawalpindi'].includes(city.name)
      );

      majorCities.forEach(city => {
        if (!city.weather?.current) return;

        const temp = city.weather.current.temperature;
        const color = temp > 30 ? '#ef4444' : temp > 20 ? '#f59e0b' : temp > 10 ? '#10b981' : '#3b82f6';

        const cityIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: 12px;
              height: 12px;
              background: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([city.latitude, city.longitude], { icon: cityIcon })
          .bindPopup(`
            <div style="padding: 6px;">
              <strong>${city.name}</strong><br/>
              <span style="color:${color};font-weight:bold;">${temp}°C</span>
            </div>
          `)
          .addTo(mapRef.current);

        cityMarkersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error updating city markers:', error);
    }
  }, [citiesWeather, mapLoaded, showCityMarkers]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '500px' }}>
        <div className="text-center p-6">
          <p className="text-red-600 font-semibold mb-2">⚠️ Map Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '500px' }} />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Map...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-6 z-[999] flex flex-col gap-2">
        <button
          onClick={() => setShowCityMarkers(!showCityMarkers)}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all ${showCityMarkers ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
        >
          {showCityMarkers ? '✓' : '○'} Cities
        </button>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 z-[999] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold text-gray-800">🗺️ Pakistan Weather Map</h3>
        <p className="text-xs text-gray-600 mt-1">Click to select location</p>
      </div>
    </div>
  );
};

export default MapSelector;
