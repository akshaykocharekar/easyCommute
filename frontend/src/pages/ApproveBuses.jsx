import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";

function ApproveBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get("/buses");
      const pending = res.data.filter((bus) => !bus.isApproved);
      setBuses(pending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveBus = async (busId) => {
    try {
      await axios.post("/buses/approve", { busId });
      setBuses((prev) => prev.filter((bus) => bus._id !== busId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Approve Buses
        </h1>

        <div className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
          {buses.length} Pending
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading buses...
          </div>
        ) : buses.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No pending buses 🚍
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Bus Number</th>
                <th className="px-6 py-3">Capacity</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>

              {buses.map((bus, index) => (
                <motion.tr
                  key={bus._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {bus.busNumber}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {bus.capacity}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => approveBus(bus._id)}
                      className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 transition"
                    >
                      Approve
                    </button>
                  </td>
                </motion.tr>
              ))}

            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}

export default ApproveBuses;