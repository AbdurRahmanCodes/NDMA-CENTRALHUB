import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartContainer, RiskMeter } from '../../components/UI';
import { useData } from '../../hooks/useData';
import { loadNDMAData } from '../../services/dataLoader';
import { Flame, AlertTriangle, Shield, Thermometer, Wind, Droplets } from 'lucide-react';

const FireRisk = () => {
  const { data: ndmaData, loading, error } = useData(loadNDMAData);

  // Static seasonal fire risk data (mock data)
  const seasonalRiskData = [
    { month: 'Jan', risk: 20 },
    { month: 'Feb', risk: 35 },
    { month: 'Mar', risk: 50 },
    { month: 'Apr', risk: 75 },
    { month: 'May', risk: 90 },
    { month: 'Jun', risk: 95 },
    { month: 'Jul', risk: 60 },
    { month: 'Aug', risk: 40 },
    { month: 'Sep', risk: 55 },
    { month: 'Oct', risk: 70 },
    { month: 'Nov', risk: 45 },
    { month: 'Dec', risk: 25 },
  ];

  // Prevention tips
  const preventionTips = [
    {
      title: 'Create Defensible Space',
      desc: 'Clear vegetation and dry debris within 30 feet of your home.',
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      color: 'emerald'
    },
    {
      title: 'Report Smoke Immediately',
      desc: 'Call emergency services (1122) if you spot smoke or unattended fire.',
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      color: 'orange'
    },
    {
      title: 'Safe Debris Disposal',
      desc: 'Never burn trash or leaves during dry, windy conditions.',
      icon: <Flame className="w-6 h-6 text-rose-400" />,
      color: 'rose'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <div className="p-6 text-white animate-pulse">Loading fire risk data...</div>;
  }

  if (error) {
    return <div className="p-6 text-risk-critical">Error loading data: {error}</div>;
  }

  // Calculate average risk score from provincial data
  const provinces = ndmaData?.provinces ? Object.values(ndmaData.provinces) : [];
  const highRiskCount = provinces.filter(p => p.risk_level === 'High').length;
  const mediumRiskCount = provinces.filter(p => p.risk_level === 'Medium').length;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-heading text-white mb-2">Fire Risk Assessment</h1>
        <p className="text-gray-400 font-body">Forest fire monitoring and prevention analysis</p>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-background-light/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-glass flex items-center justify-between group hover:border-risk-critical/30 transition-colors">
          <div>
            <div className="text-gray-400 text-sm mb-1 font-body">High Risk Areas</div>
            <div className="text-3xl font-bold font-heading text-risk-critical">{highRiskCount} Regions</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-risk-critical/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 text-risk-critical" />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-background-light/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-glass flex items-center justify-between group hover:border-risk-high/30 transition-colors">
          <div>
            <div className="text-gray-400 text-sm mb-1 font-body">Moderate Risk Areas</div>
            <div className="text-3xl font-bold font-heading text-risk-high">{mediumRiskCount} Regions</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-risk-high/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 text-risk-high" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-background-light/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-glass flex items-center justify-between group hover:border-risk-medium/30 transition-colors">
          <div>
            <div className="text-gray-400 text-sm mb-1 font-body">Avg. Temperature</div>
            <div className="text-3xl font-bold font-heading text-risk-medium">34°C</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-risk-medium/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Thermometer className="w-6 h-6 text-risk-medium" />
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fire Danger Index Meter */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-background-light/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-glass flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-risk-high/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <h3 className="text-xl font-bold font-heading text-white mb-6 relative z-10">National Fire Danger Index</h3>
          <RiskMeter value={75} label="High Danger" size="lg" />
          
          <div className="grid grid-cols-3 gap-4 w-full mt-8">
            <div className="text-center">
              <div className="flex justify-center mb-1"><Wind className="w-4 h-4 text-gray-400" /></div>
              <div className="text-sm font-bold text-white">15 km/h</div>
              <div className="text-xs text-gray-500">Wind</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1"><Droplets className="w-4 h-4 text-gray-400" /></div>
              <div className="text-sm font-bold text-white">12%</div>
              <div className="text-xs text-gray-500">Humidity</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1"><Thermometer className="w-4 h-4 text-gray-400" /></div>
              <div className="text-sm font-bold text-white">38°C</div>
              <div className="text-xs text-gray-500">Temp</div>
            </div>
          </div>
        </motion.div>

        {/* Seasonal Risk Chart */}
        <div className="lg:col-span-2">
          <ChartContainer title="Seasonal Fire Risk Trends">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={seasonalRiskData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                  name="Risk Level"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risk Areas List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background-light/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-glass"
        >
          <h3 className="text-xl font-bold font-heading text-white mb-4">High Risk Areas</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {ndmaData?.provinces && Object.entries(ndmaData.provinces).map(([name, data], index) => (
              <motion.div 
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">{name}</div>
                  <div className="text-xs text-gray-400">Vulnerable Districts: {data.vulnerable_districts.length}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  data.risk_level === 'High' ? 'bg-risk-critical/10 text-risk-critical border-risk-critical/20' :
                  data.risk_level === 'Medium' ? 'bg-risk-high/10 text-risk-high border-risk-high/20' :
                  'bg-risk-low/10 text-risk-low border-risk-low/20'
                }`}>
                  {data.risk_level} Risk
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prevention Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background-light/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-glass"
        >
          <h3 className="text-xl font-bold font-heading text-white mb-4">Prevention Guidelines</h3>
          <div className="space-y-4">
            {preventionTips.map((tip, index) => (
              <div key={index} className="flex gap-4 p-4 bg-background/50 rounded-lg border border-white/5 hover:border-primary/30 transition-colors group">
                <div className={`flex-shrink-0 mt-1 p-2 rounded-lg bg-${tip.color}-500/10 group-hover:bg-${tip.color}-500/20 transition-colors`}>
                  {tip.icon}
                </div>
                <div>
                  <h4 className="font-bold font-heading text-white mb-1 group-hover:text-primary transition-colors">{tip.title}</h4>
                  <p className="text-sm text-gray-400 font-body">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FireRisk;
