const Route = require("../models/Route");
const Location = require("../models/Location");
const { calculateDistanceKm } = require("../utils/geo.utils");

const AVERAGE_BUS_SPEED_KMPH = 30;

exports.getETA = async (req, res) => {
  try {
    const { busId, stopId } = req.query;

    const latestLocation = await Location.findOne({ bus: busId }).sort({
      createdAt: -1,
    });

    if (!latestLocation) {
      return res.status(404).json({ message: "Bus location not available" });
    }

    const route = await Route.findOne({ "stops._id": stopId });
    if (!route) {
      return res.status(404).json({ message: "Stop not found" });
    }

    const stop = route.stops.id(stopId);

    const distanceKm = calculateDistanceKm(
      latestLocation.latitude,
      latestLocation.longitude,
      stop.latitude,
      stop.longitude
    );

    const etaMinutes = Math.ceil((distanceKm / AVERAGE_BUS_SPEED_KMPH) * 60);

    res.json({
      stop: stop.name,
      distanceKm: distanceKm.toFixed(2),
      etaMinutes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
