import dotenv from "dotenv";
dotenv.config();

/**
 * Calculates the distance and duration between two points using OpenRouteService API
 * @param {Array} start - Starting coordinates [longitude, latitude]
 * @param {Array} end - Ending coordinates [longitude, latitude]
 * @returns {Promise<Object>} - Object containing distance (in km) and duration (in minutes)
 */
const getRouteInfo = async (start, end) => {
  try {
    const orsApiKey = process.env.ORS_API_KEY;

    // Format coordinates for ORS API
    const coordinates = [start, end];

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: orsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: coordinates,
          units: "km",
          instructions: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract distance (in km) and duration (in minutes) from response
    const route = data.routes[0];
    const distance = route.summary.distance; // in kilometers
    const duration = route.summary.duration / 60; // convert seconds to minutes

    return {
      distance: parseFloat(distance.toFixed(2)),
      duration: parseFloat(duration.toFixed(2)),
    };
  } catch (error) {
    console.error("Error calculating route:", error);
    throw error;
  }
};

export { getRouteInfo };
