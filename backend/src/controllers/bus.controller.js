const Bus = require("../models/Bus");
const User = require("../models/User");
const Location = require("../models/Location");

/* =========================
   Create Bus - Whitelist fields only
========================= */
exports.createBus = async (req, res) => {
  try {
    const { busNumber, capacity } = req.body;
    if (!busNumber || !capacity) {
      return res.status(400).json({ message: "busNumber and capacity are required" });
    }

    const bus = await Bus.create({
      busNumber: String(busNumber).trim(),
      capacity: parseInt(capacity, 10) || 0,
    });

    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Assign Route to Bus - Route must have stops
========================= */
const Route = require("../models/Route");

exports.assignRouteToBus = async (req, res) => {
  try {
    const { busId, routeId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    if (bus.status !== "INACTIVE") {
      return res.status(400).json({
        message: "Bus must be INACTIVE to assign/change route",
      });
    }
    if (bus.operator) {
      return res.status(400).json({
        message: "Unassign operator before assigning/changing route",
      });
    }

    const route = await Route.findById(routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });

    if (!route.stops || route.stops.length === 0) {
      return res.status(400).json({
        message: "Route must have at least one stop before assignment. Add stops first.",
      });
    }

    bus.route = routeId;
    await bus.save();

    const populatedBus = await Bus.findById(busId).populate("route").populate("operator", "name email");

    res.json({
      message: "Route assigned successfully",
      bus: populatedBus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Approve Bus
========================= */
exports.approveBus = async (req, res) => {
  try {
    const { busId } = req.body;

    const bus = await Bus.findById(busId).populate("route");
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    if (bus.status === "ACTIVE") {
      return res.status(400).json({ message: "Bus is already ACTIVE" });
    }

    if (!bus.route) {
      return res
        .status(400)
        .json({ message: "Assign a route before activating the bus" });
    }
    if (!bus.route.stops || bus.route.stops.length === 0) {
      return res.status(400).json({
        message: "Route must have at least one stop before activation",
      });
    }
    if (!bus.operator) {
      return res.status(400).json({
        message: "Assign an operator before activating the bus",
      });
    }

    const operator = await User.findById(bus.operator).select(
      "role operatorVerificationStatus"
    );
    if (!operator || operator.role !== "BUS_OPERATOR") {
      return res.status(400).json({ message: "Assigned operator is invalid" });
    }
    if (operator.operatorVerificationStatus !== "VERIFIED") {
      return res.status(400).json({
        message: "Operator must be verified before activating the bus",
      });
    }

    bus.isApproved = true;
    bus.status = "ACTIVE";
    await bus.save();

    res.json({
      message: "Bus activated successfully",
      bus: await Bus.findById(busId)
        .populate("route")
        .populate("operator", "name email phone operatorVerificationStatus"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Delist Bus
========================= */
exports.delistBus = async (req, res) => {
  try {
    const { busId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.status = "INACTIVE";
    await bus.save();

    res.json({
      message: "Bus delisted successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Assign Operator to Bus
========================= */
exports.assignOperatorToBus = async (req, res) => {
  try {
    const { busId, operatorId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (bus.status !== "INACTIVE") {
      return res.status(400).json({
        message: "Bus must be INACTIVE to assign an operator",
      });
    }

    if (!bus.route) {
      return res.status(400).json({
        message: "Assign a route (with stops) before assigning an operator",
      });
    }

    if (bus.operator) {
      return res.status(409).json({
        message: "This bus already has an operator assigned. Unassign first.",
      });
    }

    const operator = await User.findById(operatorId);
    if (!operator || operator.role !== "BUS_OPERATOR") {
      return res.status(400).json({
        message: "User must have BUS_OPERATOR role",
      });
    }
    if (operator.operatorVerificationStatus !== "VERIFIED") {
      return res.status(400).json({
        message: "Operator must be verified before assignment",
      });
    }

    const route = await Route.findById(bus.route);
    if (!route) {
      return res.status(400).json({
        message: "Bus has an invalid route reference. Re-assign route.",
      });
    }
    if (!route.stops || route.stops.length === 0) {
      return res.status(400).json({
        message: "Route must have at least one stop before operator assignment",
      });
    }

    const alreadyAssigned = await Bus.findOne({
      operator: operatorId,
      _id: { $ne: busId },
    });
    if (alreadyAssigned) {
      return res.status(409).json({
        message: "Operator is already assigned to another bus. Unassign first.",
      });
    }

    bus.operator = operatorId;
    await bus.save();

    res.json({
      message: "Operator assigned successfully",
      bus: await Bus.findById(busId)
        .populate("route")
        .populate("operator", "name email phone operatorVerificationStatus"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Unassign Operator (Admin)
========================= */
/* =========================
   Unassign Operator (Admin)
   Replace the existing exports.unassignOperatorFromBus with this
========================= */
exports.unassignOperatorFromBus = async (req, res) => {
  try {
    const { busId } = req.body;

    if (!busId) {
      return res.status(400).json({ message: "busId is required" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    if (bus.status !== "INACTIVE") {
      return res.status(400).json({
        message: "Deactivate the bus before removing its operator",
      });
    }

    // Use findOneAndUpdate with $unset so Mongoose never touches the unique
    // sparse index with a null write — it simply removes the field entirely,
    // which is treated as "absent" by the sparse index (no conflict).
    const updated = await Bus.findByIdAndUpdate(
      busId,
      { $unset: { operator: "" } },
      { new: true }
    )
      .populate("route")
      .populate("operator", "name email");

    res.json({ message: "Operator unassigned successfully", bus: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Unassign Route (Admin)
========================= */
exports.unassignRouteFromBus = async (req, res) => {
  try {
    const { busId } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    if (bus.status !== "INACTIVE") {
      return res.status(400).json({
        message: "Bus must be INACTIVE to unassign route",
      });
    }
    if (bus.operator) {
      return res.status(400).json({
        message: "Unassign operator before unassigning route",
      });
    }

    if (!bus.route) {
      return res.json({ message: "No route to unassign", bus });
    }

    bus.route = null;
    await bus.save();

    const populatedBus = await Bus.findById(busId)
      .populate("route")
      .populate("operator", "name email");

    res.json({ message: "Route unassigned successfully", bus: populatedBus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Update Occupancy
========================= */
exports.updateOccupancy = async (req, res) => {
  try {
    const { occupancy } = req.body;
    const operatorId = req.user._id;

    const bus = await Bus.findOne({
      operator: operatorId,
      isApproved: true,
      status: "ACTIVE",
    });

    if (!bus) {
      return res.status(403).json({
        message: "No approved active bus assigned",
      });
    }

    if (occupancy < 0 || occupancy > bus.capacity) {
      return res.status(400).json({
        message: "Invalid occupancy value",
      });
    }

    bus.currentOccupancy = occupancy;
    await bus.save();

    res.json({
      message: "Occupancy updated successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get All Buses (Admin)
========================= */
/* =========================
   Get All Buses (Admin)
   Replace the existing exports.getBuses with this
========================= */
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate("route")
      .populate("operator", "name email phone operatorVerificationStatus");
    //                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Must include operatorVerificationStatus so the frontend can check
    // whether the operator is verified before enabling the Activate button.

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get Assigned Bus (Operator)
   - Returns the bus (with route) assigned to the logged-in operator
========================= */
exports.getMyBus = async (req, res) => {
  try {
    const operatorId = req.user._id;

    const bus = await Bus.findOne({ operator: operatorId })
      .populate("route")
      .populate("operator", "name email");

    if (!bus) {
      return res.status(404).json({
        message: "No bus assigned to this operator. Ask admin to assign a bus.",
      });
    }

    // Optionally attach latest location for convenience
    const location = await Location.findOne({ bus: bus._id });

    res.json({
      bus,
      location,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
