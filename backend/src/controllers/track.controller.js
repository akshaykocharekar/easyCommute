const Bus = require("../models/Bus");
const Location = require("../models/Location");

exports.getBusTrackingData = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId).populate("route");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const location = await Location.findOne({ bus: busId });

    res.json({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      currentOccupancy: bus.currentOccupancy,
      route: bus.route,
      location: location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            updatedAt: location.updatedAt
          }
        : null
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};