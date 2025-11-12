import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import ImageResizer from "react-native-image-resizer";
import ChefService from "../services/api";
import { ChefContext } from "../context/ChefContext";
import { LocationContext } from "../context/LocationContext";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { chefData, updateChef } = useContext(ChefContext);
  const { location: splashLocation } = useContext(LocationContext);

  const initialChefData = chefData || {};

  const [imageUri, setImageUri] = useState(initialChefData?.profile_image || null);
  const [name, setName] = useState(initialChefData?.name || "");
  const [mobile, setMobile] = useState(initialChefData?.phone_number || "");
  const [email, setEmail] = useState(initialChefData?.email || "");
  const [nativePlace, setNativePlace] = useState(initialChefData?.native_place || "");
  const [aadhaar, setAadhaar] = useState(initialChefData?.aadhar_number || "");
  const [foodStyle, setFoodStyle] = useState(initialChefData?.food_styles || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (
      splashLocation &&
      (!initialChefData.location?.coordinates ||
        initialChefData.location.coordinates.length === 0)
    ) {
      initialChefData.location = {
        type: "Point",
        coordinates: [splashLocation.longitude, splashLocation.latitude],
        address: splashLocation.address || "",
      };
    }
  }, [splashLocation]);

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
      if (res?.assets?.length) setImageUri(await compressImage(res.assets[0].uri));
      setPickerVisible(false);
    });
  };

  const chooseGallery = async () => {
    launchImageLibrary({ mediaType: "photo" }, async (res) => {
      if (res?.assets?.length) setImageUri(await compressImage(res.assets[0].uri));
      setPickerVisible(false);
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!mobile.trim() || mobile.length !== 10)
      newErrors.mobile = "Enter a valid 10-digit number";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Enter a valid email";
    if (!nativePlace.trim()) newErrors.nativePlace = "Please enter native place";
    if (!aadhaar.trim() || aadhaar.length !== 12)
      newErrors.aadhaar = "Enter a valid 12-digit Aadhaar";
    if (!foodStyle) newErrors.foodStyle = "Please select food style";
    if (!imageUri) newErrors.image = "Please select a profile image";
    if (
      !initialChefData.location?.coordinates ||
      initialChefData.location.coordinates.length !== 2
    ) {
      newErrors.location = "Location not found. Please restart app.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const updatedFields = {
        name,
        phone_number: mobile,
        email,
        native_place: nativePlace,
        aadhar_number: aadhaar,
        food_styles: foodStyle,
        profile_image: imageUri,
        location: initialChefData.location,
      };

      let response;
      if (imageUri?.startsWith("file://") || imageUri?.startsWith("content://")) {
        const formData = new FormData();
        Object.entries(updatedFields).forEach(([key, value]) => {
          if (key === "profile_image") {
            formData.append("file", {
              uri: value,
              type: "image/jpeg",
              name: "profile.jpg",
            });
          } else if (key === "food_styles" && value) {
            String(value)
              .split(",")
              .forEach((style) => formData.append("food_styles", style.trim()));
          } else if (key === "location") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        response = await ChefService.updateProfile(formData, true);
      } else {
        response = await ChefService.updateProfile(updatedFields, false);
      }

      if (response?.updated) {
        const mergedChef = {
          ...chefData,
          ...response.updated,
          ...updatedFields,
        };
        await updateChef(mergedChef, true);
        const newPhotoUrl = response.updated.photo_url;
        if (newPhotoUrl) {
          setImageUri(
            newPhotoUrl.startsWith("http")
              ? newPhotoUrl
              : `${ChefService.BASE_URL}${newPhotoUrl}`
          );
        }

        Alert.alert("Success", response.message || "Profile updated successfully!", [
          { text: "OK", onPress: () => navigation.navigate("HomeTabs") },
        ]);
      } else {
        Alert.alert("Warning", "Profile updated but no data returned.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      let message = "Something went wrong. Please check your connection.";
      if (error.response?.data?.message) message = error.response.data.message;
      else if (error.message === "Network Error") message = "Network error. Try again.";
      Alert.alert("Error", message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    maxLength,
    errorKey
  ) => (
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

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#750656" />
        <Text style={{ marginTop: 10, color: "#750656", fontWeight: "500" }}>
          Updating Profile...
        </Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fdfdfd" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
  <View style={styles.imageContainer}>
    <Image
      source={
        imageUri
          ? { uri: imageUri }
          : require("../assets/default_avatar.png")
      }
      style={styles.profileImage}
    />
    <TouchableOpacity
      style={styles.editPhotoButton}
      onPress={() => setPickerVisible(true)}
    >
      <Text style={styles.editPhotoText}>Edit Photo</Text>
    </TouchableOpacity>
  </View>

  {errors.image && (
    <Text style={[styles.errorText, { textAlign: "center", marginBottom: 10 }]}>
      {errors.image}
    </Text>
  )}

  {renderField("Full Name", name, setName, "Enter Full Name", "default", 50, "name")}
  {renderField(
    "Mobile Number",
    mobile,
    (t) => /^\d{0,10}$/.test(t) && setMobile(t),
    "10-digit number",
    "phone-pad",
    10,
    "mobile"
  )}
  {renderField("Email", email, setEmail, "Enter Email", "email-address", 100, "email")}
  {renderField(
    "Native Place",
    nativePlace,
    setNativePlace,
    "Enter Native Place",
    "default",
    100,
    "nativePlace"
  )}
  {renderField(
    "Aadhaar Number",
    aadhaar,
    (t) => /^\d{0,12}$/.test(t) && setAadhaar(t),
    "12-digit Aadhaar",
    "numeric",
    12,
    "aadhaar"
  )}

  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>Food Style</Text>
    <TouchableOpacity
      style={[styles.input, errors.foodStyle && styles.inputError, { justifyContent: "center" }]}
      onPress={() => navigation.navigate("AddFoodStyle")}
    >
      <Text style={{ color: foodStyle?.length ? "#000" : "#999" }}>
        {foodStyle || "Tap to select Food Style"}
      </Text>
    </TouchableOpacity>
    {errors.foodStyle && <Text style={styles.errorText}>{errors.foodStyle}</Text>}
  </View>

  {errors.location && <Text style={[styles.errorText, { textAlign: "center", marginTop: 10 }]}>{errors.location}</Text>}
  {errors.general && <Text style={[styles.errorText, { textAlign: "center", marginTop: 10 }]}>{errors.general}</Text>}
</ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>Update Profile</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={pickerVisible}
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity style={styles.sheetButton} onPress={chooseCamera}>
              <Text style={styles.sheetText}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetButton} onPress={chooseGallery}>
              <Text style={styles.sheetText}>🖼 Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sheetButton, { backgroundColor: "#eee", marginTop: 10 }]}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={[styles.sheetText, { color: "#333" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  editPhotoButton: {
    marginTop: 12,
    backgroundColor: "#1abc9c",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editPhotoText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  fieldWrapper: { marginBottom: 22 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  inputError: { borderBottomColor: "red" },
  errorText: { fontSize: 12, color: "red", marginTop: 4 },
  saveButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#750656",
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  bottomSheetOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: { backgroundColor: "#fff", padding: 22, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  sheetButton: { paddingVertical: 14, borderBottomWidth: 1, borderColor: "#eee", marginVertical: 4 },
  sheetText: { fontSize: 16, color: "#750656", textAlign: "center", fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fdfdfd" },
});

export default EditProfileScreen;
