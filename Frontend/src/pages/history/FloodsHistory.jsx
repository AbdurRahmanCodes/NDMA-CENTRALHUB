import React from 'react';
import {
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
import { useMultipleData } from '../../hooks/useData';
import { loadFloodHistory, loadProvincialVictims } from '../../services/dataLoader';
import { Calendar, Users, DollarSign, Activity } from 'lucide-react';

const FloodsHistory = () => {
  const { data, loading, error } = useMultipleData({
    floodHistory: loadFloodHistory,
    provincialVictims: loadProvincialVictims
  });

  const { floodHistory, provincialVictims } = data;

  if (loading) {
    return <div className="p-6 text-white">Loading history data...</div>;
  }

  if (error) {
    return <div className="p-6 text-risk-critical">Error loading data: {error}</div>;
  }

  // Prepare provincial data for chart
  const provincialChartData = provincialVictims?.provinces
    ? Object.entries(provincialVictims.provinces).map(([province, stats]) => ({
        province,
        affected: stats.total_affected / 1000000, // in millions
        deaths: stats.deaths
      }))
    : [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Floods History</h1>
          <p className="text-gray-400">Comprehensive timeline of major flood events in Pakistan</p>
        </div>

        {/* Major Events Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="text-primary" /> Major Events Timeline
          </h2>
          <div className="space-y-6">
            {floodHistory?.major_events?.map((event) => (
              <div key={event.year} className="bg-background-light rounded-lg p-6 border border-background-lighter hover:border-primary transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">{event.year} Flood</div>
                    <div className="text-gray-400">{event.affected.toLocaleString()} People Affected</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center px-4 py-2 bg-background rounded-lg">
                      <div className="text-xl font-bold text-risk-critical">{event.deaths.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Deaths</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-background rounded-lg">
                      <div className="text-xl font-bold text-risk-high">${event.economic_loss_billion}B</div>
                      <div className="text-xs text-gray-500">Loss</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Provincial Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartContainer title="Provincial Impact (Deaths)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={provincialChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="province" type="category" stroke="#94a3b8" width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="deaths" fill="#EF4444" name="Deaths" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Affected Population (Millions)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={provincialChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="province" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="affected" fill="#3B82F6" name="Affected (M)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Economic Loss Analysis */}
        <div className="bg-background-light rounded-lg p-8 border border-background-lighter">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign className="text-green-500" /> Economic Impact Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              value="$35B+"
              label="Total Economic Loss (2010-2022)"
              icon={<DollarSign />}
              color="red"
            />
            <StatCard
              value="10.5M"
              label="Houses Damaged"
              icon={<Users />}
              color="orange"
            />
            <StatCard
              value="22,000+"
              label="Schools Destroyed"
              icon={<Activity />}
              color="yellow"
            />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={floodHistory?.major_events || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="economic_loss_billion"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="Economic Loss ($ Billion)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodsHistory;
