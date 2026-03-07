import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function SearchRoute() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!source || !destination) {
      alert("Please enter source and destination");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `/search?source=${source}&destination=${destination}`
      );

      setBuses(res.data);
    } catch (error) {
      console.error(error);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-6 md:py-6">
      <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
        Find Bus
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Search for buses by source and destination.
      </p>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={search}
          className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-slate-500">Searching buses…</p>
      )}

      {!loading && buses.length === 0 && (
        <p className="mt-3 text-sm text-slate-500">No buses found.</p>
      )}

      <div className="mt-4 space-y-3">
        {buses.map((bus) => (
          <div
            key={bus._id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
          >
            <div>
              <p className="font-semibold text-slate-900">
                Bus {bus.busNumber}
              </p>
              <p className="text-xs text-slate-500">
                {bus.route?.routeName || "Route"}{" "}
                {bus.route?.startPoint && bus.route?.endPoint
                  ? ` – ${bus.route.startPoint} → ${bus.route.endPoint}`
                  : ""}
              </p>
            </div>
            <Link
              to={`/track/${bus._id}`}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              Track
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchRoute;