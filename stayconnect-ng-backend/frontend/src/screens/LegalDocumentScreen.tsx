import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppNavigator';

type LegalDocumentScreenRouteProp = RouteProp<AppStackParamList, 'LegalDocument'>;

interface LegalDocumentScreenProps {
  route: LegalDocumentScreenRouteProp;
}

const TERMS_CONTENT = `STAYCONNECT NG - TERMS OF USE

Last Updated: April 22, 2026

IMPORTANT NOTICE: These Terms of Use constitute a legally binding agreement between you and StayConnect Technologies Limited.

1. PLATFORM ROLE CLARIFICATION

StayConnect NG is a technology marketplace only. We:
- Do not own, manage, inspect, or operate any accommodation
- Do not act as an agent, broker, or guarantor
- Do not participate in offline transactions or agreements

2. USER ELIGIBILITY & ACCOUNT USE

- Users must be at least 18 years old
- Users must provide accurate and verifiable information
- We reserve the absolute right to suspend or terminate accounts without notice

3. BOOKINGS, CALLS & PAYMENTS

- Call acceptance does not constitute a contractual guarantee
- Payments made are solely between users
- We do not hold funds in escrow unless expressly stated
- Any financial loss is borne solely by the users involved

4. HOST OBLIGATIONS

Hosts agree to:
- Provide truthful listings
- Maintain safety and hygiene standards
- Comply with all applicable laws

Host Agreement (Extended)
- Listing accuracy & availability SLA
- Commission (25%) & payout timelines (<=5 working days)
- Prohibited conduct & penalties
- Insurance & indemnity by host
- Suspension/termination & dispute handling

Note: We do not verify physical conditions of properties.

5. GUEST OBLIGATIONS

Guests agree to:
- Conduct themselves lawfully
- Respect host property
- Resolve disputes civilly

6. RATINGS & REVIEWS

We do not guarantee accuracy of ratings or reviews and shall not be liable for reliance placed on them.

7. COMPLAINTS & DISPUTES

- Complaints may be submitted through the App
- We may mediate at our discretion
- We are not obligated to resolve disputes
- Users waive the right to hold the platform liable for unresolved disputes

8. DISCLAIMER OF WARRANTIES

The App is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied.

9. INDEMNITY

Users agree to fully indemnify and hold harmless StayConnect Technologies Limited, its directors, employees, and partners from all claims, damages, losses, liabilities, costs, and legal fees arising from:
- Offline interactions
- Property conditions
- Criminal acts
- Breach of these Terms

10. LIMITATION OF LIABILITY

Under no circumstances shall StayConnect Technologies Limited be liable for:
- Personal injury or death
- Property damage
- Loss of profit, revenue, or data

11. GOVERNING LAW & JURISDICTION

These Terms shall be governed exclusively by the laws of the Federal Republic of Nigeria. Courts in Nigeria shall have exclusive jurisdiction.

12. SEVERABILITY

If any provision is held invalid, the remaining provisions shall remain in full force and effect.

13. ENTIRE AGREEMENT

These Terms constitute the entire agreement between the user and StayConnect Technologies Limited and supersede all prior communications.

14. USER ACKNOWLEDGEMENT

By using StayConnect NG, you acknowledge that you have read, understood, and agreed to be bound by these Terms and the Privacy Policy.

MANDATORY ARBITRATION & DISPUTE RESOLUTION CLAUSE

1. Mandatory Arbitration
All disputes, claims, controversies, or disagreements arising out of or relating to the use of StayConnect NG, whether contractual, tortious, statutory, or otherwise, shall be resolved exclusively by binding arbitration, and not by litigation in court, except where prohibited by law.

2. Arbitration Rules
- Arbitration shall be conducted in Nigeria
- The venue shall be the Federal Capital Territory Abuja
- Proceedings shall be confidential
- A single arbitrator shall be appointed by StayConnect Technologies Limited

3. Waiver of Class Actions
Users expressly waive any right to:
- Participate in class actions
- Join consolidated claims
- Act as a class representative

Disputes must be brought individually.

4. Injunctive Relief Exception
StayConnect Technologies Limited reserves the right to seek injunctive or equitable relief in court to protect its intellectual property, platform integrity, or business interests.

Contact Us: support@stayconnect.ng`;

const PRIVACY_CONTENT = `STAYCONNECT NG - PRIVACY POLICY

Last Updated: April 22, 2026

This Privacy Policy governs the collection, use, storage, disclosure, and protection of personal data by StayConnect Technologies Limited, owners of the StayConnect NG mobile application ("the App", "we", "us", "our"). By accessing or using the App, you expressly consent to the practices described herein.

1. SCOPE AND APPLICATION

This Privacy Policy applies to all users of the App, including but not limited to Guests, Hosts, Agents, and any other persons who access or interact with the App, whether online or offline.

Use of the App constitutes irrevocable acceptance of this Privacy Policy.

2. DATA WE COLLECT

We may collect, store, and process the following categories of data:

a. Personal Identification Data
- Full name
- Phone number
- Email address
- Government-issued identification (NIN, Passport, Driver's License, Voter's Card)
- Selfie and verification images

b. Usage & Technical Data
- Device information
- IP address
- App interaction logs
- Location data (GPS)

c. Transactional & Communication Data
- Call request records
- Booking interactions
- Payment confirmations
- Ratings, reviews, complaints, and messages

3. PURPOSE OF DATA COLLECTION

Your data is collected and used strictly for the following purposes:
- Identity verification and fraud prevention
- Facilitating connections between Guests and Hosts
- Enabling communication and navigation features
- Platform security and abuse monitoring
- Legal compliance and dispute handling

We do not guarantee uninterrupted, error-free, or risk-free services.

4. DATA SHARING & DISCLOSURE

We reserve the right to share data:
- With law enforcement or regulatory authorities
- To comply with legal obligations or court orders
- To protect the rights, safety, and property of the platform, its users, or the public

We are not responsible for how users handle data exchanged outside the App.

5. DATA STORAGE & RETENTION

- Data is stored securely using reasonable technical safeguards
- We retain data for as long as deemed necessary for business, legal, or regulatory purposes
- We reserve the right to retain anonymized data indefinitely

6. USER RESPONSIBILITY

Users are solely responsible for:
- Accuracy of information provided
- Safeguarding their login credentials
- Consequences arising from sharing information offline or outside the App

7. OFFLINE INTERACTIONS DISCLAIMER

StayConnect NG does not monitor, control, supervise, or guarantee any offline interaction, meeting, stay, transaction, or agreement between users.

Any incident, loss, injury, dispute, criminal act, or damage occurring offline is entirely the responsibility of the involved users.

8. LIMITATION OF LIABILITY

To the fullest extent permitted by Nigerian law:
- We disclaim all liability for indirect, incidental, special, consequential, or punitive damages
- Our total liability, if any, shall not exceed the total commissions earned from the affected transaction

9. USER RIGHTS

Users may request:
- Access to personal data
- Correction of inaccurate data

Requests may be denied where legally permissible.

10. AMENDMENTS

We reserve the unrestricted right to amend this Privacy Policy at any time without prior notice. Continued use of the App constitutes acceptance of the revised policy.

Contact Us: support@stayconnect.ng`;

const LegalDocumentScreen: React.FC<LegalDocumentScreenProps> = ({ route }) => {
  const { type } = route.params;
  const content = type === 'terms' ? TERMS_CONTENT : PRIVACY_CONTENT;

  const renderContent = () => {
    return content.split('\n').map((line, index) => {
      const isHeading = line.startsWith('STAYCONNECT') || line === 'MANDATORY ARBITRATION & DISPUTE RESOLUTION CLAUSE';
      const isSubHeading = /^\d+\./.test(line) && line.length < 80;
      const isBullet = line.startsWith('- ') || line.startsWith('• ');

      if (isHeading) {
        return (
          <Text key={index} style={styles.heading}>
            {line}
          </Text>
        );
      }

      if (isSubHeading) {
        return (
          <Text key={index} style={styles.subHeading}>
            {line}
          </Text>
        );
      }

      if (isBullet) {
        return (
          <Text key={index} style={styles.bullet}>
            {line}
          </Text>
        );
      }

      if (line.trim() === '') {
        return <View key={index} style={styles.spacer} />;
      }

      return (
        <Text key={index} style={styles.paragraph}>
          {line}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 8,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 4,
    paddingLeft: 12,
  },
  spacer: {
    height: 8,
  },
});

export default LegalDocumentScreen;
