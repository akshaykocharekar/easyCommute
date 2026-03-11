const Location = require("../models/Location");
const Bus = require("../models/Bus");

/* =========================
   Update Location (Operator)
   ========================= */

exports.updateLocation = async (req, res) => {
  try {
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);

    if (
      isNaN(latitude) || isNaN(longitude) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ message: "Valid latitude and longitude required" });
    }

    const userId = req.user._id;

    const bus = await Bus.findOne({
      operator: userId,
      isApproved: true,
      status: "ACTIVE",
    });

    if (!bus) {
      return res.status(403).json({ message: "No approved active bus assigned" });
    }

    // Read existing location so we can snapshot it as "previous"
    const existing = await Location.findOne({ bus: bus._id });

    const updatePayload = {
      latitude,
      longitude,
      // Carry forward the current position as previous before overwriting
      previousLatitude:  existing ? existing.latitude  : null,
      previousLongitude: existing ? existing.longitude : null,
      previousUpdatedAt: existing ? existing.updatedAt : null,
    };

    const location = await Location.findOneAndUpdate(
      { bus: bus._id },
      updatePayload,
      { new: true, upsert: true }
    );

    const io = req.app.get("io");
    if (io) {
      io.to(bus._id.toString()).emit("locationUpdate", {
        busId: bus._id,
        latitude,
        longitude,
        timestamp: new Date(),
      });
    }

    res.json({ message: "Location updated", location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get Latest Location
   ========================= */

exports.getLatestLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const location = await Location.findOne({ bus: busId });
    if (!location) {
      return res.status(404).json({ message: "No location found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
