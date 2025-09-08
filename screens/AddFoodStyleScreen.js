import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

const SELECTED_BG_COLOR = '#E0F2F1';
const SELECTED_TEXT_COLOR = '#00796B';
const UNSELECTED_TEXT_COLOR = '#111';
const UNSELECTED_BORDER_COLOR = '#333333';
const DECO_GREEN_COLOR = '#009688';
const DECO_PURPLE_COLOR = '#673AB7';

const AddFoodStyleScreen = ({ navigation, route }) => {
  const initial = route?.params?.selectedFoodStyle || '';
  const [selectedFoodStyle, setSelectedFoodStyle] = useState(initial);
  const [foodStyles, setFoodStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodStyles = async () => {
      try {
        const response = await fetch('http://13.204.84.41/api/food-styles');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          Alert.alert("No data", "The API returned an empty list.");
          setFoodStyles([]);
          return;
        }
        const stylesArray = data.map(item => ({ label: item }));
        setFoodStyles(stylesArray);
      } catch (error) {
        console.error("Error fetching food styles:", error);
        Alert.alert('Error', `Unable to load food styles: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodStyles();
  }, []);

  const handleSelectAndSave = (style) => {
    setSelectedFoodStyle(style);
    if (route.params?.onSelectFoodStyle) route.params.onSelectFoodStyle(style);
    setTimeout(() => navigation.goBack(), 200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.greenCircle} />
      <View style={styles.purpleCircle} />

      {loading ? (
        <ActivityIndicator size="large" color={DECO_GREEN_COLOR} style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {foodStyles.map((item, index) => {
            const selected = selectedFoodStyle === item.label;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.item, selected && styles.itemSelected]}
                onPress={() => handleSelectAndSave(item.label)}
              >
                <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default AddFoodStyleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  scrollContent: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, paddingTop: 24 },
  item: { borderWidth: 1, borderColor: UNSELECTED_BORDER_COLOR, borderRadius: 50, paddingVertical: 10, paddingHorizontal: 20, margin: 6, backgroundColor: '#fff' },
  itemSelected: { backgroundColor: SELECTED_BG_COLOR, borderColor: SELECTED_BG_COLOR },
  itemText: { fontSize: 14, color: UNSELECTED_TEXT_COLOR, fontWeight: '500' },
  itemTextSelected: { color: SELECTED_TEXT_COLOR, fontWeight: '600' },
  greenCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: DECO_GREEN_COLOR, top: '45%', left: -120, opacity: 0.8 },
  purpleCircle: { position: 'absolute', width: 320, height: 350, borderRadius: 200, backgroundColor: DECO_PURPLE_COLOR, bottom: -220, right: -150, opacity: 0.9 },
});
