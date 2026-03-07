import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

function StatCard({ label, value, helper, data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      {/* Label */}
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>

      {/* Value */}
      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {value}
      </p>

      {/* Helper text */}
      {helper && (
        <p className="mt-1 text-xs text-slate-500">
          {helper}
        </p>
      )}

      {/* Mini Chart */}
      {data && (
        <div className="mt-4 h-14">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;