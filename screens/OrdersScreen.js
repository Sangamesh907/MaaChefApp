// screens/OrdersScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ChefContext } from "../context/ChefContext";

export default function OrdersScreen() {
  const { token } = useContext(ChefContext);
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState("New");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://13.204.84.41/api/chef/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success" && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("🔥 Error fetching orders:", error.message);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Respond to order (accept/reject)
  const respondToOrder = async (orderId, status) => {
    try {
      const response = await axios.post(
        "http://13.204.84.41/api/orders/chef/response",
        {
          order_id: orderId,
          status: status, // 'accepted' or 'rejected'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", `Order ${status} successfully!`);
        fetchOrders(); // Refresh list after action
      } else {
        Alert.alert("Error", response.data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error responding to order:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "New") {
      return order.chef_status === "pending";
    } else if (activeTab === "Ongoing") {
      return order.chef_status === "accepted" && order.delivery_status !== "delivered";
    } else if (activeTab === "Delivered") {
      return order.delivery_status === "delivered" || order.status === "delivered";
    }
    return true;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#008080" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["New", "Ongoing", "Delivered"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab} Orders
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.center}>
            <Text>No {activeTab.toLowerCase()} orders found</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order._id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.customerName}>
                    {order.address?.label || "Unknown Address"}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                  <Text style={styles.items}>
                    {order.items && order.items.length > 0
                      ? order.items
                          .map(
                            (i) =>
                              `${i.food_name} x ${i.quantity} (₹${i.price})`
                          )
                          .join(", ")
                      : "No items"}
                  </Text>
                </View>
                <Text style={styles.amount}>₹ {order.total_price}</Text>
              </View>

              <View style={styles.actionRow}>
                {activeTab === "New" && (
                  <>
                    <TouchableOpacity
                      style={styles.statusBtn}
                      onPress={() => respondToOrder(order._id, "rejected")}
                    >
                      <Text style={styles.statusText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => respondToOrder(order._id, "accepted")}
                    >
                      <Text style={styles.viewText}>Accept</Text>
                    </TouchableOpacity>
                  </>
                )}

                {activeTab !== "New" && (
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() =>
                      navigation.navigate("OrderDetails", { orderId: order._id })
                    }
                  >
                    <Text style={styles.viewText}>View Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", padding: 16 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab: { paddingVertical: 10 },
  tabText: { fontSize: 14, color: "#888" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#000" },
  activeTabText: { color: "#000", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  customerName: { fontWeight: "bold", fontSize: 16 },
  date: { fontSize: 12, color: "#666", marginBottom: 4 },
  items: { fontSize: 13, color: "#333", marginBottom: 4 },
  amount: { fontWeight: "bold", fontSize: 16, color: "#000" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  statusBtn: {
    borderWidth: 1,
    borderColor: "#008080",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: "#008080", fontWeight: "500" },
  viewBtn: {
    backgroundColor: "#D8F2EC",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewText: { color: "#000", fontWeight: "500" },
});
