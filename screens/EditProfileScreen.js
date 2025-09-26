// EditProfileScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Modal, Alert
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import ImageResizer from "react-native-image-resizer";

import { ChefContext } from "../context/ChefContext";
import { updateChefProfile } from "../services/profileService";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chefData, updateChef, token } = useContext(ChefContext);

  const [imageUri, setImageUri] = useState(chefData?.profile_image || null);
  const [name, setName] = useState(chefData?.name || "");
  const [mobile, setMobile] = useState(chefData?.phone_number || "");
  const [email, setEmail] = useState(chefData?.email || "");
  const [nativePlace, setNativePlace] = useState(chefData?.native_place || "");
  const [aadhaar, setAadhaar] = useState(chefData?.aadhar_number || "");
  const [foodStyle, setFoodStyle] = useState(chefData?.food_styles || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickerVisible, setPickerVisible] = useState(false);

  // Load updated food styles from AddFoodStyleScreen
  useEffect(() => {
    if (route.params?.updatedFoodStyle) {
      const updated = Array.isArray(route.params.updatedFoodStyle)
        ? route.params.updatedFoodStyle
        : [route.params.updatedFoodStyle];
      setFoodStyle(updated);
    }
  }, [route.params?.updatedFoodStyle]);

  const compressImage = async (uri) => {
    try {
      const resized = await ImageResizer.createResizedImage(uri, 800, 800, "JPEG", 80);
      return resized.uri;
    } catch (err) {
      console.warn("Image compression error:", err);
      return uri;
    }
  };

  const chooseCamera = async () => {
    launchCamera({ mediaType: "photo" }, async (res) => {
      if (res?.assets?.length) {
        const compressedUri = await compressImage(res.assets[0].uri);
        setImageUri(compressedUri);
      }
      setPickerVisible(false);
    });
  };

  const chooseGallery = async () => {
    launchImageLibrary({ mediaType: "photo" }, async (res) => {
      if (res?.assets?.length) {
        const compressedUri = await compressImage(res.assets[0].uri);
        setImageUri(compressedUri);
      }
      setPickerVisible(false);
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!mobile.trim() || mobile.length !== 10) newErrors.mobile = "Enter a valid 10-digit number";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";
    if (!nativePlace.trim()) newErrors.nativePlace = "Please enter native place";
    if (!aadhaar.trim() || aadhaar.length !== 12) newErrors.aadhaar = "Enter a valid 12-digit Aadhaar";
    if (!foodStyle.length) newErrors.foodStyle = "Please select food style";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        navigation.replace("Login");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone_number", mobile);
      formData.append("email", email);
      formData.append("native_place", nativePlace);
      formData.append("aadhar_number", aadhaar);
      foodStyle.forEach((style) => formData.append("food_styles[]", style));

      // ✅ Append image only if it's local (not URL)
      if (imageUri && !imageUri.startsWith("http")) {
        const filename = imageUri.split("/").pop();
        const type = /\.(\w+)$/.exec(filename)?.[1]
          ? `image/${/\.(\w+)$/.exec(filename)[1]}`
          : "image/jpeg";
        formData.append("profile_image", { uri: imageUri, name: filename, type });
      }

      const data = await updateChefProfile(formData, token);
      const updatedChef = data.updated;

      // ✅ Update ChefContext with returned photo_url
     updateChef({
  ...chefData,
  name: updatedChef.name?.trim(),
  email: updatedChef.email?.trim(),
  phone_number: updatedChef.phone_number?.trim(), // ✅ added
  native_place: updatedChef.native_place?.trim(),
  aadhar_number: updatedChef.aadhar_number?.trim(),
  food_styles: updatedChef.food_styles || foodStyle,
  profile_image: updatedChef.photo_url || imageUri,
});


      Alert.alert("Success", data.message || "Profile updated successfully!");
      navigation.navigate("HomeTabs", { screen: "Profile" });

    } catch (error) {
      console.error("Profile update error:", error.message);
      setErrors({ general: error.response?.data?.detail || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value, onChangeText, placeholder, keyboardType = "default", maxLength, errorKey) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[errorKey] && styles.inputError]}
        value={value}
        onChangeText={(text) => {
          if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: null }));
          onChangeText(text);
        }}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {errors[errorKey] && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0A3E73" />
      <Text style={{ marginTop: 10, color: "#0A3E73" }}>Updating Profile...</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <View style={styles.imageContainer}>
          <Image
            source={imageUri ? { uri: imageUri } : require("../assets/default_avatar.png")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => setPickerVisible(true)}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>✎</Text>
          </TouchableOpacity>
        </View>

        {renderField("Full Name", name, setName, "Enter Full Name", "default", 50, "name")}
        {renderField("Mobile Number", mobile, (t) => /^\d{0,10}$/.test(t) && setMobile(t), "10-digit number", "phone-pad", 10, "mobile")}
        {renderField("Email", email, setEmail, "Enter Email", "email-address", 100, "email")}
        {renderField("Native Place", nativePlace, setNativePlace, "Enter Native Place", "default", 100, "nativePlace")}
        {renderField("Aadhaar Number", aadhaar, (t) => /^\d{0,12}$/.test(t) && setAadhaar(t), "12-digit Aadhaar", "numeric", 12, "aadhaar")}

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Food Style</Text>
          <TouchableOpacity style={[styles.input, errors.foodStyle && styles.inputError, { justifyContent: "center" }]} onPress={() => navigation.navigate("AddFoodStyle")}>
            <Text style={{ color: foodStyle?.length ? "#000" : "#999" }}>
              {foodStyle?.join(", ") || "Tap to select Food Style"}
            </Text>
          </TouchableOpacity>
          {errors.foodStyle && <Text style={styles.errorText}>{errors.foodStyle}</Text>}
        </View>

        {errors.general && <Text style={[styles.errorText, { textAlign: "center", marginTop: 10 }]}>{errors.general}</Text>}

        <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveText}>Update Profile</Text>
        </TouchableOpacity>

        <Modal transparent visible={pickerVisible} animationType="slide" onRequestClose={() => setPickerVisible(false)}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity style={styles.sheetButton} onPress={chooseCamera}>
              <Text style={styles.sheetText}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetButton} onPress={chooseGallery}>
              <Text style={styles.sheetText}>🖼 Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetButton, { backgroundColor: "#ddd" }]} onPress={() => setPickerVisible(false)}>
              <Text style={[styles.sheetText, { color: "#333" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  imageContainer: { alignItems: "center", marginBottom: 24 },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: "#0A3E73" },
  editIcon: { position: "absolute", bottom: 0, right: "35%", backgroundColor: "#0A3E73", padding: 6, borderRadius: 20 },
  fieldWrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#0A3E73", marginBottom: 6 },
  input: { backgroundColor: "#f8f8f8", borderRadius: 8, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: "#ccc", color: "#000" },
  inputError: { borderColor: "red" },
  errorText: { fontSize: 12, color: "red", marginTop: 4 },
  saveButton: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#0A3E73", paddingVertical: 16, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bottomSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  sheetButton: { paddingVertical: 14, borderBottomWidth: 1, borderColor: "#eee" },
  sheetText: { fontSize: 16, color: "#0A3E73", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAFAFA" },
});
