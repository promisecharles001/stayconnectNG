# Quick Reference: Seed & Run Commands

## The Fix in One Command

```bash
cd stayconnect-ng-backend
npm run prisma:seed
```

---

## Available Commands

```bash
# Seed the database with roles, users, and sample data
npm run prisma:seed

# Reset database (DELETE ALL DATA) and reseed
npm run db:reset

# View database schema in UI
npm run prisma:studio

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

---

## What Gets Seeded

### Roles (3 total)
| Role  | Permissions | Default For |
|-------|-------------|-------------|
| GUEST | read properties, book | New users |
| HOST  | read/write properties, manage bookings | Property owners |
| ADMIN | all (*)     | Admin users |

### Sample Users
- **admin@stayconnect.ng** / Admin@123456
- **host@example.com** / Host@123456
- **guest@example.com** / Guest@123456

### Sample Data
- 2 approved properties
- 1 pending property
- 1 sample booking
- KYC verification for host

---

## Error Message Fixed

**Before:**
```
Default role not found
```

**After:**
```
Default guest role not found. Please run database seed: npm run prisma:seed
```

---

## Manual SQL (if needed)

```sql
-- Check if roles exist
SELECT name FROM roles;

-- Manually insert roles if seed failed
INSERT INTO roles (id, name, description, permissions, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'GUEST', 'Guest can search and book properties', '["properties:read","bookings:write"]', NOW(), NOW()),
  (gen_random_uuid(), 'HOST', 'Property Host can list and manage properties', '["properties:read","properties:write","bookings:read","earnings:read","withdrawals:write"]', NOW(), NOW()),
  (gen_random_uuid(), 'ADMIN', 'System Administrator with full access', '["*"]', NOW(), NOW());
```

---

## Files Modified

✅ `/stayconnect-ng-backend/src/auth/auth.service.ts`
- Updated error handling with clear message
- Added logging for debugging

✅ `/stayconnect-ng-backend/prisma/seed.ts`
- Already configured (no changes needed)
- Creates all 3 roles with correct names

✅ `/stayconnect-ng-backend/prisma/schema.prisma`
- Already correct (no changes needed)
- Role model properly defined

---

## Next: Start Backend

```bash
# In stayconnect-ng-backend directory
npm run start:dev
```

---

## Debugging

```bash
# View database with Prisma Studio
npm run prisma:studio

# Check env
cat .env | grep DATABASE_URL

# Test with curl
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "firstName": "John",
    "lastName": "Doe"
  }'
```
