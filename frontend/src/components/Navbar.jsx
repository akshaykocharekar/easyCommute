import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Badge from "./Badge";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isUser = token && user?.role === "USER";
  const isOperator = token && user?.role === "BUS_OPERATOR";
  const isAdmin = token && user?.role === "SUPER_ADMIN";

  const navLinks = [];

  if (!token) {
    navLinks.push(
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" }
    );
  } else if (isUser) {
    navLinks.push(
      { to: "/dashboard", label: "Dashboard" },
      { to: "/search", label: "Search Routes" },
      { to: "/nearby", label: "Nearby Buses" },
      { to: "/plans", label: "Plans" }
    );
  } else if (isOperator) {
    navLinks.push({ to: "/operator", label: "Operator Panel" });
  } else if (isAdmin) {
    navLinks.push(
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/buses", label: "Buses" },
      { to: "/admin/integrity", label: "Integrity" }
    );
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
      
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-emerald-600"
        >
          EasyCommute
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">

          {navLinks.map((link) => {
            const active = isActive(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition
                ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {token && user?.subscriptionPlan === "PREMIUM" && (
            <Badge variant="warning">Premium</Badge>
          )}

          {token && (
            <button
              onClick={logout}
              className="ml-2 rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-80"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">

            {navLinks.map((link) => {
              const active = isActive(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {token && user?.subscriptionPlan === "PREMIUM" && (
              <div className="mt-2">
                <Badge variant="warning">Premium</Badge>
              </div>
            )}

            {token && (
              <button
                onClick={logout}
                className="mt-3 rounded-lg bg-black py-2 text-sm font-medium text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;