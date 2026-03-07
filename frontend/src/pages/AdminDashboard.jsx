import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats
    ? [
        { name: "Buses", value: stats.totalBuses },
        { name: "Routes", value: stats.totalRoutes },
        { name: "Operators", value: stats.totalOperators },
        { name: "Users", value: stats.totalUsers }
      ]
    : [];

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Manage routes, buses, operators and monitor platform health"
      actions={
        <>
          <Link
            to="/admin/create-route"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Create Route
          </Link>

          <Link
            to="/admin/create-bus"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-400"
          >
            Create Bus
          </Link>

          <Link
            to="/admin/integrity"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Integrity
          </Link>
        </>
      }
    >
      {loading && (
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      )}

      {stats && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total Buses" value={stats.totalBuses} />
            <StatCard label="Routes" value={stats.totalRoutes} />
            <StatCard label="Operators" value={stats.totalOperators} />
            <StatCard label="Users" value={stats.totalUsers} />
            <StatCard
              label="Premium Subscribers"
              value={stats.totalSubscribers ?? 0}
            />
            <StatCard
              label="Revenue"
              value={`₹${stats.revenue ?? 0}`}
              helper="Based on active subscriptions"
            />
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Platform Activity
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorData)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}
    </PageShell>
  );
}

export default AdminDashboard;