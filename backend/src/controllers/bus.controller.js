const Bus = require("../models/Bus");

exports.createBus = async (req, res) => {
  try {
    const { busNumber, capacity } = req.body;

    const bus = await Bus.create({
      busNumber,
      capacity,
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignRouteToBus = async (req, res) => {
  try {
    const { busId, routeId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.route = routeId;
    await bus.save();

    res.json({
      message: "Route assigned to bus successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
