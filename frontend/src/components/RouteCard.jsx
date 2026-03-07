function RouteCard({ route }) {

  const stops = route.stops || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">

      {/* Route Name */}
      <h3 className="text-lg font-semibold text-slate-900">
        {route.routeName}
      </h3>

      {/* Route Path */}
      <p className="text-sm text-slate-500 mt-1">
        {route.startPoint} → {route.endPoint}
      </p>

      {/* Stops */}
      <div className="mt-4">

        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
          Stops
        </p>

        {stops.length === 0 ? (
          <p className="text-sm text-slate-400">
            No stops added
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">

            {stops.slice(0, 6).map((stop, index) => (
              <span
                key={index}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
              >
                {stop.name}
              </span>
            ))}

            {stops.length > 6 && (
              <span className="text-xs text-slate-400">
                +{stops.length - 6} more
              </span>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default RouteCard;