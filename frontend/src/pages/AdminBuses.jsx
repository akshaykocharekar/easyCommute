import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";

function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [busyBusId, setBusyBusId] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    const res = await axios.get("/buses");
    setBuses(res.data);
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
      fetchBuses();
    } finally {
      setBusyBusId(null);
    }
  };

  const deactivateBus = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/delist", { busId });
      fetchBuses();
    } finally {
      setBusyBusId(null);
    }
  };

  const unassignOperator = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/unassign-operator", { busId });
      fetchBuses();
    } finally {
      setBusyBusId(null);
    }
  };

  const unassignRoute = async (busId) => {
    try {
      setBusyBusId(busId);
      await axios.post("/buses/unassign-route", { busId });
      fetchBuses();
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

                <span className={`rounded-full px-3 py-1 text-xs font-medium
                  ${
                    bus.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }
                `}>
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
                      ? `${bus.route.routeName} (${bus.route.stops?.length || 0})`
                      : "Not Assigned"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Operator</span>
                  <span>{bus.operator?.name || "—"}</span>
                </div>

              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2">

                <Link to={`/admin/assign-route?busId=${bus._id}`}>
                  <button
                    disabled={bus.status !== "INACTIVE" || bus.operator}
                    className="rounded-full border px-3 py-1 text-xs"
                  >
                    Route
                  </button>
                </Link>

                <Link to={`/admin/operators?busId=${bus._id}`}>
                  <button
                    disabled={
                      bus.status !== "INACTIVE" ||
                      !bus.route ||
                      !bus.route?.stops?.length ||
                      bus.operator
                    }
                    className="rounded-full border px-3 py-1 text-xs"
                  >
                    Operator
                  </button>
                </Link>

                <button
                  disabled={
                    busyBusId === bus._id ||
                    bus.status !== "INACTIVE" ||
                    !bus.route ||
                    !bus.route?.stops?.length ||
                    !bus.operator
                  }
                  onClick={() => approveBus(bus._id)}
                  className="rounded-full bg-emerald-500 px-3 py-1 text-xs text-white"
                >
                  Activate
                </button>

                <button
                  disabled={busyBusId === bus._id || bus.status !== "ACTIVE"}
                  onClick={() => deactivateBus(bus._id)}
                  className="rounded-full bg-amber-500 px-3 py-1 text-xs text-white"
                >
                  Deactivate
                </button>

                <button
                  disabled={
                    busyBusId === bus._id ||
                    bus.status !== "INACTIVE" ||
                    !bus.operator
                  }
                  onClick={() => unassignOperator(bus._id)}
                  className="rounded-full border px-3 py-1 text-xs"
                >
                  Remove Operator
                </button>

                <button
                  disabled={
                    busyBusId === bus._id ||
                    bus.status !== "INACTIVE" ||
                    bus.operator ||
                    !bus.route
                  }
                  onClick={() => unassignRoute(bus._id)}
                  className="rounded-full border px-3 py-1 text-xs"
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