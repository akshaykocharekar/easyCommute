import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import { MapPin, Users, Play, Square } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

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

  const { user } = useContext(AuthContext);

  // Support request form + history
  const [supportCategory, setSupportCategory] = useState("OTHER");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportBusy, setSupportBusy] = useState(false);
  const [supportRequests, setSupportRequests] = useState([]);
  const [supportLoading, setSupportLoading] = useState(true);

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

  useEffect(() => {
    const loadMyRequests = async () => {
      try {
        const res = await axios.get("/support/mine");
        setSupportRequests(res.data);
      } catch {
        setSupportRequests([]);
      } finally {
        setSupportLoading(false);
      }
    };
    loadMyRequests();
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

      toast.success("Location updated");

    } catch (err) {

      toast.error(err.response?.data?.message || "Failed to update location");

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

      toast.success("Occupancy updated");

    } catch (err) {

      toast.error(err.response?.data?.message || "Failed");

    } finally {

      setLoadingOccupancy(false);

    }

  };

  const submitSupportRequest = async (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error("Please enter subject and message");
      return;
    }

    try {
      setSupportBusy(true);
      await axios.post("/support", {
        category: supportCategory,
        subject: supportSubject,
        message: supportMessage,
      });
      toast.success("Request sent to admin");
      setSupportSubject("");
      setSupportMessage("");

      const res = await axios.get("/support/mine");
      setSupportRequests(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSupportBusy(false);
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

      {user?.operatorVerificationStatus && user.operatorVerificationStatus !== "VERIFIED" && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">Verification pending</div>
          <div className="mt-1 text-amber-800">
            Your account must be verified by admin before you can be assigned to a bus and go live.
          </div>
        </div>
      )}

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
                  toast.error("No bus assigned yet. Ask admin to assign a bus.");
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

      {/* CONTACT ADMIN */}
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Contact Admin</h2>
        <p className="mt-1 text-xs text-slate-500">
          Request route changes, bus detail updates, or report issues.
        </p>

        <form onSubmit={submitSupportRequest} className="mt-4 space-y-3">
          <select
            value={supportCategory}
            onChange={(e) => setSupportCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="ROUTE_CHANGE">Route change</option>
            <option value="BUS_DETAIL_CHANGE">Bus detail change</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            value={supportSubject}
            onChange={(e) => setSupportSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <textarea
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Message"
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={supportBusy}
            className="w-full rounded-xl bg-emerald-600 py-2 text-sm text-white disabled:opacity-60"
          >
            {supportBusy ? "Sending..." : "Send request"}
          </button>
        </form>

        <div className="mt-5">
          <div className="text-xs font-medium text-slate-500">My requests</div>
          {supportLoading ? (
            <div className="mt-2 text-sm text-slate-500">Loading…</div>
          ) : supportRequests.length === 0 ? (
            <div className="mt-2 text-sm text-slate-500">No requests yet.</div>
          ) : (
            <div className="mt-2 space-y-2">
              {supportRequests.slice(0, 5).map((r) => (
                <div key={r._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {r.subject}
                    </div>
                    <div className="text-[10px] font-medium text-slate-600">
                      {r.status}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-600 line-clamp-2">
                    {r.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default OperatorPanel;