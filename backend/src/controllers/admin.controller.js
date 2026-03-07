const Bus = require("../models/Bus");
const Route = require("../models/Route");
const User = require("../models/User");

exports.getAdminStats = async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const activeRoutes = await Route.countDocuments({
      "stops.0": { $exists: true },
    });
    const totalOperators = await User.countDocuments({ role: "BUS_OPERATOR" });
    const totalUsers = await User.countDocuments({ role: "USER" });
    const totalSubscribers = await User.countDocuments({
      subscriptionPlan: "PREMIUM",
      subscriptionStatus: "ACTIVE",
    });
    const revenue = totalSubscribers * 500; // ₹500 per premium subscriber

    res.json({
      totalBuses,
      totalRoutes,
      activeRoutes,
      totalOperators,
      totalUsers,
      totalSubscribers,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.getUsers = async (req, res) => {
  try {

    const users = await User.find({ role: "USER" });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.grantPremium = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        subscriptionPlan: "PREMIUM",
        subscriptionStatus: "ACTIVE",
      },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOperators = async (req, res) => {
  try {

    const operators = await User.find({ role: "BUS_OPERATOR" });

    res.json(operators);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Integrity Report (Admin)
========================= */
exports.getIntegrityReport = async (req, res) => {
  try {
    // Operators assigned to multiple buses
    const multiAssignedOperators = await Bus.aggregate([
      { $match: { operator: { $ne: null } } },
      {
        $group: {
          _id: "$operator",
          busIds: { $push: "$_id" },
          busNumbers: { $push: "$busNumber" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    const operatorIds = multiAssignedOperators.map((x) => x._id);
    const operatorDocs = await User.find({ _id: { $in: operatorIds } }).select(
      "name email role"
    );
    const operatorById = new Map(
      operatorDocs.map((o) => [o._id.toString(), o])
    );

    const operatorAssignedToMultipleBuses = multiAssignedOperators.map((x) => ({
      operator: operatorById.get(x._id.toString()) || { _id: x._id },
      count: x.count,
      buses: x.busIds.map((id, idx) => ({
        _id: id,
        busNumber: x.busNumbers[idx],
      })),
    }));

    // Active buses missing required configuration
    const activeBusesMissingConfig = await Bus.find({
      status: "ACTIVE",
      $or: [{ route: null }, { operator: null }],
    })
      .populate("route")
      .populate("operator", "name email");

    // Buses whose assigned route has no stops
    const referencedRouteIds = await Bus.distinct("route", { route: { $ne: null } });
    const routesWithNoStops = await Route.find({
      _id: { $in: referencedRouteIds },
      "stops.0": { $exists: false },
    }).select("_id routeName startPoint endPoint");

    const badRouteIds = routesWithNoStops.map((r) => r._id);
    const busesWithRouteMissingStops = await Bus.find({
      route: { $in: badRouteIds },
    })
      .populate("route")
      .populate("operator", "name email");

    res.json({
      operatorAssignedToMultipleBuses,
      activeBusesMissingConfig,
      busesWithRouteMissingStops,
      counts: {
        operatorAssignedToMultipleBuses: operatorAssignedToMultipleBuses.length,
        activeBusesMissingConfig: activeBusesMissingConfig.length,
        busesWithRouteMissingStops: busesWithRouteMissingStops.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};