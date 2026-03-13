import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

function Login() {
  const [step, setStep] = useState(1); // 1=credentials, 2=otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", { email, password });

      if (data.requiresOTP) {
        setUserId(data.userId);
        toast.success("OTP sent to your email!");
        setStep(2);
        return;
      }

      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate(data.user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
    } catch (error) {
      const err = error?.response?.data;
      if (err?.userId) {
        // Email not verified
        setUserId(err.userId);
        toast.error(err.message);
        setStep(2);
        return;
      }
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/verify-login-otp", { userId, otp });
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate(data.user.role === "BUS_OPERATOR" ? "/operator" : "/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-yellow-300/40 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-emerald-400/40 blur-[120px]" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">

        {step === 1 ? (
          <>
            <h2 className="text-center text-2xl font-semibold text-slate-900">Welcome Back</h2>
            <p className="mt-1 text-center text-sm text-slate-500">Login to your EasyCommute account</p>

            <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
              <input type="email" placeholder="Email address" value={email} required onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
              <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />

              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading}
                className="rounded-full bg-black py-2 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-60">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-center text-2xl font-semibold text-slate-900">Enter OTP</h2>
            <p className="mt-1 text-center text-sm text-slate-500">Check <strong>{email}</strong> for your 6-digit code</p>

            <form onSubmit={handleVerifyOTP} className="mt-6 flex flex-col gap-4">
              <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-center tracking-widest outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
              <button type="submit" disabled={loading}
                className="rounded-full bg-black py-2 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-60">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

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