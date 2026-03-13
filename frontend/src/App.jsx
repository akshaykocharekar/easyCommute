import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useContext, useEffect, useState, lazy } from "react";
import ForgotPassword from "./pages/ForgotPassword";

import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const OperatorRegister = lazy(() => import("./pages/OperatorRegister"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TrackBus = lazy(() => import("./pages/TrackBus"));
const SearchRoute = lazy(() => import("./pages/SearchRoute"));
const NearbyBuses = lazy(() => import("./pages/NearbyBuses"));
const Plans = lazy(() => import("./pages/Plans"));
const UpgradePremium = lazy(() => import("./pages/UpgradePremium"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminBuses = lazy(() => import("./pages/AdminBuses"));
const AdminRoutes = lazy(() => import("./pages/AdminRoutes"));
const AdminOperators = lazy(() => import("./pages/AdminOperators"));
const AdminIntegrity = lazy(() => import("./pages/AdminIntegrity"));
const AdminSupport = lazy(() => import("./pages/AdminSupport"));

const CreateBus = lazy(() => import("./pages/CreateBus"));

const AssignRoute = lazy(() => import("./pages/AssignRoute"));
const CreateRoute = lazy(() => import("./pages/CreateRoute"));
const AddStop = lazy(() => import("./pages/AddStop"));

const OperatorPanel = lazy(() => import("./pages/OperatorPanel"));

function AppSplash({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white">
              🚌
            </div>
            <div className="text-xl font-semibold text-slate-900">EasyCommute</div>
            <div className="mt-1 text-sm text-slate-500">Getting things ready…</div>
            <div className="mx-auto mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ x: "-60%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 1.0, ease: "easeInOut", repeat: Infinity }}
                className="h-full w-24 rounded-full bg-emerald-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const { token, user } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(t);
  }, []);

  const showBottomNav =
    Boolean(token) && (user?.role === "USER" || user?.role === "BUS_OPERATOR");

  return (
    <Router>
      <Navbar />

      <div className={showBottomNav ? "pb-20 pb-safe-bottom md:pb-0" : undefined}>
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
              Loading…
            </div>
          }
        >
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-operator" element={<OperatorRegister />} />
            
<Route path="/forgot-password" element={<ForgotPassword />} />

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
              <Route path="support" element={<AdminSupport />} />
              <Route path="integrity" element={<AdminIntegrity />} />
              <Route path="create-bus" element={<CreateBus />} />
              <Route path="create-route" element={<CreateRoute />} />
              <Route path="assign-route" element={<AssignRoute />} />
              
              <Route path="add-stop" element={<AddStop />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      <BottomNav />
      <AppSplash visible={showSplash} />
    </Router>
  );
}

export default App;