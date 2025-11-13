import axios from "axios";

export async function reverseGeocode(lat, lon) {
  try {
    // Use OpenStreetMap Nominatim for reverse geocoding
    const reverseUrl = `https://nominatim.openstreetmap.org/reverse`;
    const reverseParams = {
      lat: lat,
      lon: lon,
      format: "json",
      zoom: 10,
      addressdetails: 1,
    };

    const { data } = await axios.get(reverseUrl, {
      params: reverseParams,
    });

    if (data && data.address) {
      const addr = data.address;
      const parts = [
        addr.city || addr.town || addr.village || addr.suburb || addr.county,
        addr.state || addr.region,
        addr.country,
      ].filter(Boolean);

      if (parts.length > 0) {
        return parts.join(", ");
      }
    }

    // If we have display_name, use that
    if (data && data.display_name) {
      return data.display_name;
    }

    // Fallback to coordinates
    const latStr = typeof lat === "number" ? lat.toFixed(4) : lat;
    const lonStr = typeof lon === "number" ? lon.toFixed(4) : lon;
    return `${latStr}, ${lonStr}`;
  } catch (error) {
    console.error("Geocoding error:", error);
    const latStr = typeof lat === "number" ? lat.toFixed(4) : lat;
    const lonStr = typeof lon === "number" ? lon.toFixed(4) : lon;
    return `${latStr}, ${lonStr}`;
  }
}

// Forward geocoding - search for a location by name
export async function searchLocation(query) {
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search`;
    const params = {
      q: query,
      format: "json",
      limit: 1,
      addressdetails: 1,
    };

    const { data } = await axios.get(searchUrl, { params });

    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        name: result.display_name,
      };
    }

    throw new Error("Location not found");
  } catch (error) {
    console.error("Location search error:", error);
    throw error;
  }
}
