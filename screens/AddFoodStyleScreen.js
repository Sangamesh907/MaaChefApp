import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { ChefContext } from "../context/ChefContext";
import { updateChefFoodStyle } from "../services/foodStyleService";

// Colors
const SELECTED_BG_COLOR = "#E0F2F1";
const SELECTED_TEXT_COLOR = "#00796B";
const UNSELECTED_TEXT_COLOR = "#111";
const UNSELECTED_BORDER_COLOR = "#ccc";
const DECO_GREEN_COLOR = "#009688";
const DECO_PURPLE_COLOR = "#673AB7";

// ✅ Static list of food styles
const STATIC_FOOD_STYLES = [
  "Andhra Style","Arunachal Pradesh Style","Assam Style","Bihar Style",
  "Chattisgarh Style","Delhi Style","Goa Style","Gujarat Style","Haryana Style",
  "Himachal Pradesh Style","Jammu Kashmir Style","Jharkhand Style","Karnataka Style",
  "Kerala Style","Madhya Pradesh Style","Maharastrian Style","Meghalaya Style",
  "Mizoram Style","Nagaland Style","Orissa Style","Punjabi Style","Rajasthan Style",
  "Sikkim Style","Tamilian Style","Telangana Style","Tripura Style","Uttrakhand Style",
  "Uttar Pradesh Style","West Bengal Style"
];

const AddFoodStyleScreen = ({ navigation }) => {
  const { chefData, updateChef, token } = useContext(ChefContext);

  const [selectedFoodStyle, setSelectedFoodStyle] = useState(
    chefData?.food_styles?.[0] || ""
  );

  const handleSelectAndSave = async (style) => {
    setSelectedFoodStyle(style);

    if (!chefData?.id || !token) {
      Alert.alert("Error", "Chef not logged in properly.");
      return;
    }

    try {
      // Send as array to backend
      const result = await updateChefFoodStyle([style], token);

      // Update context as array
      updateChef({ food_styles: [style] });

      Alert.alert("Success", "Food style updated.");
      navigation.navigate("EditProfile", { updatedFoodStyle: [style] });
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Unable to update food style.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {STATIC_FOOD_STYLES.map((style, index) => {
          const selected = selectedFoodStyle === style;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => handleSelectAndSave(style)}
            >
              <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                {style}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Decorative Circles */}
      <View style={styles.greenCircle} />
      <View style={styles.purpleCircle} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", position: "relative" },
  scrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  item: {
    borderWidth: 1,
    borderColor: UNSELECTED_BORDER_COLOR,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 22,
    margin: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemSelected: {
    backgroundColor: SELECTED_BG_COLOR,
    borderColor: SELECTED_BG_COLOR,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  itemText: { fontSize: 14, color: UNSELECTED_TEXT_COLOR, fontWeight: "500" },
  itemTextSelected: { color: SELECTED_TEXT_COLOR, fontWeight: "600" },
  greenCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: DECO_GREEN_COLOR,
    top: "40%",
    left: -90,
    opacity: 0.15,
  },
  purpleCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: DECO_PURPLE_COLOR,
    bottom: -140,
    right: -120,
    opacity: 0.12,
  },
});

export default AddFoodStyleScreen;
