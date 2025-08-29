import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";

// ✅ Base Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies if backend uses them
});

// ✅ Attach token if available
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = Cookies.get("token"); // JWT stored in cookie
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle common errors (like expired token)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized, token may be expired.");
      // 👉 Optional: auto logout or redirect
      Cookies.remove("token");
      // window.location.href = "/login"; // Uncomment if needed
    }
    return Promise.reject(error);
  }
);

export default api;
