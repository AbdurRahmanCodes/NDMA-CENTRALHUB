import axios from "axios";

const HOURLY_PARAMS = [
  "temperature_2m",
  "rain",
  "snowfall",
  "precipitation",
  "surface_pressure",
  "wind_speed_10m",
  "cloud_cover",
  "relative_humidity_2m",
].join(",");

export async function fetchOpenMeteo(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: HOURLY_PARAMS,
    current_weather: true,
    timezone: "auto",
  };

  const { data } = await axios.get(url, { params });
  // Expected fields include elevation and hourly datasets
  return data;
}

export function pickCurrentHourly(data) {
  if (!data || !data.hourly) return null;
  const { time } = data.hourly;
  if (!Array.isArray(time) || time.length === 0) return null;

  const curIso = data.current_weather?.time;
  let idx = curIso ? time.indexOf(curIso) : -1;
  if (idx === -1) {
    // Fallback to nearest by now
    const now = Date.now();
    let best = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < time.length; i++) {
      const d = Math.abs(new Date(time[i]).getTime() - now);
      if (d < bestDiff) {
        best = i;
        bestDiff = d;
      }
    }
    idx = best;
  }
  return idx;
}
