import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import { ChartContainer, RiskMeter } from '../../components/UI';
import { useMultipleData } from '../../hooks/useData';
import { loadFloodHistory, loadNDMAData } from '../../services/dataLoader';
import { Droplets, AlertTriangle, Map, TrendingUp } from 'lucide-react';

const FloodPrediction = () => {
  const [selectedProvince, setSelectedProvince] = useState('Punjab');
  
  const { data, loading, error } = useMultipleData({
    floodHistory: loadFloodHistory,
    ndmaData: loadNDMAData
  });

  const { floodHistory, ndmaData } = data;

  // Mock prediction data for 7-day forecast
  const forecastData = [
    { day: 'Day 1', risk: 45, rainfall: 12 },
    { day: 'Day 2', risk: 55, rainfall: 25 },
    { day: 'Day 3', risk: 70, rainfall: 45 },
    { day: 'Day 4', risk: 85, rainfall: 60 },
    { day: 'Day 5', risk: 65, rainfall: 30 },
    { day: 'Day 6', risk: 40, rainfall: 10 },
    { day: 'Day 7', risk: 30, rainfall: 5 },
  ];

  // Contributing factors mock data
  const factorsData = [
    { factor: 'Soil Saturation', value: 85 },
    { factor: 'River Levels', value: 70 },
    { factor: 'Rainfall Forecast', value: 90 },
    { factor: 'Snow Melt', value: 40 },
    { factor: 'Urban Drainage', value: 60 },
  ];

  if (loading) {
    return <div className="p-6 text-white">Loading prediction models...</div>;
  }

  if (error) {
    return <div className="p-6 text-risk-critical">Error loading data: {error}</div>;
  }

  const provinceData = ndmaData?.provinces?.[selectedProvince];
  const riskLevel = provinceData?.risk_level === 'High' ? 85 : provinceData?.risk_level === 'Medium' ? 55 : 25;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Flood Prediction System</h1>
          <p className="text-gray-400">AI-powered flood forecasting and risk analysis</p>
        </div>
        
        {/* Province Selector */}
        <div className="bg-background-light p-2 rounded-lg border border-background-lighter">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="bg-background text-white px-4 py-2 rounded border border-gray-700 focus:border-primary focus:outline-none"
          >
            {ndmaData?.provinces && Object.keys(ndmaData.provinces).map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Probability Meter */}
        <div className="bg-background-light rounded-lg p-6 border border-background-lighter flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-white mb-6">{selectedProvince} Risk Probability</h3>
          <RiskMeter value={riskLevel} label={`${riskLevel}% Probability`} size="lg" />
          <div className="mt-6 w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vulnerable Districts</span>
              <span className="text-white font-bold">{provinceData?.vulnerable_districts?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Population at Risk</span>
              <span className="text-white font-bold">{provinceData?.population_at_risk || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Chart */}
        <div className="lg:col-span-2">
          <ChartContainer title="7-Day Flood Risk Forecast">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#EF4444" label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fill: '#EF4444' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" label={{ value: 'Rain (mm)', angle: 90, position: 'insideRight', fill: '#3B82F6' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar yAxisId="right" dataKey="rainfall" fill="#3B82F6" name="Rainfall (mm)" barSize={20} />
                <Line yAxisId="left" type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={3} name="Flood Risk %" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contributing Factors */}
        <ChartContainer title="Contributing Risk Factors">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factorsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
              <YAxis dataKey="factor" type="category" stroke="#94a3b8" width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="value" fill="#F59E0B" name="Impact Score" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Historical Comparison */}
        <ChartContainer title="Historical Flood Events (Deaths)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={floodHistory?.major_events || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Line type="step" dataKey="deaths" stroke="#10B981" strokeWidth={2} name="Recorded Deaths" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default FloodPrediction;
