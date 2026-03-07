import { useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import { Bus } from "lucide-react";

function CreateBus() {
  const [busNumber, setBusNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("/buses", {
        busNumber,
        capacity,
      });

      setBusNumber("");
      setCapacity("");

      alert("Bus created successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Create Bus"
      subtitle="Add a new bus to the fleet before assigning routes and operators"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur"
      >

        {/* Icon */}
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2">
            <Bus size={18} className="text-emerald-600" />
          </div>
          <h3 className="font-semibold text-slate-900">
            New Bus
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Bus Number */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Bus Number
            </label>

            <input
              required
              placeholder="e.g. MH12-BUS-102"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Capacity
            </label>

            <input
              required
              type="number"
              placeholder="Number of seats"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-emerald-500 py-2 text-sm font-medium text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Bus"}
          </button>

        </form>

      </motion.div>
    </PageShell>
  );
}

export default CreateBus;