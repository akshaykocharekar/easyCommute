import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './App.css'
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);