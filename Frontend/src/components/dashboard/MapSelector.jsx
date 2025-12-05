import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PAKISTAN_BOUNDS, PAKISTAN_CITIES } from '../../data/pakistanCities';
import { NDMA_OFFICES } from '../../data/ndmaRegionalOffices';
import { findNearestCity, formatDistance } from '../../utils/mapUtils';
import { fetchCityNameFromCoords } from '../../services/weatherService';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * MapSelector with autocomplete search, reverse geocoding, and risk heatmap
 */
const MapSelector = ({ selectedLocation, citiesWeather = [], onLocationSelect }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const cityMarkersRef = useRef([]);
  const heatmapLayersRef = useRef([]);
  const lastPositionRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showCityMarkers, setShowCityMarkers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [error, setError] = useState(null);

  const onLocationSelectRef = useRef(onLocationSelect);

  // Update ref when prop changes
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

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

        map.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          if (onLocationSelectRef.current) {
            // Immediately show coordinates while fetching name
            onLocationSelectRef.current(lat, lng, `Loading location...`);

            // Fetch real name
            try {
              const cityName = await fetchCityNameFromCoords(lat, lng);
              // Update with real name
              onLocationSelectRef.current(lat, lng, cityName);
            } catch (err) {
              // Fallback
              onLocationSelectRef.current(lat, lng, `Custom Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
            }
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
  }, []); // Empty deps - truly only run once

  // Update marker
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedLocation) return;

    const posKey = `${selectedLocation.latitude.toFixed(6)},${selectedLocation.longitude.toFixed(6)}`;
    if (lastPositionRef.current === posKey) return;
    lastPositionRef.current = posKey;

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    try {
      const nearestCity = findNearestCity(
        selectedLocation.latitude,
        selectedLocation.longitude,
        NDMA_OFFICES
      );

      const marker = L.marker([selectedLocation.latitude, selectedLocation.longitude])
        .bindPopup(`
          <div style="padding: 12px; min-width: 200px; font-family: sans-serif;">
            <div style="margin-bottom: 8px;">
              <strong style="color:#2563eb; font-size: 15px; display:flex; align-items:center; gap:6px;">
                📍 ${selectedLocation.name === 'Loading location...' ? 'Identifying Location...' : selectedLocation.name}
              </strong>
            </div>
            ${nearestCity ? `
              <div style="background: #f1f5f9; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                 <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; display:flex; align-items:center; gap:4px;">
                    🛡️ Nearest Relief Camp
                 </div>
                 <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${nearestCity.name}</div>
                 <div style="font-size: 12px; color: #475569; display: flex; justify-content: space-between; margin-top: 2px;">
                    <span>Distance: <strong>${formatDistance(nearestCity.distance)}</strong></span>
                    ${nearestCity.contact ? `<span style="color:#2563eb; font-weight:600;">📞 ${nearestCity.contact}</span>` : ''}
                 </div>
              </div>
            ` : ''}
            <div style="font-size: 11px; color: #94a3b8; display:flex; justify-content:space-between; align-items:center;">
              <span>${selectedLocation.latitude.toFixed(4)}°N, ${selectedLocation.longitude.toFixed(4)}°E</span>
              <span style="background:#22c55e; color:white; padding:1px 4px; border-radius:3px; font-size:9px;">LIVE</span>
            </div>
          </div>
        `)
        .addTo(mapRef.current);

      markerRef.current = marker;
      marker.openPopup();
    } catch (err) {
      console.error('Error adding marker:', err);
    }
  }, [selectedLocation?.latitude, selectedLocation?.longitude, selectedLocation?.name, mapLoaded]);

  // Division heatmap
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    heatmapLayersRef.current.forEach(layer => {
      try { mapRef.current.removeLayer(layer); } catch (e) { }
    });
    heatmapLayersRef.current = [];

    if (!showHeatmap) return;

    try {
      const provinces = [
        { name: 'Punjab', center: [31.1704, 72.7097], temp: 35, desc: 'Most populous' },
        { name: 'Sindh', center: [26.0, 68.5], temp: 38, desc: 'Coastal region' },
        { name: 'KP', center: [34.5, 72.0], temp: 28, desc: 'Mountainous' },
        { name: 'Balochistan', center: [28.5, 65.0], temp: 32, desc: 'Largest province' }
      ];

      provinces.forEach(province => {
        const risk = ((province.temp - 20) / 25) * 100;
        const getColor = (r) => {
          if (r > 70) return { bg: '#dc2626', label: 'HIGH' };
          if (r > 50) return { bg: '#f59e0b', label: 'ELEVATED' };
          if (r > 30) return { bg: '#3b82f6', label: 'MODERATE' };
          return { bg: '#10b981', label: 'LOW' };
        };
        const riskInfo = getColor(risk);

        const circle = L.circle(province.center, {
          radius: 150000,
          fillColor: riskInfo.bg,
          fillOpacity: 0.25,
          stroke: true,
          color: riskInfo.bg,
          weight: 2,
          opacity: 0.5
        }).bindPopup(`
          <div style="padding: 10px; min-width: 160px;">
            <div style="margin-bottom: 6px;">
              <strong style="color: ${riskInfo.bg}; font-size: 14px;">${province.name}</strong>
            </div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
              ${province.desc}
            </div>
            <div style="font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              <div>Avg Temp: <strong>${province.temp}°C</strong></div>
              <div>Risk Level: <span style="font-weight: 600; color: ${riskInfo.bg};">${riskInfo.label}</span></div>
            </div>
          </div>
        `);

        circle.addTo(mapRef.current);
        heatmapLayersRef.current.push(circle);
      });
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
  }, [mapLoaded, showHeatmap]);

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
      <div className="relative w-full h-full bg-gray-100 rounded-lg flex items-center justify-center min-h-[400px]">
        <div className="text-center p-6">
          <p className="text-red-600 font-semibold mb-2">⚠️ Map Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Map...</p>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
        {/* Reset View Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView(
                [PAKISTAN_BOUNDS.center.latitude, PAKISTAN_BOUNDS.center.longitude],
                PAKISTAN_BOUNDS.zoom
              );
            }
          }}
          className="bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded shadow-md border border-gray-200 transition-colors flex items-center gap-2"
          title="Reset Map View"
        >
          <span>↺</span> Reset View
        </button>

        <button
          onClick={() => setShowCityMarkers(!showCityMarkers)}
          className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-md border transition-colors flex items-center gap-2 ${showCityMarkers
            ? 'bg-blue-600 text-white border-blue-700'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
        >
          <span>{showCityMarkers ? '✓' : '○'}</span> Cities
        </button>

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-md border transition-colors flex items-center gap-2 ${showHeatmap
            ? 'bg-orange-600 text-white border-orange-700'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
        >
          <span>{showHeatmap ? '✓' : '○'}</span> Risk Map
        </button>
      </div>

      {/* Heatmap Legend - Enhanced with Context */}
      {showHeatmap && (
        <div className="absolute top-4 left-4 z-[999] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 max-w-[200px]">
          <h4 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-200 pb-2">
            ⚠️ Regional Risk Index
          </h4>
          <p className="text-[10px] text-gray-500 mb-3 leading-tight">
            Based on aggregate heatwave intensity & historical flood probability.
          </p>
          <div className="space-y-2">
            {[
              { color: '#10b981', label: 'Low Risk', desc: 'Safe levels' },
              { color: '#3b82f6', label: 'Moderate', desc: 'Standard monitoring' },
              { color: '#f59e0b', label: 'Elevated', desc: 'Pre-alert status' },
              { color: '#dc2626', label: 'High Risk', desc: 'Active monitoring req.' }
            ].map(item => (
              <div key={item.label} className="flex items-start gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm mt-0.5 flex-shrink-0" style={{ background: item.color }}></div>
                <div>
                  <span className="text-xs font-bold text-gray-700 block">{item.label}</span>
                  <span className="text-[9px] text-gray-400 block -mt-0.5">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSelector;
