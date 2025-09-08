// MenuScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, FlatList, Modal, Pressable, Switch, Alert, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MenuScreen() {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('Breakfast');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chefFoodStyle, setChefFoodStyle] = useState('My Style');

  useFocusEffect(
    React.useCallback(() => {
      loadChefFoodStyle();
      loadSelectedServiceType();
    }, [])
  );

  useEffect(() => {
    loadItems();
  }, [selectedServiceType]);

  const loadChefFoodStyle = async () => {
    const style = await AsyncStorage.getItem('chef_food_style');
    if (style) setChefFoodStyle(style);
  };

  const loadSelectedServiceType = async () => {
    const savedType = await AsyncStorage.getItem('selected_service_type');
    if (savedType) {
      setSelectedServiceType(savedType);
    } else {
      setSelectedServiceType('Breakfast');
    }
  };

  const loadItems = async () => {
    const stored = await AsyncStorage.getItem('menu_items');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMenuItems(parsed);
      const filtered = parsed.filter(item => item.serviceType === selectedServiceType);
      setFilteredItems(filtered);
    }
  };

  const saveItems = async (items) => {
    await AsyncStorage.setItem('menu_items', JSON.stringify(items));
    loadItems();
  };

  const toggleStatus = (index) => {
    const updated = [...menuItems];
    updated[index].isAvailable = !updated[index].isAvailable;
    saveItems(updated);
  };

  const openContextMenu = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const deleteItem = () => {
    const filtered = menuItems.filter(i => i !== selectedItem);
    saveItems(filtered);
    setModalVisible(false);
  };

  const deleteAll = () => {
    Alert.alert('Delete All', 'Are you sure you want to delete all items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('menu_items');
          setMenuItems([]);
          setFilteredItems([]);
          setModalVisible(false);
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.itemName}>{item.foodName}</Text>
        <Text style={styles.itemDetail}>₹{item.price}</Text>
        <Text style={styles.itemDetail}>
          {item.foodType} • Qty: {item.quantity}
        </Text>
        <Text style={styles.itemDetail}>
          ⭐ {item.rating} ({item.votes} votes)
        </Text>
        {item.offPrice ? (
          <Text style={styles.discountText}>{item.offPrice}% OFF</Text>
        ) : null}
      </View>

      <Switch
        value={item.isAvailable}
        onValueChange={() => toggleStatus(menuItems.findIndex(i => i === item))}
      />

      <TouchableOpacity onPress={() => openContextMenu(item)}>
        <Icon name="ellipsis-vertical" size={22} color="#555" style={{ paddingLeft: 10 }} />
      </TouchableOpacity>
    </View>
  );

  const serviceTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Menu</Text>
        <View style={styles.subHeader}>
          <Text style={styles.foodStyle}>{chefFoodStyle}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
            <Icon name="options-outline" size={20} color="#750656" />
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          {serviceTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.tabButton, selectedServiceType === type && styles.activeTab]}
              onPress={() => setSelectedServiceType(type)}
            >
              <Text style={[styles.tabText, selectedServiceType === type && styles.activeText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.centerContent}>
          <Image source={require('../assets/bowl.png')} style={styles.bowlImage} />
          <Text style={styles.createText}>No items found under {selectedServiceType}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddNewItem', { serviceType: selectedServiceType })}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                const index = menuItems.findIndex(i => i === selectedItem);
                navigation.navigate('AddNewItem', {
                  editItem: selectedItem,
                  editIndex: index,
                });
              }}
            >
              <Text style={styles.modalText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={deleteItem}>
              <Text style={styles.modalText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={deleteAll}>
              <Text style={[styles.modalText]}>Delete All</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

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
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  foodStyle: { color: '#750656', fontSize: 16, fontWeight: '600' },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tabButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: '#750656',
  },
  tabText: { color: '#000' },
  activeText: { color: '#fff', fontWeight: '600' },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  itemImage: { width: 70, height: 70, borderRadius: 10 },
  itemName: { fontWeight: 'bold', fontSize: 16, color: '#000' }, // Black color
  itemDetail: { color: '#666', fontSize: 13 },
  discountText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
    marginTop: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bowlImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  createText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#750656',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000060',
  },
  modalBox: {
    width: 220,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000', // Black color for modal text
  },
});
