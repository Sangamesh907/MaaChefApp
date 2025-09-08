import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const issueOptions = ['Food Packaging', 'Quality', 'Late Delivery', 'Cold Food'];

const UserRatingScreen = () => {
  const [rating, setRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [review, setReview] = useState('');

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const submitRating = () => {
    Alert.alert('Submitted', `Rating: ${rating}\nIssues: ${selectedIssues.join(', ')}\nReview: ${review}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>Sangamesh</Text>
              <Text style={styles.orderTime}>9th Feb at 12:05am</Text>
            </View>
          </View>

          {/* Star Rating */}
          <Text style={styles.sectionTitle}>Rate your experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={30}
                  color="#f59e0b"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Issues Selection */}
          <Text style={styles.sectionTitle}>What went wrong?</Text>
          <View style={styles.issuesWrap}>
            {issueOptions.map((issue) => (
              <TouchableOpacity
                key={issue}
                style={[
                  styles.issueTag,
                  selectedIssues.includes(issue) && styles.issueTagSelected,
                ]}
                onPress={() => toggleIssue(issue)}
              >
                <Text
                  style={[
                    styles.issueTagText,
                    selectedIssues.includes(issue) && styles.issueTagTextSelected,
                  ]}
                >
                  {issue}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Input */}
          <Text style={styles.sectionTitle}>Leave a comment</Text>
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={4}
            placeholder="Type something..."
            value={review}
            onChangeText={setReview}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={submitRating}>
            <Text style={styles.submitText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserRatingScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  orderTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#111827',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  issuesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  issueTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  issueTagSelected: {
    backgroundColor: '#86198f',
  },
  issueTagText: {
    color: '#374151',
  },
  issueTagTextSelected: {
    color: 'white',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    color: '#111827',
  },
  submitBtn: {
    backgroundColor: '#910f6a',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
