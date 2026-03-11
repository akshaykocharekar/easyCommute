import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Badge from "./Badge";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isUser     = token && user?.role === "USER";
  const isOperator = token && user?.role === "BUS_OPERATOR";
  const isAdmin    = token && user?.role === "SUPER_ADMIN";
  const isPremium  =
    user?.subscriptionPlan === "PREMIUM" && user?.subscriptionStatus === "ACTIVE";

  // Use dark theme on landing page only
  const isHome = location.pathname === "/";

  const navLinks = [];

  if (!token) {
    navLinks.push(
      { to: "/login",    label: "Login" },
      { to: "/register", label: "Register" }
    );
  } else if (isUser) {
    navLinks.push(
      { to: "/dashboard", label: "Dashboard" },
      { to: "/search",    label: "Search Routes" },
      { to: "/nearby",    label: "Nearby Buses" },
      ...(isPremium ? [] : [{ to: "/plans", label: "Plans" }])
    );
  } else if (isOperator) {
    navLinks.push({ to: "/operator", label: "Operator Panel" });
  } else if (isAdmin) {
    navLinks.push(
      { to: "/admin",           label: "Dashboard" },
      { to: "/admin/buses",     label: "Buses" },
      { to: "/admin/integrity", label: "Integrity" }
    );
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={
        isHome
          ? { backgroundColor: "rgba(16,34,28,0.85)", borderColor: "rgba(16,183,127,0.12)" }
          : { backgroundColor: "rgba(255,255,255,0.75)", borderColor: "rgba(148,163,184,0.3)" }
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight"
          style={{ color: "#10b981" }}
        >
          EasyCommute
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition
                  ${active
                    ? "bg-emerald-500 text-white"
                    : isHome
                    ? "text-slate-300 hover:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {token && isPremium && <Badge variant="warning">Premium</Badge>}

          {/* Guest CTA on home */}
          {!token && isHome && (
            <Link to="/register">
              <button
                className="ml-2 px-5 py-2 rounded-lg text-sm font-bold transition hover:brightness-110"
                style={{ backgroundColor: "#10b77f", color: "#10221c" }}
              >
                Get Started
              </button>
            </Link>
          )}

          {token && (
            <button
              onClick={logout}
              className="ml-2 rounded-full px-4 py-1.5 text-sm font-medium transition hover:opacity-80"
              style={
                isHome
                  ? { backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
                  : { backgroundColor: "#0f172a", color: "#fff" }
              }
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{ color: isHome ? "#fff" : "#0f172a" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="border-t backdrop-blur-xl md:hidden"
          style={
            isHome
              ? { backgroundColor: "rgba(16,34,28,0.97)", borderColor: "rgba(16,183,127,0.15)" }
              : { backgroundColor: "rgba(255,255,255,0.97)", borderColor: "#e2e8f0" }
          }
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition
                    ${active
                      ? "bg-emerald-500 text-white"
                      : isHome
                      ? "text-slate-300 hover:text-emerald-400"
                      : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {token && isPremium && (
              <div className="mt-2">
                <Badge variant="warning">Premium</Badge>
              </div>
            )}

            {token ? (
              <button
                onClick={logout}
                className="mt-3 rounded-lg py-2 text-sm font-medium"
                style={
                  isHome
                    ? { backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
                    : { backgroundColor: "#0f172a", color: "#fff" }
                }
              >
                Logout
              </button>
            ) : isHome ? (
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="w-full rounded-lg border border-slate-600 py-2 text-sm font-medium text-slate-300">
                    Login
                  </button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <button
                    className="w-full rounded-lg py-2 text-sm font-bold"
                    style={{ backgroundColor: "#10b77f", color: "#10221c" }}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;