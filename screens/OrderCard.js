// components/OrderCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import ChefService, { BASE_URL } from "../services/api";

export default function OrderCard({ order, onViewDetails, onRespond }) {
  const [loading, setLoading] = useState(false);

  const respondToOrder = async (action) => {
    const statusMap = { accepted: "chef_accepted", rejected: "cancelled" };
    try {
      setLoading(true);
      const res = await ChefService.updateOrderStatus(order._id, statusMap[action]);
      if (res.status === "success") {
        Alert.alert("Success", `Order ${action} successfully!`);
        onRespond && onRespond(action);
      } else {
        Alert.alert("Error", res.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Order update error:", error);
      Alert.alert("Error", "Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  const isNew = order.status === "pending";
  const isOngoing = ["chef_accepted", "preparing", "ready"].includes(order.status);
  const isDelivered = ["completed", "delivered"].includes(order.status);

  // ✅ Always try both sources for customer data (user_details or user)
  const customer = order.user_details || order.user || {};
  const customerName = customer.name || order.name || 'Unknown';
  const customerPhoto = customer.photo_url
    ? `${BASE_URL}${customer.photo_url}`
    : 'https://i.pravatar.cc/150?u=' + (customer._id || Math.random());

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: customerPhoto }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{customerName}</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.help}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Order Info */}
      <Text style={styles.time}>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</Text>
      <Text style={styles.cuisine}>
        Cuisine: <Text style={styles.cuisineValue}>{order.cuisine || '-'}</Text>
      </Text>
      <Text style={styles.items}>
        Items: {(order.items || []).map(i => i.food_name || i.name).join(', ')}
      </Text>

      {/* Buttons */}
      <View style={styles.row}>
        {isNew && (
          <>
            <TouchableOpacity
              style={styles.reject}
              onPress={() => respondToOrder('rejected')}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#750656" /> : <Text style={styles.rejectText}>Reject</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accept}
              onPress={() => respondToOrder('accepted')}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.acceptText}>Accept</Text>}
            </TouchableOpacity>
          </>
        )}

        {(isOngoing || isDelivered) && (
          <>
            <TouchableOpacity style={styles.accept} onPress={() => onViewDetails(order)}>
              <Text style={styles.acceptText}>View Details</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin: 10, padding: 14, borderRadius: 10, backgroundColor: '#fff', elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#eee' },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  time: { fontSize: 13, color: '#777', marginBottom: 4 },
  cuisine: { fontSize: 13 },
  cuisineValue: { color: '#750656', fontWeight: '600' },
  items: { fontSize: 13, color: '#000', marginBottom: 10 },
  help: { fontSize: 13, color: 'green' },
  reject: { borderWidth: 1, borderColor: '#750656', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  rejectText: { color: '#750656', fontWeight: '600' },
  accept: { backgroundColor: '#DFF3EC', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginLeft: 10 },
  acceptText: { color: '#000', fontWeight: '600' },
});
