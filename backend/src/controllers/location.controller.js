const Location = require("../models/Location");
const Bus = require("../models/Bus");

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;

    const bus = await Bus.findOne({ operator: userId, isApproved: true });
    if (!bus)
      return res.status(403).json({ message: "No approved bus assigned" });

    const location = await Location.create({
      bus: bus._id,
      latitude,
      longitude,
    });

    res.json({ message: "Location updated", location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestLocation = async (req, res) => {
  try {
    const { busId } = req.params;

    const location = await Location.findOne({ bus: busId }).sort({
      createdAt: -1,
    });

    if (!location)
      return res.status(404).json({ message: "No location found" });

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;

    const bus = await Bus.findOne({
      operator: userId,
      isApproved: true,
      status: "ACTIVE",
    });

    if (!bus) {
      return res.status(403).json({ message: "No approved bus assigned" });
    }

    const location = await Location.create({
      bus: bus._id,
      latitude,
      longitude,
    });

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    io.to(bus._id.toString()).emit("locationUpdate", {
      busId: bus._id,
      latitude,
      longitude,
      timestamp: location.createdAt,
    });

    res.json({ message: "Location updated", location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
