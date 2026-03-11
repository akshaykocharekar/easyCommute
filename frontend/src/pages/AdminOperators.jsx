import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import toast from "react-hot-toast";

const getVerificationChip = (status) => {
  if (status === "VERIFIED")
    return { label: "Verified", className: "bg-emerald-100 text-emerald-700" };
  if (status === "REJECTED")
    return { label: "Rejected", className: "bg-rose-100 text-rose-700" };
  return { label: "Pending", className: "bg-amber-100 text-amber-800" };
};

function AdminOperators() {
  const [operators, setOperators] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [busyOperatorId, setBusyOperatorId] = useState(null);

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

  const verifyOperator = async (operatorId) => {
    try {
      setBusyOperatorId(operatorId);
      await axios.patch(`/admin/operators/${operatorId}/verify`);
      toast.success("Operator verified");
      await fetchOperators();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify operator");
    } finally {
      setBusyOperatorId(null);
    }
  };

  const rejectOperator = async (operatorId) => {
    const reason = window.prompt("Reason for rejection? (optional)", "");
    if (reason === null) return; // user cancelled
    try {
      setBusyOperatorId(operatorId);
      await axios.patch(`/admin/operators/${operatorId}/reject`, { reason });
      toast.success("Operator rejected");
      await fetchOperators();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject operator");
    } finally {
      setBusyOperatorId(null);
    }
  };

  const assignOperator = async (operatorId) => {
    try {
      setBusyOperatorId(operatorId);
      await axios.post("/buses/assign-operator", { busId: selectedBus, operatorId });
      toast.success("Operator assigned to bus");
      await fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign operator");
    } finally {
      setBusyOperatorId(null);
    }
  };

  // Unassign this operator from whatever bus they're currently on
  const deassignOperator = async (operatorId, busId) => {
    try {
      setBusyOperatorId(operatorId);
      await axios.post("/buses/unassign-operator", { busId });
      toast.success("Operator removed from bus");
      await fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove operator from bus");
    } finally {
      setBusyOperatorId(null);
    }
  };

  // Buses eligible for operator assignment
  const eligibleBuses = buses.filter((bus) => {
    const stopsCount = bus.route?.stops?.length || 0;
    return (
      bus.status === "INACTIVE" &&
      Boolean(bus.route) &&
      stopsCount > 0 &&
      !bus.operator
    );
  });

  // Map operatorId (string) → the bus they're currently assigned to
  // Always stringify keys — ObjectId references don't match by === across fetches
  const operatorToBus = new Map();
  for (const bus of buses) {
    if (bus.operator?._id)
      operatorToBus.set(String(bus.operator._id), bus);
    else if (bus.operator && typeof bus.operator === "string")
      operatorToBus.set(bus.operator, bus);
  }

  return (
    <PageShell
      title="Verify Operators"
      subtitle="Review pending operators, verify or reject them, then assign verified operators to buses ready for service"
    >
      {/* BUS SELECTOR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur"
      >
        <label className="text-sm font-medium text-slate-600">
          Select Bus to Assign
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
            No buses ready for assignment (need INACTIVE + route with stops + no operator)
          </p>
        )}
      </motion.div>

      {/* OPERATORS LIST */}
      <div className="space-y-3">
        {operators.map((op) => {
          const assignedBus  = operatorToBus.get(String(op._id));
          const chip         = getVerificationChip(op.operatorVerificationStatus);
          const isVerified   = op.operatorVerificationStatus === "VERIFIED";
          const isRejected   = op.operatorVerificationStatus === "REJECTED";
          const isBusy       = busyOperatorId === op._id;

          // Can only deassign if the bus is INACTIVE (can't pull operator off an active bus)
          const canDeassign  = assignedBus && assignedBus.status === "INACTIVE";

          return (
            <motion.div
              key={op._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/80 px-5 py-4 shadow-sm backdrop-blur hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">

                {/* Operator Info */}
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{op.name}</p>
                  <p className="text-xs text-slate-500">{op.email}</p>
                  {op.phone && <p className="text-xs text-slate-500">{op.phone}</p>}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Verification status chip */}
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${chip.className}`}>
                    {chip.label}
                  </span>

                  {/* Bus assignment chip */}
                  {assignedBus ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      {assignedBus.busNumber}
                      {assignedBus.status === "ACTIVE" && (
                        <span className="ml-1 text-[10px] text-amber-500">(active)</span>
                      )}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      Unassigned
                    </span>
                  )}

                  {/* Verify */}
                  <button
                    disabled={isBusy || isVerified}
                    onClick={() => verifyOperator(op._id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition
                      ${isBusy || isVerified
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                  >
                    Verify
                  </button>

                  {/* Reject */}
                  <button
                    disabled={isBusy || isVerified}
                    onClick={() => rejectOperator(op._id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition
                      ${isBusy || isVerified
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    Reject
                  </button>

                  {/* Assign to bus */}
                  <button
                    disabled={isBusy || !selectedBus || assignedBus || !isVerified}
                    onClick={() => assignOperator(op._id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition
                      ${isBusy || !selectedBus || assignedBus || !isVerified
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-500 text-white hover:bg-emerald-400"
                      }`}
                  >
                    Assign
                  </button>

                  {/* Deassign from bus — only shown when operator has a bus */}
                  {assignedBus && (
                    <button
                      disabled={isBusy || !canDeassign}
                      onClick={() => deassignOperator(op._id, assignedBus._id)}
                      title={
                        !canDeassign
                          ? "Deactivate the bus first before removing operator"
                          : `Remove from ${assignedBus.busNumber}`
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition
                        ${isBusy || !canDeassign
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "border border-rose-300 text-rose-600 hover:bg-rose-50"
                        }`}
                    >
                      Remove from Bus
                    </button>
                  )}

                </div>
              </div>
            </motion.div>
          );
        })}

        {operators.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No operators registered yet
          </p>
        )}
      </div>
    </PageShell>
  );
}

export default AdminOperators;