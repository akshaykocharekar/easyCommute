import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetModal, setResetModal] = useState(null); // { id, name }
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/admin/users");
    setUsers(res.data);
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const grantPremium = async (id) => {
    await axios.put(`/admin/users/${id}/premium`);
    fetchUsers();
  };

  const openReset = (user) => {
    setResetModal({ id: user._id, name: user.name });
    setNewPassword("");
  };

  const handleReset = async () => {
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
    setResetting(true);
    try {
      await axios.put(`/admin/users/${resetModal.id}/reset-password`, { newPassword });
      toast.success(`Password reset for ${resetModal.name}`);
      setResetModal(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <PageShell title="Users" subtitle="Manage platform users and subscriptions">

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800">Reset Password</h3>
            <p className="mt-1 text-sm text-slate-500">
              Set a new password for <strong>{resetModal.name}</strong>
            </p>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 rounded-full bg-emerald-500 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50"
              >
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
              <button
                onClick={() => setResetModal(null)}
                className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Subscription</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="4" className="px-5 py-6 text-center text-slate-500">Loading users...</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan="4" className="px-5 py-6 text-center text-slate-500">No users found</td></tr>
              )}
              {users.map((user) => (
                <tr key={user._id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">{user.name}</td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4">
                    {user.subscriptionPlan === "PREMIUM" ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Premium</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Free</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.subscriptionPlan !== "PREMIUM" && (
                        <button onClick={() => grantPremium(user._id)}
                          className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-400">
                          Grant Premium
                        </button>
                      )}
                      <button onClick={() => openReset(user)}
                        className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-400">
                        Reset Password
                      </button>
                      <button onClick={() => deleteUser(user._id)}
                        className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-medium text-white hover:bg-rose-400">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageShell>
  );
}

export default AdminUsers;