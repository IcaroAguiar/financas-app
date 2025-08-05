// src/navigation/types.ts
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Define as telas e os parâmetros que elas aceitam.
// 'undefined' significa que a tela não recebe nenhum parâmetro.
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  CentralAction: undefined;
  Debtors: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  Reminders: undefined;
  Accounts: undefined;
  Subscriptions: undefined;
};

// Define o tipo das props para cada tela, para uso dentro dos componentes
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;
export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;
export type HomeScreenProps = BottomTabScreenProps<
  AppTabParamList,
  "Dashboard"
>;
