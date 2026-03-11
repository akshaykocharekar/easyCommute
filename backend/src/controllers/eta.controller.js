const Bus = require("../models/Bus");
const Location = require("../models/Location");

// ---------------------------------------------------------------------------
// Haversine distance in kilometres between two lat/lng points
// ---------------------------------------------------------------------------
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Project a point onto a line segment [a, b] in lat/lng space.
// Returns { latitude, longitude, t } where t ∈ [0,1] along the segment.
// ---------------------------------------------------------------------------
function projectPointOnSegment(point, a, b) {
  const px = point.latitude,  py = point.longitude;
  const ax = a.latitude,      ay = a.longitude;
  const bx = b.latitude,      by = b.longitude;
  const vx = bx - ax, vy = by - ay;
  const wx = px - ax, wy = py - ay;
  const len2 = vx * vx + vy * vy;
  if (len2 === 0) return { latitude: ax, longitude: ay, t: 0 };
  const t = Math.min(1, Math.max(0, (wx * vx + wy * vy) / len2));
  return { latitude: ax + t * vx, longitude: ay + t * vy, t };
}

// ---------------------------------------------------------------------------
// Derive real-time speed (km/h) from the two most recent location pings.
// Falls back to `fallbackKmh` when data is insufficient or stale.
// ---------------------------------------------------------------------------
const FALLBACK_SPEED_KMH = 30;
const MAX_SPEED_KMH      = 80;  // cap to reject GPS noise spikes
const MAX_PING_AGE_MS    = 5 * 60 * 1000; // 5 minutes – older = stale

function deriveSpeedKmh(location) {
  const {
    latitude, longitude,
    previousLatitude, previousLongitude, previousUpdatedAt,
    updatedAt,
  } = location;

  // Need a valid previous fix
  if (
    previousLatitude  == null ||
    previousLongitude == null ||
    previousUpdatedAt == null
  ) {
    return FALLBACK_SPEED_KMH;
  }

  const elapsedMs = new Date(updatedAt) - new Date(previousUpdatedAt);

  // Reject stale or zero-interval pings
  if (elapsedMs <= 0 || elapsedMs > MAX_PING_AGE_MS) {
    return FALLBACK_SPEED_KMH;
  }

  const distKm = haversineKm(
    previousLatitude, previousLongitude,
    latitude, longitude
  );

  const elapsedHours = elapsedMs / 3_600_000;
  const speedKmh     = distKm / elapsedHours;

  // Clamp: ignore sub-1 km/h (bus parked) and GPS noise spikes
  if (speedKmh < 1 || speedKmh > MAX_SPEED_KMH) {
    return FALLBACK_SPEED_KMH;
  }

  return speedKmh;
}

// ---------------------------------------------------------------------------
// Detect which direction the bus is currently travelling along a route.
//
// Strategy: compare the movement vector (prev→current position) against the
// route's forward vector (first stop → last stop).  A positive dot-product
// means forward; negative means reverse (return journey).
//
// Returns "forward" | "reverse" | "unknown"
// ---------------------------------------------------------------------------
function detectDirection(location, stops) {
  const {
    latitude, longitude,
    previousLatitude, previousLongitude,
  } = location;

  if (previousLatitude == null || stops.length < 2) return "unknown";

  // Movement vector
  const moveLat = latitude - previousLatitude;
  const moveLng = longitude - previousLongitude;

  // Route forward vector (first → last stop)
  const routeLat = stops[stops.length - 1].latitude - stops[0].latitude;
  const routeLng = stops[stops.length - 1].longitude - stops[0].longitude;

  const dot = moveLat * routeLat + moveLng * routeLng;

  if (dot === 0) return "unknown";
  return dot > 0 ? "forward" : "reverse";
}

// ---------------------------------------------------------------------------
// Find where the bus sits along an ordered stop array.
// Returns { segmentIndex, distanceFromStartKm, offRouteMeters }
// ---------------------------------------------------------------------------
function locateBusOnRoute(busPoint, stops) {
  const cumulative = [0];
  for (let i = 1; i < stops.length; i++) {
    cumulative[i] =
      cumulative[i - 1] +
      haversineKm(
        stops[i - 1].latitude, stops[i - 1].longitude,
        stops[i].latitude,     stops[i].longitude
      );
  }

  let best = {
    segmentIndex: 0,
    distanceFromStartKm: 0,
    offRouteMeters: Infinity,
  };

  for (let i = 0; i < stops.length - 1; i++) {
    const proj = projectPointOnSegment(busPoint, stops[i], stops[i + 1]);
    const offKm = haversineKm(
      busPoint.latitude, busPoint.longitude,
      proj.latitude, proj.longitude
    );
    const alongKm =
      cumulative[i] +
      haversineKm(
        stops[i].latitude, stops[i].longitude,
        proj.latitude,     proj.longitude
      );

    if (offKm * 1000 < best.offRouteMeters) {
      best = {
        segmentIndex: i,
        distanceFromStartKm: alongKm,
        offRouteMeters: offKm * 1000,
      };
    }
  }

  return { ...best, cumulativeDistances: cumulative };
}

// ---------------------------------------------------------------------------
// Main ETA endpoint
// ---------------------------------------------------------------------------
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

    const forwardStops = bus.route.stops || [];
    if (forwardStops.length === 0) {
      return res.json({
        busNumber: bus.busNumber,
        eta: [],
        message: "Route has no stops",
      });
    }

    // ------------------------------------------------------------------
    // 1. Derive real speed from GPS delta
    // ------------------------------------------------------------------
    const speedKmh = deriveSpeedKmh(location);

    // ------------------------------------------------------------------
    // 2. Detect travel direction and choose the correct stop ordering
    // ------------------------------------------------------------------
    const isBidirectional = bus.route.bidirectional !== false; // default true
    const direction = isBidirectional
      ? detectDirection(location, forwardStops)
      : "forward";

    // On a return journey, the bus visits stops in reverse order
    const orderedStops =
      direction === "reverse"
        ? [...forwardStops].reverse()
        : forwardStops;

    // ------------------------------------------------------------------
    // 3. Locate the bus on the (direction-aware) stop sequence
    // ------------------------------------------------------------------
    const busPoint = { latitude: location.latitude, longitude: location.longitude };
    const { distanceFromStartKm, offRouteMeters, cumulativeDistances } =
      locateBusOnRoute(busPoint, orderedStops);

    // ------------------------------------------------------------------
    // 4. Build per-stop ETA — only for stops ahead of the bus
    // ------------------------------------------------------------------
    const etaStops = orderedStops.map((stop, idx) => {
      const stopDistKm  = cumulativeDistances[idx];
      const remainingKm = Math.max(0, stopDistKm - distanceFromStartKm);
      const passed      = stopDistKm < distanceFromStartKm - 0.05; // 50 m buffer

      const timeMinutes = passed
        ? 0
        : Math.round((remainingKm / speedKmh) * 60);

      return {
        stopName:    stop.name,
        etaMinutes:  timeMinutes,
        distanceKm:  Number(remainingKm.toFixed(2)),
        passed,
      };
    });

    res.json({
      busNumber: bus.busNumber,
      direction,                    // "forward" | "reverse" | "unknown"
      eta: etaStops,
      meta: {
        speedKmh:        Math.round(speedKmh),
        offRouteMeters:  Math.round(offRouteMeters),
        isBidirectional,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
