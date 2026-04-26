import axios from "axios";
import API_BASE from "./api";

const axios1 = axios.create({
  baseURL: API_BASE,
});

// Attach token to every request automatically
axios1.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios1;