import { useEffect, useState } from "react";
import axios from "../api/axios";
import PageShell from "../components/PageShell";
import { motion } from "framer-motion";

function AdminIntegrity() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/admin/integrity")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell
      title="System Integrity"
      subtitle="Detect configuration issues before enforcing strict constraints"
    >
      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      {error && (
        <p className="text-sm text-rose-600">
          {error}
        </p>
      )}

      {data && (
        <div className="space-y-6">

          {/* COUNTS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {Object.entries(data.counts).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xs uppercase text-slate-500">
                  {key}
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* MULTI BUS OPERATORS */}
          <IntegrityCard
            title="Operators assigned to multiple buses"
            items={data.operatorAssignedToMultipleBuses}
            render={(row) => (
              <div key={row.operator?._id} className="space-y-1">
                <p className="font-medium">
                  {row.operator?.name || row.operator?._id}
                </p>
                <p className="text-xs text-slate-500">
                  {row.operator?.email} — {row.count} buses
                </p>
                <div className="flex flex-wrap gap-1">
                  {row.buses.map((b) => (
                    <span
                      key={b._id}
                      className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700"
                    >
                      {b.busNumber}
                    </span>
                  ))}
                </div>
              </div>
            )}
          />

          {/* ACTIVE BUSES WITH ISSUES */}
          <IntegrityCard
            title="Active buses missing configuration"
            items={data.activeBusesMissingConfig}
            render={(bus) => (
              <div key={bus._id} className="flex justify-between">
                <span>{bus.busNumber}</span>
                <span className="text-xs text-rose-500">
                  route: {bus.route ? "OK" : "Missing"} | operator:{" "}
                  {bus.operator ? "OK" : "Missing"}
                </span>
              </div>
            )}
          />

          {/* ROUTES WITHOUT STOPS */}
          <IntegrityCard
            title="Buses assigned to routes without stops"
            items={data.busesWithRouteMissingStops}
            render={(bus) => (
              <div key={bus._id} className="flex justify-between">
                <span>{bus.busNumber}</span>
                <span className="text-xs text-amber-500">
                  {bus.route?.routeName} ({bus.route?.stops?.length || 0} stops)
                </span>
              </div>
            )}
          />

        </div>
      )}
    </PageShell>
  );
}

/* Reusable integrity section */

function IntegrityCard({ title, items, render }) {
  return (
    <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur">

      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        {title}
      </h3>

      {!items?.length ? (
        <p className="text-sm text-emerald-600">
          No issues found
        </p>
      ) : (
        <div className="space-y-3">
          {items.map(render)}
        </div>
      )}

    </div>
  );
}

export default AdminIntegrity;