# StayConnect Project Structure

## Project Architecture

```
StayConnect Backend/
├── backend/                    # NestJS API Server
│   ├── src/                    # TypeScript source files
│   │   ├── admin/              # Admin module
│   │   ├── auth/               # Authentication module
│   │   ├── bookings/           # Booking management
│   │   ├── common/             # Shared utilities
│   │   ├── config/             # Configuration files
│   │   ├── earnings/           # Earnings tracking
│   │   ├── kyc/                # KYC verification
│   │   ├── prisma/             # Database ORM
│   │   ├── properties/         # Property management
│   │   ├── users/              # User management
│   │   ├── voice/              # Voice calling service
│   │   ├── withdrawals/        # Withdrawal processing
│   │   ├── app.module.ts       # Main application module
│   │   └── main.ts             # Application entry point
│   ├── prisma/                 # Prisma schema and migrations
│   ├── dist/                   # Compiled output
│   ├── node_modules/           # Backend dependencies
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── nest-cli.json           # NestJS CLI configuration
│   └── .env                    # Environment variables
│
├── frontend/                   # React Native (Expo) App
│   ├── src/                    # Application source
│   │   ├── components/         # Reusable components
│   │   ├── screens/            # Screen components
│   │   │   └── VoiceCallScreen.tsx  # Voice calling screen
│   │   ├── services/           # Service layer
│   │   │   └── voiceService.ts      # Agora voice service
│   │   ├── config/             # Configuration files
│   │   │   └── api.ts          # API configuration
│   │   └── navigation/         # Navigation setup
│   ├── node_modules/           # Frontend dependencies
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── app.json                # Expo configuration
│   └── babel.config.js         # Babel configuration
│
└── README.md                   # Project documentation
```

## Backend (NestJS)

### Key Features
- RESTful API with Swagger documentation
- JWT authentication
- PostgreSQL database with Prisma ORM
- Agora.io voice calling integration
- Role-based access control
- Comprehensive validation

### Commands
```bash
# Development
npm run start:dev

# Production build
npm run build

# Production start
npm run start:prod

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

## Frontend (React Native/Expo)

### Key Features
- Mobile-first React Native application
- Expo for easy development and deployment
- Agora.io voice calling integration
- TypeScript support
- Navigation with React Navigation

### Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Start on Android
npm run android

# Start on iOS
npm run ios

# Start on Web
npm run web
```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stayconnect_ng

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Agora
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-app-certificate
```

### Frontend (.env)
```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Development Workflow

1. **Start Backend Server**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Frontend App**
   ```bash
   cd frontend
   npm start
   ```

3. **Database Setup**
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Deployment

### Backend
- Deploy to cloud provider (AWS, Google Cloud, Azure)
- Configure environment variables
- Set up database connection
- Run production build

### Frontend
- Build for production: `expo build`
- Deploy to app stores or Expo hosting
- Configure production API URL

## Git Workflow

The project is organized to keep backend and frontend separate:
- Backend changes go in `backend/` directory
- Frontend changes go in `frontend/` directory
- Shared documentation in root directory