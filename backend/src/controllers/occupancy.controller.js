const Bus = require("../models/Bus");

exports.getOccupancyStatus = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const ratio = bus.currentOccupancy / bus.capacity;

    let status = "LOW";
    if (ratio >= 0.7) status = "HIGH";
    else if (ratio >= 0.4) status = "MEDIUM";

    res.json({
      busId: bus._id,
      currentOccupancy: bus.currentOccupancy,
      capacity: bus.capacity,
      status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
