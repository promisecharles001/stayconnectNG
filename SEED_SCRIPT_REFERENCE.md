# Complete Prisma Seed Script

## Location
`stayconnect-ng-backend/prisma/seed.ts`

## Current Status
✅ **Already correctly configured** - No changes needed

## Roles Creation Code

The seed script creates the three required roles:

```typescript
// Create Roles
const adminRole = await prisma.role.create({
  data: {
    name: 'ADMIN',
    description: 'System Administrator with full access',
    permissions: ['*'],
  },
});

const hostRole = await prisma.role.create({
  data: {
    name: 'HOST',
    description: 'Property Host can list and manage properties',
    permissions: ['properties:read', 'properties:write', 'bookings:read', 'earnings:read', 'withdrawals:write'],
  },
});

const guestRole = await prisma.role.create({
  data: {
    name: 'GUEST',
    description: 'Guest can search and book properties',
    permissions: ['properties:read', 'bookings:write'],
  },
});

console.log('👥 Created roles: ADMIN, HOST, GUEST');
```

## Role Names (Case-Sensitive)

| Name  | Exact String | Used In |
|-------|--------------|---------|
| GUEST | `'GUEST'`    | User registration (default role) |
| HOST  | `'HOST'`     | Host signup/role upgrade |
| ADMIN | `'ADMIN'`    | Admin users only |

## Run the Seed

### First time setup:
```bash
cd stayconnect-ng-backend
npm install  # Install dependencies if not done
npm run prisma:migrate  # Apply migrations
npm run prisma:seed    # Create roles and sample data
```

### To reseed (clears data):
```bash
cd stayconnect-ng-backend
npm run prisma:seed
```

### To completely reset:
```bash
cd stayconnect-ng-backend
npm run db:reset  # WARNING: Deletes ALL data
```

## Sample Data Created by Seed

### Admin User
- Email: `admin@stayconnect.ng`
- Password: `Admin@123456`
- Role: ADMIN
- Status: ACTIVE

### Host User
- Email: `host@example.com`
- Password: `Host@123456`
- Role: HOST
- Status: ACTIVE
- With KYC verification (APPROVED)

### Guest User
- Email: `guest@example.com`
- Password: `Guest@123456`
- Role: GUEST
- Status: ACTIVE

### Properties
- Luxury Apartment in Lekki (₦75,000/night) - APPROVED
- Cozy Studio in Ikoyi (₦35,000/night) - APPROVED
- Beachfront Villa in Eko Atlantic (₦150,000/night) - PENDING_APPROVAL

### Bookings
- 1 sample booking (guest@example.com → host@example.com, property1, 2024-03-01 to 2024-03-05)

## Seed Script Execution Flow

```
1. Connect to PostgreSQL database
2. Delete all existing data (in this order):
   - WithdrawalRequest
   - EarningsLedger
   - Booking
   - Property
   - KYCVerification
   - User
   - Role
3. Create 3 roles:
   - ADMIN (with * permissions)
   - HOST (with properties and earnings permissions)
   - GUEST (with read and book permissions)
4. Create 3 users:
   - Admin (linked to ADMIN role)
   - Host (linked to HOST role)
   - Guest (linked to GUEST role)
5. Create KYC verification for host
6. Create 3 sample properties
7. Create 1 sample booking
8. Log credentials and success message
9. Close database connection
```

## Troubleshooting

### Issue: "Default role not found" error

**Step 1:** Check if roles exist
```bash
npm run prisma:studio
# Navigate to "roles" table and verify GUEST, HOST, ADMIN exist
```

**Step 2:** If roles missing, run seed
```bash
npm run prisma:seed
```

**Step 3:** If seed fails, check database connection
```bash
# Verify .env file has correct DATABASE_URL
cat .env | grep DATABASE_URL
```

### Issue: Role name mismatch

Ensure exact case matching:
```typescript
// ✅ CORRECT - uppercase
where: { name: 'GUEST' }

// ❌ WRONG - lowercase
where: { name: 'guest' }

// ❌ WRONG - mixed case
where: { name: 'Guest' }
```

### Issue: Permission strings format

Permissions are stored as a string array:
```typescript
permissions: ['properties:read', 'bookings:write']
// NOT
permissions: 'properties:read,bookings:write'
```

## Integration with Auth Service

When a user registers, the auth service performs this lookup:

```typescript
const guestRole = await this.prisma.role.findUnique({
  where: { name: 'GUEST' },  // Must match seed script exactly
});

if (!guestRole) {
  throw new NotFoundException(
    'Default guest role not found. Please run database seed: npm run prisma:seed',
  );
}

// Assign role to new user
const user = await this.prisma.user.create({
  data: {
    // ... other fields
    roleId: guestRole.id,  // ← Automatically assigned
    // ... 
  },
});
```

## Database Schema

The Role model in Prisma schema:

```prisma
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  permissions String[] @default([])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  users       User[]

  @@map("roles")
}
```

**Key constraints:**
- `@id @default(uuid())` - Auto-generated UUID primary key
- `@unique` on name - Prevents duplicate role names
- `String[]` for permissions - Array of permission strings

## Package.json Scripts

```json
{
  "scripts": {
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force"
  }
}
```

## Success Indicators

After running `npm run prisma:seed`, you should see:

```
🌱 Starting database seed...
🗑️  Cleaned existing data
👥 Created roles: ADMIN, HOST, GUEST
👤 Created admin user: admin@stayconnect.ng
👤 Created host user: host@example.com
👤 Created guest user: guest@example.com
✅ Created KYC for host
🏠 Created property: Luxury Apartment in Lekki Phase 1
🏠 Created property: Cozy Studio in Ikoyi
🏠 Created property: Beachfront Villa in Eko Atlantic
📅 Created sample booking
✅ Database seed completed successfully!

📧 Default login credentials:
   Admin: admin@stayconnect.ng / Admin@123456
   Host:  host@example.com / Host@123456
   Guest: guest@example.com / Guest@123456
```

---

## Summary

✅ Seed script is correctly configured
✅ All 3 roles (GUEST, HOST, ADMIN) are created
✅ Role names are case-sensitive and match auth service
✅ Default GUEST role is assigned to new users
✅ Clear error handling if role is missing
✅ Run `npm run prisma:seed` to initialize database
