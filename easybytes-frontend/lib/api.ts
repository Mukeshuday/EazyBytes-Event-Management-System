import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// ✅ Base Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Attach token if available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("token"); // JWT stored in cookie
  if (token) {
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
      Cookies.remove("token");
      // window.location.href = "/login"; // Optional auto redirect
    }
    return Promise.reject(error);
  }
);

export default api;
