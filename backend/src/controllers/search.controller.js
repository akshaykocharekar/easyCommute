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

    const routes = await Route.find({
      stops: {
        $all: [
          { $elemMatch: { name: { $regex: source, $options: "i" } } },
          { $elemMatch: { name: { $regex: destination, $options: "i" } } }
        ]
      }
    });

    if (routes.length === 0) {
      return res.json([]);
    }

    const routeIds = routes.map(r => r._id);

    const buses = await Bus.find({
      route: { $in: routeIds },
      status: "ACTIVE",
      isApproved: true
    });

    res.json(buses);

  } catch (error) {

    console.error("Search error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};