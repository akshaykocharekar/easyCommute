const Bus = require("../models/Bus");
const User = require("../models/User");

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

exports.approveBus = async (req, res) => {
  try {
    const { busId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.isApproved = true;
    bus.status = "ACTIVE";
    await bus.save();

    res.json({ message: "Bus approved successfully", bus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delistBus = async (req, res) => {
  try {
    const { busId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.status = "INACTIVE";
    await bus.save();

    res.json({ message: "Bus delisted successfully", bus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignOperatorToBus = async (req, res) => {
  try {
    const { busId, operatorId } = req.body;

    // Validate bus
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Validate operator
    const operator = await User.findById(operatorId);
    if (!operator || operator.role !== "BUS_OPERATOR") {
      return res.status(400).json({
        message: "Invalid operator. User must have BUS_OPERATOR role",
      });
    }

    // Assign operator
    bus.operator = operatorId;
    await bus.save();

    res.json({
      message: "Operator assigned to bus successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
