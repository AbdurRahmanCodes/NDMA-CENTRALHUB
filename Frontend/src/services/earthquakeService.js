import axios from "axios";

const USGS_FDSN_BASE = "https://earthquake.usgs.gov/fdsnws/event/1/query";

/**
 * Fetch recent earthquakes from USGS
 * @param {number} daysBack - Number of days to look back (default: 30)
 * @param {number} minMagnitude - Minimum magnitude (default: 2.5)
 * @returns {Promise} Earthquake GeoJSON data
 */
export async function fetchEarthquakes(daysBack = 30, minMagnitude = 2.5) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const params = {
      format: "geojson",
      starttime: startDate.toISOString().split("T")[0],
      endtime: endDate.toISOString().split("T")[0],
      minmagnitude: minMagnitude,
      orderby: "time",
    };

    const { data } = await axios.get(USGS_FDSN_BASE, { params });
    console.log(`Fetched ${data.features?.length || 0} earthquakes`);
    return data;
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
}

/**
 * Find nearest earthquake to a given coordinate
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Array} earthquakes - Array of earthquake features from GeoJSON
 * @param {number} maxDistanceKm - Maximum distance to search (default: 100km)
 * @returns {Object|null} Nearest earthquake data or null
 */
export function findNearestEarthquake(
  lat,
  lon,
  earthquakes,
  maxDistanceKm = 100
) {
  if (!earthquakes || earthquakes.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  earthquakes.forEach((quake) => {
    const [quakeLon, quakeLat] = quake.geometry.coordinates;
    const distance = calculateDistance(lat, lon, quakeLat, quakeLon);

    if (distance < minDistance && distance <= maxDistanceKm) {
      minDistance = distance;
      nearest = {
        magnitude: quake.properties.mag,
        place: quake.properties.place,
        time: new Date(quake.properties.time),
        depth: quake.geometry.coordinates[2],
        distance: Math.round(distance),
        url: quake.properties.url,
      };
    }
  });

  return nearest;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}
