import React, { useState, useEffect } from 'react';
import { ChartContainer } from '../../components/UI';
import { useRealTimeWeather } from '../../hooks/useRealTimeWeather';
import { useEarthquakeData } from '../../hooks/useEarthquakeData';
import { fetchMultipleCities } from '../../services/weatherService';
import { PAKISTAN_CITIES } from '../../data/pakistanCities';
import LocationSearch from '../../components/dashboard/LocationSearch';
import MapSelector from '../../components/dashboard/MapSelector';
import WeatherCard from '../../components/dashboard/WeatherCard';
import { 
  TemperatureForecastChart, 
  HumidityWindChart, 
  PrecipitationChart 
} from '../../components/dashboard/WeatherCharts';
import { MapPin, RefreshCw, Clock } from 'lucide-react';
import { reverseGeocode } from '../../services/geocodingService';

const WeatherMonitoring = () => {
  // Selected location state
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 33.6844, // Default: Islamabad
    longitude: 73.0479,
    name: 'Islamabad'
  });

  // Pakistan cities weather data
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [lastCitiesUpdate, setLastCitiesUpdate] = useState(null);

  // Get real-time weather for selected location
  const { 
    weatherData, 
    loading: weatherLoading, 
    error: weatherError,
    refresh: refreshWeather,
    lastUpdated: weatherLastUpdated
  } = useRealTimeWeather(selectedLocation.latitude, selectedLocation.longitude);

  // Get earthquake data for selected location
  const {
    summary: earthquakeSummary,
    loading: earthquakeLoading,
    error: earthquakeError,
  } = useEarthquakeData(selectedLocation.latitude, selectedLocation.longitude);

  // Fetch weather for all Pakistan cities
  const fetchCitiesWeather = async () => {
    setCitiesLoading(true);
    try {
      const data = await fetchMultipleCities(PAKISTAN_CITIES);
      setCitiesWeather(data);
      setLastCitiesUpdate(new Date());
    } catch (error) {
      console.error('Error fetching cities weather:', error);
    } finally {
      setCitiesLoading(false);
    }
  };

  // Initial fetch and auto-refresh for cities
  useEffect(() => {
    fetchCitiesWeather();

    // Refresh cities every 5 minutes
    const interval = setInterval(fetchCitiesWeather, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle location selection from search or map
  const handleLocationSelect = async (latitude, longitude, name = null) => {
    let locationName = name;

    // If no name provided, reverse geocode
    if (!locationName) {
      try {
        locationName = await reverseGeocode(latitude, longitude);
      } catch (error) {
        locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    }

    setSelectedLocation({
      latitude,
      longitude,
      name: locationName
    });
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Real-Time Weather Monitoring</h1>
        <p className="text-gray-400">Live weather data and climate analysis for Pakistan</p>
      </div>

      {/* Location Selection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Location */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Search Location
          </h2>
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        </div>

        {/* Current Selection Info */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-2">Selected Location</h3>
          <div className="text-xl font-bold text-white mb-1">{selectedLocation.name}</div>
          <div className="text-sm text-gray-300">
            {selectedLocation.latitude.toFixed(4)}°, {selectedLocation.longitude.toFixed(4)}°
          </div>
          {weatherLastUpdated && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
              <Clock className="w-3 h-3" />
              Updated {formatLastUpdate(weatherLastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Select Location on Map
        </h2>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapSelector
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>

      {/* Current Weather Display */}
      {weatherData && (
        <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-500/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Current Weather</h2>
            <button
              onClick={refreshWeather}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white text-sm"
              disabled={weatherLoading}
            >
              <RefreshCw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <WeatherCard
            city={selectedLocation.name}
            weather={weatherData}
            earthquakeSummary={earthquakeSummary}
            loading={weatherLoading}
            error={weatherError}
          />
        </div>
      )}

      {/* Weather Charts */}
      {weatherData && weatherData.forecast24h && weatherData.forecast24h.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">24-Hour Forecast</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Forecast */}
            <ChartContainer title="Temperature Forecast">
              <TemperatureForecastChart forecast24h={weatherData.forecast24h} />
            </ChartContainer>

            {/* Humidity & Wind Speed */}
            <ChartContainer title="Humidity & Wind Speed">
              <HumidityWindChart forecast24h={weatherData.forecast24h} />
            </ChartContainer>
          </div>

          {/* Precipitation */}
          <ChartContainer title="Precipitation Forecast">
            <PrecipitationChart forecast24h={weatherData.forecast24h} />
          </ChartContainer>
        </div>
      )}

      {/* Pakistan Cities Weather */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Pakistan Regions Weather</h2>
          <div className="flex items-center gap-4">
            {lastCitiesUpdate && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                Updated {formatLastUpdate(lastCitiesUpdate)}
              </div>
            )}
            <button
              onClick={fetchCitiesWeather}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white text-sm"
              disabled={citiesLoading}
            >
              <RefreshCw className={`w-4 h-4 ${citiesLoading ? 'animate-spin' : ''}`} />
              Refresh All
            </button>
          </div>
        </div>

        {citiesLoading && citiesWeather.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-blue-600/20 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-blue-500/20 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-blue-500/20 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-blue-500/20 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {citiesWeather.map((cityData) => (
              <WeatherCard
                key={cityData.id}
                city={cityData.name}
                weather={cityData.weather}
                loading={false}
                error={cityData.error}
                onClick={() => handleLocationSelect(cityData.latitude, cityData.longitude, cityData.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {weatherError && (
        <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 text-red-200">
          <p className="font-semibold">Error loading weather data:</p>
          <p className="text-sm">{weatherError}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherMonitoring;
