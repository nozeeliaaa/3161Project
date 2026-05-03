import axios from "axios";
import { clearStoredSession, getStoredToken } from "../utils/storage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || "Something went wrong";

    if (error.response?.status === 401) {
      clearStoredSession();
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status
    });
  }
);

export default apiClient;
