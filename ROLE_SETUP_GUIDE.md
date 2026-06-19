# Role Setup and "Default Role Not Found" Fix Guide

## Problem
The application throws "Default role not found" error when users try to register because the required roles are not in the database.

## Solution Status
✅ **IMPLEMENTED** - Your backend is properly configured to handle this.

---

## 1. Prisma Schema (Roles)

**Location:** `stayconnect-ng-backend/prisma/schema.prisma`

The Role model is properly defined:

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

**Key Points:**
- `name` field is UNIQUE (prevents duplicates)
- `name` is case-sensitive
- All three required roles are created in the seed script

---

## 2. Seed Script

**Location:** `stayconnect-ng-backend/prisma/seed.ts`

The seed script already creates the required roles:

### Roles Created:
1. **GUEST** (Default for new users)
   - Permissions: `properties:read`, `bookings:write`
   - Description: Guest can search and book properties

2. **HOST**
   - Permissions: `properties:read`, `properties:write`, `bookings:read`, `earnings:read`, `withdrawals:write`
   - Description: Property Host can list and manage properties

3. **ADMIN**
   - Permissions: `*` (full access)
   - Description: System Administrator with full access

### Seed Script Excerpt:
```typescript
const guestRole = await prisma.role.create({
  data: {
    name: 'GUEST',
    description: 'Guest can search and book properties',
    permissions: ['properties:read', 'bookings:write'],
  },
});

const hostRole = await prisma.role.create({
  data: {
    name: 'HOST',
    description: 'Property Host can list and manage properties',
    permissions: ['properties:read', 'properties:write', 'bookings:read', 'earnings:read', 'withdrawals:write'],
  },
});

const adminRole = await prisma.role.create({
  data: {
    name: 'ADMIN',
    description: 'System Administrator with full access',
    permissions: ['*'],
  },
});
```

---

## 3. Updated Auth Service Registration Logic

**Location:** `stayconnect-ng-backend/src/auth/auth.service.ts`

The registration logic now:

1. ✅ Fetches the "GUEST" role by exact name match
2. ✅ Throws a clear, actionable error if the role is missing
3. ✅ Includes helpful instructions in the error message

```typescript
// Get default guest role
const guestRole = await this.prisma.role.findUnique({
  where: { name: 'GUEST' },
});

if (!guestRole) {
  this.logger.error('Default "GUEST" role not found in database');
  throw new NotFoundException(
    'Default guest role not found. Please run database seed: npm run prisma:seed',
  );
}

// Create user with the GUEST role
const user = await this.prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    roleId: guestRole.id, // ← Assigned automatically
    status: UserStatus.PENDING_VERIFICATION,
  },
  include: {
    role: true,
  },
});
```

---

## 4. How to Run the Seed

### Prerequisites:
- Node.js installed
- PostgreSQL database running and accessible
- `.env` file configured with `DATABASE_URL`

### Command:
```bash
cd stayconnect-ng-backend
npm run prisma:seed
```

### What It Does:
1. ✅ Cleans existing data (optional, can be modified)
2. ✅ Creates 3 roles: GUEST, HOST, ADMIN
3. ✅ Creates 3 sample users (admin, host, guest)
4. ✅ Creates sample properties and bookings
5. ✅ Outputs default login credentials

### Expected Output:
```
🌱 Starting database seed...
🗑️  Cleaned existing data
👥 Created roles: ADMIN, HOST, GUEST
👤 Created admin user: admin@stayconnect.ng
👤 Created host user: host@example.com
👤 Created guest user: guest@example.com
✅ Database seed completed successfully!

📧 Default login credentials:
   Admin: admin@stayconnect.ng / Admin@123456
   Host:  host@example.com / Host@123456
   Guest: guest@example.com / Guest@123456
```

---

## 5. Alternative: One-Time Database Reset

If you want to completely reset and reseed the database:

```bash
cd stayconnect-ng-backend
npm run db:reset
```

**Warning:** This will delete ALL data and restart migrations. Only use in development.

---

## 6. Verification

### Check if roles exist (in PostgreSQL):
```sql
SELECT id, name, description, permissions FROM roles;
```

Expected output:
```
                  id                  | name  |           description           |                          permissions
--------------------------------------+-------+---------------------------------+-----------------------------------------------------
 abc123...                            | ADMIN | System Administrator...         | {*}
 def456...                            | HOST  | Property Host can list...       | {properties:read,properties:write,...}
 ghi789...                            | GUEST | Guest can search and book...    | {properties:read,bookings:write}
```

---

## 7. Troubleshooting

### Error: "Default guest role not found"

**Solution 1: Run the seed**
```bash
npm run prisma:seed
```

**Solution 2: Check database connection**
```bash
# Verify DATABASE_URL in .env is correct
cat .env | grep DATABASE_URL
```

**Solution 3: Manual role creation**
```sql
INSERT INTO roles (id, name, description, permissions, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'GUEST', 'Guest can search and book properties', '["properties:read","bookings:write"]', NOW(), NOW()),
  (gen_random_uuid(), 'HOST', 'Property Host can list and manage properties', '["properties:read","properties:write","bookings:read","earnings:read","withdrawals:write"]', NOW(), NOW()),
  (gen_random_uuid(), 'ADMIN', 'System Administrator with full access', '["*"]', NOW(), NOW());
```

---

## 8. Next Steps

1. **Run the seed:**
   ```bash
   npm run prisma:seed
   ```

2. **Verify roles were created:**
   ```sql
   SELECT name FROM roles ORDER BY name;
   -- Should show: ADMIN, GUEST, HOST
   ```

3. **Test registration:**
   - Try registering a new user via your API
   - New users should automatically get the GUEST role

4. **Check logs:**
   - If an error occurs, the error message now provides clear instructions

---

## Summary

| Item | Status | Details |
|------|--------|---------|
| Schema defined | ✅ | Role model with unique name field |
| Seed script | ✅ | Creates GUEST, HOST, ADMIN roles |
| Auth logic updated | ✅ | Fetches GUEST role, clear error if missing |
| Seed command available | ✅ | `npm run prisma:seed` |
| Documentation | ✅ | This guide |

**To fix the error: Run `npm run prisma:seed` in the `stayconnect-ng-backend` folder.**
