import api from "./api";

export const getAdminUsersApi = async () => {
  const res = await api.get("/api/v1/admin/users");
  return res.data;
};

export const updateAdminUserStatusApi = async (userId, status) => {
  const res = await api.put(`/api/v1/admin/users/${userId}/status`, {
    status,
  });
  return res.data;
};