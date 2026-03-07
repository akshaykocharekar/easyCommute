const Bus = require("../models/Bus");
const Location = require("../models/Location");

// Great-circle distance in kilometers (Haversine)
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Approximate projection of a point onto a segment in lat/lng space.
// Good enough for short segments in a city-scale network.
function projectPointOnSegment(point, a, b) {
  const px = point.latitude;
  const py = point.longitude;
  const ax = a.latitude;
  const ay = a.longitude;
  const bx = b.latitude;
  const by = b.longitude;

  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;

  const len2 = vx * vx + vy * vy;
  if (len2 === 0) {
    // a and b are the same point
    return { latitude: ax, longitude: ay, t: 0 };
  }

  let t = (wx * vx + wy * vy) / len2;
  // Clamp to segment
  if (t < 0) t = 0;
  if (t > 1) t = 1;

  return {
    latitude: ax + t * vx,
    longitude: ay + t * vy,
    t,
  };
}

exports.getETA = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId).populate("route");

    if (!bus || !bus.route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const location = await Location.findOne({ bus: busId });

    if (!location) {
      return res.json({
        busNumber: bus.busNumber,
        eta: [],
        message: "Location not available yet",
      });
    }

    const stops = bus.route.stops || [];
    if (stops.length === 0) {
      return res.json({
        busNumber: bus.busNumber,
        eta: [],
        message: "Route has no stops",
      });
    }

    // Build along-route distance profile (polyline through stops in order)
    const cumulativeDistances = [0]; // km, distance from first stop
    for (let i = 1; i < stops.length; i++) {
      const prev = stops[i - 1];
      const curr = stops[i];
      const segmentKm = haversineKm(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
      cumulativeDistances[i] = cumulativeDistances[i - 1] + segmentKm;
    }

    // Find the closest point on the route polyline to the bus location
    const busPoint = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    let best = {
      segmentIndex: 0,
      distanceFromRouteStartKm: 0,
      distanceFromRouteMeters: Number.POSITIVE_INFINITY,
    };

    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      const proj = projectPointOnSegment(busPoint, a, b);

      const distToProjKm = haversineKm(
        busPoint.latitude,
        busPoint.longitude,
        proj.latitude,
        proj.longitude
      );

      const distAlongSegmentKm = haversineKm(
        a.latitude,
        a.longitude,
        proj.latitude,
        proj.longitude
      );

      const distFromRouteStartKm =
        cumulativeDistances[i] + distAlongSegmentKm;

      if (distToProjKm * 1000 < best.distanceFromRouteMeters) {
        best = {
          segmentIndex: i,
          distanceFromRouteStartKm: distFromRouteStartKm,
          distanceFromRouteMeters: distToProjKm * 1000,
        };
      }
    }

    const averageSpeed =
      bus.route.averageSpeedKmh && bus.route.averageSpeedKmh > 0
        ? bus.route.averageSpeedKmh
        : 30; // km/h

    // Compute ETA only for stops that are ahead of the bus along the route
    const etaStops = stops.map((stop, idx) => {
      const stopDistanceFromStartKm = cumulativeDistances[idx];
      let remainingKm = stopDistanceFromStartKm - best.distanceFromRouteStartKm;

      // If negative, this stop is behind the bus – treat as 0 or mark as passed.
      if (remainingKm < 0) {
        remainingKm = 0;
      }

      const timeHours = remainingKm / averageSpeed;
      const timeMinutes = Math.round(timeHours * 60);

      return {
        stopName: stop.name,
        etaMinutes: timeMinutes,
        distanceKm: Number(remainingKm.toFixed(2)),
      };
    });

    res.json({
      busNumber: bus.busNumber,
      eta: etaStops,
      meta: {
        averageSpeedKmh: averageSpeed,
        distanceFromRouteMeters: Math.round(best.distanceFromRouteMeters),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};