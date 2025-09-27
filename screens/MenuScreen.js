import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChefContext } from '../context/ChefContext';
import MenuAPI from '../services/api'; // ✅ Menu API

export default function MenuScreen() {
  const navigation = useNavigation();
  const { chefData, fetchChefData, updateChef } = useContext(ChefContext);

  const [selectedServiceType, setSelectedServiceType] = useState('Breakfast');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const serviceTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Refresh menu whenever screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchChefData?.();
    }, [])
  );

  const filteredItems = useMemo(() => {
    const menuItems = Array.isArray(chefData?.menuItems) ? chefData.menuItems : [];
    return menuItems.filter(item => item.service_type === selectedServiceType);
  }, [chefData?.menuItems, selectedServiceType]);

  const handleToggleStatus = async (itemId) => {
    const originalItem = chefData?.menuItems?.find(i => i.id === itemId);
    if (!originalItem) return;

    updateChef({
      menuItems: chefData.menuItems.map(item =>
        item.id === itemId ? { ...item, is_available: !item.is_available } : item
      ),
    });

    try {
      await MenuAPI.updateMenuItem(itemId, { is_available: !originalItem.is_available });
    } catch (error) {
      updateChef({ menuItems: chefData.menuItems });
      Alert.alert('Error', 'Failed to update item status.');
    }
  };

  const openContextMenu = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      await MenuAPI.deleteItem(selectedItem.id);
      updateChef({
        menuItems: chefData.menuItems.filter(i => i.id !== selectedItem.id),
      });
      setModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete item.');
    }
  };

  const handleDeleteAll = () => {
    Alert.alert('Delete All', 'Are you sure you want to delete all items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          try {
            await MenuAPI.deleteAll();
            updateChef({ menuItems: [] });
            setModalVisible(false);
            setSelectedItem(null);
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete all items.');
          }
        },
      },
    ]);
  };

  // -------------------------------
  // Dynamic Styles
  // -------------------------------
  const dynamicStyles = useMemo(() => ({
    headerText: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: chefData?.food_styles?.includes('Spicy') ? '#FF4500' : '#000' 
    },
    tabButton: (type) => ({
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: selectedServiceType === type
        ? chefData?.food_styles?.includes('Sweet') ? '#FF69B4' : '#0A3E73'
        : '#F0F0F0',
    }),
    tabText: (type) => ({
      color: selectedServiceType === type ? '#fff' : '#555',
      fontWeight: '500',
    }),
    itemCard: (item) => ({
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      backgroundColor: item.is_available ? '#E6FFFA' : '#fff', // Available items highlighted
      padding: 12,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    }),
    itemName: (item) => ({
      fontSize: 16,
      fontWeight: '600',
      color: item.is_available ? '#000' : '#888',
    }),
  }), [chefData, selectedServiceType]);

  const renderItem = ({ item }) => (
    <View style={dynamicStyles.itemCard(item)}>
      <Image source={{ uri: item.photo }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={dynamicStyles.itemName(item)}>{item.food_name}</Text>
        <Text style={styles.itemDetail}>₹{item.price}</Text>
        <Text style={styles.itemDetail}>
          {item.food_type} • Qty: {item.quantity}
        </Text>
        {item.off_price ? <Text style={styles.discountText}>{item.off_price}% OFF</Text> : null}
      </View>
      <Switch
        value={!!item.is_available}
        onValueChange={() => handleToggleStatus(item.id)}
      />
      <TouchableOpacity onPress={() => openContextMenu(item)}>
        <Icon name="ellipsis-vertical" size={22} color="#555" style={{ paddingLeft: 10 }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={dynamicStyles.headerText}>Menu</Text>
        <View style={styles.subHeader}>
          <Text style={styles.foodStyle}>
            {Array.isArray(chefData?.food_styles) && chefData.food_styles.length > 0
              ? chefData.food_styles.join(', ')
              : 'My Style'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
            <Icon name="options-outline" size={20} color="#750656" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Tabs */}
      <View style={styles.tabContainer}>
        {serviceTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={dynamicStyles.tabButton(type)}
            onPress={() => setSelectedServiceType(type)}
          >
            <Text style={dynamicStyles.tabText(type)}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu List */}
      {filteredItems.length === 0 ? (
        <View style={styles.centerContent}>
          <Image source={require('../assets/bowl.png')} style={styles.bowlImage} />
          <Text style={styles.createText}>
            No items found under {selectedServiceType}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}

      {/* Add New Item FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddNewItem', { serviceType: selectedServiceType })
        }
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Context Menu Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddNewItem', { editItem: selectedItem, serviceType: selectedServiceType });
              }}
            >
              <Text style={styles.modalText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDeleteItem}>
              <Text style={styles.modalText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDeleteAll}>
              <Text style={styles.modalText}>Delete All</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// -------------------------------
// Static Styles
// -------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFD' },
  headerContainer: {
    marginTop: Platform.OS === 'android' ? 50 : 70,
    paddingHorizontal: 20,
    borderBottomWidth: 0.4,
    borderBottomColor: '#C4C4C4',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, alignItems: 'center' },
  foodStyle: { fontSize: 14, color: '#750656', fontWeight: '500' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  itemImage: { width: 70, height: 70, borderRadius: 8 },
  itemDetail: { fontSize: 14, color: '#555' },
  discountText: { fontSize: 12, color: 'green', fontWeight: '500' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  bowlImage: { width: 150, height: 150, marginBottom: 10 },
  createText: { fontSize: 16, color: '#888' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#0A3E73', padding: 16, borderRadius: 30, elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: 250, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  modalOption: { padding: 15, borderBottomWidth: 0.5, borderColor: '#ccc' },
  modalText: { fontSize: 16, color: '#0A3E73', textAlign: 'center' },
});
