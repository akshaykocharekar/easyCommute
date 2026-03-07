import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import AdminUsers from "./pages/AdminUsers";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TrackBus from "./pages/TrackBus";
import SearchRoute from "./pages/SearchRoute";
import NearbyBuses from "./pages/NearbyBuses";
import Plans from "./pages/Plans";
import UpgradePremium from "./pages/UpgradePremium";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBuses from "./pages/AdminBuses";
import AdminRoutes from "./pages/AdminRoutes";
import AdminOperators from "./pages/AdminOperators";
import AdminIntegrity from "./pages/AdminIntegrity";

import CreateBus from "./pages/CreateBus";
import ApproveBuses from "./pages/ApproveBuses";
import AssignRoute from "./pages/AssignRoute";
import CreateRoute from "./pages/CreateRoute";
import AddStop from "./pages/AddStop";

import OperatorPanel from "./pages/OperatorPanel";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* TRACK BUS */}
        <Route
          path="/track/:busId"
          element={
            <ProtectedRoute>
              <TrackBus />
            </ProtectedRoute>
          }
        />

        {/* SEARCH ROUTE */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchRoute />
            </ProtectedRoute>
          }
        />

        {/* NEARBY BUSES */}
        <Route
          path="/nearby"
          element={
            <ProtectedRoute>
              <NearbyBuses />
            </ProtectedRoute>
          }
        />

        {/* SUBSCRIPTION PLANS */}
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <Plans />
            </ProtectedRoute>
          }
        />

        {/* PREMIUM UPGRADE */}
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <UpgradePremium />
            </ProtectedRoute>
          }
        />

        {/* OPERATOR PANEL */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute requiredRole="BUS_OPERATOR">
              <OperatorPanel />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="SUPER_ADMIN">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="buses" element={<AdminBuses />} />
          <Route path="routes" element={<AdminRoutes />} />
          <Route path="operators" element={<AdminOperators />} />
          <Route path="integrity" element={<AdminIntegrity />} />
          <Route path="create-bus" element={<CreateBus />} />
          <Route path="create-route" element={<CreateRoute />} />
          <Route path="assign-route" element={<AssignRoute />} />
          <Route path="approve-buses" element={<ApproveBuses />} />
          <Route path="add-stop" element={<AddStop />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;