// @/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/styles/theme";

// Importa nossas telas e tipos
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import HomeScreen from "@/screens/HomeScreen";
import TransactionsScreen from "@/screens/TransactionsScreen";
import { AuthStackParamList, AppTabParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTab = createBottomTabNavigator<AppTabParamList>();

// Novo componente para a Navegação Principal
function AppRoutes() {
  return (
    <AppTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "alert-circle";
          if (route.name === "Dashboard")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "Transactions")
            iconName = focused ? "list" : "list-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false, // Vamos colocar o header dentro de cada tela se precisarmos
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
