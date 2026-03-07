import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/admin/users");
    setUsers(res.data);
    setLoading(false);
  };

  const deleteUser = async (id) => {
    await axios.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const grantPremium = async (id) => {
    await axios.put(`/admin/users/${id}/premium`);
    fetchUsers();
  };

  return (
    <PageShell
      title="Users"
      subtitle="Manage platform users and subscriptions"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >

        {/* TABLE */}
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
                <tr>
                  <td colSpan="4" className="px-5 py-6 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-6 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-medium text-slate-800">
                    {user.name}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">

                    {user.subscriptionPlan === "PREMIUM" ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Premium
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Free
                      </span>
                    )}

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {user.subscriptionPlan !== "PREMIUM" && (
                        <button
                          onClick={() => grantPremium(user._id)}
                          className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-400"
                        >
                          Grant Premium
                        </button>
                      )}

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-medium text-white hover:bg-rose-400"
                      >
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