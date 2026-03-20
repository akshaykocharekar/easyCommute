import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// Custom donut tooltip
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
        <p className="font-medium text-slate-800">{payload[0].name}</p>
        <p className="text-slate-500">{payload[0].value} users</p>
      </div>
    );
  }
  return null;
};

// Custom bar tooltip
const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-emerald-600 font-semibold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const BAR_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const barData = stats
    ? [
        { name: "Buses", value: stats.totalBuses },
        { name: "Routes", value: stats.totalRoutes },
        { name: "Operators", value: stats.totalOperators },
        { name: "Users", value: stats.totalUsers },
      ]
    : [];

  const donutData = stats
    ? [
        { name: "Premium", value: stats.totalSubscribers ?? 0 },
        {
          name: "Free",
          value: (stats.totalUsers ?? 0) - (stats.totalSubscribers ?? 0),
        },
      ]
    : [];

  const activeRoutes = stats?.activeRoutes ?? 0;
  const inactiveRoutes = (stats?.totalRoutes ?? 0) - activeRoutes;
  const activeRoutePct =
    stats?.totalRoutes > 0
      ? Math.round((activeRoutes / stats.totalRoutes) * 100)
      : 0;

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
          {/* Stat Cards */}
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

          {/* Charts Row */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Bar Chart — Platform Overview */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <h2 className="mb-1 text-base font-semibold text-slate-800">
                Platform Overview
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Total counts across all platform entities
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {barData.map((_, index) => (
                        <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Donut Chart — Subscription Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <h2 className="mb-1 text-base font-semibold text-slate-800">
                Subscriptions
              </h2>
              <p className="mb-2 text-xs text-slate-400">
                Premium vs Free users
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs text-slate-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center label */}
              <p className="text-center text-xs text-slate-400 -mt-2">
                <span className="text-emerald-600 font-semibold text-sm">
                  {stats.totalSubscribers ?? 0}
                </span>{" "}
                premium of {stats.totalUsers} users
              </p>
            </motion.div>
          </div>

          {/* Route Health Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Route Health
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Active Routes */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                  Active Routes
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">
                  {activeRoutes}
                </p>
                <p className="mt-1 text-xs text-emerald-500">
                  Routes with at least 1 stop
                </p>
              </div>

              {/* Inactive Routes */}
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-amber-600">
                  Incomplete Routes
                </p>
                <p className="mt-2 text-3xl font-semibold text-amber-700">
                  {inactiveRoutes}
                </p>
                <p className="mt-1 text-xs text-amber-500">
                  Routes with no stops configured
                </p>
              </div>

              {/* Progress Bar */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Completion Rate
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-800">
                  {activeRoutePct}%
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${activeRoutePct}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </PageShell>
  );
}

export default AdminDashboard;