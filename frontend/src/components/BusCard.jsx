import { Link } from "react-router-dom";

function BusCard({ bus }) {
  const capacity = bus.capacity || 1;
  const occupancy = bus.currentOccupancy || 0;

  const occupancyPercent = Math.round((occupancy / capacity) * 100);
  const seatsLeft = capacity - occupancy;

  let crowdLevel = "";
  let badgeColor = "";
  let barColor = "";

  if (occupancy === capacity) {
    crowdLevel = "Bus Full";
    badgeColor = "bg-rose-100 text-rose-600";
    barColor = "bg-rose-500";
  } else if (occupancyPercent >= 70) {
    crowdLevel = "Crowded";
    badgeColor = "bg-amber-100 text-amber-700";
    barColor = "bg-amber-500";
  } else {
    crowdLevel = "Seats Available";
    badgeColor = "bg-emerald-100 text-emerald-700";
    barColor = "bg-emerald-500";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="text-lg">🚌</span>

          <h3 className="text-lg font-semibold text-slate-900">
            {bus.busNumber}
          </h3>
        </div>

        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
          {crowdLevel}
        </span>

      </div>


      {/* Occupancy */}

      <div className="mt-4">

        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Occupancy</span>
          <span>{occupancyPercent}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${barColor} transition-all`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {occupancy} / {capacity} passengers
        </p>

      </div>


      {/* Seats left */}

      {seatsLeft > 0 && (
        <p className="text-xs text-slate-500 mt-2">
          {seatsLeft} seats left
        </p>
      )}


      {/* Action */}

      <Link to={`/track/${bus._id}`} className="mt-4">
        <button className="w-full rounded-full bg-slate-900 py-2 text-sm text-white hover:bg-slate-800 transition">
          Track Bus
        </button>
      </Link>

    </div>
  );
}

export default BusCard;