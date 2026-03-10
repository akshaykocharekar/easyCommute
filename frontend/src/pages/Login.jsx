import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      login(data.token, data.user);
      toast.success("Welcome back");

      if (data.user.role === "SUPER_ADMIN") {
        navigate("/admin");
      } else if (data.user.role === "BUS_OPERATOR") {
        navigate("/operator");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6">

      {/* Gradient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-yellow-300/40 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-emerald-400/40 blur-[120px]" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">

        <h2 className="text-center text-2xl font-semibold text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-1 text-center text-sm text-slate-500">
          Login to your EasyCommute account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-black py-2 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-600 hover:underline"
          >
            Register
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-slate-500">
          Are you an operator?{" "}
          <Link to="/register-operator" className="font-medium text-emerald-600 hover:underline">
            Register as Operator
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;