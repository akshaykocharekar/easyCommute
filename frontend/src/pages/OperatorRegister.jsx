import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function OperatorRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);

    const timer = setTimeout(() => setSlowWarning(true), 8000);

    try {
      const { data } = await axios.post("/auth/register-operator", {
        name,
        phone,
        email,
        password,
      });
      login(data.token, data.user);
      toast.success(
        "Registered! Await admin verification before you can go live."
      );
      navigate("/operator");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Operator registration failed."
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSlowWarning(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Operator Registration
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Register as an operator. Admin verification is required before you can
          be assigned a bus.
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
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Registering...
              </span>
            ) : (
              "Register as Operator"
            )}
          </button>

          {slowWarning && (
            <p className="text-center text-xs text-amber-500 animate-pulse">
              ⏳ Server is waking up, please wait up to 30 seconds...
            </p>
          )}
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
