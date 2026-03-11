import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import toast from "react-hot-toast";

function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [busyBusId, setBusyBusId] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get("/buses");
      setBuses(res.data);
    } catch (err) {
      toast.error("Failed to load buses");
    }
  };

  const getSetupStage = (bus) => {
    if (bus.status === "ACTIVE") return "Active";
    if (!bus.route) return "Draft";
    if (bus.route && !bus.operator) return "Route Assigned";
    if (bus.route && bus.operator) return "Operator Assigned";
    return "Unknown";
  };

  const approveBus = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/approve", { busId });
      toast.success("Bus activated");
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to activate bus");
    } finally {
      setBusyBusId(null);
    }
  };

  const deactivateBus = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/delist", { busId });
      toast.success("Bus deactivated");
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate bus");
    } finally {
      setBusyBusId(null);
    }
  };

  const unassignOperator = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/unassign-operator", { busId });
      toast.success("Operator removed");
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove operator");
    } finally {
      setBusyBusId(null);
    }
  };

  const unassignRoute = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/unassign-route", { busId });
      toast.success("Route removed");
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove route");
    } finally {
      setBusyBusId(null);
    }
  };

  return (
    <PageShell
      title="Bus Management"
      subtitle="Setup workflow: Route → Operator → Activate"
      actions={
        <>
          <Link to="/admin/create-bus">
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
              Create Bus
            </button>
          </Link>
          <Link to="/admin/assign-route">
            <button className="rounded-full border px-4 py-2 text-sm">
              Assign Route
            </button>
          </Link>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {buses.map((bus) => {
          const stage = getSetupStage(bus);

          // Derive booleans from populated data
          const hasRoute      = Boolean(bus.route);
          const hasStops      = (bus.route?.stops?.length || 0) > 0;
          const hasOperator   = Boolean(bus.operator);
          const isActive      = bus.status === "ACTIVE";
          const isInactive    = bus.status === "INACTIVE";
          const isBusy        = busyBusId === bus._id;

          // Operator is verified if the populated operator doc says so
          const operatorVerified =
            bus.operator?.operatorVerificationStatus === "VERIFIED";

          // Activate requires: INACTIVE + route with stops + verified operator
          const canActivate =
            isInactive && hasRoute && hasStops && hasOperator && operatorVerified;

          return (
            <motion.div
              key={bus._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur"
            >
              {/* Bus header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Bus</p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {bus.busNumber}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium
                  ${isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {bus.status}
                </span>
              </div>

              {/* Bus info */}
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Capacity</span>
                  <span>{bus.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stage</span>
                  <span>{stage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Route</span>
                  <span>
                    {bus.route
                      ? `${bus.route.routeName} (${bus.route.stops?.length || 0} stops)`
                      : "Not Assigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Operator</span>
                  <span className="text-right">
                    {bus.operator?.name || "—"}
                    {bus.operator?.operatorVerificationStatus && (
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          operatorVerified
                            ? "bg-emerald-100 text-emerald-700"
                            : bus.operator.operatorVerificationStatus === "REJECTED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {bus.operator.operatorVerificationStatus}
                      </span>
                    )}
                  </span>
                </div>

                {/* Hint when activate is blocked */}
                {isInactive && hasRoute && hasStops && hasOperator && !operatorVerified && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    ⚠ Operator must be verified before activating
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/admin/assign-route?busId=${bus._id}`}>
                  <button
                    disabled={isActive || hasOperator}
                    className="rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Route
                  </button>
                </Link>

                <Link to={`/admin/operators?busId=${bus._id}`}>
                  <button
                    disabled={isActive || !hasRoute || !hasStops || hasOperator}
                    className="rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Operator
                  </button>
                </Link>

                <button
                  disabled={isBusy || !canActivate}
                  onClick={() => approveBus(bus._id)}
                  className="rounded-full bg-emerald-500 px-3 py-1 text-xs text-white disabled:opacity-40"
                >
                  {isBusy ? "..." : "Activate"}
                </button>

                <button
                  disabled={isBusy || !isActive}
                  onClick={() => deactivateBus(bus._id)}
                  className="rounded-full bg-amber-500 px-3 py-1 text-xs text-white disabled:opacity-40"
                >
                  {isBusy ? "..." : "Deactivate"}
                </button>

                <button
                  disabled={isBusy || !isInactive || !hasOperator}
                  onClick={() => unassignOperator(bus._id)}
                  className="rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                >
                  Remove Operator
                </button>

                <button
                  disabled={isBusy || !isInactive || hasOperator || !hasRoute}
                  onClick={() => unassignRoute(bus._id)}
                  className="rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                >
                  Remove Route
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}

export default AdminBuses;