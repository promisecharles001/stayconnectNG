# Architecture & Data Flow Diagram

## 1. Database Schema Relationship

```
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐           ┌──────────────────┐    │
│  │  roles (Table)   │◄──────────│  users (Table)   │    │
│  ├──────────────────┤ roleId    ├──────────────────┤    │
│  │ id (PK)          │           │ id (PK)          │    │
│  │ name (UNIQUE)    │           │ email (UNIQUE)   │    │
│  │ description      │           │ password         │    │
│  │ permissions []   │           │ firstName        │    │
│  │ createdAt        │           │ lastName         │    │
│  │ updatedAt        │           │ roleId (FK)      │    │
│  └──────────────────┘           │ status           │    │
│                                 │ createdAt        │    │
│         ▲                        └──────────────────┘    │
│         │                                                 │
│    Seeded by:                                            │
│    prisma/seed.ts                                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 2. Seed Execution Flow

```
START: npm run prisma:seed
   │
   ├─► Connect to PostgreSQL (via DATABASE_URL in .env)
   │
   ├─► DELETE existing data (cascade):
   │   ├─ WithdrawalRequest
   │   ├─ EarningsLedger
   │   ├─ Booking
   │   ├─ Property
   │   ├─ KYCVerification
   │   ├─ User
   │   └─ Role ◄── (Important: Delete first)
   │
   ├─► CREATE Roles:
   │   ├─ ADMIN (permissions: ['*'])
   │   ├─ HOST (permissions: [5 items])
   │   └─ GUEST (permissions: ['properties:read', 'bookings:write'])
   │
   ├─► CREATE Users (each linked to a role):
   │   ├─ admin@stayconnect.ng → ADMIN role
   │   ├─ host@example.com → HOST role
   │   └─ guest@example.com → GUEST role
   │
   ├─► CREATE Sample Data:
   │   ├─ KYC verification for host
   │   ├─ 3 properties
   │   └─ 1 booking
   │
   ├─► LOG credentials and summary
   │
   └─► END: Database fully seeded ✅
```

## 3. User Registration Flow

```
User Registration Request
   │
   │  POST /auth/register
   │  {
   │    "email": "newuser@example.com",
   │    "password": "SecurePass@123",
   │    "firstName": "John",
   │    "lastName": "Doe"
   │  }
   │
   ▼
┌─────────────────────────────────────────────┐
│  AuthService.register()                     │
├─────────────────────────────────────────────┤
│                                             │
│  1. Validate email doesn't exist            │
│     ├─ If exists → ConflictException       │
│     └─ Continue                            │
│                                             │
│  2. Validate password strength              │
│     ├─ If weak → BadRequestException       │
│     └─ Continue                            │
│                                             │
│  3. Hash password                           │
│                                             │
│  4. Fetch GUEST role from database ◄────┐  │
│     │                                    │  │
│     ├─ prisma.role.findUnique({          │  │
│     │   where: { name: 'GUEST' }        │  │
│     │ })                                 │  │
│     │                                    │  │
│     ├─ Role found? Continue              │  │
│     └─ Role NOT found?                   │  │
│        └─ NotFoundException ───┐          │  │
│           "Default guest role  │          │  │
│            not found. Please   │          │  │
│            run: npm run        │          │  │
│            prisma:seed"        │          │  │
│                                │          │  │
└────────────────────────────────┼──────────┘  │
                                 │             │
                    Must exist in roles table──┘
                    (created by seed script)
│
│  5. Create user with roleId
│     └─ INSERT INTO users (
│          email, password, firstName,
│          lastName, roleId, status
│        )
│
│  6. Generate JWT tokens
│
│  7. Return auth response ✅
│     {
│       "user": { ... },
│       "accessToken": "...",
│       "refreshToken": "..."
│     }
│
▼
User successfully registered with GUEST role
```

## 4. Role Lookup Dependency

```
┌────────────────────────────────────────────┐
│        User Registration (Register)        │
└────────────┬─────────────────────────────┘
             │
             │ Depends on:
             │ WHERE name = 'GUEST'
             │
             ▼
┌────────────────────────────────────────────┐
│         Role Query to Database             │
│     ┌──────────────────────────────┐       │
│     │ SELECT * FROM roles          │       │
│     │ WHERE name = 'GUEST'         │       │
│     │ LIMIT 1                      │       │
│     └──────────────────────────────┘       │
└────────────┬───────────────────────────────┘
             │
             ├─► Role Found ✅
             │   └─► Assign roleId to user
             │
             └─► Role Not Found ❌
                 └─► Throw NotFoundException
                     └─► Suggest: npm run prisma:seed
```

## 5. Role Hierarchy & Permissions

```
┌─────────────────────────────────────────────────┐
│              Role Hierarchy                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ADMIN                                          │
│  ├─ Permissions: ['*'] (all)                   │
│  └─ Can: Access everything                     │
│                                                 │
│  HOST                                           │
│  ├─ Permissions:                               │
│  │  ├─ properties:read    (list all)           │
│  │  ├─ properties:write   (create/edit own)    │
│  │  ├─ bookings:read      (view own)           │
│  │  ├─ earnings:read      (view earnings)      │
│  │  └─ withdrawals:write  (request withdraw)   │
│  └─ Can: Manage properties and bookings        │
│                                                 │
│  GUEST (Default for new users) ◄── Register   │
│  ├─ Permissions:                               │
│  │  ├─ properties:read    (search)             │
│  │  └─ bookings:write     (make booking)       │
│  └─ Can: Search properties and book stays      │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 6. Troubleshooting Decision Tree

```
                   Error: Default role not found
                            │
                ┌───────────┴───────────┐
                │                       │
        Is seed run?                Have roles in DB?
                │                       │
        ┌───────┴───────┐       ┌───────┴───────┐
        │               │       │               │
       YES              NO      YES              NO
        │               │       │               │
        │               │       │        Check role names:
        │      Run:     │       │        ✓ GUEST (uppercase)
        │    npm run    │       ✓ Continue    ✓ HOST
        │    prisma:    │                    ✓ ADMIN
        │    seed       │
        │               │        If names don't match
        │               │        or wrong spelling:
        │               │
        ▼               │        Run:
    Retry register      │        npm run
    Should work! ✅     │        db:reset
                        │        (clears all data)
                        │
                        ▼
                   Manually insert
                   roles via SQL
                   or restart app
                   and retry seed
```

## 7. File Dependencies

```
Entry Point: User Registration
   │
   ├─► src/auth/auth.service.ts
   │   └─► prisma.role.findUnique({ name: 'GUEST' })
   │       │
   │       └─► Depends on: Roles in database
   │
   ├─► Roles created by: prisma/seed.ts
   │   ├─ Reads: None (creates data)
   │   └─ Writes: roles table (GUEST, HOST, ADMIN)
   │
   └─► Schema definition: prisma/schema.prisma
       ├─ Defines: Role model
       └─ Index: name field (UNIQUE)
```

## 8. Environment Setup

```
.env (Environment Variables)
   │
   ├─ DATABASE_URL=postgresql://user:pass@localhost:5432/stayconnect
   │  └─ Used by: prisma seed, prisma migrate, app runtime
   │
   └─ Other variables (JWT_SECRET, etc.)
      └─ Used by: NestJS runtime
```

## 9. Command Sequence for First Setup

```
Terminal:
┌──────────────────────────────────────────────────┐
│ $ cd stayconnect-ng-backend                      │
│                                                  │
│ $ npm install                                    │
│   └─► Install all dependencies                  │
│                                                  │
│ $ npm run prisma:migrate                        │
│   └─► Create database tables (schema)           │
│                                                  │
│ $ npm run prisma:seed                           │
│   └─► Insert roles, users, sample data         │
│       Logs: ✅ Database seed completed!        │
│                                                  │
│ $ npm run start:dev                             │
│   └─► Start backend server                      │
│       Ready: http://localhost:3000              │
│                                                  │
│ Now register: POST /auth/register                │
│   └─► Uses GUEST role (already in DB) ✅       │
└──────────────────────────────────────────────────┘
```

## 10. Role Name Sensitivity (CRITICAL)

```
❌ WRONG (These will NOT work):
   • 'guest' (lowercase)
   • 'Guest' (mixed case)
   • 'GUESTS' (plural)
   • 'DEFAULT' (wrong name)
   • 'USER' (wrong name)
   Database lookup: WHERE name = 'guest'
   Result: NULL ❌

✅ CORRECT (Only this works):
   • 'GUEST' (uppercase, exact match)
   Database lookup: WHERE name = 'GUEST'
   Result: ✅ Found role with ID xyz
   Assign: roleId = xyz
```

---

## Summary Checklist

- [ ] Seed script exists: `prisma/seed.ts`
- [ ] Role names are: GUEST, HOST, ADMIN (uppercase)
- [ ] Auth service queries: `WHERE name = 'GUEST'`
- [ ] Seed command: `npm run prisma:seed`
- [ ] Error message includes fix instructions
- [ ] Database connection: `.env` has `DATABASE_URL`
- [ ] Migrations applied: `npm run prisma:migrate`
- [ ] Roles seeded: `npm run prisma:seed`
- [ ] User registration works: New users get GUEST role
