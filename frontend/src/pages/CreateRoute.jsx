import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import { Map } from "lucide-react";

function CreateRoute() {
  const [routeName, setRouteName] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("/routes", {
        routeName,
        startPoint,
        endPoint,
      });

      const routeId = res.data.route?._id || res.data._id;

      alert("Route created. Now add stops.");

      navigate(`/admin/add-stop?routeId=${routeId}`);

    } catch (err) {
      console.error(err);
      alert("Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Create Route"
      subtitle="Define the main route before adding stops"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur"
      >

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2">
            <Map size={18} className="text-emerald-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              New Route
            </h3>
            <p className="text-xs text-slate-500">
              Next step: add stops
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Route Name */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Route Name
            </label>

            <input
              required
              placeholder="e.g. City Loop"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Start */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Start Point
            </label>

            <input
              required
              placeholder="Starting location"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* End */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              End Point
            </label>

            <input
              required
              placeholder="Destination"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-emerald-500 py-2 text-sm font-medium text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Creating Route..." : "Create Route"}
          </button>

        </form>

      </motion.div>
    </PageShell>
  );
}

export default CreateRoute;