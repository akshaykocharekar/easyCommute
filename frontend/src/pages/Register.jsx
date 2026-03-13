import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

function Register() {
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", { name, email, password });
      setUserId(data.userId);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/verify-email", { userId, otp });
      toast.success("Email verified! You can now login.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/auth/resend-otp", { userId });
      toast.success("OTP resent!");
    } catch {
      toast.error("Could not resend OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold text-slate-900">Create Account</h2>
            <p className="mt-1 text-sm text-slate-500">Join the smart bus tracking system</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-emerald-500 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50">
                {loading ? "Sending OTP..." : "Register"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-slate-900">Verify Email</h2>
            <p className="mt-1 text-sm text-slate-500">Enter the 6-digit OTP sent to <strong>{email}</strong></p>

            <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
              <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-center tracking-widest outline-none focus:ring-2 focus:ring-emerald-200" />
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-emerald-500 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              Didn't receive it?{" "}
              <button onClick={handleResend} className="text-emerald-600 hover:underline">Resend OTP</button>
            </p>
          </>
        )}

        <p className="mt-6 text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;