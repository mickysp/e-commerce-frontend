import axios from "axios";
import store from "@/store";
import swalAlert from "@/services/alert/swalServices";
import { jwtDecode } from "jwt-decode";
import router from "@/router";

const API_URL = process.env.VUE_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let loggingOut = false;

const forceLogout = async (message) => {
  if (loggingOut) return;
  loggingOut = true;

  if (message) {
    await swalAlert.Error(message, "กำลังนำคุณไปที่หน้าเข้าสู่ระบบ...");
  }
  localStorage.clear();
  router.push({ name: "login" });
};

api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }

    const token = store.getters.accessToken;
    const userId = store.getters.userId;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < now) {
          return forceLogout("เซสชันหมดอายุ").then(() =>
            Promise.reject("Token expired")
          );
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error("Invalid token:", e);
        return forceLogout("Token ไม่ถูกต้อง").then(() =>
          Promise.reject("Invalid token")
        );
      }
    }

    if (userId) {
      config.headers["X-User-Id"] = userId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const data = error.response?.data;
    const status = error.response?.status;
    const currentRoute = router.currentRoute?.value || router.currentRoute;

    const isFormPage =
      currentRoute?.name === "job_recruitment_form" ||
      currentRoute?.name === "training_form";

    if ((status === 401 || data?.message === "Invalid token") && !isFormPage) {
      return forceLogout("กรุณาเข้าสู่ระบบใหม่");
    }

    return Promise.reject(error);
  }
);

export default api;
