import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShieldCheck,
  Map,
  Bus,
  Users,
  UserCog,
  Menu,
  X
} from "lucide-react";

function DashboardLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/integrity", label: "Integrity", icon: ShieldCheck },
    { to: "/admin/routes", label: "Routes", icon: Map },
    { to: "/admin/create-route", label: "Create Route", icon: Map },
    { to: "/admin/buses", label: "Buses", icon: Bus },
    { to: "/admin/create-bus", label: "Create Bus", icon: Bus },
    { to: "/admin/assign-route", label: "Assign Route", icon: Bus },
    { to: "/admin/approve-buses", label: "Approve Buses", icon: Bus },
    { to: "/admin/operators", label: "Operators", icon: UserCog },
    { to: "/admin/users", label: "Users", icon: Users }
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">

        <div className="border-b px-6 py-5">
          <h2 className="text-lg font-semibold text-emerald-600">
            EasyCommute
          </h2>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                ${
                  active
                    ? "bg-emerald-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      <div className="flex flex-1 flex-col">

        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">

          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          <h2 className="text-sm font-semibold text-emerald-600">
            EasyCommute
          </h2>

        </header>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ duration: 0.25 }}
                className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl"
              >

                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="font-semibold text-emerald-600">
                    EasyCommute
                  </h2>

                  <button onClick={() => setOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.to);

                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                        ${
                          active
                            ? "bg-emerald-500 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;