import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';

/**
 * Temperature Forecast Chart - Shows 24-hour temperature trend
 */
export const TemperatureForecastChart = ({ forecast24h }) => {
  if (!forecast24h || forecast24h.length === 0) {
    return <div className="text-gray-400 text-center py-8">No forecast data available</div>;
  }

  const data = forecast24h.map(item => ({
    hour: `${item.hour}:00`,
    temperature: item.temperature ? Math.round(item.temperature) : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="hour" 
          stroke="#94a3b8" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke="#94a3b8" 
          tick={{ fontSize: 12 }}
          label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="#F97316"
          fill="#F97316"
          fillOpacity={0.3}
          name="Temperature (°C)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/**
 * Humidity & Wind Speed Chart - Combined chart
 */
export const HumidityWindChart = ({ forecast24h }) => {
  if (!forecast24h || forecast24h.length === 0) {
    return <div className="text-gray-400 text-center py-8">No forecast data available</div>;
  }

  const data = forecast24h.map(item => ({
    hour: `${item.hour}:00`,
    humidity: item.humidity || null,
    windSpeed: item.windSpeed ? Math.round(item.windSpeed) : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="hour" 
          stroke="#94a3b8" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          yAxisId="left"
          stroke="#3B82F6" 
          tick={{ fontSize: 12 }}
          label={{ value: 'Humidity %', angle: -90, position: 'insideLeft', fill: '#3B82F6' }}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          stroke="#10B981" 
          tick={{ fontSize: 12 }}
          label={{ value: 'Wind km/h', angle: 90, position: 'insideRight', fill: '#10B981' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidity"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Humidity (%)"
          dot={{ r: 3 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="windSpeed"
          stroke="#10B981"
          strokeWidth={2}
          name="Wind Speed (km/h)"
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/**
 * Precipitation Chart - Shows rainfall forecast
 */
export const PrecipitationChart = ({ forecast24h }) => {
  if (!forecast24h || forecast24h.length === 0) {
    return <div className="text-gray-400 text-center py-8">No forecast data available</div>;
  }

  const data = forecast24h.map(item => ({
    hour: `${item.hour}:00`,
    precipitation: item.precipitation || 0,
    rain: item.rain || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="hour" 
          stroke="#94a3b8" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke="#94a3b8" 
          tick={{ fontSize: 12 }}
          label={{ value: 'mm', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Bar
          dataKey="rain"
          fill="#3B82F6"
          name="Rain (mm)"
        />
        <Bar
          dataKey="precipitation"
          fill="#06B6D4"
          name="Total Precipitation (mm)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
