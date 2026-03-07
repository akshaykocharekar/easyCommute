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

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>

        {user?.subscriptionPlan === "PREMIUM" && (
          <p className="text-sm text-amber-600 mt-1">
            ⭐ Premium User
          </p>
        )}
      </div>


      {/* SUPER ADMIN STATS */}

      {user?.role === "SUPER_ADMIN" && stats && (

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Subscribers</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.totalSubscribers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

        {buses.length === 0 ? (
          <p className="text-sm text-slate-500">
            No buses available right now
          </p>
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

        {routes.length === 0 ? (
          <p className="text-sm text-slate-500">
            No routes available
          </p>
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