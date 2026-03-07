import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix default marker icon issue in React Leaflet */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function Home() {
  const collegeCoords = [15.2750, 73.9570];

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden px-6">

      {/* Gradient Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[30%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-300/30 blur-[150px]" />
        <div className="absolute right-[10%] top-[40%] h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-[130px]" />
        <div className="absolute left-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-yellow-200/30 blur-[130px]" />
      </div>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 pt-36 pb-28 md:grid-cols-2">

        {/* LEFT TEXT */}
        <div>

          <p className="mb-4 text-sm font-semibold tracking-wide text-emerald-600">
            PUBLIC TRANSPORT REINVENTED
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

          <p className="mt-6 text-sm text-slate-500">
            Live GPS • Nearby buses • Smart routes
          </p>

        </div>

        {/* RIGHT PRODUCT PREVIEW */}
        <div className="relative">

          <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-2xl">

            {/* Window bar */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            {/* Map Preview */}
            <div className="h-[350px] overflow-hidden rounded-xl">

              <MapContainer
                center={collegeCoords}
                zoom={16}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={collegeCoords}>
                  <Popup>🚌 Damodar College Bus Stop</Popup>
                </Marker>

              </MapContainer>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl pb-28">

        <h2 className="text-center text-3xl font-semibold text-slate-900">
          Built for modern commuting
        </h2>

        <p className="mt-3 text-center text-slate-600">
          Everything you need to navigate public transport smarter
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-8 transition hover:shadow-lg">

            <div className="text-2xl">🚌</div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Live Bus Tracking
            </h3>

            <p className="mt-3 text-slate-600">
              See real-time GPS locations of buses and follow their movement live.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-8 transition hover:shadow-lg">

            <div className="text-2xl">📍</div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Nearby Buses
            </h3>

            <p className="mt-3 text-slate-600">
              Instantly discover buses close to your location.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-8 transition hover:shadow-lg">

            <div className="text-2xl">🗺️</div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Smart Routes
            </h3>

            <p className="mt-3 text-slate-600">
              Search routes and plan your commute with ease.
            </p>

          </div>

        </div>

      </section>

      {/* PRODUCT SECTION */}
      <section className="bg-white py-28 border-y border-slate-200">

        <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">

          <div>

            <h2 className="text-4xl font-semibold text-slate-900">
              See buses moving live
            </h2>

            <p className="mt-4 text-slate-600">
              EasyCommute provides real-time bus tracking so you always
              know where your bus is and when it will arrive.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-10 text-center text-slate-400">
            Live tracking preview
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-32 text-center">

        <h2 className="text-4xl font-semibold text-slate-900">
          Start commuting smarter
        </h2>

        <p className="mt-4 text-slate-600">
          Join EasyCommute and experience real-time public transport.
        </p>

        <Link to="/register">
          <button className="mt-8 rounded-full bg-black px-8 py-3 text-white transition hover:scale-105">
            Get Started
          </button>
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EasyCommute. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;