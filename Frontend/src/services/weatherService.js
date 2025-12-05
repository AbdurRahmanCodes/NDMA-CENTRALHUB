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

/**
 * Fetch comprehensive weather data for a specific location
 * Returns formatted data ready for display
 */
export async function fetchWeatherForLocation(lat, lon) {
  try {
    const data = await fetchOpenMeteo(lat, lon);

    if (!data || !data.current_weather) {
      throw new Error('Invalid weather data received');
    }

    const currentIndex = pickCurrentHourly(data);
    const hourly = data.hourly || {};

    // Extract current values
    const current = {
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      weatherCode: data.current_weather.weathercode,
      time: data.current_weather.time,
    };

    // Extract hourly values at current index
    if (currentIndex !== null && currentIndex >= 0) {
      current.humidity = hourly.relative_humidity_2m?.[currentIndex] || null;
      current.precipitation = hourly.precipitation?.[currentIndex] || 0;
      current.rain = hourly.rain?.[currentIndex] || 0;
      current.pressure = hourly.surface_pressure?.[currentIndex] || null;
      current.cloudCover = hourly.cloud_cover?.[currentIndex] || null;
    }

    // Get 24-hour forecast data
    const forecast24h = extractForecast24h(data);

    return {
      current,
      forecast24h,
      hourly: hourly,
      elevation: data.elevation,
      timezone: data.timezone,
      rawData: data
    };
  } catch (error) {
    console.error('Error fetching weather for location:', error);
    throw error;
  }
}

/**
 * Fetch weather data for multiple cities in parallel
 */
export async function fetchMultipleCities(citiesArray) {
  try {
    const promises = citiesArray.map(city =>
      fetchWeatherForLocation(city.latitude, city.longitude)
        .then(weather => ({
          ...city,
          weather,
          error: null
        }))
        .catch(error => ({
          ...city,
          weather: null,
          error: error.message
        }))
    );

    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple cities weather:', error);
    throw error;
  }
}

/**
 * Extract 24-hour forecast from hourly data
 */
function extractForecast24h(data) {
  if (!data || !data.hourly) return [];

  const hourly = data.hourly;
  const times = hourly.time || [];

  if (times.length === 0) return [];

  // Get current hour index
  const currentIndex = pickCurrentHourly(data);
  if (currentIndex === null || currentIndex < 0) return [];

  // Get next 24 hours starting from current hour
  const forecast = [];
  for (let i = 0; i < 24 && (currentIndex + i) < times.length; i++) {
    const index = currentIndex + i;
    const time = new Date(times[index]);

    forecast.push({
      time: times[index],
      hour: time.getHours(),
      temperature: hourly.temperature_2m?.[index] || null,
      humidity: hourly.relative_humidity_2m?.[index] || null,
      windSpeed: hourly.wind_speed_10m?.[index] || null,
      precipitation: hourly.precipitation?.[index] || 0,
      rain: hourly.rain?.[index] || 0,
      cloudCover: hourly.cloud_cover?.[index] || null,
    });
  }

  return forecast;
}

/**
 * Get weather condition text from weather code
 * https://open-meteo.com/en/docs
 */
export function getWeatherCondition(weatherCode) {
  const conditions = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Light Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail',
  };

  return conditions[weatherCode] || 'Unknown';
}
