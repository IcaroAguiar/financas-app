// App.tsx
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "@/contexts/AuthContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { DebtorProvider } from "@/contexts/DebtorContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

// Importa o hook 'useFonts' e as fontes específicas que queremos
import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

export default function App() {
  // O hook useFonts carrega as fontes e nos diz quando elas estão prontas
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  // Se as fontes ainda não foram carregadas, não renderizamos nada (ou um Loading)
  // Isso evita o "flash" de texto sem estilo (FOUT)
  if (!fontsLoaded) {
    return null;
  }

  // Quando as fontes estiverem prontas, renderizamos o app
  return (
    <SafeAreaProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <TransactionProvider>
            <CategoryProvider>
              <AccountProvider>
                <DebtorProvider>
                  <SubscriptionProvider>
                    <AppNavigator />
                    <Toast />
                  </SubscriptionProvider>
                </DebtorProvider>
              </AccountProvider>
            </CategoryProvider>
          </TransactionProvider>
        </AuthProvider>
      </ConfirmationProvider>
    </SafeAreaProvider>
  );
}
