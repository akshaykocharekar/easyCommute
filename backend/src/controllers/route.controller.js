const Route = require("../models/Route");

/* CREATE ROUTE */
exports.createRoute = async (req, res) => {
  try {
    const { routeName, startPoint, endPoint } = req.body;

    const route = await Route.create({
      routeName,
      startPoint,
      endPoint,
      stops: []
    });

    res.status(201).json({
      message: "Route created successfully",
      route,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* GET ALL ROUTES */
exports.getAllRoutes = async (req, res) => {
  try {

    const routes = await Route.find();

    res.json(routes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* VALIDATION */
const addStopValidation = (name, latitude, longitude) => {

  if (!name || typeof name !== "string" || !name.trim()) {
    return "Stop name is required";
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    isNaN(lat) ||
    isNaN(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return "Valid latitude (-90 to 90) and longitude (-180 to 180) required";
  }

  return null;
};


/* ADD SINGLE STOP */
exports.addStopToRoute = async (req, res) => {

  try {

    const { routeId, name, latitude, longitude } = req.body;

    const err = addStopValidation(name, latitude, longitude);

    if (err) {
      return res.status(400).json({ message: err });
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const newStop = {
      name: String(name).trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    /* Prevent duplicate stop names */
    const exists = route.stops.find(
      (s) => s.name.toLowerCase() === newStop.name.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        message: "Stop with same name already exists"
      });
    }

    route.stops.push(newStop);

    await route.save();

    res.json({
      message: "Stop added successfully",
      route,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ADD MULTIPLE STOPS (FIXED VERSION) */
exports.addStopsBatch = async (req, res) => {

  try {

    const { routeId, stops } = req.body;

    if (!routeId || !Array.isArray(stops) || stops.length === 0) {
      return res.status(400).json({
        message: "routeId and non-empty stops array required"
      });
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    /* Validate stops */
    for (const s of stops) {

      const err = addStopValidation(s.name, s.latitude, s.longitude);

      if (err) {
        return res.status(400).json({
          message: `Invalid stop: ${err}`
        });
      }

    }

    const validStops = stops.map((s) => ({
      name: String(s.name).trim(),
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
    }));


    /* Remove duplicates by stop name */
    const uniqueStops = [
      ...new Map(validStops.map((s) => [s.name, s])).values()
    ];


    /* 🔥 IMPORTANT FIX
       Replace stops instead of pushing
    */
    route.stops = uniqueStops;

    await route.save();


    res.json({
      message: `${uniqueStops.length} stops saved successfully`,
      route,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* GET ROUTE BY ID */
exports.getRouteById = async (req, res) => {

  try {

    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        message: "Route not found"
      });
    }

    res.json(route);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};