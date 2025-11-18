import axios from "axios";
import store from "@/store";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || "/",
  withCredentials: false,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const { Authorization } = store.getters.authHeader;
  if (Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = Authorization;
  }
  return config;
});

export default api;