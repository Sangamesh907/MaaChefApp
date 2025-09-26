import api from "./api"; // ✅ centralized axios instance

// Get Orders (pending, completed, etc.)
export const getOrders = async (status, token) => {
  try {
    const response = await api.get(`/chef/orders?status=${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("❌ Fetch orders failed:", err.response?.data || err.message);
    throw err;
  }
};

// Update Order Status (accept, reject, complete, etc.)
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await api.put(
      `/chef/orders/${orderId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err) {
    console.error("❌ Update order status failed:", err.response?.data || err.message);
    throw err;
  }
};

// Get Single Order Details
export const getOrderDetails = async (orderId, token) => {
  try {
    const response = await api.get(`/chef/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("❌ Fetch order details failed:", err.response?.data || err.message);
    throw err;
  }
};
