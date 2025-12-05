import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, CloudRain, Activity, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

/**
 * Helper function to get relative time
 */
const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

/**
 * Helper to get AQI gradient colors
 */
const getAQIStyles = (color) => {
    const styles = {
        green: {
            gradient: 'from-green-600 to-emerald-700',
            border: 'border-green-500/30'
        },
        yellow: {
            gradient: 'from-yellow-500 to-amber-600',
            border: 'border-yellow-500/30'
        },
        orange: {
            gradient: 'from-orange-500 to-orange-700',
            border: 'border-orange-500/30'
        },
        red: {
            gradient: 'from-red-600 to-red-800',
            border: 'border-red-500/30'
        },
        purple: {
            gradient: 'from-purple-600 to-purple-800',
            border: 'border-purple-500/30'
        },
        maroon: {
            gradient: 'from-red-900 to-red-950',
            border: 'border-red-900/30'
        }
    };
    return styles[color] || { gradient: 'from-gray-600 to-gray-700', border: 'border-gray-500/30' };
};

/**
 * Animated Number Component
 */
const AnimatedNumber = ({ value, decimals = 0, suffix = '', prefix = '' }) => {
    const [prevValue, setPrevValue] = useState(value);

    useEffect(() => {
        if (value !== prevValue) {
            setPrevValue(value);
        }
    }, [value, prevValue]);

    return (
        <CountUp
            start={prevValue}
            end={value}
            duration={1.2}
            decimals={decimals}
            suffix={suffix}
            prefix={prefix}
            useEasing={true}
            easingFn={(t, b, c, d) => {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            }}
        />
    );
};

/**
 * Compact metric card with premium animations and tooltips
 */
const MetricCard = ({ icon: Icon, label, value, sublabel, gradient, delay, numericValue, tooltip }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ scale: 1.02, translateY: -2 }}
        className={`rounded-xl p-4 ${gradient} shadow-lg backdrop-blur-sm border border-white/10 relative overflow-hidden group cursor-default`}
        title={tooltip}
    >
        <motion.div
            className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.2, opacity: 0.1 }}
            transition={{ duration: 0.4 }}
        />

        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-110">
            <Icon className="w-16 h-16 text-white" />
        </div>

        <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
                <div className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider flex items-center gap-2">
                    {label}
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                </div>
                <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                    {numericValue !== undefined ? (
                        <AnimatedNumber value={numericValue} suffix={value.replace(/[0-9.-]/g, '')} />
                    ) : (
                        value
                    )}
                </div>
                <div className="text-xs text-white/60 font-medium">
                    {sublabel}
                </div>
            </div>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md group-hover:bg-white/20 transition-colors">
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    </motion.div>
);

/**
 * Weather Sidebar with all fixes
 */
const WeatherSidebar = ({
    selectedLocation,
    weatherData,
    citiesWeather,
    earthquakeSummary,
    airQuality,
    onLocationSelect,
    loading
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (weatherData && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [weatherData, isInitialLoad]);

    const filteredCities = citiesWeather.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    if ((loading && !weatherData) || isInitialLoad) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-900 border-r border-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading disaster monitoring data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800 shadow-2xl relative z-20">
            {/* Search with Clear Button */}
            <div className="p-5 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-10">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Pakistani cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
                            title="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-5 space-y-6">
                    {/* Current Location Info */}
                    {selectedLocation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6"
                        >
                            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2 uppercase tracking-wider">
                                <MapPin className="w-3 h-3" />
                                Monitoring Location
                            </div>
                            <h2 className="text-2xl font-bold text-white leading-tight">{selectedLocation.name}</h2>
                            <div className="text-gray-500 text-xs mt-1 font-mono">
                                {selectedLocation.latitude.toFixed(4)}°N, {selectedLocation.longitude.toFixed(4)}°E
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Real-time weather and disaster data for this location</p>
                        </motion.div>
                    )}

                    {/* Current Weather Conditions */}
                    {weatherData && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                                    Current Weather
                                </div>
                                <p className="text-xs text-gray-600">Live conditions updated every 5 minutes</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <MetricCard
                                    icon={Thermometer}
                                    label="Temperature"
                                    value={`${weatherData.current.temperature}°C`}
                                    numericValue={weatherData.current.temperature}
                                    sublabel="Air temperature"
                                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                                    delay={0.1}
                                    tooltip="Current air temperature in degrees Celsius"
                                />
                                <MetricCard
                                    icon={Droplets}
                                    label="Humidity"
                                    value={`${weatherData.current.humidity}%`}
                                    numericValue={weatherData.current.humidity}
                                    sublabel="Moisture level"
                                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                                    delay={0.2}
                                    tooltip="Relative humidity percentage in the air"
                                />
                                <MetricCard
                                    icon={Wind}
                                    label="Wind Speed"
                                    value={`${weatherData.current.windSpeed} km/h`}
                                    numericValue={weatherData.current.windSpeed}
                                    sublabel="Surface wind"
                                    gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
                                    delay={0.3}
                                    tooltip="Wind speed at ground level"
                                />
                                <MetricCard
                                    icon={CloudRain}
                                    label="Precipitation"
                                    value={`${weatherData.current.precipitation || 0} mm`}
                                    numericValue={weatherData.current.precipitation || 0}
                                    sublabel="Rainfall amount"
                                    gradient="bg-gradient-to-br from-violet-500 to-purple-600"
                                    delay={0.4}
                                    tooltip="Total rainfall in millimeters"
                                />
                            </div>
                        </div>
                    )}

                    {/* Air Quality Alert */}
                    {airQuality && airQuality.aqi && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${getAQIStyles(airQuality.category?.color).gradient} border ${getAQIStyles(airQuality.category?.color).border} rounded-xl p-4 shadow-lg relative overflow-hidden group cursor-default`}
                            title="Air Quality Index - measures air pollution levels"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Wind className="w-20 h-20 text-white" />
                            </div>
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-white/90 mb-1 uppercase tracking-wider flex items-center gap-2">
                                        <span className="text-lg">{airQuality.category?.icon || '🌫️'}</span>
                                        Air Quality
                                    </div>
                                    <div className="text-3xl font-extrabold text-white mb-1">
                                        {airQuality.aqi}
                                    </div>
                                    <div className="text-sm font-bold text-white/80 mb-1">
                                        {airQuality.category?.level || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-white/70">
                                        {airQuality.category?.description || 'Data unavailable'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Earthquake Alert */}
                    {earthquakeSummary && earthquakeSummary.count > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-red-900/50 to-red-600/20 border border-red-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden group cursor-default"
                            title="Recent earthquake activity detected in your area"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity className="w-20 h-20 text-red-500" />
                            </div>
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-red-400 mb-1 uppercase tracking-wider flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        Seismic Activity
                                    </div>
                                    <div className="text-3xl font-extrabold text-white mb-1">
                                        M <AnimatedNumber value={earthquakeSummary.mostRecent?.magnitude || 0} decimals={1} />
                                    </div>
                                    <div className="text-xs text-red-200/70 font-medium">
                                        <AnimatedNumber value={earthquakeSummary.mostRecent?.distance || 0} decimals={0} suffix=" km away" />
                                    </div>
                                    {earthquakeSummary.mostRecent?.time && (
                                        <div className="text-xs text-red-200/60 mt-1">
                                            {getRelativeTime(earthquakeSummary.mostRecent.time)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-green-900/30 to-green-600/10 border border-green-500/20 rounded-xl p-4 shadow-lg"
                            title="No recent earthquake activity in your area"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Activity className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-green-400 mb-1">No Seismic Activity</div>
                                    <div className="text-xs text-green-200/60">No earthquakes detected within 100km</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Major Cities List */}
                    <div className="pt-2">
                        <div className="space-y-1 mb-3">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                                Quick Access Cities
                            </div>
                            <p className="text-xs text-gray-600">Click any city to view its weather data</p>
                        </div>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-2"
                        >
                            {filteredCities.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No cities found</p>
                                    <p className="text-xs mt-1">Try a different search term</p>
                                </div>
                            ) : (
                                filteredCities.map((city) => (
                                    <motion.button
                                        key={city.name}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onLocationSelect(city.latitude, city.longitude, city.name)}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-700/50 rounded-lg p-3 text-left transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-200 font-medium text-sm group-hover:text-white transition-colors">{city.name}</span>
                                            {city.weather && city.weather.current && (
                                                <span className={`font-bold text-sm ${city.weather.current.temperature > 30 ? 'text-orange-400' :
                                                        city.weather.current.temperature < 15 ? 'text-blue-400' : 'text-green-400'
                                                    }`}>
                                                    {city.weather.current.temperature}°C
                                                </span>
                                            )}
                                        </div>
                                        {city.weather && city.weather.current && (
                                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                                <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {city.weather.current.humidity}%</span>
                                                <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {city.weather.current.windSpeed} km/h</span>
                                            </div>
                                        )}
                                    </motion.button>
                                ))
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherSidebar;
