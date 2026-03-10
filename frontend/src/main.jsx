import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './App.css'
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { background: "rgba(15, 23, 42, 0.95)", color: "#fff" },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);