import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import PageShell from "../components/PageShell";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"];

function AdminSupport() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchRequests = async () => {
    const res = await axios.get("/support");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests()
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const byStatus = new Map();
    for (const r of requests) byStatus.set(r.status, (byStatus.get(r.status) || 0) + 1);
    return {
      total: requests.length,
      open: byStatus.get("OPEN") || 0,
      inProgress: byStatus.get("IN_PROGRESS") || 0,
    };
  }, [requests]);

  const updateStatus = async (id, status) => {
    try {
      setBusyId(id);
      await axios.patch(`/support/${id}`, { status });
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update request");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageShell
      title="Support Requests"
      subtitle={`Total ${counts.total} · Open ${counts.open} · In progress ${counts.inProgress}`}
    >
      {loading ? (
        <div className="text-sm text-slate-500">Loading support requests…</div>
      ) : requests.length === 0 ? (
        <div className="text-sm text-slate-500">No support requests.</div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">
                      {r.subject}
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {r.category}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Operator:{" "}
                    <span className="font-medium text-slate-700">
                      {r.operator?.name || "—"}
                    </span>{" "}
                    {r.operator?.email ? `(${r.operator.email})` : ""}
                    {r.bus?.busNumber ? ` · Bus ${r.bus.busNumber}` : ""}
                    {r.operator?.operatorVerificationStatus
                      ? ` · ${r.operator.operatorVerificationStatus}`
                      : ""}
                  </div>

                  <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                    {r.message}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      disabled={busyId === r._id || r.status === s}
                      onClick={() => updateStatus(r._id, s)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        r.status === s
                          ? "bg-slate-900 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      } disabled:opacity-60`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default AdminSupport;

