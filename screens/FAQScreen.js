import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function FAQScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Maakitchen – Frequently Asked Questions (FAQs)</Text>

      {/* 👩‍🍳 About Maakitchen */}
      <Text style={styles.section}>👩‍🍳 About Maakitchen</Text>
      <Text style={styles.question}>Q1. What is Maakitchen?</Text>
      <Text style={styles.answer}>
        A: Maakitchen is a platform that connects customers with local home chefs to deliver fresh, hygienic, and delicious homecooked meals right to your doorstep.
      </Text>

      <Text style={styles.question}>Q2. How is Maakitchen different from regular food delivery apps?</Text>
      <Text style={styles.answer}>
        A: Unlike restaurant-based platforms, Maakitchen offers food prepared by verified home chefs, ensuring authentic taste, personalized menus, and healthy options free from commercial additives.
      </Text>

      {/* 🛒 Ordering & Delivery */}
      <Text style={styles.section}>🛒 Ordering & Delivery</Text>
      <Text style={styles.question}>Q3. How do I place an order on Maakitchen?</Text>
      <Text style={styles.answer}>
        A: You can place an order through our mobile app or website. Simply browse menus from nearby home chefs, add items to your cart, and choose your delivery time slot.
      </Text>

      <Text style={styles.question}>Q4. Can I pre-order meals in advance?</Text>
      <Text style={styles.answer}>
        A: Yes, pre-ordering is encouraged to give home chefs ample preparation time. You can schedule meals for the same day or upcoming days.
      </Text>

      <Text style={styles.question}>Q5. What is the delivery time for my order?</Text>
      <Text style={styles.answer}>
        A: Delivery usually takes between 30 minutes to 1.5 hours depending on the chef’s location and meal preparation time.
      </Text>

      <Text style={styles.question}>Q6. Are there delivery charges?</Text>
      <Text style={styles.answer}>
        A: Delivery charges vary by distance but are clearly shown at checkout. Some chefs offer free delivery for minimum order values.
      </Text>

      {/* 👨‍🍳 About the Home Chefs */}
      <Text style={styles.section}>👨‍🍳 About the Home Chefs</Text>
      <Text style={styles.question}>Q7. Who are the chefs on Maakitchen?</Text>
      <Text style={styles.answer}>
        A: Our chefs are passionate home cooks, homemakers, and culinary professionals who have been verified and trained in hygiene and quality standards.
      </Text>

      <Text style={styles.question}>Q8. Can I rate or review a chef?</Text>
      <Text style={styles.answer}>
        A: Yes, after your meal is delivered, you’ll be prompted to rate your experience and leave a review to help others.
      </Text>

      <Text style={styles.question}>Q9. Can I follow or favorite a chef?</Text>
      <Text style={styles.answer}>
        A: Absolutely! You can follow your favorite chefs to get notified when they upload new dishes or special menus.
      </Text>

      {/* 💳 Payments & Refunds */}
      <Text style={styles.section}>💳 Payments & Refunds</Text>
      <Text style={styles.question}>Q10. What payment methods are accepted?</Text>
      <Text style={styles.answer}>
        A: We accept UPI, debit/credit cards, net banking, and wallet payments like Paytm, PhonePe, and Google Pay.
      </Text>

      <Text style={styles.question}>Q11. Is Cash on Delivery (COD) available?</Text>
      <Text style={styles.answer}>
        A: In select areas, yes. COD availability will be shown at checkout.
      </Text>

      <Text style={styles.question}>Q12. What if I receive the wrong or bad-quality food?</Text>
      <Text style={styles.answer}>
        A: We’re sorry to hear that! Please report the issue via the app or call our customer support. We will investigate and issue refunds or credits as appropriate.
      </Text>

      {/* 🧼 Hygiene & Safety */}
      <Text style={styles.section}>🧼 Hygiene & Safety</Text>
      <Text style={styles.question}>Q13. How do you ensure food safety and hygiene?</Text>
      <Text style={styles.answer}>
        A: All chefs follow FSSAI guidelines. We conduct regular kitchen inspections, offer hygiene training, and collect customer feedback regularly.
      </Text>

      <Text style={styles.question}>Q14. Are chefs vaccinated and trained in hygiene practices?</Text>
      <Text style={styles.answer}>
        A: Yes, we prioritize onboarding chefs who are vaccinated and trained in hygienic food handling and kitchen sanitation.
      </Text>

      {/* 🔄 Subscriptions & Custom Meals */}
      <Text style={styles.section}>🔄 Subscriptions & Custom Meals</Text>
      <Text style={styles.question}>Q15. Do you offer meal subscriptions?</Text>
      <Text style={styles.answer}>
        A: Yes! Daily, weekly, and monthly tiffin subscriptions are available from select chefs.
      </Text>

      <Text style={styles.question}>Q16. Can I customize my meal (less spicy, Jain, gluten-free, etc.)?</Text>
      <Text style={styles.answer}>
        A: Most chefs allow customizations. Just mention your preferences in the special instructions section while ordering.
      </Text>

      {/* 🌍 Locations & Availability */}
      <Text style={styles.section}>🌍 Locations & Availability</Text>
      <Text style={styles.question}>Q17. Where is Maakitchen available?</Text>
      <Text style={styles.answer}>
        A: Maakitchen is currently available in select Indian cities. You can enter your PIN code on our website/app to check availability in your area.
      </Text>

      <Text style={styles.question}>Q18. Are there vegetarian or regional specialty options?</Text>
      <Text style={styles.answer}>
        A: Absolutely! You’ll find North Indian, South Indian, Jain, Bengali, Rajasthani, and many more homemade specialties.
      </Text>

      {/* 📞 Support & Feedback */}
      <Text style={styles.section}>📞 Support & Feedback</Text>
      <Text style={styles.question}>Q19. How can I contact Maakitchen?</Text>
      <Text style={styles.answer}>
        A: You can reach us via the app's support chat, email at support@maakitchen.in, or call our helpline at +91-XXXXXXXXXX.
      </Text>

      <Text style={styles.question}>Q20. How do I give feedback or suggest improvements?</Text>
      <Text style={styles.answer}>
        A: You can rate chefs, leave reviews, or use the in-app feedback form to share your thoughts. We love hearing from our users!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#750656',
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#000',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#333',
  },
  answer: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
    lineHeight: 22,
  },
});
