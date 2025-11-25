import api from "./api";

export const getAdminUsersApi = async () => {
  const res = await api.get("/api/v1/admin/users");
  return res.data;
};

export const getAdminUserByIdApi = async (userId) => {
  const res = await api.get(`/api/v1/admin/users/${userId}`);
  return res.data;
};