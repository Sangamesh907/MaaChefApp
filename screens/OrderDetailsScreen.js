import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import ChefService from '../services/api'; 

// Professional Color Palette
const COLORS = {
  primary: '#007BFF',      // Professional Blue for actions and primary status
  success: '#28A745',      // Green for success/savings
  danger: '#DC3545',       // Red for rejection/cancellation
  background: '#F8F9FA',   // Light gray background
  card: '#FFFFFF',         // White card background
  text: '#343A40',         // Dark gray for main text
  lightText: '#6C757D',    // Muted gray for secondary text
  border: '#E9ECEF',       // Light border color
};

export default function OrderDetailsScreen({ route, navigation }) {
  // ----------------------------------------------------
  // ✅ Using real data passed via navigation parameters
  // ----------------------------------------------------
  const order = route?.params?.order; 
  
  const [loading, setLoading] = useState(false);

  // This check is crucial: if no 'order' object is passed, show an error.
  if (!order)
    return <Text style={{ padding: 20, color: COLORS.text }}>Order data not available</Text>;

  // -----------------------
  // Determine button visibility based on order status (Logic unchanged)
  // -----------------------
  const status = order.status || 'pending'; 
  const isAccepted = status === 'chef_accepted';
  const isPreparing = status === 'preparing';
  const isReady = status === 'ready';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isNew = !isAccepted && !isPreparing && !isReady && !isCompleted && !isCancelled;

  // -----------------------
  // Handle order status update (Logic unchanged)
  // -----------------------
  const handleResponse = async (newStatus) => {
    try {
      setLoading(true);
      // NOTE: Assuming order._id is available for the API call
      const res = await ChefService.updateOrderStatus(order._id, newStatus);

      if (res.status === 'success') {
        Alert.alert('Success', `Order marked as "${newStatus.replace('_', ' ')}" successfully!`, [
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

  // Helper function to determine the next action button (Logic unchanged)
  const getNextStatusButton = () => {
    if (isAccepted && !isPreparing) {
      return { label: 'MARK AS PREPARING', status: 'preparing' };
    }
    if (isPreparing) {
      return { label: 'MARK AS READY', status: 'ready' };
    }
    if (isReady) {
      return { label: 'MARK AS COMPLETED', status: 'completed' };
    }
    return null;
  };

  const nextButton = getNextStatusButton();

  // Helper function to style status badges (Logic unchanged)
  const getStatusBadgeStyle = (currentStatus) => {
    let color = COLORS.lightText;
    let backgroundColor = '#F0F0F0';
    
    if (currentStatus === 'chef_accepted' || currentStatus === 'preparing') {
        color = COLORS.primary;
        backgroundColor = '#E6F2FF';
    } else if (currentStatus === 'ready') {
        color = COLORS.success;
        backgroundColor = '#E9F9EC';
    } else if (currentStatus === 'cancelled') {
        color = COLORS.danger;
        backgroundColor = '#FDEBEC';
    } else if (currentStatus === 'completed') {
        color = COLORS.success;
        backgroundColor = '#D4EDDA';
    }
    
    return { color, backgroundColor };
  };

  const statusStyle = getStatusBadgeStyle(status);

  return (
    <ScrollView style={styles.container}>
      {/* Header and Customer Info */}
      <View style={styles.sectionHeader}>
        <Text style={styles.orderIdText}>ORDER ID: #{order._id || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.customerHeader}>
            {/* Profile Image - Placeholder for dynamic image */}
            <Image 
                source={{ uri: 'https://i.pravatar.cc/100?img=1' }} 
                style={styles.profileImage}
            />
            <View style={styles.customerDetails}>
                <Text style={styles.name}>{order.name || 'Unknown Customer'}</Text>
                <Text style={styles.time}>Placed: {order.created_at || 'N/A'}</Text>
                <Text style={styles.cuisine}>
                    Cuisine: <Text style={styles.cuisineValue}>{order.cuisine || 'N/A'}</Text>
                </Text>
            </View>
        </View>

        <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <View style={[styles.statusBadge, {backgroundColor: statusStyle.backgroundColor}]}>
                <Text style={[styles.statusText, {color: statusStyle.color}]}>
                    {status.replace('_', ' ').toUpperCase()}
                </Text>
            </View>
        </View>
      </View>

      {/* Order Items & Summary */}
      <Text style={styles.subheading}>Order Items</Text>

      <View style={styles.card}>
        {/* Items List */}
        {(order.items || []).map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.name || '-'}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity || 1}</Text>
            {/* Displaying unit price. Ensure your 'item.price' is the unit price. */}
            <Text style={styles.itemPrice}>₹{item.price || 0}</Text> 
          </View>
        ))}
      </View>

      {/* Summary Section */}
      <Text style={styles.subheading}>Billing Summary</Text>
      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{order.subtotal || 0}</Text>
        </View>

        {/* Dynamically render charges */}
        {order.charges &&
            Object.keys(order.charges).map((key) => {
                const chargeValue = order.charges[key];
                const isDeduction = chargeValue < 0;
                // Improves display: 'delivery_charges' -> 'Delivery Charges'
                const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
                
                return (
                    <View key={key} style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            {isDeduction ? `${displayKey} (Discount)` : displayKey}
                        </Text>
                        <Text style={[styles.summaryValue, isDeduction && styles.deductionText]}>
                            {/* Format negative numbers with a minus sign and positive with a plus or just the value */}
                            {isDeduction ? `-₹${Math.abs(chargeValue)}` : `₹${chargeValue}`}
                        </Text>
                    </View>
                )
            })}

        <View style={styles.totalDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
          {/* Displaying total amount */}
          <Text style={styles.totalValue}>₹{order.total || 0}</Text> 
        </View>

        {order.savings > 0 && 
            <Text style={styles.savings}>Total Savings: ₹{order.savings}</Text>
        }
      </View>

      {/* Footer Buttons */}
      <View style={styles.footerButtons}>
        {/* New Order State: Accept and Cancel */}
        {isNew && (
            <>
                <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleResponse('cancelled')}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.danger} />
                    ) : (
                        <Text style={styles.rejectText}>REJECT ORDER</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleResponse('chef_accepted')}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.acceptText}>ACCEPT ORDER</Text>
                    )}
                </TouchableOpacity>
            </>
        )}

        {/* Sequential Status Update Button */}
        {nextButton && (
          <TouchableOpacity
            style={[styles.button, styles.acceptButton, styles.fullWidthButton]}
            onPress={() => handleResponse(nextButton.status)}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.acceptText}>{nextButton.label}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 15 },
  
  // Header and Card Styling
  sectionHeader: { marginBottom: 15 },
  orderIdText: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000', // Subtle shadow for professional depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Customer Details
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 10,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 15,
    backgroundColor: COLORS.border,
  },
  customerDetails: { flex: 1 },
  name: { fontWeight: '700', fontSize: 16, color: COLORS.text },
  time: { fontSize: 12, color: COLORS.lightText },
  cuisine: { marginTop: 4, fontSize: 13, color: COLORS.lightText },
  cuisineValue: { color: COLORS.primary, fontWeight: '600' },
  
  // Status Badge
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
  },
  statusLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: { 
    fontWeight: '700', 
    fontSize: 13,
  },
  
  // Order Items
  subheading: { marginTop: 5, fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  itemText: { fontSize: 14, flex: 2, color: COLORS.text },
  itemQuantity: { fontSize: 14, flex: 0.5, textAlign: 'right', color: COLORS.lightText },
  itemPrice: { fontSize: 14, flex: 0.8, textAlign: 'right', color: COLORS.text, fontWeight: '600' },
  
  // Summary/Billing
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: { fontSize: 14, color: COLORS.text },
  summaryValue: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  deductionText: { color: COLORS.danger, fontWeight: '500' },
  
  totalDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.text, marginVertical: 10, opacity: 0.2 },
  
  totalLabel: { fontWeight: '700', fontSize: 16, color: COLORS.text },
  totalValue: { fontWeight: '700', fontSize: 16, color: COLORS.text },
  
  savings: { 
    color: COLORS.success, 
    fontSize: 13, 
    marginTop: 10, 
    fontWeight: '600', 
    textAlign: 'right',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  
  // Footer Button Styles
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
    flex: 0.48,
    minHeight: 50,
    justifyContent: 'center',
  },
  fullWidthButton: {
      flex: 1,
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.card,
  },
  rejectText: { color: COLORS.danger, fontWeight: '700', fontSize: 14 },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});