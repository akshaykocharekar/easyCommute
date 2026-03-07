import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

function AssignRoute() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const preselectedBusId = searchParams.get("busId");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (preselectedBusId) setBusId(preselectedBusId);
  }, [preselectedBusId]);

  const fetchData = async () => {
    try {
      const [busRes, routeRes] = await Promise.all([
        axios.get("/buses"),
        axios.get("/routes")
      ]);

      setBuses(busRes.data);
      setRoutes(routeRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/buses/assign-route", { busId, routeId });

      setBusId("");
      setRouteId("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign route");
    }
  };

  const routesWithStops = routes.filter((r) => r.stops?.length);
  const routesWithoutStops = routes.filter((r) => !r.stops?.length);

  const eligibleBuses = buses.filter(
    (bus) => bus.status === "INACTIVE" && !bus.operator
  );

  const selectedRoute = routes.find((r) => r._id === routeId);

  return (
  <div className="p-6">

  <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">

    {/* ASSIGN FORM */}

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h1 className="text-xl font-semibold text-slate-900 mb-4">
        Assign Route
      </h1>

      <form onSubmit={handleAssign} className="space-y-4">

        {/* BUS */}

        <div>
          <label className="text-sm font-medium text-slate-700">
            Select Bus
          </label>

          <select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">Choose bus</option>

            {eligibleBuses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.busNumber}
              </option>
            ))}
          </select>
        </div>

        {/* ROUTE */}

        <div>
          <label className="text-sm font-medium text-slate-700">
            Select Route
          </label>

          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">Choose route</option>

            {routesWithStops.map((route) => (
              <option key={route._id} value={route._id}>
                {route.routeName} ({route.stops.length} stops)
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!busId || !routeId}
          className="w-full rounded-full bg-emerald-500 py-2 text-sm text-white hover:bg-emerald-400 disabled:opacity-50"
        >
          Assign Route
        </button>

      </form>

    </div>

    {/* ROUTE PREVIEW PANEL */}

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Route Preview
      </h2>

      {!selectedRoute ? (
        <p className="text-sm text-slate-500">
          Select a route to preview stops.
        </p>
      ) : (
        <div className="space-y-2">

          {selectedRoute.stops.map((stop, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="text-xs text-slate-400 w-5">
                {i + 1}
              </span>

              <span>{stop.name}</span>
            </div>
          ))}

        </div>
      )}

    </div>

  </div>

</div>
  );
}

export default AssignRoute;