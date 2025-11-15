import { BarChart3, AlertTriangle, Calendar, Clock } from "lucide-react";
import "./InfoSidebar.css";
import { useEffect, useState } from "react";

function InfoSidebar({ selectedPoint }) {
  const [histStats, setHistStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [predLoading, setPredLoading] = useState(false);
  const [predError, setPredError] = useState(null);
  const [prediction, setPrediction] = useState(null);

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

  // Fetch flood prediction when a point is selected
  useEffect(() => {
    const fetchPrediction = async () => {
      if (
        !selectedPoint ||
        selectedPoint.latitude == null ||
        selectedPoint.longitude == null
      ) {
        setPrediction(null);
        return;
      }
      setPredLoading(true);
      setPredError(null);
      try {
        const url = new URL("http://localhost:5000/api/predict");
        url.searchParams.set("lat", String(selectedPoint.latitude));
        url.searchParams.set("lon", String(selectedPoint.longitude));
        const resp = await fetch(url.toString());
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        setPrediction(json?.flood_prediction || null);
      } catch (e) {
        console.error("Prediction fetch failed:", e);
        setPrediction(null);
        setPredError("Failed to load prediction");
      } finally {
        setPredLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedPoint]);

  // Risk badge class helper (replaces inline styles)
  const riskBadgeClass = (risk) => {
    const level = (risk || "").toLowerCase();
    if (level === "high") return "risk-high";
    if (level === "medium" || level === "moderate") return "risk-medium";
    if (level === "low") return "risk-low";
    return "risk-unknown";
  };

  return (
    <div className="info-sidebar">
      <div className="info-sidebar-header">
        <h2 className="info-sidebar-title">Floods Analysis</h2>
        <p className="info-sidebar-subtitle">Insights and status</p>
      </div>

      {/* Current Analysis (Prediction from Weathering API) */}
      <div className="alerts-section section-block">
        <h3 className="section-title">Current Analysis</h3>
        {!selectedPoint ? (
          <div className="alerts-list">
            <div className="alert-item">
              <div className="alert-header">
                <span className="alert-region">Select a location</span>
                <span className="alert-badge">Idle</span>
              </div>
              <div className="alert-time">Click the map to analyze risk.</div>
            </div>
          </div>
        ) : predLoading ? (
          <div className="alerts-list">
            <div className="alert-item">Analyzing risk…</div>
          </div>
        ) : predError ? (
          <div className="alerts-list">
            <div className="alert-item">{predError}</div>
          </div>
        ) : prediction ? (
          <div className="alerts-list">
            <div className="alert-item">
              <div className="alert-header">
                <span className="alert-region">Flood Risk</span>
                <span
                  className={`alert-badge ${riskBadgeClass(
                    prediction.risk_level
                  )}`}
                >
                  {prediction.risk_level || "Unknown"}
                </span>
              </div>
              <div className="alert-time">
                {prediction.message || "Prediction"} •{" "}
                {prediction.probability != null
                  ? `${(prediction.probability * 100).toFixed(1)}%`
                  : "N/A"}
              </div>
            </div>
          </div>
        ) : (
          <div className="alerts-list">
            <div className="alert-item">No prediction available.</div>
          </div>
        )}
      </div>

      {/* Historical Overview (dataset-wide statistics) */}
      <div className="alerts-section section-block">
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
              <div className="stat-icon stat-icon--success">
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
              <div className="stat-icon stat-icon--danger">
                <AlertTriangle size={24} />
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
              <div className="stat-icon stat-icon--warning">
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
              <div className="stat-icon stat-icon--success">
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

      {/* Quick Info */}
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
        </div>
      </div>
    </div>
  );
}

export default InfoSidebar;
