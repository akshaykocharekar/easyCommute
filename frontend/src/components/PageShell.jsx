import { motion } from "framer-motion";

function PageShell({ title, subtitle, actions, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">

        <div>
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {actions}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default PageShell;