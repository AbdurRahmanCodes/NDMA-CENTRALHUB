import { BarChart3, TrendingUp, AlertTriangle, MapPin } from "lucide-react";
import "./InfoSidebar.css";

function InfoSidebar({
  selectedPoint,
  weatherData,
  weatherLoading,
  weatherError,
  locationName,
}) {
  // Dummy statistics data
  const stats = [
    {
      icon: AlertTriangle,
      label: "High Risk Areas",
      value: "47",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      icon: MapPin,
      label: "Monitored Regions",
      value: "156",
      color: "#2563eb",
      bgColor: "rgba(37, 99, 235, 0.1)",
    },
    {
      icon: TrendingUp,
      label: "Flood Events (2024)",
      value: "23",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: BarChart3,
      label: "Data Points",
      value: "12.5K",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ];

  const recentAlerts = [
    { region: "Southeast Asia", severity: "High", time: "2 hours ago" },
    { region: "Central Europe", severity: "Medium", time: "5 hours ago" },
    { region: "West Africa", severity: "Low", time: "1 day ago" },
  ];

  // Left sidebar now focuses on Flood Analysis only (placeholder)

  return (
    <div className="info-sidebar">
      <div className="info-sidebar-header">
        <h2 className="info-sidebar-title">Floods Analysis</h2>
        <p className="info-sidebar-subtitle">Insights coming soon</p>
      </div>

      {/* Flood Analysis placeholder */}
      <div className="alerts-section" style={{ marginBottom: "1rem" }}>
        <h3 className="section-title">Overview</h3>
        <div className="alerts-list">
          <div className="alert-item">
            <div className="alert-header">
              <span className="alert-region">Risk Assessment</span>
              <span className="alert-badge">N/A</span>
            </div>
            <div className="alert-time">Model output will appear here.</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards (dummy, kept as requested) */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: stat.bgColor,
                  color: stat.color,
                }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Alerts (dummy) */}
      <div className="alerts-section">
        <h3 className="section-title">Recent Alerts</h3>
        <div className="alerts-list">
          {recentAlerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <div className="alert-header">
                <span className="alert-region">{alert.region}</span>
                <span
                  className={`alert-badge severity-${alert.severity.toLowerCase()}`}
                >
                  {alert.severity}
                </span>
              </div>
              <div className="alert-time">{alert.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info (dummy) */}
      <div className="quick-info">
        <h3 className="section-title">System Status</h3>
        <div className="status-items">
          <div className="status-item">
            <span className="status-dot active"></span>
            <span className="status-text">Data Feed Active</span>
          </div>
          <div className="status-item">
            <span className="status-dot active"></span>
            <span className="status-text">Models Updated</span>
          </div>
          <div className="status-item">
            <span className="status-dot warning"></span>
            <span className="status-text">2 Alerts Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSidebar;
