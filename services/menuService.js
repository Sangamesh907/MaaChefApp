import api from "./api";

// Add a new menu item with image upload
export const addMenuItemApi = async (formData, token) => {
  try {
    const response = await api.post("/chef/item/add", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      maxBodyLength: Infinity,       // ✅ Allow large uploads
      maxContentLength: Infinity,    // ✅ Allow large uploads
    });
    return response.data;
  } catch (err) {
    console.error("❌ Add item failed:", err.response?.data || err.message);
    throw err;
  }
};

// Update menu item
export const updateMenuItemApi = async (itemId, formData, token) => {
  try {
    const response = await api.post(`/chef/item/update/${itemId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      maxBodyLength: Infinity,       // ✅ Allow large uploads
      maxContentLength: Infinity,    // ✅ Allow large uploads
    });
    return response.data;
  } catch (err) {
    console.error("❌ Update item failed:", err.response?.data || err.message);
    throw err;
  }
};
