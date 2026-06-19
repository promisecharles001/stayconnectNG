# StayConnect NG — Recommended User Flow Strategy
## PropTech App: Guest & Host Onboarding Policy (Real-World Ready)

---

## Executive Summary

To maximize trust, downloads, and bookings in the Nigerian property rental market, StayConnect NG should follow the industry-proven model used by Airbnb, Booking.com, and Vrbo:

> **Guests browse freely. Hosts verify fully.**

This means **zero friction at discovery** (no account needed to view properties) and **full verification at transaction** (account required only when booking or listing a property).

---

## 1. Guest Journey (People Looking to Rent)

### Phase 1: Discovery — No Account Required
| What They Can Do | Account Needed? |
|---|---|
| Open the app | No |
| Browse properties on Home screen | No |
| Search and filter by location, price, type | No |
| View property photos, description, and reviews | No |
| See host name and basic info | No |

**Why:** Nigerians are highly cautious about sharing personal data with new apps. Letting them see inventory first builds confidence and reduces app abandonment.

### Phase 2: Engagement — Minimal Info Required
| Action | What's Required |
|---|---|
| Contact host / ask a question | Phone number + OTP verification only |
| Save a property to favorites | Optional: phone number |

**Why:** A simple phone OTP stops spam without asking for full registration. It captures the user intent while keeping friction low.

### Phase 3: Booking — Full Account Required
| Action | What's Required |
|---|---|
| Confirm a booking | Name, phone number, email |
| Make payment | Verified account + payment method |
| View host's phone number for check-in | Confirmed booking only |
| Leave a review after stay | Account required |

**Why:** At the point of money exchange, both guest and host need traceability. This is the correct place to require full registration.

### Phase 4: Identity Verification (Optional for Guests)
| Scenario | Action |
|---|---|
| Regular guest booking | No ID verification needed |
| Guest reported by a host | Admin can require ID verification |
| Guest wants to switch to host role | Full KYC + ID upload required |

---

## 2. Host Journey (People Listing Properties)

Hosts must be fully verified **before** any property goes live. This is non-negotiable for platform trust and safety.

### Step-by-Step Host Onboarding

| Step | Requirement | Status |
|---|---|---|
| 1. Create account | Name, phone, email, profile photo | Mandatory |
| 2. Phone verification | OTP confirmation | Mandatory |
| 3. Identity verification (KYC) | Upload NIN, Passport, or Driver's License | Mandatory |
| 4. Admin KYC approval | Admin reviews and approves ID | Mandatory |
| 5. Add bank account | For receiving payouts | Mandatory |
| 6. Accept Terms & Host Policy | Digital acceptance recorded | Mandatory |
| 7. List property | Photos, location, price, house rules | Mandatory |
| 8. Admin listing review | Admin approves property before it goes live | Mandatory |
| 9. Start receiving bookings | Property visible to guests | Approved only |

### Host Earnings & Withdrawals
- StayConnect NG deducts **15% commission** per completed booking
- Hosts can request withdrawals anytime
- Payouts processed within **5 working days**
- All earnings visible in host dashboard

---

## 3. Comparison: Current vs. Recommended Flow

| Stage | Current Flow | Recommended Flow |
|---|---|---|
| Open app | Must tap "Continue as Visitor" | See properties immediately |
| Browse listings | After onboarding screens | Instant access |
| View property details | Account not needed | Account not needed |
| Contact host | Requires full account | Phone number + OTP only |
| Book property | Requires full account | Requires full account |
| List a property | KYC required | KYC + admin approval required |

---

## 4. Why This Matters for the Nigerian Market

| Market Factor | Impact on App Design |
|---|---|
| **Low trust in new online platforms** | Showing properties first builds confidence before asking for data |
| **High mobile data costs** | Users won't waste data on an app that blocks them at signup |
| **Scam and fraud awareness** | Anonymous browsing is safe; transactions require identity |
| **Word-of-mouth culture** | Easy browsing leads to referrals; signup walls lead to complaints |
| **Cash-to-digital transition** | Let users see value before asking for bank or payment details |

---

## 5. What the Profile Screen Should Show

### For a Guest Who Has Not Signed In
```
Profile

[Sign In]                    [Create Free Account]
------------------------------------------------------------------
Help Centre
Terms & Privacy

"Browse properties without an account.
Sign in only when you're ready to book."
```

### For a Signed-In Guest
```
Profile

[User Name] | [Phone Number]
My Bookings
Saved Properties
Messages

Help Centre
Terms & Privacy

[Log Out]
```

### For a Verified Host
```
Profile

[Host Name] | [Verified Badge]
My Listings
My Bookings
Earnings & Withdrawals
Messages

Host Verification Status: Approved
Help Centre
Terms & Privacy

[Log Out]
```

---

## 6. Technical Notes for Development

- **Guests browsing without an account** should use a temporary "visitor" session ID stored locally on the device
- **Phone OTP** should be the primary authentication method (more reliable than email in Nigeria)
- **KYC documents** must be reviewed by an admin before the host can list properties
- **Payment integration** should support bank transfer, debit card, and mobile transfer
- **All offline payments** are at the user's own risk — platform is not liable

---

## 7. Summary Table

| User Type | Browse | Contact Host | Book | List Property | Get Paid |
|---|---|---|---|---|---|
| **Anonymous Visitor** | Yes | No | No | No | No |
| **Phone-Verified Guest** | Yes | Yes | No | No | No |
| **Registered Guest** | Yes | Yes | Yes | No | No |
| **Verified Host** | Yes | Yes | Yes | Yes | Yes |

> **The golden rule:** Remove every barrier between the user and the property listings. Add verification only at the point of trust — when money, property access, or legal liability is involved.

---

*Prepared for StayConnect NG Client Review*  
*Strategy based on Airbnb, Booking.com, Vrbo, and Nigerian market research*
