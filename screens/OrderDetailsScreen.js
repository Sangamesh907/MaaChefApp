// screens/OrderDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function OrderDetailsScreen({ route }) {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order #{order.id}</Text>

      <View style={styles.box}>
        <Text style={styles.name}>{order.name}</Text>
        <Text style={styles.time}>{order.time}</Text>
        <Text style={styles.cuisine}>Cuisine: <Text style={styles.cuisineValue}>{order.cuisine}</Text></Text>
      </View>

      <Text style={styles.subheading}>Order Details</Text>

      <View style={styles.orderBox}>
        <Text style={styles.rowText}>Dosa x 1 ₹60</Text>
        <Text style={styles.rowText}>Idly x 1 ₹60</Text>
        <View style={styles.divider} />
        <Text>Subtotal ₹120</Text>
        <Text>Promo -₹75</Text>
        <Text>Delivery ₹25</Text>
        <Text>Tax ₹25</Text>
        <View style={styles.divider} />
        <Text style={styles.total}>Total ₹120</Text>
        <Text style={styles.savings}>Your Total Savings ₹75</Text>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.reject}>
          <Text style={styles.rejectText}>Reject Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accept}>
          <Text style={styles.acceptText}>Accept Order</Text>
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
  },
  rejectText: { color: '#750656', fontWeight: '600' },
  accept: {
    backgroundColor: '#DFF3EC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  acceptText: { color: '#000', fontWeight: '600' },
});
