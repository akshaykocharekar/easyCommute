import { useEffect, useState, useContext } from "react";
import { getPublicBuses } from "../services/busService";
import { getRoutes } from "../services/routeService";
import { Link } from "react-router-dom";
import axios from "../api/axios";

import BusCard from "../components/BusCard";
import RouteCard from "../components/RouteCard";
import { AuthContext } from "../context/AuthContext";

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white shadow-sm">
      {initials}
    </div>
  );
}

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      axios.get("/payment/revenue").then((res) => setStats(res.data));
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busData, routeData] = await Promise.all([
        getPublicBuses(),
        getRoutes(),
      ]);
      setBuses(busData);
      setRoutes(routeData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {user?.name ? `Hey, ${user.name.split(" ")[0]} 👋` : "Dashboard"}
            </h1>
            {user?.subscriptionPlan === "PREMIUM" && (
              <p className="text-xs text-amber-600 mt-0.5 font-medium">
                ⭐ Premium Member
              </p>
            )}
          </div>
        </div>
      </div>


      {/* SUPER ADMIN STATS */}
      {user?.role === "SUPER_ADMIN" && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-sm text-slate-500">Total Subscribers</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.totalSubscribers}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-emerald-600">
              ₹{stats.totalRevenue}
            </p>
          </div>
        </div>
      )}


      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-3">
        <Link to="/search">
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
            Search Route
          </button>
        </Link>
        <Link to="/nearby">
          <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-400">
            Nearby Buses
          </button>
        </Link>
      </div>


      {/* BUSES */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Available Buses
        </h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-2 w-full animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-2 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : buses.length === 0 ? (
          <p className="text-sm text-slate-500">No buses available right now</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {buses.map((bus) => (
              <BusCard key={bus._id} bus={bus} />
            ))}
          </div>
        )}
      </div>


      {/* ROUTES */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Routes
        </h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
                <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-2 w-5/6 animate-pulse rounded bg-slate-100" />
                  <div className="h-2 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : routes.length === 0 ? (
          <p className="text-sm text-slate-500">No routes available</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {routes.map((route) => (
              <RouteCard key={route._id} route={route} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;