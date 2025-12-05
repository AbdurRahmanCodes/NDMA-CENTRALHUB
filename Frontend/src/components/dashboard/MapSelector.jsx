import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PAKISTAN_BOUNDS } from '../../data/pakistanCities';

// Fix Leaflet default marker icon issue with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * MapSelector with reliable standard markers
 */
const MapSelector = ({ selectedLocation, citiesWeather = [], onLocationSelect }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const cityMarkersRef = useRef([]);
  const heatLayerRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showCityMarkers, setShowCityMarkers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [error, setError] = useState(null);

  // Initialize map once
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

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap, © CARTO',
          maxZoom: 19,
          minZoom: 5
        }).addTo(map);

        mapRef.current = map;
        setMapLoaded(true);

        // Handle map clicks
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (onLocationSelect) {
            onLocationSelect(lat, lng, `Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
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
  }, [onLocationSelect]);

  // Update marker when location changes - FIXED VERSION
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedLocation) return;

    // Use timeout to avoid Leaflet animation conflicts
    const timeoutId = setTimeout(() => {
      if (!mapRef.current) return;

      // Safely remove old marker
      if (markerRef.current) {
        try {
          mapRef.current.removeLayer(markerRef.current);
        } catch (e) {
          // Ignore errors from removing markers during animations
        }
        markerRef.current = null;
      }

      // Create new standard Leaflet marker (blue pin)
      try {
        const marker = L.marker(
          [selectedLocation.latitude, selectedLocation.longitude],
          {
            title: `${selectedLocation.name}`,
            riseOnHover: true,
            draggable: false
          }
        );

        marker.bindPopup(`
          <div style="padding: 10px; min-width: 160px;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 15px; font-weight: 600;">
              📍 ${selectedLocation.name}
            </h4>
            <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
              <div><strong>Lat:</strong> ${selectedLocation.latitude.toFixed(4)}°N</div>
              <div><strong>Lon:</strong> ${selectedLocation.longitude.toFixed(4)}°E</div>
            </div>
          </div>
        `, {
          closeButton: true,
          autoClose: false,
          className: 'custom-leaflet-popup'
        });

        marker.addTo(mapRef.current);
        markerRef.current = marker;

        // Auto-open popup after a short delay
        setTimeout(() => {
          if (marker && mapRef.current) {
            marker.openPopup();
          }
        }, 150);
      } catch (err) {
        console.error('Error adding marker:', err);
      }
    }, 150); // Delay to avoid conflicts

    return () => clearTimeout(timeoutId);
  }, [selectedLocation?.latitude, selectedLocation?.longitude, mapLoaded]);

  // Update city markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !showCityMarkers) {
      // Clear markers if toggle is off
      cityMarkersRef.current.forEach(m => {
        try {
          mapRef.current?.removeLayer(m);
        } catch (e) { }
      });
      cityMarkersRef.current = [];
      return;
    }

    if (!Array.isArray(citiesWeather) || citiesWeather.length === 0) return;

    try {
      // Clear old markers
      cityMarkersRef.current.forEach(m => {
        try {
          mapRef.current.removeLayer(m);
        } catch (e) { }
      });
      cityMarkersRef.current = [];

      // Add new markers for major cities
      const majorCities = citiesWeather.filter(city =>
        ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Rawalpindi'].includes(city.name)
      );

      majorCities.forEach(city => {
        if (!city.weather?.current) return;

        const temp = city.weather.current.temperature;
        let color = temp > 30 ? '#ef4444' : temp > 20 ? '#f59e0b' : temp > 10 ? '#10b981' : '#3b82f6';

        const cityIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: 14px;
              height: 14px;
              background: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([city.latitude, city.longitude], { icon: cityIcon })
          .bindPopup(`
            <div style="padding: 8px;">
              <strong>${city.name}</strong><br/>
              <span style="color: ${color}; font-weight: bold;">${temp}°C</span><br/>
              <small>💧 ${city.weather.current.humidity}% | 💨 ${city.weather.current.windSpeed} km/h</small>
            </div>
          `)
          .addTo(mapRef.current);

        cityMarkersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error updating city markers:', error);
    }
  }, [citiesWeather, mapLoaded, showCityMarkers]);

  // Update heatmap
  useEffect(() => {
    if (heatLayerRef.current && mapRef.current) {
      try {
        mapRef.current.removeLayer(heatLayerRef.current);
      } catch (e) { }
      heatLayerRef.current = null;
    }

    if (!mapLoaded || !mapRef.current || !showHeatmap || !Array.isArray(citiesWeather) || citiesWeather.length === 0) {
      return;
    }

    try {
      const heatCircles = citiesWeather
        .filter(city => city.weather?.current)
        .map(city => {
          const temp = city.weather.current.temperature;
          const color = temp > 35 ? '#dc2626' : temp > 30 ? '#f59e0b' : temp > 20 ? '#10b981' : '#3b82f6';

          return L.circle([city.latitude, city.longitude], {
            radius: 30000,
            fillColor: color,
            fillOpacity: 0.2,
            stroke: false
          });
        });

      const heatGroup = L.layerGroup(heatCircles);
      heatGroup.addTo(mapRef.current);
      heatLayerRef.current = heatGroup;
    } catch (error) {
      console.error('Error updating heatmap:', error);
    }
  }, [citiesWeather, mapLoaded, showHeatmap]);

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
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all ${showHeatmap ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'
            }`}
        >
          {showHeatmap ? '✓' : '○'} Heat
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
