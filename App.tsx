// App.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
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
import * as Notifications from 'expo-notifications';

// Importa o hook 'useFonts' e as fontes específicas que queremos
import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

// Configuração de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  // O hook useFonts carrega as fontes e nos diz quando elas estão prontas
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  // Solicitar permissões de notificação ao iniciar o app
  useEffect(() => {
    async function requestNotificationPermissions() {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permissão de notificação não foi concedida');
        }
      } catch (error) {
        console.log('Erro ao solicitar permissões de notificação:', error);
      }
    }

    requestNotificationPermissions();
  }, []);

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
                    <Toast 
                      position="top"
                      topOffset={60}
                      visibilityTime={3000}
                      autoHide={true}
                      config={{
                        success: (props) => (
                          <View style={{
                            height: 70,
                            width: '90%',
                            backgroundColor: '#4CAF50',
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}>
                            <Text style={{ 
                              color: 'white', 
                              fontWeight: 'bold',
                              fontSize: 16,
                              flex: 1
                            }}>
                              {props.text1}
                            </Text>
                            {props.text2 && (
                              <Text style={{ 
                                color: 'white', 
                                fontSize: 14,
                                marginTop: 2
                              }}>
                                {props.text2}
                              </Text>
                            )}
                          </View>
                        ),
                        error: (props) => (
                          <View style={{
                            height: 70,
                            width: '90%',
                            backgroundColor: '#F44336',
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}>
                            <Text style={{ 
                              color: 'white', 
                              fontWeight: 'bold',
                              fontSize: 16,
                              flex: 1
                            }}>
                              {props.text1}
                            </Text>
                            {props.text2 && (
                              <Text style={{ 
                                color: 'white', 
                                fontSize: 14,
                                marginTop: 2
                              }}>
                                {props.text2}
                              </Text>
                            )}
                          </View>
                        ),
                      }}
                    />
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
