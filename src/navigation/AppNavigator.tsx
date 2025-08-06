// @/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import GlobalHeader from "@/components/GlobalHeader";
import CentralActionButton from "@/components/CentralActionButton";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { useDebtors } from "@/contexts/DebtorContext";
import { theme } from "@/styles/theme";
import AddTransactionModal from "@/components/AddTransactionModal";
import QuickActionsModal from "@/components/QuickActionsModal";
import AddReminderModal from "@/components/AddReminderModal";
import AddDebtorModal from "@/components/AddDebtorModal";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import { CreateTransactionData } from '@/api/transactionService';
import { CreateDebtorData } from '@/api/debtorService';

// Importa nossas telas e tipos
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import { ForgotPasswordScreen } from "@/screens/ForgotPasswordScreen";
import { ResetPasswordScreen } from "@/screens/ResetPasswordScreen";
import HomeScreen from "@/screens/HomeScreen";
import TransactionsScreen from "@/screens/TransactionsScreen";
import RemindersScreen from "@/screens/RemindersScreen";
import DebtorsScreen from "@/screens/DebtorsScreen";
import SubscriptionsScreen from "@/screens/SubscriptionsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import AccountsScreen from "@/screens/AccountsScreen";
import { AuthStackParamList, AppTabParamList, AppStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTab = createBottomTabNavigator<AppTabParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// Componente para as abas principais
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { addTransaction } = useTransactions();
  const { addDebtor } = useDebtors();
  const [isQuickActionsVisible, setIsQuickActionsVisible] = React.useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = React.useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = React.useState(false);
  const [isDebtorModalVisible, setIsDebtorModalVisible] = React.useState(false);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = React.useState(false);

  const handleCentralAction = () => {
    setIsQuickActionsVisible(true);
  };

  const handleAddTransaction = async (data: Omit<CreateTransactionData, "date">) => {
    try {
      await addTransaction({ ...data, date: new Date().toISOString() });
      setIsTransactionModalVisible(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleOpenTransactionModal = () => {
    setIsTransactionModalVisible(true);
  };

  const handleAddReminder = () => {
    setIsReminderModalVisible(true);
  };

  const handleAddDebtor = () => {
    setIsDebtorModalVisible(true);
  };

  const handleAddSubscription = () => {
    setIsSubscriptionModalVisible(true);
  };

  const handleReminderSubmit = async (reminderData: any) => {
    try {
      // TODO: Implement reminder API integration
      console.log('Reminder data:', reminderData);
      setIsReminderModalVisible(false);
    } catch (error) {
      console.error('Erro ao criar lembrete:', error);
    }
  };

  const handleDebtorSubmit = async (debtorData: CreateDebtorData) => {
    try {
      await addDebtor(debtorData);
      setIsDebtorModalVisible(false);
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
    }
  };
  
  return (
    <>
    <AppTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: 'home' | 'home-filled' | 'dollar-sign' | 'list-search' | 'bell' | 'users' | 'user' | 'calendar' = "home" ;
          
          if (route.name === "Dashboard")
            iconName = focused ? "home-filled" : "home";
          if (route.name === "Transactions")
            iconName = focused ? "dollar-sign" : "dollar-sign";
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
          paddingHorizontal: 0, // Remove horizontal padding for better centering
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
        name="CentralAction"
        component={View} // Dummy component, won't be used
        options={{
          title: "",
          tabBarIcon: () => null, // No icon, custom button will replace
          tabBarButton: (props) => (
            <CentralActionButton onPress={handleCentralAction} />
          ),
        }}
      />
      <AppTab.Screen
        name="Debtors"
        component={DebtorsScreen}
        options={{ title: "Cobranças" }}
      />
      <AppTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </AppTab.Navigator>
    
    <QuickActionsModal
      visible={isQuickActionsVisible}
      onClose={() => setIsQuickActionsVisible(false)}
      onAddTransaction={handleOpenTransactionModal}
      onAddReminder={handleAddReminder}
      onAddDebtor={handleAddDebtor}
      onAddSubscription={handleAddSubscription}
    />
    
    <AddTransactionModal
      visible={isTransactionModalVisible}
      onClose={() => setIsTransactionModalVisible(false)}
      onSave={handleAddTransaction}
    />
    
    <AddReminderModal
      visible={isReminderModalVisible}
      onClose={() => setIsReminderModalVisible(false)}
      onSubmit={handleReminderSubmit}
    />
    
    <AddDebtorModal
      visible={isDebtorModalVisible}
      onClose={() => setIsDebtorModalVisible(false)}
      onSubmit={handleDebtorSubmit}
    />
    
    <AddSubscriptionModal
      visible={isSubscriptionModalVisible}
      onClose={() => setIsSubscriptionModalVisible(false)}
    />
    </>
  );
}

// Novo componente para a Navegação Principal com Stack
function AppRoutes() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={MainTabs} />
      <AppStack.Screen 
        name="Reminders" 
        component={RemindersScreen}
        options={{
          headerShown: true,
          title: "Lembretes",
          presentation: 'modal',
        }}
      />
      <AppStack.Screen 
        name="Accounts" 
        component={AccountsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <AppStack.Screen 
        name="Subscriptions" 
        component={SubscriptionsScreen}
        options={{
          headerShown: true,
          title: "Assinaturas",
          presentation: 'card',
        }}
      />
    </AppStack.Navigator>
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
          <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
