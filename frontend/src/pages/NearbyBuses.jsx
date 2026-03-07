import { useEffect, useState, useContext } from "react";
import { getPublicBuses } from "../services/busService";
import { getRoutes } from "../services/routeService";
import { Link } from "react-router-dom";
import axios from "../api/axios";

import BusCard from "../components/BusCard";
import RouteCard from "../components/RouteCard";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const { user } = useContext(AuthContext);

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("buses");

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      axios.get("/payment/revenue").then(res => {
        setStats(res.data);
      });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const busData = await getPublicBuses();
      const routeData = await getRoutes();

      setBuses(busData);
      setRoutes(routeData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-10">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Dashboard
          </h1>

          {user?.subscriptionPlan === "PREMIUM" && (
            <p className="text-sm text-amber-600 mt-1">
              ⭐ Premium User
            </p>
          )}
        </div>

      </div>


      {/* ADMIN STATS */}

      {user?.role === "SUPER_ADMIN" && stats && (

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Subscribers</p>
            <p className="text-3xl font-semibold text-slate-900">
              {stats.totalSubscribers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="text-3xl font-semibold text-emerald-600">
              ₹{stats.totalRevenue}
            </p>
          </div>

        </div>

      )}


      {/* QUICK ACTIONS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Link to="/search">
          <div className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">

            <h3 className="text-lg font-semibold text-slate-900">
              🔎 Search Routes
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Find the best route between stops
            </p>

          </div>
        </Link>

        <Link to="/nearby">
          <div className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">

            <h3 className="text-lg font-semibold text-slate-900">
              📍 Nearby Buses
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              See buses near your location
            </p>

          </div>
        </Link>

      </div>


      {/* TABS */}

      <div>

        <div className="flex gap-6 border-b border-slate-200 mb-6">

          <button
            onClick={() => setActiveTab("buses")}
            className={`pb-3 text-sm font-medium ${
              activeTab === "buses"
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-slate-500"
            }`}
          >
            Live Buses
          </button>

          <button
            onClick={() => setActiveTab("routes")}
            className={`pb-3 text-sm font-medium ${
              activeTab === "routes"
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-slate-500"
            }`}
          >
            Routes
          </button>

        </div>


        {/* BUSES TAB */}

        {activeTab === "buses" && (

          buses.length === 0 ? (
            <p className="text-sm text-slate-500">
              No buses available right now
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {buses.map((bus) => (
                <BusCard key={bus._id} bus={bus} />
              ))}
            </div>
          )

        )}


        {/* ROUTES TAB */}

        {activeTab === "routes" && (

          routes.length === 0 ? (
            <p className="text-sm text-slate-500">
              No routes available
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {routes.map((route) => (
                <RouteCard key={route._id} route={route} />
              ))}
            </div>
          )

        )}

      </div>

    </div>
  );
}

export default Dashboard;