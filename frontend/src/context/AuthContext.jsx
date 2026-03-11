import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Read synchronously so the very first render already has auth state.
// This prevents the Home page flash for logged-in users.
function getInitialToken() {
  return localStorage.getItem("token") || null;
}

function getInitialUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getInitialToken);
  const [user,  setUser]  = useState(getInitialUser);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const updateUser = (userData) => {
    const saved  = JSON.parse(localStorage.getItem("user") || "{}");
    const merged = { ...saved, ...userData };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};