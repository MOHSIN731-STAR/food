import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 👈 tumhara Next.js API ka base route
});

// ✅ Har request ke header me token inject
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
