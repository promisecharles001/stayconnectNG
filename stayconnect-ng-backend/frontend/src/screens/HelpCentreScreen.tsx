import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HelpCentreScreen: React.FC = () => {
  const navigation = useNavigation();

  const openEmail = () => {
    Linking.openURL('mailto:info@stayconnect.ng');
  };

  const openPhone = () => {
    Linking.openURL('tel:09015537313');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help Centre</Text>
        <Text style={styles.headerSubtitle}>
          Welcome to StayConnectNG Help Center{'\n'}
          How can we help you today?
        </Text>
      </View>

      {/* Search placeholder */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <Text style={styles.searchText}>Search help articles...</Text>
      </View>

      {/* Categories */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Main Help Categories</Text>

        {/* 1. Account & Registration */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>1. Account & Registration</Text>

          <Text style={styles.question}>How do I create an account?</Text>
          <Text style={styles.answer}>
            To use StayConnectNG:{'\n'}
            • Download the app{'\n'}
            • Sign up using your email{'\n'}
            • Verify your account using OTP{'\n'}
            • Complete your profile
          </Text>

          <Text style={styles.question}>What documents are accepted for verification?</Text>
          <Text style={styles.answer}>
            Accepted identification documents include:{'\n'}
            • National Identification Number (NIN){'\n'}
            • International Passport{'\n'}
            • Driver's License{'\n'}
            • Voter's Card{'\n\n'}
            Verification helps improve platform safety and trust.
          </Text>

          <Text style={styles.question}>I forgot my password</Text>
          <Text style={styles.answer}>
            • Tap "Forgot Password"{'\n'}
            • Enter your registered email{'\n'}
            • Follow reset instructions
          </Text>

          <Text style={styles.question}>How do I update my profile?</Text>
          <Text style={styles.answer}>
            Go to: Profile → Edit Profile{'\n\n'}
            You can update:{'\n'}
            • Profile photo{'\n'}
            • Phone number{'\n'}
            • Email{'\n'}
            • Password
          </Text>
        </View>

        {/* 2. Bookings & Reservations */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>2. Bookings & Reservations</Text>

          <Text style={styles.question}>How do I book a room?</Text>
          <Text style={styles.answer}>
            • Search for nearby rooms{'\n'}
            • Select a listing{'\n'}
            • Contact the host{'\n'}
            • Confirm booking{'\n'}
            • Make payment{'\n'}
            • Proceed to the location using map navigation
          </Text>

          <Text style={styles.question}>Can I cancel a booking?</Text>
          <Text style={styles.answer}>
            Cancellation depends on the host's cancellation policy.{'\n\n'}
            Some bookings may be:{'\n'}
            • Fully refundable{'\n'}
            • Partially refundable{'\n'}
            • Non-refundable
          </Text>

          <Text style={styles.question}>I made payment but host is not responding</Text>
          <Text style={styles.answer}>
            Please contact StayConnectNG support immediately.{'\n\n'}
            Provide:{'\n'}
            • Booking reference{'\n'}
            • Payment proof{'\n'}
            • Host details
          </Text>

          <Text style={styles.question}>Can I extend my stay?</Text>
          <Text style={styles.answer}>
            Yes. Contact the host directly through the app to request an extension.
          </Text>
        </View>

        {/* 3. Payments & Refunds */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>3. Payments & Refunds</Text>

          <Text style={styles.question}>What payment methods are accepted?</Text>
          <Text style={styles.answer}>
            Payments may be made through:{'\n'}
            • Bank transfer{'\n'}
            • Debit card{'\n'}
            • Mobile transfer
          </Text>

          <Text style={styles.question}>Where do I make payment?</Text>
          <Text style={styles.answer}>
            Only make payments to approved StayConnectNG payment details displayed inside the app.{'\n\n'}
            Never send money outside the platform unless instructed officially.
          </Text>

          <Text style={styles.question}>How long do refunds take?</Text>
          <Text style={styles.answer}>
            Refund processing may take:{'\n'}
            • 3–10 business days{'\n'}
            • Depending on the payment provider (T&C applies)
          </Text>

          <Text style={styles.question}>Is StayConnectNG responsible for offline payments?</Text>
          <Text style={styles.answer}>
            No. StayConnectNG is not liable for disputes or incidents arising from:{'\n'}
            • Direct offline payments{'\n'}
            • Private arrangements outside the platform{'\n'}
            • Transactions not verified within the app
          </Text>
        </View>

        {/* 4. Host Support */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>4. Host Support</Text>

          <Text style={styles.question}>How do I become a host?</Text>
          <Text style={styles.answer}>
            • Register as a Host{'\n'}
            • Verify your identity{'\n'}
            • Upload property photos{'\n'}
            • Add location and pricing{'\n'}
            • Submit listing for approval
          </Text>

          <Text style={styles.question}>How do I receive payments?</Text>
          <Text style={styles.answer}>
            Host earnings are displayed in your dashboard.{'\n\n'}
            Withdrawals can be requested anytime and are processed within 5 working days.
          </Text>

          <Text style={styles.question}>What commission does StayConnectNG charge?</Text>
          <Text style={styles.answer}>
            StayConnectNG deducts 15% commission from each completed booking.{'\n\n'}
            The remaining balance is credited to the host wallet.
          </Text>

          <Text style={styles.question}>Why was my listing rejected?</Text>
          <Text style={styles.answer}>
            Listings may be rejected due to:{'\n'}
            • Poor image quality{'\n'}
            • Incomplete address{'\n'}
            • Suspicious activity{'\n'}
            • Inaccurate property details
          </Text>
        </View>

        {/* 5. Safety & Trust */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>5. Safety & Trust</Text>

          <Text style={styles.question}>How does StayConnectNG verify users?</Text>
          <Text style={styles.answer}>
            Users may be required to submit:{'\n'}
            • Valid ID{'\n'}
            • Phone verification{'\n'}
            • Email verification{'\n\n'}
            Hosts may also undergo property verification.
          </Text>

          <Text style={styles.question}>Safety Tips for Guests</Text>
          <Text style={styles.answer}>
            ✓ Verify listing details{'\n'}
            ✓ Read reviews carefully{'\n'}
            ✓ Avoid suspicious requests{'\n'}
            ✓ Report unsafe behavior immediately
          </Text>

          <Text style={styles.question}>Safety Tips for Hosts</Text>
          <Text style={styles.answer}>
            ✓ Verify guest information{'\n'}
            ✓ Use in-app communication{'\n'}
            ✓ Report misconduct promptly
          </Text>

          <Text style={styles.question}>Report a User</Text>
          <Text style={styles.answer}>
            To report a user: Profile → Report User{'\n\n'}
            Our moderation team will review the complaint.
          </Text>
        </View>

        {/* 6. Maps & Location */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>6. Maps & Location</Text>

          <Text style={styles.question}>How do I navigate to a property?</Text>
          <Text style={styles.answer}>
            StayConnectNG integrates with Google Maps. Tap "Navigate" to get directions.
          </Text>

          <Text style={styles.question}>Why can't I find the property?</Text>
          <Text style={styles.answer}>
            Possible reasons:{'\n'}
            • Incorrect location pin{'\n'}
            • Network issues{'\n'}
            • Host location update pending{'\n\n'}
            Contact the host for assistance.
          </Text>
        </View>

        {/* 7. Legal & Disclaimers */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>7. Legal & Disclaimers</Text>

          <Text style={styles.question}>Does StayConnectNG own the listed properties?</Text>
          <Text style={styles.answer}>
            No. StayConnectNG operates solely as a technology marketplace connecting guests with hosts.
          </Text>

          <Text style={styles.question}>Is StayConnectNG responsible for incidents during stays?</Text>
          <Text style={styles.answer}>
            StayConnectNG shall not be held liable for:{'\n'}
            • Personal disputes{'\n'}
            • Injuries{'\n'}
            • Theft{'\n'}
            • Damages{'\n'}
            • Misconduct{'\n'}
            • Offline agreements between users{'\n\n'}
            Users interact at their own discretion and risk.
          </Text>

          <Text style={styles.question}>Can StayConnectNG suspend accounts?</Text>
          <Text style={styles.answer}>
            Yes. Accounts may be suspended for:{'\n'}
            • Fraud{'\n'}
            • Fake listings{'\n'}
            • Abuse{'\n'}
            • Policy violations
          </Text>
        </View>
      </View>

      {/* Contact Support */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Need More Help?</Text>

        <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
          <Ionicons name="mail" size={22} color="#059669" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>info@stayconnect.ng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
          <Ionicons name="call" size={22} color="#059669" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>09015537313</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.contactItem}>
          <Ionicons name="time" size={22} color="#059669" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Support Hours</Text>
            <Text style={styles.contactValue}>Monday – Friday, 9:00 AM – 6:00 PM</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    backgroundColor: '#059669',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 10,
  },
  searchText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  category: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 12,
  },
  question: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
  },
  answer: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  contactSection: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 2,
  },
});

export default HelpCentreScreen;
