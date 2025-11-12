// screens/OrdersScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChefService from "../services/api";
import { BASE_URL } from "../services/api";

export default function OrdersScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("New");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === "New") response = await ChefService.getOrders("incoming");
      else if (activeTab === "Ongoing") response = await ChefService.getOrders("ongoing");
      else response = await ChefService.getOrders("completed");

      if (response.status === "success" && response.orders) setOrders(response.orders);
      else setOrders([]);
    } catch (error) {
      console.error("🔥 Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const respondToOrder = async (orderId, status) => {
    const statusMap = { accepted: "chef_accepted", rejected: "cancelled" };
    try {
      const response = await ChefService.updateOrderStatus(orderId, statusMap[status]);
      if (response.status === "success") {
        Alert.alert("Success", `Order ${status} successfully!`);
        fetchOrders();
      } else {
        Alert.alert("Error", response.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error responding to order:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#008080" />
        <Text style={{ marginTop: 8 }}>Loading orders...</Text>
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
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {orders.length === 0 ? (
          <View style={styles.center}>
            <Text>No {activeTab.toLowerCase()} orders found</Text>
          </View>
        ) : (
          orders.map((order) => {
            // ✅ Handle all user info cases
            const customer =
              order.user_details || order.user || order.customer || {};
            const customerName =
              customer.name || order.name || order.customer_name || "Unknown";
            const customerPhoto = customer.photo_url
              ? `${BASE_URL}${customer.photo_url}`
              : customer.image
              ? `${BASE_URL}${customer.image}`
              : "https://i.pravatar.cc/150?u=" + (customer._id || Math.random());

            return (
              <View key={order._id} style={styles.card}>
                <View style={styles.rowBetween}>
                  {/* Customer Info */}
                  <View style={styles.customerInfo}>
                    <Image source={{ uri: customerPhoto }} style={styles.avatar} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={styles.customerName}>{customerName}</Text>
                      <Text style={styles.date}>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "-"}
                      </Text>
                      <Text style={styles.items}>
                        {order.items && order.items.length > 0
                          ? order.items
                              .map(
                                (i) =>
                                  `${i.food_name || i.name} x ${i.quantity || 1}`
                              )
                              .join(", ")
                          : "No items"}
                      </Text>
                      <Text style={styles.cuisine}>
                        {order.cuisine || "Cuisine"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.amount}>
                    ₹ {order.total || order.total_price || 0}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  {activeTab === "New" ? (
                    <>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => respondToOrder(order._id, "rejected")}
                      >
                        <Text style={styles.rejectText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => respondToOrder(order._id, "accepted")}
                      >
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                    </>
                  ) : activeTab === "Ongoing" ? (
                    <>
                      <TouchableOpacity style={styles.inProcessBtn}>
                        <Text style={styles.inProcessText}>In Process</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => navigation.navigate("OrderDetails", { order })}
                      >
                        <Text style={styles.viewText}>View Details</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.deliveredBtn}
                      onPress={() => navigation.navigate("OrderDetails", { order })}
                    >
                      <Text style={styles.deliveredText}>Delivered</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", padding: 16, color: "#333" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab: { paddingVertical: 10 },
  tabText: { fontSize: 14, color: "#888" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#008080" },
  activeTabText: { color: "#008080", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  customerInfo: { flexDirection: "row", flex: 1, alignItems: "center" },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },

  customerName: { fontWeight: "bold", fontSize: 16, color: "#000" },
  date: { fontSize: 12, color: "#666" },
  items: { fontSize: 13, color: "#333" },
  cuisine: { fontSize: 13, color: "#AA00FF", fontWeight: "600", marginTop: 2 },
  amount: { fontWeight: "bold", fontSize: 16, color: "#000" },

  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap" },
  rejectBtn: {
    borderWidth: 1,
    borderColor: "#FF5C5C",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 5,
  },
  rejectText: { color: "#FF5C5C", fontWeight: "500" },
  acceptBtn: {
    backgroundColor: "#D8F2EC",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  acceptText: { color: "#008080", fontWeight: "500" },
  inProcessBtn: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 5,
  },
  inProcessText: { color: "#856404", fontWeight: "500" },
  deliveredBtn: {
    backgroundColor: "#D4EDDA",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 5,
  },
  deliveredText: { color: "#155724", fontWeight: "500" },
  viewBtn: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  viewText: { color: "#000", fontWeight: "500" },
});
