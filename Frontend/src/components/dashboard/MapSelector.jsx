import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PAKISTAN_BOUNDS } from '../../data/pakistanCities';

const MapSelector = ({ onLocationSelect, selectedLocation }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      // Fix for default marker icons in Leaflet with Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map
      const map = L.map(mapContainer.current).setView(
        [PAKISTAN_BOUNDS.center.latitude, PAKISTAN_BOUNDS.center.longitude],
        PAKISTAN_BOUNDS.zoom
      );

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 5
      }).addTo(map);

      mapRef.current = map;
      setMapLoaded(true);

      // Handle click events
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;

        // Add or update marker
        updateMarker(lat, lng);

        // Notify parent component
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }
      });

      // Cleanup
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
  }, [onLocationSelect]);

  // Update marker when selected location changes
  useEffect(() => {
    if (selectedLocation && mapLoaded && mapRef.current) {
      try {
        updateMarker(selectedLocation.latitude, selectedLocation.longitude);

        // Center map on selected location
        mapRef.current.setView(
          [selectedLocation.latitude, selectedLocation.longitude],
          10
        );
      } catch (err) {
        console.error('Error updating marker:', err);
      }
    }
  }, [selectedLocation, mapLoaded]);

  const updateMarker = (latitude, longitude) => {
    if (!mapRef.current) return;

    try {
      // Remove existing marker
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      // Create new marker
      const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
      markerRef.current = marker;
    } catch (err) {
      console.error('Error creating marker:', err);
    }
  };

  if (error) {
    return (
      <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center p-6">
          <p className="text-red-400 mb-2">Map failed to load</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Loading map...</p>
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      {mapLoaded && (
        <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-2 text-white text-sm shadow-lg z-[500]">
          <p className="font-medium">Click on the map to select a location</p>
        </div>
      )}
    </div>
  );
};

export default MapSelector;
