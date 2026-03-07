const Location = require("../models/Location");
const Bus = require("../models/Bus");

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.getNearbyBuses = async (req, res) => {
  try {

    const { latitude, longitude } = req.query;

    const locations = await Location.find().populate("bus");

    const nearby = [];

    locations.forEach((loc) => {

      const distance = calculateDistance(
        latitude,
        longitude,
        loc.latitude,
        loc.longitude
      );

      if (distance <= 2) {
        nearby.push({
          busId: loc.bus._id,
          busNumber: loc.bus.busNumber,
          latitude: loc.latitude,
          longitude: loc.longitude,
          distance: distance.toFixed(2)
        });
      }

    });

    res.json(nearby);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};