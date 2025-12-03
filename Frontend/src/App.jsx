import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PDMENavbar from './components/PDMENavbar';
import HomePage from './pages/HomePage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Analytics from './pages/dashboard/Analytics';
import WeatherMonitoring from './pages/dashboard/WeatherMonitoring';
import FireRisk from './pages/dashboard/FireRisk';
import FloodPrediction from './pages/dashboard/FloodPrediction';
import AboutUs from './pages/AboutUs';
import FloodsHistory from './pages/history/FloodsHistory';
import EarthquakeHistory from './pages/history/EarthquakeHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <PDMENavbar />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Dashboard with nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="weather" element={<WeatherMonitoring />} />
            <Route path="fire-risk" element={<FireRisk />} />
            <Route path="flood-prediction" element={<FloodPrediction />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* About Us */}
          <Route path="/about" element={<AboutUs />} />

          {/* History */}
          <Route path="/history/floods" element={<FloodsHistory />} />
          <Route path="/history/earthquakes" element={<EarthquakeHistory />} />

          {/* 404 */}
          <Route path="*" element={<div className="p-6 text-white min-h-screen text-center">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
