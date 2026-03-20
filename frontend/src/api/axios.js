import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true,
  timeout: 60000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pre-warm Render when in production
if (import.meta.env.PROD) {
  fetch(import.meta.env.VITE_API_URL + "/health").catch(() => {});
}

export default axiosInstance;