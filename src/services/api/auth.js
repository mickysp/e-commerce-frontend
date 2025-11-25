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

export const adminLoginApi = async ({ usernameOrEmail, password }) => {
  const res = await api.post(
    "/api/v1/auth/admin/login",
    { usernameOrEmail, password },
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

export const getAdminProfileApi = async () => {
  const res = await api.get("/api/v1/auth/admin/profile");
  return res.data.admin;
};