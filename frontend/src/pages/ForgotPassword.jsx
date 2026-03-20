import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);

    const timer = setTimeout(() => setSlowWarning(true), 8000);

    try {
      const { data } = await axios.post("/auth/forgot-password", { email });
      setUserId(data.userId);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSlowWarning(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/reset-password", { userId, otp, newPassword });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold text-slate-900">Forgot Password</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your email and we'll send you an OTP</p>
            <form onSubmit={handleSendOTP} className="mt-6 space-y-4">
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />

              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-emerald-500 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </span>
                ) : "Send OTP"}
              </button>

              {slowWarning && (
                <p className="text-center text-xs text-amber-500 animate-pulse">
                  ⏳ Server is waking up, please wait up to 30 seconds...
                </p>
              )}
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-slate-900">Reset Password</h2>
            <p className="mt-1 text-sm text-slate-500">Enter the OTP sent to <strong>{email}</strong></p>
            <form onSubmit={handleReset} className="mt-6 space-y-4">
              <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-center tracking-widest outline-none focus:ring-2 focus:ring-emerald-200" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-emerald-500 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;