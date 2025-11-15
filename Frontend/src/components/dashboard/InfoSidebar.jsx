import { BarChart3, TrendingUp, Calendar, Clock } from "lucide-react";
import "./InfoSidebar.css";
import { useEffect, useState } from "react";

function InfoSidebar() {
  const [histStats, setHistStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // Fetch general historical statistics from ArcGIS layer
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const base =
          "https://services3.arcgis.com/UDCw00RKDRKPqASe/arcgis/rest/services/FLOODS_PONTS2/FeatureServer/0/query";
        const outStatistics = [
          {
            statisticType: "count",
            onStatisticField: "OBJECTID",
            outStatisticFieldName: "record_count",
          },
          {
            statisticType: "avg",
            onStatisticField: "flood_intensity",
            outStatisticFieldName: "avg_intensity",
          },
          {
            statisticType: "avg",
            onStatisticField: "flood_duration",
            outStatisticFieldName: "avg_duration",
          },
          {
            statisticType: "max",
            onStatisticField: "date",
            outStatisticFieldName: "latest_date",
          },
        ];
        const params = new URLSearchParams({
          f: "json",
          where: "1=1",
          returnGeometry: "false",
          outStatistics: JSON.stringify(outStatistics),
        });
        const resp = await fetch(`${base}?${params.toString()}`);
        const json = await resp.json();
        const attrs = json?.features?.[0]?.attributes || null;
        setHistStats(attrs);
      } catch {
        setStatsError("Failed to load historical stats");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="info-sidebar">
      <div className="info-sidebar-header">
        <h2 className="info-sidebar-title">Floods Analysis</h2>
        <p className="info-sidebar-subtitle">Insights and status</p>
      </div>

      {/* Current Analysis (Weathering API model placeholder) */}
      <div className="alerts-section" style={{ marginBottom: "1rem" }}>
        <h3 className="section-title">Current Analysis</h3>
        <div className="alerts-list">
          <div className="alert-item">
            <div className="alert-header">
              <span className="alert-region">Weathering API Model</span>
              <span className="alert-badge">Pending</span>
            </div>
            <div className="alert-time">Predictions will appear here.</div>
          </div>
        </div>
      </div>

      {/* Historical Overview (dataset-wide statistics) */}
      <div className="alerts-section" style={{ marginBottom: "1rem" }}>
        <h3 className="section-title">Historical Overview</h3>
        {statsLoading ? (
          <div className="alerts-list">
            <div className="alert-item">Loading statistics…</div>
          </div>
        ) : statsError ? (
          <div className="alerts-list">
            <div className="alert-item">{statsError}</div>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                }}
              >
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {histStats?.record_count ?? "–"}
                </div>
                <div className="stat-label">Records</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  color: "#2563eb",
                }}
              >
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {histStats?.avg_intensity != null
                    ? Number(histStats.avg_intensity).toFixed(1)
                    : "–"}
                </div>
                <div className="stat-label">Avg Intensity</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  color: "#f59e0b",
                }}
              >
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {histStats?.avg_duration != null
                    ? Number(histStats.avg_duration).toFixed(1)
                    : "–"}
                </div>
                <div className="stat-label">Avg Duration (days)</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                }}
              >
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {histStats?.latest_date
                    ? new Date(histStats.latest_date).toLocaleDateString()
                    : "–"}
                </div>
                <div className="stat-label">Latest Record</div>
              </div>
            </div>
          </div>
        )}
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
