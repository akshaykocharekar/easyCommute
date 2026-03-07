import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 text-center">

      {/* Gradient Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-300/40 blur-[120px]" />
        <div className="absolute right-[20%] top-[40%] h-[500px] w-[500px] rounded-full bg-emerald-400/40 blur-[120px]" />
        <div className="absolute left-[20%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-[120px]" />
      </div>

      {/* Hero Text */}
      <p className="mb-3 text-sm font-medium text-slate-500">
        Smart public transport
      </p>

      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
        Track Buses
        <br />
        <span className="text-emerald-600">in Real Time</span>
      </h1>

      <p className="mt-6 max-w-xl text-base text-slate-600 sm:text-lg">
        EasyCommute helps commuters find nearby buses, track routes live,
        and reach destinations faster with smart transport insights.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

        <Link to="/register">
          <button className="rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:opacity-80">
            Get Started
          </button>
        </Link>

        <Link to="/login">
          <button className="rounded-full border border-slate-300 px-8 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Login
          </button>
        </Link>

      </div>

      {/* Footer logos (optional SaaS style) */}
      <div className="mt-20 flex flex-wrap items-center justify-center gap-10 opacity-60">
        <span className="text-sm font-semibold text-slate-500">Smart Transit</span>
        <span className="text-sm font-semibold text-slate-500">Live GPS</span>
        <span className="text-sm font-semibold text-slate-500">Route Search</span>
        <span className="text-sm font-semibold text-slate-500">Nearby Buses</span>
      </div>

    </div>
  );
}

export default Home;