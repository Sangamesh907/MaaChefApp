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

const BRAND_COLOR = '#750656';
const LIGHT_BG = '#FCFCFD';

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
    tabButton: (type) => ({
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      backgroundColor: selectedServiceType === type ? BRAND_COLOR : '#F3E6F1',
      elevation: selectedServiceType === type ? 3 : 0,
    }),
    tabText: (type) => ({
      color: selectedServiceType === type ? '#fff' : BRAND_COLOR,
      fontWeight: '600',
      fontSize: 15,
    }),
    itemCard: (item) => ({
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 3,
    }),
    itemName: (item) => ({
      fontSize: 16,
      fontWeight: '600',
      color: '#222',
    }),
  }), [selectedServiceType]);

  const renderItem = ({ item }) => (
    <View style={dynamicStyles.itemCard(item)}>
      <Image source={{ uri: item.photo }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={dynamicStyles.itemName(item)}>{item.food_name}</Text>
        <Text style={styles.itemDetail}>₹{item.price}</Text>
        <Text style={styles.itemDetailSmall}>
          {item.food_type} • Qty: {item.quantity}
        </Text>
        {item.off_price ? (
          <Text style={styles.discountText}>{item.off_price}% OFF</Text>
        ) : null}
      </View>
      <Switch
        value={!!item.is_available}
        onValueChange={() => handleToggleStatus(item.id)}
        thumbColor={item.is_available ? BRAND_COLOR : '#ccc'}
        trackColor={{ false: '#ddd', true: '#E4CDE1' }}
      />
      <TouchableOpacity onPress={() => openContextMenu(item)}>
        <Icon name="ellipsis-vertical" size={22} color="#777" style={{ paddingLeft: 10 }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Menu</Text>
          <Text style={styles.subHeaderText}>
            {Array.isArray(chefData?.food_styles) && chefData.food_styles.length > 0
              ? chefData.food_styles.join(', ')
              : 'Your Style'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
          <Icon name="options-outline" size={24} color={BRAND_COLOR} />
        </TouchableOpacity>
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
          <Text style={styles.emptyText}>No items found for {selectedServiceType}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  headerContainer: {
    marginTop: Platform.OS === 'android' ? 50 : 70,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
  subHeaderText: { fontSize: 14, color: '#750656', marginTop: 3 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 10,
  },
  itemImage: { width: 70, height: 70, borderRadius: 10 },
  itemDetail: { fontSize: 15, color: BRAND_COLOR, fontWeight: '600', marginTop: 2 },
  itemDetailSmall: { fontSize: 13, color: '#666', marginTop: 2 },
  discountText: { fontSize: 12, color: 'green', fontWeight: '500', marginTop: 4 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  bowlImage: { width: 130, height: 130, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#888', fontWeight: '500' },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: BRAND_COLOR,
    padding: 18,
    borderRadius: 50,
    elevation: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: 260, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 5 },
  modalOption: { padding: 15, borderBottomWidth: 0.6, borderColor: '#ddd' },
  modalText: { fontSize: 16, color: BRAND_COLOR, textAlign: 'center', fontWeight: '500' },
});
