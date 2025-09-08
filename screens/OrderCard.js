// components/OrderCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function OrderCard({ order, onViewDetails }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{order.name}</Text>
        <TouchableOpacity>
          <Text style={styles.help}>Help</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.time}>{order.time}</Text>
      <Text style={styles.cuisine}>Cuisine: <Text style={styles.cuisineValue}>{order.cuisine}</Text></Text>
      <Text style={styles.items}>Items: {order.items}</Text>
      <View style={styles.row}>
        {order.status === 'New Orders' && (
          <>
            <TouchableOpacity style={styles.reject}>
              <Text style={styles.rejectText}>Reject Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accept}>
              <Text style={styles.acceptText}>Accept Order</Text>
            </TouchableOpacity>
          </>
        )}

        {order.status === 'Ongoing Orders' && (
          <>
            <TouchableOpacity style={styles.inProcess}>
              <Text style={styles.inProcessText}>In Process</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accept}>
              <Text style={styles.acceptText}>View Details</Text>
            </TouchableOpacity>
          </>
        )}

        {order.status === 'Delivered' && (
          <>
            <TouchableOpacity style={styles.delivered}>
              <Text style={styles.deliveredText}>Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accept}>
              <Text style={styles.acceptText}>View Details</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 16, fontWeight: '600' },
  time: { fontSize: 13, color: '#777', marginVertical: 4 },
  cuisine: { fontSize: 13 },
  cuisineValue: { color: '#750656', fontWeight: '600' },
  items: { fontSize: 13, color: '#000', marginBottom: 10 },

  help: { fontSize: 13, color: 'green' },

  reject: {
    borderWidth: 1,
    borderColor: '#750656',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rejectText: { color: '#750656', fontWeight: '600' },

  accept: {
    backgroundColor: '#DFF3EC',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  acceptText: { color: '#000', fontWeight: '600' },

  inProcess: {
    borderWidth: 1,
    borderColor: '#04aa6d',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  inProcessText: { color: '#04aa6d', fontWeight: '600' },

  delivered: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deliveredText: { color: '#000', fontWeight: '600' },
});
