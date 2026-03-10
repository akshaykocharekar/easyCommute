import { useState } from "react";
import { registerOperator } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function OperatorRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerOperator({ name, phone, email, password });
      toast.success("Registration submitted. Await admin verification.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operator registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Operator Registration
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Register as an operator. Admin verification is required before assignment.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Register as Operator"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OperatorRegister;

