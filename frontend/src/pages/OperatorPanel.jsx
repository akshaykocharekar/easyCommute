import { useState, useEffect } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import { MapPin, Users, Play, Square } from "lucide-react";

function OperatorPanel() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [occupancy, setOccupancy] = useState("");

  const [tripActive, setTripActive] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("idle");

  const [loadingOccupancy, setLoadingOccupancy] = useState(false);

  // Operator context: assigned bus + route
  const [assignedBus, setAssignedBus] = useState(null);
  const [assignedRoute, setAssignedRoute] = useState(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextError, setContextError] = useState(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await axios.get("/buses/my-bus");
        const bus = res.data.bus;

        setAssignedBus(bus);
        setAssignedRoute(bus?.route || null);
        setContextError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setAssignedBus(null);
          setAssignedRoute(null);
          setContextError("No bus assigned. Ask the admin to assign a bus before starting a trip.");
        } else {
          setContextError("Unable to load your assigned bus details right now.");
        }
      } finally {
        setContextLoading(false);
      }
    };

    fetchContext();
  }, []);

  /* ======================
     AUTO GPS STREAM
  ====================== */

  useEffect(() => {

    if (!tripActive) return;

    const interval = setInterval(() => {

      if (!navigator.geolocation) {
        setGpsStatus("unsupported");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {

          setGpsStatus("sending");

          await axios.post("/location/update", {
            latitude: lat,
            longitude: lng
          });

          setGpsStatus("live");

        } catch {
          setGpsStatus("error");
        }

      });

    }, 5000);

    return () => clearInterval(interval);

  }, [tripActive]);

  /* ======================
     MANUAL LOCATION SEND
  ====================== */

  const sendLocation = async () => {

    try {

      await axios.post("/location/update", {
        latitude,
        longitude
      });

      alert("Location updated");

    } catch (err) {

      alert(err.response?.data?.message || "Failed to update location");

    }

  };

  /* ======================
     OCCUPANCY UPDATE
  ====================== */

  const updateOccupancy = async () => {

    try {

      setLoadingOccupancy(true);

      await axios.post("/buses/update-occupancy", {
        occupancy
      });

      alert("Occupancy updated");

    } catch (err) {

      alert(err.response?.data?.message || "Failed");

    } finally {

      setLoadingOccupancy(false);

    }

  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6">

      {/* HEADER */}

      <h1 className="text-2xl font-semibold text-slate-900">
        Operator Dashboard
      </h1>

      <p className="text-sm text-slate-500">
        Manage live bus tracking and passenger occupancy
      </p>

      {/* TRIP CONTROL */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"
      >

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-semibold text-slate-900">
              Trip Status
            </h2>

            <p className="text-xs text-slate-500">
              {tripActive
                ? "Tracking live location for your assigned bus"
                : "Trip not started"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {contextLoading && "Checking your assigned bus..."}
              {!contextLoading && assignedBus && (
                <>
                  Bus{" "}
                  <span className="font-medium">
                    {assignedBus.busNumber}
                  </span>
                  {assignedRoute && (
                    <>
                      {" "}
                      · Route{" "}
                      <span className="font-medium">
                        {assignedRoute.routeName}
                      </span>
                    </>
                  )}
                </>
              )}
              {!contextLoading && !assignedBus && contextError && (
                <span className="text-rose-500">{contextError}</span>
              )}
            </p>
          </div>

          {tripActive ? (
            <button
              onClick={() => setTripActive(false)}
              className="flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm text-white"
            >
              <Square size={16}/>
              Stop Trip
            </button>
          ) : (
            <button
              onClick={() => {
                if (!assignedBus) {
                  alert(
                    "You don't have a bus assigned yet. Please ask the admin to assign a bus before starting a trip."
                  );
                  return;
                }
                setTripActive(true);
              }}
              disabled={!assignedBus || contextLoading}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              <Play size={16}/>
              Start Trip
            </button>
          )}

        </div>

        {/* GPS STATUS */}

        <div className="mt-4 text-xs text-slate-500">

          GPS Status:

          {gpsStatus === "live" && (
            <span className="ml-2 text-emerald-600 font-medium">
              Live
            </span>
          )}

          {gpsStatus === "sending" && (
            <span className="ml-2 text-yellow-600">
              Updating...
            </span>
          )}

          {gpsStatus === "error" && (
            <span className="ml-2 text-rose-600">
              Connection issue
            </span>
          )}

        </div>

      </motion.div>

      {/* LOCATION CARD */}

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">

        <div className="flex items-center gap-2">
          <MapPin size={18}/>
          <h2 className="text-sm font-semibold">
            Manual Location
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">

          <input
            placeholder="Latitude"
            value={latitude}
            onChange={(e)=>setLatitude(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            placeholder="Longitude"
            value={longitude}
            onChange={(e)=>setLongitude(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />

        </div>

        <button
          onClick={sendLocation}
          className="mt-3 w-full rounded-xl border py-2 text-sm"
        >
          Send Manual Location
        </button>

      </div>

      {/* OCCUPANCY */}

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">

        <div className="flex items-center gap-2">
          <Users size={18}/>
          <h2 className="text-sm font-semibold">
            Passenger Occupancy
          </h2>
        </div>

        <input
          type="number"
          min="0"
          value={occupancy}
          onChange={(e)=>setOccupancy(e.target.value)}
          placeholder="Passenger count"
          className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
        />

        <button
          disabled={loadingOccupancy}
          onClick={updateOccupancy}
          className="mt-3 w-full rounded-xl bg-slate-900 py-2 text-sm text-white"
        >
          {loadingOccupancy ? "Updating..." : "Update Occupancy"}
        </button>

      </div>

    </div>
  );
}

export default OperatorPanel;