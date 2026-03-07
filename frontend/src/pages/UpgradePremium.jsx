import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function UpgradePremium() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.subscriptionPlan === "PREMIUM") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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

      const scriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

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
          alert("Premium activated!");
          navigate("/dashboard", { replace: true });

        },

        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (error) {

      console.error(error);
      alert("Payment failed");

    }

  };

  return (
    <div>

      <h1>Upgrade to Premium</h1>

      <button onClick={upgradePremium}>
        Pay ₹500
      </button>

    </div>
  );
}

export default UpgradePremium;