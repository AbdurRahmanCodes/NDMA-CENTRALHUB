import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ChartContainer, StatCard } from '../../components/UI';
import { useData } from '../../hooks/useData';
import { loadClimateData } from '../../services/dataLoader';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherMonitoring = () => {
  const { data: climateData, loading, error } = useData(loadClimateData);

  // Static sample data for current weather (since we don't have a live API)
  const currentWeather = [
    { city: 'Islamabad', temp: 28, condition: 'Partly Cloudy', humidity: 65, wind: 12, icon: <Cloud /> },
    { city: 'Lahore', temp: 32, condition: 'Sunny', humidity: 55, wind: 8, icon: <Sun /> },
    { city: 'Karachi', temp: 30, condition: 'Humid', humidity: 75, wind: 15, icon: <Wind /> },
    { city: 'Peshawar', temp: 26, condition: 'Rainy', humidity: 80, wind: 10, icon: <CloudRain /> },
    { city: 'Quetta', temp: 22, condition: 'Clear', humidity: 40, wind: 6, icon: <Sun /> },
    { city: 'Gilgit', temp: 18, condition: 'Cloudy', humidity: 70, wind: 14, icon: <Cloud /> },
  ];

  // Static sample data for 7-day forecast
  const forecastData = [
    { day: 'Mon', temp: 28, rain: 20 },
    { day: 'Tue', temp: 27, rain: 40 },
    { day: 'Wed', temp: 25, rain: 80 },
    { day: 'Thu', temp: 26, rain: 60 },
    { day: 'Fri', temp: 29, rain: 10 },
    { day: 'Sat', temp: 31, rain: 0 },
    { day: 'Sun', temp: 32, rain: 0 },
  ];

  if (loading) {
    return <div className="p-6 text-white">Loading weather data...</div>;
  }

  if (error) {
    return <div className="p-6 text-risk-critical">Error loading weather data: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Weather Monitoring</h1>
        <p className="text-gray-400">Real-time weather tracking and climate analysis</p>
      </div>

      {/* Current Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {currentWeather.map((weather) => (
          <div
            key={weather.city}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">{weather.city}</h3>
              <div className="text-2xl opacity-80">{weather.icon}</div>
            </div>
            <div className="text-3xl font-bold mb-2">{weather.temp}°C</div>
            <div className="text-sm opacity-90 mb-3">{weather.condition}</div>
            <div className="flex items-center justify-between text-xs opacity-75">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{weather.wind} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trends */}
        <ChartContainer title="Monthly Temperature Growth (%)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={climateData?.temperature_trends?.monthly_growth_percent || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#F97316"
                strokeWidth={2}
                name="Growth %"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Precipitation Patterns */}
        <ChartContainer title="Monthly Average Rainfall (mm)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={climateData?.precipitation_patterns?.monthly_average_mm || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="rainfall" fill="#3B82F6" name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 7-Day Forecast */}
      <ChartContainer title="7-Day Forecast Overview">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#F97316" />
            <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.3}
              name="Temperature (°C)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="rain"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              name="Rain Probability (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Additional Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          value={`${climateData?.co2_emissions?.[climateData.co2_emissions.length - 1]?.metric_tons_per_capita || 0}`}
          label="CO₂ Emissions (Metric Tons/Capita)"
          icon={<Cloud />}
          color="orange"
        />
        <StatCard
          value={`${climateData?.forest_cover?.remaining_percent || 0}%`}
          label="Remaining Forest Cover"
          icon={<Droplets />} // Using Droplets as a placeholder for nature/forest if Trees isn't available or just reuse
          color="green"
        />
        <StatCard
          value={`${climateData?.glacier_melt?.annual_retreat_meters || 0}m`}
          label="Annual Glacier Retreat"
          icon={<Thermometer />}
          color="red"
        />
      </div>
    </div>
  );
};

export default WeatherMonitoring;
