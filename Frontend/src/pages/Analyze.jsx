import { useState, useEffect } from "react";
import FloodMap from "../components/dashboard/FloodMap";
import DummyCharts from "../components/dashboard/DummyCharts";
import WeatherPanel from "../components/dashboard/WeatherPanel";
import InfoSidebar from "../components/dashboard/InfoSidebar";
import { queryAllCountries } from "../utils/mapHelpers";
import { fetchOpenMeteo } from "../services/weatherService";
import { reverseGeocode, searchLocation } from "../services/geocodingService";
import {
  fetchEarthquakes,
  findNearestEarthquake,
} from "../services/earthquakeService";
import "./Analyze.css";

function Analyze() {
  const [dataLayer, setDataLayer] = useState(null);
  const [mapView, setMapView] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2022);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [nearestQuake, setNearestQuake] = useState(null);

  useEffect(() => {
    if (dataLayer && mapView) {
      const loadCountries = async () => {
        setIsLoadingCountries(true);
        try {
          const allCountries = await queryAllCountries(dataLayer);
          setCountries(allCountries);
        } catch (error) {
          console.error("Error loading countries:", error);
        } finally {
          setIsLoadingCountries(false);
        }
      };
      loadCountries();
    }
  }, [dataLayer, mapView]);

  // Fetch earthquake data on mount
  useEffect(() => {
    const loadEarthquakes = async () => {
      try {
        const data = await fetchEarthquakes(30, 2.5);
        setEarthquakeData(data.features);
      } catch (error) {
        console.error("Failed to load earthquake data:", error);
      }
    };
    loadEarthquakes();
  }, []);

  // Recompute nearest earthquake whenever selected point or dataset changes
  useEffect(() => {
    if (!selectedPoint || !earthquakeData) {
      setNearestQuake(null);
      return;
    }
    const nearest = findNearestEarthquake(
      selectedPoint.latitude,
      selectedPoint.longitude,
      earthquakeData,
      250 // expand search radius to 250km for better coverage
    );
    setNearestQuake(nearest);
  }, [selectedPoint, earthquakeData]);

  // Handle point selection from map
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

      // Find nearest earthquake
      if (earthquakeData) {
        const nearest = findNearestEarthquake(
          coordinates.latitude,
          coordinates.longitude,
          earthquakeData,
          100 // 100km radius
        );
        setNearestQuake(nearest);
      }

      // Reverse geocode to human-readable place name via Open‑Meteo Geocoding API
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

  // Handle location search
  const handleSearch = async (query) => {
    try {
      const location = await searchLocation(query);
      // Center map on searched location
      if (mapView) {
        mapView.goTo({
          center: [location.longitude, location.latitude],
          zoom: 10,
        });
      }
      // Trigger point selection for the searched location
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
        {/* Left Sidebar - Info & Stats */}
        <div className="left-sidebar-section">
          <InfoSidebar />
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
          <DummyCharts weatherData={weatherData} />
        </div>
      </div>
    </div>
  );
}

export default Analyze;
