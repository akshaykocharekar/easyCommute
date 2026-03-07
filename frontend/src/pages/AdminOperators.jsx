import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";

function AdminOperators() {
  const [operators, setOperators] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");

  const [searchParams] = useSearchParams();
  const preselectedBusId = searchParams.get("busId");

  useEffect(() => {
    fetchOperators();
    fetchBuses();
  }, []);

  useEffect(() => {
    if (preselectedBusId) setSelectedBus(preselectedBusId);
  }, [preselectedBusId]);

  const fetchOperators = async () => {
    const res = await axios.get("/admin/operators");
    setOperators(res.data);
  };

  const fetchBuses = async () => {
    const res = await axios.get("/buses");
    setBuses(res.data);
  };

  const assignOperator = async (operatorId) => {
    try {
      await axios.post("/buses/assign-operator", {
        busId: selectedBus,
        operatorId,
      });

      await fetchBuses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign operator");
    }
  };

  const eligibleBuses = buses.filter((bus) => {
    const stopsCount = bus.route?.stops?.length || 0;
    return (
      bus.status === "INACTIVE" &&
      Boolean(bus.route) &&
      stopsCount > 0 &&
      !bus.operator
    );
  });

  const operatorToBus = new Map();
  for (const bus of buses) {
    if (bus.operator?._id) operatorToBus.set(bus.operator._id, bus);
  }

  return (
    <PageShell
      title="Assign Operators"
      subtitle="Match drivers with buses ready for service"
    >
      {/* BUS SELECTOR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur"
      >
        <label className="text-sm font-medium text-slate-600">
          Select Bus
        </label>

        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <option value="">Choose a bus</option>

          {eligibleBuses.map((bus) => (
            <option key={bus._id} value={bus._id}>
              {bus.busNumber} — {bus.route?.routeName || "Route"}
            </option>
          ))}
        </select>

        {eligibleBuses.length === 0 && (
          <p className="mt-3 text-xs text-rose-500">
            No buses ready for assignment
          </p>
        )}
      </motion.div>

      {/* OPERATORS LIST */}
      <div className="space-y-3">

        {operators.map((op) => {

          const assignedBus = operatorToBus.get(op._id);

          return (
            <motion.div
              key={op._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-2xl bg-white/80 px-5 py-4 shadow-sm backdrop-blur hover:shadow-md transition"
            >

              {/* Operator Info */}
              <div>
                <p className="font-medium text-slate-900">
                  {op.name}
                </p>

                <p className="text-xs text-slate-500">
                  {op.email}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">

                {assignedBus ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    {assignedBus.busNumber}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    Available
                  </span>
                )}

                <button
                  disabled={!selectedBus || assignedBus}
                  onClick={() => assignOperator(op._id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition
                    ${
                      !selectedBus || assignedBus
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-500 text-white hover:bg-emerald-400"
                    }
                  `}
                >
                  Assign
                </button>

              </div>

            </motion.div>
          );
        })}

      </div>
    </PageShell>
  );
}

export default AdminOperators;