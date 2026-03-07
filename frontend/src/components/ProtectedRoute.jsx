import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {

  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {

    if (user.role === "SUPER_ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "BUS_OPERATOR") {
      return <Navigate to="/operator" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;