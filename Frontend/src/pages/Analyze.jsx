import { useState, useEffect } from "react";
import FloodMap from "../components/dashboard/FloodMap";
import Charts from "../components/dashboard/Charts";
import WeatherPanel from "../components/dashboard/WeatherPanel";
import InfoSidebar from "../components/dashboard/InfoSidebar";
import { fetchOpenMeteo } from "../services/weatherService";
import { reverseGeocode, searchLocation } from "../services/geocodingService";
import {
  fetchEarthquakes,
  findNearestEarthquake,
} from "../services/earthquakeService";
import "./Analyze.css";

function Analyze() {
  const [mapView, setMapView] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [nearestQuake, setNearestQuake] = useState(null);

  // Fetch earthquake data on mount
  useEffect(() => {
    const loadEarthquakes = async () => {
      try {
        const data = await fetchEarthquakes(30, 1.5);
        setEarthquakeData(data.features);
      } catch (error) {
        console.error("Failed to load earthquake data:", error);
      }
    };
    loadEarthquakes();
  }, []);

  useEffect(() => {
    if (!selectedPoint || !earthquakeData) {
      setNearestQuake(null);
      return;
    }
    const nearest = findNearestEarthquake(
      selectedPoint.latitude,
      selectedPoint.longitude,
      earthquakeData,
      150
    );
    setNearestQuake(nearest);
  }, [selectedPoint, earthquakeData]);

  const handlePointSelect = async (coordinates) => {
    setSelectedPoint(coordinates);
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchOpenMeteo(
        coordinates.latitude,
        coordinates.longitude
      );
      setWeatherData(data);

      if (earthquakeData) {
        const nearest = findNearestEarthquake(
          coordinates.latitude,
          coordinates.longitude,
          earthquakeData,
          100 // 100km radius
        );
        setNearestQuake(nearest);
      }

      try {
        const label = await reverseGeocode(
          coordinates.latitude,
          coordinates.longitude
        );
        setLocationName(label);
      } catch (e) {
        console.warn("Reverse geocode failed:", e);
        const latStr = coordinates.latitude?.toFixed
          ? coordinates.latitude.toFixed(4)
          : String(coordinates.latitude);
        const lonStr = coordinates.longitude?.toFixed
          ? coordinates.longitude.toFixed(4)
          : String(coordinates.longitude);
        setLocationName(`${latStr}, ${lonStr}`);
      }
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setWeatherError("Failed to fetch weather data");
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const location = await searchLocation(query);
      if (mapView) {
        mapView.goTo({
          center: [location.longitude, location.latitude],
          zoom: 10,
        });
      }
      setSelectedPoint({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      await handlePointSelect({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (error) {
      console.error("Search failed:", error);
      setWeatherError("Location not found. Please try another search.");
    }
  };

  return (
    <div className="analyze-page">
      <div className="dashboard-container">
        {/* Left Sidebar - Flood Prediction & Analysis */}
        <div className="left-sidebar-section">
          <InfoSidebar selectedPoint={selectedPoint} />
        </div>

        {/* Main Map Area */}
        <div className="map-section">
          <FloodMap
            onViewLoad={(view) => setMapView(view)}
            onPointSelect={handlePointSelect}
          />
        </div>

        {/* Right Sidebar - Weather Panel */}
        <div className="right-sidebar-section">
          <WeatherPanel
            selectedPoint={selectedPoint}
            weatherData={weatherData}
            weatherLoading={weatherLoading}
            weatherError={weatherError}
            locationName={locationName}
            onSearch={handleSearch}
            earthquakeData={nearestQuake}
          />
        </div>

        {/* Bottom Charts Section */}
        <div className="charts-section">
          <Charts weatherData={weatherData} />
        </div>
      </div>
    </div>
  );
}

export default Analyze;
