import api from "./api"; // central axios instance

// ✅ Update chef profile (with image upload)
export const updateChefProfile = async (formData, token) => {
  const response = await api.post("/chef/profile/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
