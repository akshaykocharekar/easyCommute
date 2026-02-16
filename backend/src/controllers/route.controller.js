const Route = require("../models/Route");

exports.createRoute = async (req, res) => {
  try {
    const { routeName, startPoint, endPoint } = req.body;

    const route = await Route.create({
      routeName,
      startPoint,
      endPoint,
    });

    res.status(201).json({
      message: "Route created successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStopToRoute = async (req, res) => {
  try {
    const { routeId, name, latitude, longitude } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.stops.push({ name, latitude, longitude });
    await route.save();

    res.json({
      message: "Stop added successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
