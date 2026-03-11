import { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import axios from "../api/axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

/* FIX LEAFLET ICON BUG */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const busIcon = new L.Icon({
  iconUrl:     "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize:    [42, 42],
  iconAnchor:  [21, 42],
  popupAnchor: [0, -36]
});

const nextStopIcon = new L.Icon({
  iconUrl:    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize:   [30, 30],
  iconAnchor: [15, 30]
});

/* AUTO FOLLOW CAMERA */
function FollowBus({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.panTo([location.latitude, location.longitude], { animate: true });
  }, [location, map]);
  return null;
}

/* Direction badge */
function DirectionBadge({ direction }) {
  if (!direction || direction === "unknown") return null;
  const isReturn = direction === "reverse";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
        ${isReturn
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700"
        }`}
    >
      {isReturn ? "↩ Return Journey" : "→ Outbound Journey"}
    </span>
  );
}

function TrackBus() {
  const { user } = useContext(AuthContext);
  const isPremium =
    user?.subscriptionPlan === "PREMIUM" && user?.subscriptionStatus === "ACTIVE";

  const { busId } = useParams();

  const [location, setLocation]           = useState(null);
  const [smoothLocation, setSmoothLocation] = useState(null);
  const [route, setRoute]                 = useState(null);
  const [etaData, setEtaData]             = useState(null);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [mapReady, setMapReady]           = useState(false);

  const animationRef = useRef(null);

  /* RESET WHEN BUS CHANGES */
  useEffect(() => {
    setLocation(null);
    setSmoothLocation(null);
    setRoute(null);
    setEtaData(null);
    setPremiumRequired(false);
    setMapReady(false);
  }, [busId]);

  /* SOCKET */
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const socket = io(socketUrl, { transports: ["websocket"] });

    socket.emit("joinBus", busId);
    socket.on("locationUpdate", (data) => {
      if (String(data.busId) === String(busId)) {
        const newLocation = { latitude: data.latitude, longitude: data.longitude };
        setLocation(newLocation);
        if (!smoothLocation) setSmoothLocation(newLocation);
        else animateMovement(newLocation);
      }
    });

    return () => socket.disconnect();
  }, [busId, smoothLocation]);

  /* INITIAL LOAD */
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`/track/${busId}`);
        const { location: loc, route: busRoute } = res.data;
        setRoute(busRoute);
        if (!loc) return;
        setLocation(loc);
        if (!smoothLocation) setSmoothLocation(loc);
        else animateMovement(loc);
      } catch (err) {
        if (err.response?.status === 403) setPremiumRequired(true);
      }
    };

    const fetchETA = async () => {
      try {
        const res = await axios.get(`/eta/${busId}`);
        setEtaData(res.data);
      } catch {}
    };

    fetchLocation();
    fetchETA();

    const interval = setInterval(fetchETA, 15000);
    return () => clearInterval(interval);
  }, [busId]);

  /* SMOOTH MOVEMENT */
  const animateMovement = (target) => {
    cancelAnimationFrame(animationRef.current);
    const animate = () => {
      setSmoothLocation(prev => {
        if (!prev) return target;
        const latDiff = target.latitude  - prev.latitude;
        const lngDiff = target.longitude - prev.longitude;
        if (Math.sqrt(latDiff ** 2 + lngDiff ** 2) < 0.00001) {
          cancelAnimationFrame(animationRef.current);
          return target;
        }
        return {
          latitude:  prev.latitude  + latDiff * 0.15,
          longitude: prev.longitude + lngDiff * 0.15,
        };
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  // Use direction-aware stop order from eta response if available,
  // otherwise fall back to raw route stops
  const etaStops        = etaData?.eta || [];
  const direction       = etaData?.direction;
  const meta            = etaData?.meta;

  // Build polyline from etaStops order (reflects actual travel direction)
  const stopCoordinates =
    etaStops.length > 0
      ? etaStops.map(s => {
          // Match back to route stop coordinates by name
          const match = route?.stops?.find(rs => rs.name === s.stopName);
          return match ? [match.latitude, match.longitude] : null;
        }).filter(Boolean)
      : route?.stops?.map(s => [s.latitude, s.longitude]) || [];

  // First upcoming (non-passed) stop
  const nextEtaStop = etaStops.find(s => !s.passed);
  const nextStopCoords = nextEtaStop
    ? route?.stops?.find(rs => rs.name === nextEtaStop.stopName)
    : null;

  const hasRouteGeometry = stopCoordinates.length > 0;

  if (premiumRequired) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">Premium Required</h2>
        <p className="mt-2 text-slate-600">Live tracking is available for premium users.</p>
        {!isPremium && (
          <Link to="/plans">
            <button className="mt-4 rounded-full bg-emerald-500 px-6 py-2 text-white">
              View Plans
            </button>
          </Link>
        )}
      </div>
    );
  }

  const mapCenter = smoothLocation
    ? [smoothLocation.latitude, smoothLocation.longitude]
    : hasRouteGeometry
    ? stopCoordinates[0]
    : [18.5204, 73.8567];

  return (
    <div className="flex h-[calc(100vh-70px)] flex-col md:flex-row">

      {/* MAP */}
      <div className="relative flex-1 min-h-[300px] md:min-h-full">
        {!mapReady && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white pointer-events-none">
            <div className="relative w-56 h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="absolute -top-4 left-0 animate-[drive_2s_linear_infinite] text-xl">🚌</div>
            </div>
            <p className="text-sm text-slate-500 animate-pulse">Loading live bus map...</p>
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          whenReady={() => setMapReady(true)}
        >
          {smoothLocation && <FollowBus location={smoothLocation} />}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {smoothLocation && (
            <Marker position={[smoothLocation.latitude, smoothLocation.longitude]} icon={busIcon}>
              <Popup>Live Bus Location</Popup>
            </Marker>
          )}

          {hasRouteGeometry && (
            <Polyline
              positions={stopCoordinates}
              pathOptions={{ color: "#10b981", weight: 5, dashArray: "10 10" }}
            />
          )}

          {nextStopCoords && (
            <Marker position={[nextStopCoords.latitude, nextStopCoords.longitude]} icon={nextStopIcon}>
              <Popup>Next Stop: {nextEtaStop.stopName}</Popup>
            </Marker>
          )}

          {route?.stops?.map((stop, i) => (
            <Marker key={i} position={[stop.latitude, stop.longitude]}>
              <Popup>{stop.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ETA PANEL */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-[380px] border-l border-slate-200 bg-white p-6 overflow-y-auto"
      >
        {etaData && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Bus</p>
                <h3 className="text-lg font-semibold">{etaData.busNumber}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Next Arrival</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {nextEtaStop ? `${nextEtaStop.etaMinutes} min` : "--"}
                </p>
              </div>
            </div>

            {/* Direction + speed meta */}
            <div className="mt-3 flex items-center justify-between">
              <DirectionBadge direction={direction} />
              {meta?.speedKmh != null && (
                <span className="text-xs text-slate-400">
                  ~{meta.speedKmh} km/h
                </span>
              )}
            </div>

            {/* Stop list */}
            <div className="mt-5 space-y-2">
              {etaStops.map((stop, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 transition
                    ${stop.passed
                      ? "bg-slate-50 opacity-40"          // greyed out — already passed
                      : i === etaStops.indexOf(nextEtaStop)
                      ? "bg-emerald-50 ring-1 ring-emerald-200" // next stop highlight
                      : "bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {stop.passed ? (
                      <span className="text-slate-300 text-xs">✓</span>
                    ) : i === etaStops.indexOf(nextEtaStop) ? (
                      <span className="text-emerald-500 text-xs">●</span>
                    ) : (
                      <span className="text-slate-300 text-xs">○</span>
                    )}
                    <span className={`text-sm ${stop.passed ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {stop.stopName}
                    </span>
                  </div>

                  <span className={`text-sm font-medium ${stop.passed ? "text-slate-300" : "text-slate-700"}`}>
                    {stop.passed ? "Passed" : `${stop.etaMinutes} min`}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {!etaData && (
          <p className="text-sm text-slate-400 text-center mt-10">
            Loading ETA...
          </p>
        )}
      </motion.div>

    </div>
  );
}

export default TrackBus;