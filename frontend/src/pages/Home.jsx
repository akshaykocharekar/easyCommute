import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6">

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[30%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-yellow-300/30 blur-[140px]" />
        <div className="absolute right-[10%] top-[40%] h-[500px] w-[500px] rounded-full bg-emerald-400/30 blur-[120px]" />
        <div className="absolute left-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-[120px]" />
      </div>

      {/* HERO */}
      <div className="mx-auto grid max-w-7xl items-center gap-16 pt-32 md:grid-cols-2">

        {/* LEFT TEXT */}
        <div>

          <p className="mb-4 text-sm font-semibold text-emerald-600">
            Smart Public Transport
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Track buses
            <br />
            <span className="text-emerald-600">in real time</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-600">
            EasyCommute helps commuters discover nearby buses, track live
            routes, and navigate public transport smarter.
          </p>

          <div className="mt-10 flex gap-4">

            <Link to="/register">
              <button className="rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:scale-105 hover:opacity-90">
                Get Started
              </button>
            </Link>

            <Link to="/login">
              <button className="rounded-full border border-slate-300 px-8 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Login
              </button>
            </Link>

          </div>

        </div>

        {/* RIGHT PRODUCT PREVIEW */}
        <div className="relative">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">

            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="flex h-[320px] items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              Map Preview
            </div>

          </div>

        </div>

      </div>


      {/* FEATURES */}
      <div className="mx-auto mt-32 grid max-w-6xl gap-8 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 p-8 transition hover:shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900">
            Live Bus Tracking
          </h3>
          <p className="mt-3 text-slate-600">
            See real-time GPS locations of buses and follow their movement live.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-8 transition hover:shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900">
            Nearby Buses
          </h3>
          <p className="mt-3 text-slate-600">
            Instantly discover buses close to your location.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-8 transition hover:shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900">
            Smart Routes
          </h3>
          <p className="mt-3 text-slate-600">
            Search routes and plan your commute with ease.
          </p>
        </div>

      </div>


      {/* TRUST BAR */}
      <div className="mt-28 flex flex-wrap items-center justify-center gap-10 opacity-60">
        <span className="text-sm font-semibold text-slate-500">Live GPS</span>
        <span className="text-sm font-semibold text-slate-500">Real Time</span>
        <span className="text-sm font-semibold text-slate-500">Smart Routes</span>
        <span className="text-sm font-semibold text-slate-500">Nearby Buses</span>
      </div>

    </div>
  );
}

export default Home;