import api from "./api";

export const changePasswordApi = async ({
  currentPassword,
  newPassword,
  confirmNewPassword,
}) => {
  const { data } = await api.put("/api/v1/users/profile/password", {
    currentPassword,
    newPassword,
    confirmNewPassword,
  });
  return data;
};

export const getProfileApi = async () => {
  const { data } = await api.get("/api/v1/users/profile");
  return data;
};

export const updateProfileApi = async (payload) => {
  const { data } = await api.put("/api/v1/users/update/profile", payload);
  return data;
};

export const updateProfileImageApi = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const { data } = await api.put(
    "/api/v1/users/profile/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const deleteProfileImageApi = async () => {
  const { data } = await api.delete("/api/v1/users/profile/image");
  return data;
};

export const getMyAddresses = async () => {
  const { data } = await api.get("/api/v1/users/addresses");
  return data;
};

export const createAddress = async (payload) => {
  const { data } = await api.post("/api/v1/users/addresses", payload);
  return data;
};

export const updateAddress = async (id, payload) => {
  const { data } = await api.put(`/api/v1/users/addresses/${id}`, payload);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await api.delete(`/api/v1/users/addresses/${id}`);
  return data;
};

export const setDefaultAddress = async (id) => {
  const { data } = await api.put(`/api/v1/users/addresses/${id}/default`);
  return data;
};
