import api from "./api";

export const loginApi = async ({ email, password }) => {
  const res = await api.post(
    "/api/v1/auth/login",
    { email, password },
    { skipAuth: true }
  );
  return res.data;
};

export const sellerLoginApi = async ({ email, password }) => {
  const res = await api.post(
    "/api/v1/seller/login",
    { email, password },
    { skipAuth: true }
  );
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/api/v1/auth/logout");
  return res.data;
};

export const registerApi = async (payload) => {
  const res = await api.post("/api/v1/auth/register", payload, { skipAuth: true });
  return res.data;
};

export const sellerRegisterApi = async (payload) => {
  const res = await api.post("/api/v1/seller/register", payload);
  return res.data;
};