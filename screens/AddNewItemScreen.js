import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChefContext } from "../context/ChefContext";
import { addMenuItemApi, updateMenuItemApi } from "../services/menuService";

// ✅ Backend allowed enums
const FOOD_STYLES = [
  "Andhra Style", "Arunachal Pradesh Style", "Assam Style", "Bihar Style", "Chattisgarh Style",
  "Delhi Style", "Goa Style", "Gujarat Style", "Haryana Style", "Himachal Pradesh Style",
  "Jammu Kashmir Style", "Jharkhand Style", "Karnataka Style", "Kerala Style", "Madhya Pradesh Style",
  "Maharastrian Style", "Meghalaya Style", "Mizoram Style", "Nagaland Style", "Orissa Style",
  "Punjabi Style", "Rajasthan Style", "Sikkim Style", "Tamilian Style", "Telangana Style",
  "Tripura Style", "Uttrakhand Style", "Uttar Pradesh Style", "West Bengal Style"
];

const SERVICE_TYPES = ["Breakfast", "Lunch", "Dinner"]; // ✅ Snacks removed

const AddNewItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingItem = route.params?.editItem;

  const { addMenuItem, updateMenuItem, token } = useContext(ChefContext);

  const [imageUri, setImageUri] = useState(editingItem?.imageUri || null);
  const [foodName, setFoodName] = useState(editingItem?.foodName || "");
  const [price, setPrice] = useState(editingItem?.price || "");
  const [offPrice, setOffPrice] = useState(editingItem?.offPrice || "");
  const [quantity, setQuantity] = useState(editingItem?.quantity || "");
  const [foodStyle, setFoodStyle] = useState(editingItem?.foodStyle || null);
  const [serviceType, setServiceType] = useState(editingItem?.serviceType || "Breakfast");
  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [foodType, setFoodType] = useState(editingItem?.foodType || null);
  const [foodStyleOpen, setFoodStyleOpen] = useState(false);

  // ✅ Pick and resize image before uploading
  const handleUploadPhoto = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: "photo" });

      if (result.didCancel || !result.assets || result.assets.length === 0) return;

      const image = result.assets[0];

      // Resize image to prevent 413 error
      const resizedImage = await ImageResizer.createResizedImage(
        image.uri,
        800,  // max width
        800,  // max height
        "JPEG",
        80    // quality %
      );

      setImageUri(resizedImage.uri);

    } catch (error) {
      console.error("Image picker or resizing error:", error);
      Alert.alert("Error", "Failed to pick or resize image.");
    }
  };

  const handleSave = async () => {
    if (!foodName || !foodStyle || !foodType || !quantity || !price || !serviceType) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    if (!token) {
      Alert.alert("Authentication Error", "You are not logged in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("food_name", foodName.trim());
      formData.append("food_style", foodStyle);
      formData.append("food_type", foodType);
      formData.append("quantity", Number(quantity));
      formData.append("price", Number(price));
      formData.append("off", offPrice ? Number(offPrice) : 0);
      formData.append("service_type", serviceType);
      formData.append("is_available", true);

      if (imageUri) {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("photo", {
          uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
          type,
          name: filename,
        });
      }

      let data;
      if (editingItem) {
        data = await updateMenuItemApi(editingItem.id, formData, token);
      } else {
        data = await addMenuItemApi(formData, token);
      }

      const newItem = {
        id: data.item_id || editingItem?.id,
        foodName,
        foodStyle,
        foodType,
        quantity,
        price,
        offPrice,
        serviceType,
        imageUri,
      };

      editingItem ? updateMenuItem(newItem) : addMenuItem(newItem);

      Alert.alert("Success", editingItem ? "Item Updated" : "Item Added");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Network error:", error);
      Alert.alert("Error", "A network error occurred.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 200 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>{editingItem ? "Edit Item" : "Add New Item"}</Text>

        <TouchableOpacity style={styles.imageWrapper} onPress={handleUploadPhoto}>
          <Image
            source={imageUri ? { uri: imageUri } : require("../assets/sample_food.png")}
            style={styles.image}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleUploadPhoto} style={styles.uploadBtn}>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Food Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
        />

        {/* Food Style Dropdown */}
        <DropDownPicker
          open={foodStyleOpen}
          value={foodStyle}
          setOpen={setFoodStyleOpen}
          setValue={setFoodStyle}
          items={FOOD_STYLES.map((style) => ({ label: style, value: style }))}
          placeholder="Select Food Style"
          listMode="MODAL"
          modalTitle="Select Food Style"
          style={[styles.dropdown, { marginTop: 15 }]}
        />

        {/* Food Type Dropdown */}
        <DropDownPicker
          open={foodTypeOpen}
          value={foodType}
          setOpen={setFoodTypeOpen}
          setValue={setFoodType}
          items={[
            { label: "Veg", value: "veg" },
            { label: "Non-Veg", value: "non_veg" },
          ]}
          placeholder="Food Type"
          listMode="MODAL"
          modalTitle="Select Food Type"
          style={[styles.dropdown, { marginTop: 15 }]}
        />

        <Text style={styles.label}>Service Type</Text>
        <View style={styles.serviceContainer}>
          {SERVICE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.serviceButton, serviceType === type && styles.serviceSelected]}
              onPress={() => setServiceType(type)}
            >
              <Text style={[styles.serviceText, serviceType === type && styles.serviceTextSelected]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Quantity"
          placeholderTextColor="#888"
          keyboardType="numeric"
          style={styles.input}
          value={String(quantity)}
          onChangeText={setQuantity}
        />
        <TextInput
          placeholder="Price (₹)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          style={styles.input}
          value={String(price)}
          onChangeText={setPrice}
        />
        <TextInput
          placeholder="Off (%)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          style={styles.input}
          value={String(offPrice)}
          onChangeText={setOffPrice}
        />

        <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
          <Text style={styles.addText}>{editingItem ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewItemScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  imageWrapper: {
    width: "100%",
    height: 200,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  uploadBtn: {
    backgroundColor: "#e2f4ee",
    padding: 10,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 20,
  },
  uploadText: { color: "#2a7d58", fontWeight: "bold" },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
    paddingVertical: 8,
    marginTop: 15,
    color: "#000",
  },
  dropdown: { borderColor: "#ccc" },
  label: { fontSize: 14, fontWeight: "600", color: "#000", marginTop: 20 },
  addBtn: {
    backgroundColor: "#910f6a",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 30,
  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    flexWrap: "wrap",
  },
  serviceButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  serviceSelected: { backgroundColor: "#910f6a", borderColor: "#910f6a" },
  serviceText: { color: "#000", fontWeight: "500" },
  serviceTextSelected: { color: "#fff", fontWeight: "600" },
});
