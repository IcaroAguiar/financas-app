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
