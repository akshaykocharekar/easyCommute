import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Badge from "../components/Badge";

function AdminRoutes() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("/routes");
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageShell
      title="Routes"
      subtitle="Manage routes and their stops. Routes with no stops cannot be assigned."
      actions={
        <Link
          to="/admin/create-route"
          className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
        >
          Create Route
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {routes.map((route) => {
          const stopCount = route.stops?.length || 0;
          const hasStops = stopCount > 0;
          return (
            <div
              key={route._id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {route.routeName}
                  </h2>
                  <Badge variant={hasStops ? "success" : "warning"}>
                    {hasStops ? `${stopCount} stops` : "No stops"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {route.startPoint} → {route.endPoint}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/admin/add-stop?routeId=${route._id}`}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {hasStops ? "Edit stops" : "Add stops"}
                </Link>
              </div>
            </div>
          );
        })}
        {routes.length === 0 && (
          <p className="text-sm text-slate-500">
            No routes found. Create your first route to get started.
          </p>
        )}
      </div>
    </PageShell>
  );
}

export default AdminRoutes;