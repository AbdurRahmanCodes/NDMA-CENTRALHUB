import { Line, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./DummyCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DummyCharts({ weatherData }) {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setTheme(
            document.documentElement.getAttribute("data-theme") || "light"
          );
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark
    ? "rgba(148, 163, 184, 0.15)"
    : "rgba(148, 163, 184, 0.1)";
  const legendColor = isDark ? "#cbd5e1" : "#64748b";
  // Build weather charts when weatherData is available
  let weatherCharts = null;
  if (weatherData && weatherData.hourly) {
    const {
      time,
      temperature_2m,
      precipitation,
      rain,
      wind_speed_10m,
      relative_humidity_2m,
    } = weatherData.hourly;
    const labels = time.slice(0, 24).map((t) =>
      new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const tempData = {
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperature_2m.slice(0, 24),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.15)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const precipData = {
      labels,
      datasets: [
        {
          label: "Precipitation (mm)",
          data: precipitation.slice(0, 24),
          backgroundColor: "rgba(37,99,235,0.6)",
          borderColor: "#2563eb",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Rain (mm)",
          data: rain.slice(0, 24),
          backgroundColor: "rgba(59,130,246,0.35)",
          borderColor: "#3b82f6",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };

    const windHumData = {
      labels,
      datasets: [
        {
          type: "line",
          label: "Wind Speed (m/s)",
          yAxisID: "y",
          data: wind_speed_10m.slice(0, 24),
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.15)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          type: "line",
          label: "Humidity (%)",
          yAxisID: "y1",
          data: relative_humidity_2m.slice(0, 24),
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.12)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const commonLineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: legendColor,
            font: { size: 12, weight: "600" },
            usePointStyle: true,
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: isDark
            ? "rgba(15,23,42,0.98)"
            : "rgba(15,23,42,0.95)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#2563eb",
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor, font: { size: 11 } },
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 } },
        },
      },
    };

    const dualAxisOptions = {
      ...commonLineOptions,
      scales: {
        x: commonLineOptions.scales.x,
        y: {
          beginAtZero: true,
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: textColor },
        },
      },
    };

    const precipOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: legendColor,
            font: { size: 12, weight: "600" },
            usePointStyle: true,
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: isDark
            ? "rgba(15,23,42,0.98)"
            : "rgba(15,23,42,0.95)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#2563eb",
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor, font: { size: 11 } },
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 } },
        },
      },
    };

    weatherCharts = (
      <div className="dummy-charts-container">
        <div className="chart-wrapper">
          <div className="chart-header">
            <h3 className="chart-title">Temperature (next 24h)</h3>
            <p className="chart-subtitle">Open‑Meteo hourly temperature</p>
          </div>
          <div className="chart-canvas">
            <Line data={tempData} options={commonLineOptions} />
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-header">
            <h3 className="chart-title">Precipitation & Rain (next 24h)</h3>
            <p className="chart-subtitle">Open‑Meteo precipitation amounts</p>
          </div>
          <div className="chart-canvas">
            <Bar data={precipData} options={precipOptions} />
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-header">
            <h3 className="chart-title">Wind Speed & Humidity (next 24h)</h3>
            <p className="chart-subtitle">Open‑Meteo wind and humidity</p>
          </div>
          <div className="chart-canvas">
            <Line data={windHumData} options={dualAxisOptions} />
          </div>
        </div>
      </div>
    );
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: legendColor,
          font: {
            size: 12,
            weight: "600",
          },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(15, 23, 42, 0.98)"
          : "rgba(15, 23, 42, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2563eb",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} events`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: legendColor,
          font: {
            size: 12,
            weight: "600",
          },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(15, 23, 42, 0.98)"
          : "rgba(15, 23, 42, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2563eb",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} areas`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  if (weatherCharts) return weatherCharts;

  return (
    <div className="dummy-charts-container">
      <div className="chart-wrapper">
        <div className="chart-header">
          <h3 className="chart-title">Click on the map</h3>
          <p className="chart-subtitle">
            Select a point to load weather charts
          </p>
        </div>
        <div
          className="chart-canvas"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#64748b" }}>No data yet</span>
        </div>
      </div>
    </div>
  );
}

export default DummyCharts;
