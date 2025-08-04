# GEMINI.md - Financas Mobile App

This file provides guidance to Gemini Code when working with the React Native mobile application component of the personal finance management system.

## Project Overview

**Financas App** is a React Native mobile application built with Expo that provides a modern interface for personal finance management. It connects to the Node.js backend API for data persistence and user authentication.

## Quick Start

### Prerequisites
- Node.js (v16+)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator / Android Emulator or physical device with Expo Go
- Backend API running on localhost:3000

### Development Setup

```bash
# Install dependencies
npm install

# Start Expo development server
npm start
# or
npx expo start

# Platform-specific commands
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## Directory Structure

```
financas-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CustomButton/    # Styled button component
│   │   ├── GlobalHeader/    # Navigation header with logo
│   │   ├── Icon/           # Feather icons wrapper
│   │   └── ...
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── TransactionContext.tsx
│   │   ├── CategoryContext.tsx
│   │   └── DebtorContext.tsx
│   ├── navigation/         # React Navigation setup
│   │   ├── AppNavigator.tsx # Main navigation
│   │   └── types.ts
│   ├── screens/           # Screen components
│   │   ├── HomeScreen/    # Dashboard with overview
│   │   ├── TransactionsScreen/
│   │   ├── DebtorsScreen/
│   │   ├── ProfileScreen/
│   │   └── auth screens/
│   ├── services/          # API integration
│   │   └── notificationService.ts
│   ├── api/              # API service layer
│   │   ├── axiosConfig.ts
│   │   ├── authService.ts
│   │   ├── transactionService.ts
│   │   └── debtorService.ts
│   ├── styles/            # Styling and themes
│   │   └── theme.ts       # Design system tokens
│   └── types/             # TypeScript definitions
├── App.tsx               # Root component
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## Key Technologies

- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **TypeScript**: Type safety and developer experience
- **React Navigation v7**: Navigation and routing
- **React Context**: State management
- **Axios**: HTTP client for API calls
- **Expo Google Fonts**: Roboto font family
- **React Native Feather**: Icon library

## Architecture Patterns

### Context-Based State Management

```typescript
// AuthContext provides user authentication state
const { user, login, logout, isLoading } = useAuth();

// TransactionContext manages transaction data
const { transactions, addTransaction, updateTransaction } = useTransactions();

// CategoryContext handles user categories
const { categories, addCategory } = useCategories();

// DebtorContext manages debtor and debt data
const { debtors, debts, addDebtor } = useDebtors();
```

### Navigation Structure

- **Unauthenticated**: Login/Register screens
- **Authenticated**: Main app tabs
  - HomeTab: Dashboard overview
  - TransactionsTab: Income/expense management
  - RemindersTab: Debt reminders and payments
  - DebtorsTab: Debtor management
  - ProfileTab: User settings and logout

### Component Architecture

- **GlobalHeader**: Consistent navigation header with logo
- **CustomButton**: Themed button with variants (primary, secondary, danger)
- **Icon**: Feather icons with consistent sizing
- **QuickActionCard**: Dashboard action items
- **DashboardCard**: Summary cards with data

## Styling System

### Theme Structure (src/styles/theme.ts)

```typescript
export const theme = {
  colors: {
    primary: '#007AFF',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
      light: '#C7C7CC'
    }
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
    sides: 16 // Horizontal screen padding
  },
  fonts: {
    regular: 'Roboto_400Regular',
    medium: 'Roboto_500Medium',
    bold: 'Roboto_700Bold'
  },
  borderRadius: {
    sm: 6, md: 8, lg: 12, xl: 16
  }
}
```

## API Integration

### Configuration (src/api/axiosConfig.ts)

```typescript
const API_BASE_URL = 'http://192.168.0.24:3000/api'; // Local development
// const API_BASE_URL = 'https://your-api.com/api'; // Production

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
```

## Development Commands

```bash
npm start                    # Start Expo dev server
npm run ios                 # iOS simulator
npm run android             # Android emulator
npm run web                 # Web development
npm install                 # Install dependencies
npx expo install <package>  # Install Expo-compatible packages
npx tsc --noEmit           # TypeScript type checking
```

## Environment Configuration

### Network Setup for Physical Devices

1. **Find your machine's local IP**: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. **Update API_URL** in axiosConfig.ts
3. **Ensure CORS** is configured in backend for your IP
4. **Same WiFi network** required for device and development machine

## Performance Optimization

### Bundle Size
- Optimized icon library (Feather for smaller bundle)
- Selective imports to reduce module count
- Image optimization for faster loading

## Related Project

This mobile app connects to the **financas-api** Node.js backend located in `../financas-api/`. The API provides all data operations and authentication services.

---

## Gemini Code Pro Plan - Token Conservation Tips

To maximize your Gemini Code Pro plan usage and conserve daily tokens:

### 🎯 Efficient File Operations

- **Use Glob tool first** to locate files: `src/**/*.tsx`, `src/components/**/*.ts`
- **Read specific components** instead of browsing entire directories
- **Use Grep tool** to find component usage: `"import.*ComponentName"`
- **Batch related operations** in single messages

### 🔍 Smart React Native Navigation

- **Search for screen patterns**: `"Screen.*tsx"` to find all screens
- **Find component usage**: `"import.*ButtonComponent"` before modifying
- **Check navigation structure**: Look in `src/navigation/` first
- **Understand context flow**: Read context files before state changes

### 💡 Component-Focused Development

- **Check existing components** before creating new ones
- **Review theme usage**: Read `src/styles/theme.ts` for consistency
- **Find similar patterns**: Search for existing implementations
- **Understand prop interfaces**: Check TypeScript definitions first

### 🚀 Mobile Development Workflows

- **Test on device early** to catch platform-specific issues
- **Use TypeScript checks**: `npx tsc --noEmit` before major changes
- **Check bundle impact**: Monitor Metro bundler output
- **Verify navigation flow** after route changes

### 🛠️ React Native Specific Efficiency

- **Check Expo compatibility** before adding packages
- **Use expo install** for Expo SDK packages
- **Test on multiple platforms** (iOS/Android) when relevant
- **Monitor performance** with Flipper or Expo dev tools

### 📱 Mobile UI Best Practices

- **Follow platform conventions**: iOS vs Android design patterns
- **Test responsive layouts** on different screen sizes
- **Check accessibility** with screen reader compatibility
- **Verify touch targets** meet minimum size requirements

### ⚡ Context and State Management

- **Understand context hierarchy** before adding new providers
- **Minimize context re-renders** with proper value memoization
- **Use local state** when global state isn't needed
- **Check existing state patterns** before implementing new ones

### 🔧 API Integration Debugging

- **Check network requests** in Expo dev tools
- **Verify API endpoint** connectivity with curl
- **Test authentication flow** step by step
- **Monitor API response** structure changes

### 🎨 Styling and Theme Efficiency

- **Use existing theme tokens** instead of hardcoded values
- **Check responsive breakpoints** in existing components
- **Follow established patterns** for component styling
- **Test dark/light themes** if supported

### 📦 Bundle and Performance

- **Monitor Metro bundler** output for bundle size changes
- **Use selective imports**: `import { specific } from 'library'`
- **Check for duplicate dependencies** in package.json
- **Optimize images** and assets for mobile

Remember: React Native development is most efficient when you understand the existing patterns, test frequently on devices, and leverage the established component and navigation systems.

## Recent Development History & Critical Information

### 🚨 IMPORTANT: Latest Session (2025-08-04) - Production Deployment Complete

**PRODUCTION STATUS**: ✅ **FULLY OPERATIONAL**

#### Backend API - LIVE
- **Production URL**: `https://ascend-api-qezc.onrender.com/api`
- **Status**: ✅ All endpoints tested and working
- **Database**: PostgreSQL with Prisma migrations deployed
- **Authentication**: JWT working correctly
- **Key Fix**: Transaction type validation corrected (RECEITA/DESPESA)

#### Mobile App - BUILD READY
- **Status**: ✅ EAS build configuration complete
- **Environment**: Production API integration confirmed  
- **Build Issues**: All resolved (see troubleshooting section below)

### 🔧 CRITICAL BUILD CONFIGURATION

#### Required Dependencies (package.json)
```json
{
  "dependencies": {
    "react-native-dotenv": "^3.4.11",           // MUST be in dependencies
    "babel-plugin-module-resolver": "^5.0.2",   // MUST be in dependencies  
    "expo-system-ui": "~5.0.10"                 // Required for build
  }
}
```

#### Required Configuration Files

**metro.config.js** (MUST exist):
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};

module.exports = config;
```

**babel.config.js** (Module resolver required):
```javascript
[
  "module-resolver",
  {
    root: ["./src"],
    alias: {
      "@": "./src",
    },
  },
]
```

**.env.production** (MUST exist):
```env
API_BASE_URL=https://ascend-api-qezc.onrender.com/api
```

**app.json** (Clean schema):
```json
{
  "expo": {
    "plugins": [
      [
        "expo-system-ui",
        {
          "userInterfaceStyle": "light"
        }
      ]
    ]
  }
}
```

### 🚨 COMMON BUILD ERRORS & SOLUTIONS

#### Error 1: Module Resolution
```
Error: Unable to resolve module @/contexts/AuthContext
```
**Solution**: Ensure `babel-plugin-module-resolver` is in `dependencies` and `metro.config.js` exists.

#### Error 2: Environment Variables
```  
SyntaxError: Cannot find module 'react-native-dotenv'
```
**Solution**: Move `react-native-dotenv` from `devDependencies` to `dependencies`.

#### Error 3: Expo Configuration
```
Error validating fields: should NOT have additional property 'edgeToEdgeEnabled'
```
**Solution**: Remove invalid properties, use `expo-system-ui` plugin instead.

#### Error 4: Package Compatibility
```
The following packages should be updated for best compatibility
```
**Solution**: Run `npx expo install --check` and fix version mismatches.

### 📋 PRE-BUILD CHECKLIST (MANDATORY)

Before running EAS build, verify:

1. **Dependencies**:
   - [ ] `react-native-dotenv` in `dependencies` (not devDependencies)
   - [ ] `babel-plugin-module-resolver` in `dependencies`
   - [ ] `expo-system-ui` installed
   - [ ] All packages compatible with Expo SDK 53

2. **Configuration Files**:
   - [ ] `metro.config.js` exists with path aliases
   - [ ] `babel.config.js` has module resolver plugin
   - [ ] `app.json` passes schema validation
   - [ ] `.env.production` exists with production API URL

3. **Build Environment**:
   - [ ] EAS CLI installed and authenticated
   - [ ] Clean npm install completed
   - [ ] No TypeScript errors blocking build

### 🚀 EAS BUILD COMMAND SEQUENCE

```bash
# 1. Ensure clean environment
cd financas-app
npm install

# 2. Validate configuration
npx expo-doctor                    # Check for issues
npx expo install --check           # Fix package versions

# 3. Authentication
eas logout
eas login
# Credentials: ic03aguiar / aguiar2003

# 4. Build
eas build --platform android --profile preview --local
```

### 🧪 PRODUCTION API TESTING RESULTS

All endpoints validated on `https://ascend-api-qezc.onrender.com/api`:

| Endpoint | Method | Status | Notes |
|----------|--------|--------|--------|
| User Registration | POST /users | ✅ | Creates user successfully |
| User Login | POST /users/login | ✅ | Returns JWT token |
| Get Profile | GET /users/me | ✅ | Protected endpoint working |
| Transactions CRUD | GET/POST/PUT/DELETE | ✅ | RECEITA/DESPESA types working |
| Categories | GET/POST | ✅ | User-specific categories |
| Debtors | GET/POST | ✅ | Full relationship support |
| Debts | GET/POST | ✅ | Payment tracking functional |

### 📊 BUILD TROUBLESHOOTING REFERENCE

#### Quick Diagnostic Commands
```bash
# Check dependency locations
npm list react-native-dotenv babel-plugin-module-resolver

# Validate Expo configuration
npx expo-doctor

# Check TypeScript errors
npx tsc --noEmit

# Clear Metro cache
npx expo start --clear
```

#### File Locations to Verify
- `package.json` - Correct dependency placement
- `metro.config.js` - Path alias configuration
- `babel.config.js` - Module resolver plugin
- `.env.production` - Production API URL
- `app.json` - Valid Expo schema

### 🎯 GIT COMMIT HISTORY (Recent)

- `58df942` - Final build dependencies and configuration fixes
- `95d4cfb` - Metro and Babel module resolution  
- `3671424` - react-native-dotenv dependency fix
- `b2aa8d2` - expo-system-ui and edge-to-edge configuration
- `213d5a0` - Complete mobile app production readiness

### 💡 DEVELOPMENT BEST PRACTICES

1. **Always test production API before building**:
   ```bash
   curl -X POST https://ascend-api-qezc.onrender.com/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password"}'
   ```

2. **Verify build dependencies before major changes**:
   - Keep build-time dependencies in `dependencies`
   - Use `npx expo install` for Expo packages
   - Test Metro bundler after configuration changes

3. **Environment-specific development**:
   - Development: `.env` with local API
   - Production: `.env.production` with deployed API
   - Babel automatically loads correct environment

4. **Build troubleshooting workflow**:
   - Check dependency locations first
   - Validate configuration files
   - Clear Metro cache if needed
   - Test module resolution locally

### 🏗️ ARCHITECTURE DECISIONS

#### Module Resolution Strategy
- **Metro Resolver**: Handles `@/` aliases during bundling
- **Babel Plugin**: Transforms imports during build
- **TypeScript**: Maintains intellisense and type checking
- **Production Ready**: Works in both dev and production builds

#### Environment Management
- **Development**: Uses local API (`http://192.168.0.24:3000/api`)
- **Production**: Uses deployed API (`https://ascend-api-qezc.onrender.com/api`)
- **Automatic Switching**: Based on `NODE_ENV` environment variable

#### Build System
- **EAS Build**: Cloud-based or local Android builds
- **Preview Profile**: APK builds for internal testing
- **Production Profile**: AAB builds for store deployment

This comprehensive information should prevent future build issues and ensure smooth development continuation.
