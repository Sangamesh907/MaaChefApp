// screens/OrderDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ChefService from "../services/api"; // ✅ default export

export default function OrderDetailsScreen({ route, navigation }) {
  const order = route?.params?.order;
  const [loading, setLoading] = useState(false);

  if (!order) return <Text style={{ padding: 20 }}>Order data not available</Text>;

  // Map button actions to backend valid statuses
  const handleResponse = async (status) => {
    // status should be one of: "chef_accepted", "preparing", "ready", "completed", "cancelled"
    try {
      setLoading(true);
      const res = await ChefService.updateOrderStatus(order._id, status);

      if (res.status === 'success') {
        Alert.alert('Success', `Order marked as "${status}" successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', res.message || 'Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order #{order._id || 'N/A'}</Text>

      <View style={styles.box}>
        <Text style={styles.name}>{order.name || 'Unknown'}</Text>
        <Text style={styles.time}>{order.created_at || '-'}</Text>
        <Text style={styles.cuisine}>
          Cuisine: <Text style={styles.cuisineValue}>{order.cuisine || '-'}</Text>
        </Text>
      </View>

      <Text style={styles.subheading}>Order Details</Text>

      <View style={styles.orderBox}>
        {(order.items || []).map((item, idx) => (
          <Text key={idx} style={styles.rowText}>
            {item.name || '-'} x {item.quantity || 1} ₹{item.price || 0}
          </Text>
        ))}
        <View style={styles.divider} />
        <Text>Subtotal ₹{order.subtotal || 0}</Text>
        <Text>Promo -₹{order.promo || 0}</Text>
        <Text>Delivery ₹{order.delivery || 0}</Text>
        <Text>Tax ₹{order.tax || 0}</Text>
        <View style={styles.divider} />
        <Text style={styles.total}>Total ₹{order.total || 0}</Text>
        <Text style={styles.savings}>Your Total Savings ₹{order.savings || 0}</Text>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.reject}
          onPress={() => handleResponse('cancelled')}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#750656" /> : <Text style={styles.rejectText}>Cancel Order</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accept}
          onPress={() => handleResponse('chef_accepted')}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.acceptText}>Accept Order</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold' },
  box: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  name: { fontWeight: '600' },
  time: { fontSize: 12, color: '#666' },
  cuisine: { marginTop: 5 },
  cuisineValue: { color: '#750656', fontWeight: '600' },
  subheading: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  orderBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 10,
  },
  rowText: { fontSize: 14, marginVertical: 2 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginVertical: 10 },
  total: { fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  savings: { color: '#04aa6d', fontSize: 14, marginTop: 10 },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  reject: {
    borderWidth: 1,
    borderColor: '#750656',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.48,
    alignItems: 'center',
  },
  rejectText: { color: '#750656', fontWeight: '600' },
  accept: {
    backgroundColor: '#DFF3EC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.48,
    alignItems: 'center',
  },
  acceptText: { color: '#000', fontWeight: '600' },
});
