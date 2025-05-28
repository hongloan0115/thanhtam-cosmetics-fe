import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:8000", // Ensure base URL is set
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
