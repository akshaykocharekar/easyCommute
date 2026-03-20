import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

function OperatorRegister() {
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);

    const timer = setTimeout(() => setSlowWarning(true), 8000);

    try {
      const { data } = await axios.post("/auth/register-operator", { name, phone, email, password });
      setUserId(data.userId);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operator registration failed");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setSlowWarning(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/verify-email", { userId, otp });
      toast.success("Email verified! Await admin verification before logging in.");
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
            <h2 className="text-2xl font-semibold text-slate-900">Operator Registration</h2>
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
                className="w-full rounded-full bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending OTP...
                  </span>
                ) : "Register as Operator"}
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
            <h2 className="text-2xl font-semibold text-slate-900">Verify Email</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-center tracking-widest outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              Didn't receive it?{" "}
              <button onClick={handleResend} className="text-emerald-600 hover:underline">
                Resend OTP
              </button>
            </p>
          </>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default OperatorRegister;