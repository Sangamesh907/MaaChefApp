// screens/OrdersScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const mockOrders = [
  {
    id: '23568',
    name: 'Pramodh',
    date: '9th February at 12:05am',
    cuisine: 'Andhra Style',
    items: 'Dosa x 1, Idly x 2',
    amount: '120',
    status: 'In Process',
  },
  {
    id: '23569',
    name: 'Ibrahim',
    date: '9th February at 12:05am',
    cuisine: 'Maharastrian',
    items: 'Dosa x 1, Idly x 2',
    amount: '120',
    status: 'Delivered',
  },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('Ongoing');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['New', 'Ongoing', 'Delivered'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab} Orders
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {mockOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.customerName}>{order.name}</Text>
                <Text style={styles.date}>{order.date}</Text>
                <Text style={styles.cuisine}>Cuisine : <Text style={{ color: '#750656' }}>{order.cuisine}</Text></Text>
                <Text style={styles.items}>{order.items}</Text>
              </View>
              <Text style={styles.amount}>₹ {order.amount}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.statusBtn}>
                <Text style={styles.statusText}>{order.status}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    marginBottom: 4,
  },
  items: {
    fontSize: 13,
    color: '#333',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusBtn: {
    borderWidth: 1,
    borderColor: '#008080',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#008080',
    fontWeight: '500',
  },
  viewBtn: {
    backgroundColor: '#D8F2EC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewText: {
    color: '#000',
    fontWeight: '500',
  },
});
