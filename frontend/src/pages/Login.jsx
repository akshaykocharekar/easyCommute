import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);

    const timer = setTimeout(() => setSlowWarning(true), 8000);

    try {
      const { data } = await axios.post("/auth/login", { email, password });
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate(data.user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSlowWarning(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-yellow-300/40 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-emerald-400/40 blur-[120px]" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
        <h2 className="text-center text-2xl font-semibold text-slate-900">Welcome Back</h2>
        <p className="mt-1 text-center text-sm text-slate-500">Login to your EasyCommute account</p>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <input
            type="email" placeholder="Email address" value={email} required
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          <input
            type="password" placeholder="Password" value={password} required
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />

          <button
            type="submit" disabled={loading}
            className="rounded-full bg-black py-2 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>

          {slowWarning && (
            <p className="text-center text-xs text-amber-500 animate-pulse">
              ⏳ Server is waking up, please wait up to 30 seconds...
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-emerald-600 hover:underline">Register</Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          Are you an operator?{" "}
          <Link to="/register-operator" className="font-medium text-emerald-600 hover:underline">Register as Operator</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;