import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.text}>
        This Privacy Policy outlines how Maakichen (“we”, “our”, or “us”) collects, uses, discloses, and protects the information you provide while using our mobile application and platform.
      </Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.text}>
        We may collect the following types of information:
        {'\n'}• Personal details (name, email address, phone number)
        {'\n'}• Delivery addresses
        {'\n'}• Payment information (processed through secure third-party gateways)
        {'\n'}• Usage data (e.g., app activity, preferences)
        {'\n'}• Device and log information
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.text}>
        We use your information to:
        {'\n'}• Process orders and facilitate delivery
        {'\n'}• Communicate order updates and promotional offers
        {'\n'}• Improve our services and personalize your experience
        {'\n'}• Prevent fraud and ensure security
      </Text>

      <Text style={styles.sectionTitle}>3. Data Sharing</Text>
      <Text style={styles.text}>
        We do not sell your data. We may share your information with:
        {'\n'}• Registered home chefs and delivery partners
        {'\n'}• Payment gateways for order processing
        {'\n'}• Government or legal authorities when required by law
      </Text>

      <Text style={styles.sectionTitle}>4. Cookies and Analytics</Text>
      <Text style={styles.text}>
        We may use cookies or third-party analytics tools to track usage and improve performance. You can disable cookies through your browser or app settings.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Retention</Text>
      <Text style={styles.text}>
        We retain your information as long as necessary to fulfill the purpose of collection and to comply with legal obligations.
      </Text>

      <Text style={styles.sectionTitle}>6. Security</Text>
      <Text style={styles.text}>
        We use commercially reasonable physical, administrative, and technical safeguards to protect your information. However, no method of transmission over the Internet is 100% secure.
      </Text>

      <Text style={styles.sectionTitle}>7. Children’s Privacy</Text>
      <Text style={styles.text}>
        Our services are not intended for children under the age of 18. We do not knowingly collect data from children.
      </Text>

      <Text style={styles.sectionTitle}>8. Your Rights</Text>
      <Text style={styles.text}>
        You have the right to:
        {'\n'}• Access and correct your personal data
        {'\n'}• Request deletion of your data
        {'\n'}• Withdraw consent (where applicable)
        {'\n'}• File complaints with relevant authorities
      </Text>

      <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
      <Text style={styles.text}>
        We may update this Privacy Policy from time to time. We encourage you to review this policy periodically.
      </Text>

      <Text style={styles.sectionTitle}>10. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions about this policy or wish to contact our Data Protection Officer, please write to:
        {'\n'}enquiries@maakichen.com
      </Text>

      <Text style={styles.footerNote}>
        By using the Maakichen app or platform, you consent to the collection and use of your personal information as described in this Privacy Policy.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#750656',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  footerNote: {
    fontSize: 14,
    color: '#444',
    marginTop: 30,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
