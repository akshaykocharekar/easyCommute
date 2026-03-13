import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function UpgradePremium() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTrial = searchParams.get("trial") === "true";

  useEffect(() => {
    if (user?.subscriptionStatus === "ACTIVE" || user?.subscriptionStatus === "TRIAL") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const startTrial = async () => {
    try {
      const { data } = await axios.post("/subscription/trial");
      updateUser({
        subscriptionPlan: data.user.subscriptionPlan,
        subscriptionStatus: data.user.subscriptionStatus,
        trialStartedAt: data.user.trialStartedAt,
        trialUsed: data.user.trialUsed,
      });
      toast.success("Free trial activated! Enjoy 24 hours of Premium.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not start trial");
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const upgradePremium = async () => {
    try {
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) { toast.error("Razorpay SDK failed to load."); return; }

      const { data: order } = await axios.post("/payment/create-order");

      const options = {
        key: "rzp_test_SGpIc8h7ViAwhr",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "EasyCommute",
        description: "Premium Subscription",
        handler: async function (response) {
          const { data } = await axios.post("/payment/verify", response);
          if (data?.user) {
            updateUser({
              subscriptionPlan: data.user.subscriptionPlan,
              subscriptionStatus: data.user.subscriptionStatus,
            });
          }
          toast.success("Premium activated!");
          navigate("/dashboard", { replace: true });
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <h1 className="text-2xl font-semibold text-slate-900 text-center">
          {isTrial ? "Start Your Free Trial" : "Upgrade to Premium"}
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2">
          {isTrial ? "7 days of full Premium access, no payment needed" : "Unlock advanced transport features"}
        </p>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2"><span>📍</span><p>Nearby bus tracking</p></div>
          <div className="flex items-center gap-2"><span>⚡</span><p>Real-time bus locations</p></div>
          <div className="flex items-center gap-2"><span>🗺</span><p>Advanced route search</p></div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-3xl font-semibold text-slate-900">{isTrial ? "Free" : "₹30"}</p>
          <p className="text-xs text-slate-500">{isTrial ? "1 day trial" : "One time payment"}</p>
        </div>

        {isTrial ? (
          <button
            onClick={startTrial}
            className="mt-6 w-full rounded-full bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-400 transition"
          >
            Activate Free Trial
          </button>
        ) : (
          <button
            onClick={upgradePremium}
            className="mt-6 w-full rounded-full bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-400 transition"
          >
            Pay with Razorpay
          </button>
        )}

        {!isTrial && !user?.trialUsed && (
          <p className="mt-4 text-center text-xs text-slate-400">
            Want to try first?{" "}
            <a href="/upgrade?trial=true" className="text-emerald-500 underline">Start free trial</a>
          </p>
        )}

      </div>
    </div>
  );
}

export default UpgradePremium;