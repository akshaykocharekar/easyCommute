import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Plans() {
  const { user } = useContext(AuthContext);

  if (user?.subscriptionPlan === "PREMIUM") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Subscription Plans</h1>

      <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "300px"
      }}>

        <h2>Premium</h2>

        <p>₹500 / month</p>

        <ul>
          <li>Live Bus Tracking</li>
          <li>ETA Predictions</li>
          <li>Nearby Buses</li>
        </ul>

        <Link to="/upgrade">
          <button>Upgrade</button>
        </Link>

      </div>

    </div>
  );
}

export default Plans;