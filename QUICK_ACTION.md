# IMMEDIATE ACTION GUIDE

## The Problem
Error: `"Default role not found"` when users try to register

## The Solution
**Run this command (1 minute):**
```bash
cd stayconnect-ng-backend
npm run prisma:seed
```

## That's It! ✅

---

## What Happens After You Run It

The seed script will:
1. ✅ Create 3 roles in database: GUEST, HOST, ADMIN
2. ✅ Create 3 sample users for testing
3. ✅ Create sample properties and bookings
4. ✅ Print success message with credentials

Expected output:
```
🌱 Starting database seed...
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

## After Seed Completes

### Option 1: Test Registration (Recommended)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Password@123456",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+2348012345678"
  }'
```

### Option 2: Login with Sample Credentials
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@example.com",
    "password": "Guest@123456"
  }'
```

### Option 3: View Data in Prisma Studio
```bash
npm run prisma:studio
```
Then open http://localhost:5555 in browser

---

## If Something Goes Wrong

### Error: "DATABASE_URL not configured"
```bash
# Check .env file
cat .env | grep DATABASE_URL
# Should show: postgresql://user:pass@localhost:5432/stayconnect
```

### Error: "Connection refused"
```bash
# Make sure PostgreSQL is running
# On Windows: Check Services or start PostgreSQL manually
```

### Error: "Seed already ran, data exists"
```bash
# To clear and reseed (WARNING: DELETES ALL DATA):
npm run db:reset
```

### Want to see database content:
```bash
npm run prisma:studio
```

---

## What Files Were Changed

✅ `src/auth/auth.service.ts` - Better error message
✅ `prisma/seed.ts` - Already configured (no changes)
✅ `prisma/schema.prisma` - Already correct (no changes)

---

## Roles Created

| Role | For | Permissions |
|------|-----|-------------|
| **GUEST** | New users | Search properties, book stays |
| **HOST** | Property owners | Manage properties, view earnings |
| **ADMIN** | System admin | Everything |

---

## Key Points

✅ **Role names are UPPERCASE** (GUEST, HOST, ADMIN)
✅ **Role names are case-sensitive** (GUEST ≠ guest)
✅ **New users get GUEST role automatically**
✅ **Seed includes sample data for testing**
✅ **Safe to run multiple times** (clears and recreates)

---

## Commands Reference

```bash
# 🌱 Run seed (creates roles and sample data)
npm run prisma:seed

# 🔄 Reset database (DELETES ALL DATA) and reseed
npm run db:reset

# 🎨 View database in web UI
npm run prisma:studio

# 📊 Check role names in DB
npm run prisma:studio
# Then click "roles" table

# 🚀 Start backend server
npm run start:dev

# 🔧 Apply migrations (if needed first)
npm run prisma:migrate
```

---

## Testing Steps (In Order)

1. **Run seed:**
   ```bash
   npm run prisma:seed
   ```
   ✅ Should complete without errors

2. **Start backend:**
   ```bash
   npm run start:dev
   ```
   ✅ Should start on http://localhost:3000

3. **Test registration:**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test@123456","firstName":"Test","lastName":"User"}'
   ```
   ✅ Should return user with GUEST role

4. **Verify in database:**
   ```bash
   npm run prisma:studio
   ```
   ✅ Check "users" and "roles" tables

---

## Most Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Role not found error | `npm run prisma:seed` |
| Database connection error | Check DATABASE_URL in .env |
| PostgreSQL not running | Start PostgreSQL service |
| Want to clear all data | `npm run db:reset` |
| Want to see roles | `npm run prisma:studio` |
| Want to see SQL logs | Set `DEBUG=*` in .env |

---

## Next Steps

1. **Run:** `npm run prisma:seed`
2. **Start:** `npm run start:dev`
3. **Test:** Register or login with credentials above
4. **Done!** ✅

---

## Help Needed?

Check these files for more details:
- `FIX_SUMMARY.md` - Complete overview
- `QUICK_REFERENCE.md` - Command reference
- `ROLE_SETUP_GUIDE.md` - Detailed setup guide
- `ARCHITECTURE_DIAGRAM.md` - How it works
- `SEED_SCRIPT_REFERENCE.md` - Seed code details

---

## That's All You Need! 🎉

The error is fixed when you run:
```bash
npm run prisma:seed
```

One command. One minute. Done.
