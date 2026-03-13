import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Plans() {
  const { user } = useContext(AuthContext);

  if (user?.subscriptionPlan === "PREMIUM" || user?.subscriptionStatus === "TRIAL") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-white px-6 py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-40 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-300/30 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">Choose your plan</h1>
        <p className="mt-4 text-slate-600">Unlock smart commuting with real-time transport insights.</p>

        <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">

          {/* Free Trial Card */}
          {!user?.trialUsed && (
            <div className="relative w-[340px] rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-md">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-white">
                Try Free
              </span>
              <h2 className="text-xl font-semibold text-slate-900">7-Day Free Trial</h2>
              <p className="mt-4 text-4xl font-bold text-slate-900">
                ₹0
                <span className="text-base font-medium text-slate-500"> /7 days</span>
              </p>
              <ul className="mt-8 space-y-3 text-left text-slate-600">
                <li>✔ Live Bus Tracking</li>
                <li>✔ ETA Predictions</li>
                <li>✔ Nearby Buses</li>
                <li>✔ Priority Features</li>
                <li className="text-slate-400">✘ No credit card needed</li>
              </ul>
              <Link to="/upgrade?trial=true">
                <button className="mt-8 w-full rounded-lg bg-emerald-500 py-3 text-sm font-medium text-white transition hover:bg-emerald-400">
                  Start Free Trial
                </button>
              </Link>
            </div>
          )}

          {/* Premium Card */}
          <div className="relative w-[340px] rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition hover:shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              Most Popular
            </span>
            <h2 className="text-xl font-semibold text-slate-900">Premium</h2>
            <p className="mt-4 text-4xl font-bold text-slate-900">
              ₹30
              <span className="text-base font-medium text-slate-500"> /lifetime</span>
            </p>
            <ul className="mt-8 space-y-3 text-left text-slate-600">
              <li>✔ Live Bus Tracking</li>
              <li>✔ ETA Predictions</li>
              <li>✔ Nearby Buses</li>
              <li>✔ Priority Features</li>
            </ul>
            <Link to="/upgrade">
              <button className="mt-8 w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:opacity-90">
                Upgrade to Premium
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Plans;