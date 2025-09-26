import api from "./api"; // centralized axios instance

// ✅ Update chef food style
export const updateChefFoodStyle = async (style, token) => {
  const response = await api.post(
    "/chef/profile/update",
    { food_styles: [style] }, // backend expects array
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
