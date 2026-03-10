import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Home, Search, MapPin, CreditCard, LayoutDashboard } from "lucide-react";

function BottomNav() {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) return null;

  const isUser = user?.role === "USER";
  const isOperator = user?.role === "BUS_OPERATOR";
  const isPremium =
    user?.subscriptionPlan === "PREMIUM" && user?.subscriptionStatus === "ACTIVE";

  let items = [];

  if (isUser) {
    items = [
      { to: "/dashboard", label: "Home", icon: Home },
      { to: "/search", label: "Search", icon: Search },
      { to: "/nearby", label: "Nearby", icon: MapPin },
      ...(isPremium ? [] : [{ to: "/plans", label: "Plans", icon: CreditCard }]),
    ];
  } else if (isOperator) {
    items = [
      { to: "/operator", label: "Dashboard", icon: LayoutDashboard },
    ];
  } else {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden">

      <div className="mx-auto flex max-w-md justify-around py-1">

        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center px-3 py-2 text-xs transition ${
                active
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon
                size={18}
                className={`mb-1 ${active ? "scale-110" : ""}`}
              />

              <span>{item.label}</span>

              {active && (
                <div className="mt-1 h-1 w-5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}

      </div>

    </nav>
  );
}

export default BottomNav;