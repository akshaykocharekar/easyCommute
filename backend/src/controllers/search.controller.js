const Route = require("../models/Route");
const Bus = require("../models/Bus");

exports.searchRoutes = async (req, res) => {
  try {

    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        message: "Source and destination required"
      });
    }

    const sourceEscaped = String(source).trim();
    const destinationEscaped = String(destination).trim();

    // Primary match: route endpoints (supports bidirectional routes)
    const endpointMatch = {
      $or: [
        {
          startPoint: { $regex: `^${sourceEscaped}$`, $options: "i" },
          endPoint: { $regex: `^${destinationEscaped}$`, $options: "i" },
        },
        {
          bidirectional: true,
          startPoint: { $regex: `^${destinationEscaped}$`, $options: "i" },
          endPoint: { $regex: `^${sourceEscaped}$`, $options: "i" },
        },
      ],
    };

    // Fallback match: stops contain both terms (keeps existing behavior working)
    const stopsMatch = {
      stops: {
        $all: [
          { $elemMatch: { name: { $regex: sourceEscaped, $options: "i" } } },
          { $elemMatch: { name: { $regex: destinationEscaped, $options: "i" } } },
        ],
      },
    };

    const routes = await Route.find({ $or: [endpointMatch, stopsMatch] });

    if (routes.length === 0) {
      return res.json([]);
    }

    const routeIds = routes.map(r => r._id);

    const buses = await Bus.find({
      route: { $in: routeIds },
      status: "ACTIVE",
      isApproved: true
    }).populate("route");

    res.json(buses);

  } catch (error) {

    console.error("Search error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};