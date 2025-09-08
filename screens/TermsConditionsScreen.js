import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const TermsConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Use</Text>
      <Text style={styles.subtitle}>With effect from [●]</Text>

      <Text style={styles.sectionTitle}>Welcome to Maakichen</Text>
      <Text style={styles.text}>
        This Platform is owned and operated by DMINE TECHS NETWORK PRIVATE LIMITED, located at 15 SRY Layout 2nd Phase 3rd Cross, Mylasandra Dinne, Begur Koppa Road, Bangalore 560068. Maakichen connects home chefs and users for home-cooked food delivery across India.
      </Text>

      <Text style={styles.sectionTitle}>Platform Use & Agreement</Text>
      <Text style={styles.text}>
        By using the Platform, you agree Maakichen is only an intermediary and does not hold or sell any food items. Users must agree to these Terms and the Privacy Policy before accessing services.
      </Text>

      <Text style={styles.sectionTitle}>Registration and Access</Text>
      <Text style={styles.text}>
        Users must register with accurate details to use the Platform. It is your responsibility to keep credentials safe. Maakichen reserves the right to suspend or remove accounts without prior notice.
      </Text>

      <Text style={styles.sectionTitle}>Platform Content</Text>
      <Text style={styles.text}>
        Users are responsible for the content they post. Maakichen has the right to use user-submitted content for marketing and can remove content that violates laws or policies.
      </Text>

      <Text style={styles.sectionTitle}>Content Restrictions</Text>
      <Text style={styles.text}>
        Users may not post or share unlawful, abusive, misleading, infringing, or inappropriate content. Maakichen reserves rights to block or remove such content.
      </Text>

      <Text style={styles.sectionTitle}>User Representations</Text>
      <Text style={styles.text}>
        Users must be 18+ years old and provide true, accurate, and lawful information on the Platform.
      </Text>

      <Text style={styles.sectionTitle}>Third-Party Links</Text>
      <Text style={styles.text}>
        The Platform may contain links to external websites. Maakichen is not responsible for their content or privacy policies.
      </Text>

      <Text style={styles.sectionTitle}>Restrictions on Use</Text>
      <Text style={styles.text}>
        You may not modify, copy, distribute, or republish Platform content. Decompilation, scraping, or reverse engineering is strictly prohibited.
      </Text>

      <Text style={styles.sectionTitle}>Indemnity</Text>
      <Text style={styles.text}>
        You agree to indemnify Maakichen from any claims or damages arising from your use of the Platform, violation of Terms, or infringement of rights.
      </Text>

      <Text style={styles.sectionTitle}>Limitation of Liability</Text>
      <Text style={styles.text}>
        Maakichen is not liable for any direct or indirect damages, losses, or service issues related to Merchant services or user experiences.
      </Text>

      <Text style={styles.sectionTitle}>Orders, Cancellations & Refunds</Text>
      <Text style={styles.text}>
        Orders are confirmed upon placement. Payments must be made in INR. Maakichen reserves the right to cancel orders for unserviceable locations, incorrect info, or Merchant issues. Refunds/cancellations depend on the scenario.
      </Text>

      <Text style={styles.sectionTitle}>Delivery</Text>
      <Text style={styles.text}>
        Delivery is only available in serviceable PIN codes. Delays may occur due to traffic or other reasons. Orders will be delivered only to the address specified at the time of booking.
      </Text>

      <Text style={styles.sectionTitle}>Intellectual Property</Text>
      <Text style={styles.text}>
        Platform content, branding, and layout are protected by intellectual property laws. Republishing or copying content without permission is prohibited.
      </Text>

      <Text style={styles.sectionTitle}>Termination</Text>
      <Text style={styles.text}>
        Breach of these Terms can lead to account suspension or termination. Illegal, abusive, or fraudulent activity will result in permanent suspension.
      </Text>

      <Text style={styles.sectionTitle}>Governing Law</Text>
      <Text style={styles.text}>
        These Terms are governed by the laws of the United States of America. Disputes are subject to arbitration in New York.
      </Text>

      <Text style={styles.sectionTitle}>Severability</Text>
      <Text style={styles.text}>
        If any provision is deemed invalid, the remaining parts of the Terms shall remain valid and enforceable.
      </Text>

      <Text style={styles.sectionTitle}>Notices</Text>
      <Text style={styles.text}>
        Notices must be sent in writing to the Company address or your registered email address.
      </Text>

      <Text style={styles.sectionTitle}>Grievance Officer</Text>
      <Text style={styles.text}>
        For grievances, contact: enquiries@maakichen.com
      </Text>

      <Text style={styles.sectionTitle}>Waiver</Text>
      <Text style={styles.text}>
        No waiver is valid unless written and signed by Maakichen.
      </Text>

      <Text style={styles.sectionTitle}>Complete Understanding</Text>
      <Text style={styles.text}>
        These Terms represent the entire understanding between the user and Maakichen regarding use of the Platform.
      </Text>

      <Text style={styles.footerNote}>
        By using this Platform, you agree to all the Terms & Conditions stated above.
      </Text>
    </ScrollView>
  );
};

export default TermsConditionsScreen;

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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 14,
    color: '#666',
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
