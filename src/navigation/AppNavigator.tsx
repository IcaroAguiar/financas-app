// @/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import GlobalHeader from "@/components/GlobalHeader";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/styles/theme";

// Importa nossas telas e tipos
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import HomeScreen from "@/screens/HomeScreen";
import TransactionsScreen from "@/screens/TransactionsScreen";
import RemindersScreen from "@/screens/RemindersScreen";
import DebtorsScreen from "@/screens/DebtorsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { AuthStackParamList, AppTabParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTab = createBottomTabNavigator<AppTabParamList>();

// Novo componente para a Navegação Principal
function AppRoutes() {
  const insets = useSafeAreaInsets();
  
  return (
    <AppTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: 'home' | 'home-filled' | 'list' | 'list-search' | 'bell' | 'users' | 'user' = "home";
          
          if (route.name === "Dashboard")
            iconName = focused ? "home-filled" : "home";
          if (route.name === "Transactions")
            iconName = focused ? "list-search" : "list";
          if (route.name === "Reminders")
            iconName = "bell";
          if (route.name === "Debtors")
            iconName = "users";
          if (route.name === "Profile")
            iconName = "user";
            
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: true,
        header: ({ route, options }) => (
          <GlobalHeader title={options.title || route.name} />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
      })}
    >
      <AppTab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{ title: "Resumo" }}
      />
      <AppTab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: "Transações" }}
      />
      <AppTab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ title: "Lembretes" }}
      />
      <AppTab.Screen
        name="Debtors"
        component={DebtorsScreen}
        options={{ title: "Devedores" }}
      />
      <AppTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </AppTab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppRoutes />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
