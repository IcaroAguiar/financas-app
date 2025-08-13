// @/contexts/AuthContext/index.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { User } from "@/types/user";
import * as authService from "@/api/authService";
import * as SecureStore from "expo-secure-store";
import api, { setGlobalSignOut, setGlobalBiometricReauth } from "@/api/axiosConfig";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  signIn(credentials: authService.SignInCredentials): Promise<void>;
  signUp(credentials: authService.SignUpCredentials): Promise<void>;
  signOut(): void;
  authenticateWithBiometrics(): Promise<boolean>;
  silentBiometricReauth(): Promise<boolean>;
  setIsBiometricEnabled(enabled: boolean): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    async function checkBiometricSupport() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      const isSupported = hasHardware && isEnrolled;
      setIsBiometricSupported(isSupported);
      
      if (isSupported) {
        const biometricEnabled = await AsyncStorage.getItem(
          "@FinancasApp:biometricEnabled"
        );
        setIsBiometricEnabled(biometricEnabled === "true");
      }
    }

    checkBiometricSupport();

    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem("@FinancasApp:user");
      const storagedToken = await AsyncStorage.getItem("@FinancasApp:token");

      if (storagedToken && storagedUser) {
        setUser(JSON.parse(storagedUser));
        setToken(storagedToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storagedToken}`;
        
        // Refresh biometric state for returning user
        await refreshBiometricState();
      } else {
        // If no stored session, check if biometric is enabled for auto-login
        const biometricEnabled = await AsyncStorage.getItem("@FinancasApp:biometricEnabled");
        if (biometricEnabled === "true" && isBiometricSupported) {
          try {
            // Small delay to ensure UI is ready
            setTimeout(async () => {
              try {
                await authenticateWithBiometrics();
              } catch (error) {
                // Silent fail - user can manually login
              }
            }, 1000);
          } catch (error) {
            // Silent fail - user can manually login
          }
        }
      }
      setIsLoading(false);
    }
    loadStoragedData();
  }, []); // Remove signOut dependency to avoid circular reference

  const signIn = async (credentials: authService.SignInCredentials) => {
    const { token } = await authService.signIn(credentials);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const meResponse = await api.get<User>("/users/me");

    setUser(meResponse.data);
    setToken(token);

    await AsyncStorage.setItem(
      "@FinancasApp:user",
      JSON.stringify(meResponse.data)
    );
    await AsyncStorage.setItem("@FinancasApp:token", token);

    // Refresh biometric state after successful login
    await refreshBiometricState();
  };

  const signUp = async (credentials: authService.SignUpCredentials) => {
    console.log('🔄 AuthContext: Iniciando processo de signup');
    try {
      await authService.signUp(credentials);
      console.log('✅ AuthContext: Signup concluído, fazendo login automático');
      await signIn({ email: credentials.email, password: credentials.password });
      console.log('✅ AuthContext: Login automático após signup concluído');
    } catch (error: any) {
      console.log('❌ AuthContext: Erro no signup:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Limpa todos os dados do AsyncStorage
      await AsyncStorage.clear();
      
      // Remove o header de autorização do axios
      delete api.defaults.headers.common['Authorization'];
      
      // Reseta o estado local
      setUser(null);
      setToken(null);
      
    } catch (error) {
      // Mesmo com erro, limpa o estado local para evitar inconsistência
      setUser(null);
      setToken(null);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Faça login no Ascend",
        fallbackLabel: "Usar senha",
        cancelLabel: "Cancelar",
      });

      if (result.success) {
        const email = await SecureStore.getItemAsync("FinancasApp_userEmail");
        const password = await SecureStore.getItemAsync("FinancasApp_userPassword");
        const storedToken = await SecureStore.getItemAsync("FinancasApp_userToken");

        if (email && password) {
          // Check if this is a token-based biometric setup
          if (password === 'BIOMETRIC_TOKEN_AUTH' && storedToken) {
            // Use stored token to validate and restore session
            try {
              api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
              const meResponse = await api.get<User>("/users/me");
              
              // Token is valid, restore user session
              setUser(meResponse.data);
              setToken(storedToken);
              
              await AsyncStorage.setItem("@FinancasApp:user", JSON.stringify(meResponse.data));
              await AsyncStorage.setItem("@FinancasApp:token", storedToken);
              
              await refreshBiometricState();
              return true;
            } catch (tokenError) {
              // Token is expired or invalid, remove biometric data
              await SecureStore.deleteItemAsync('FinancasApp_userEmail');
              await SecureStore.deleteItemAsync('FinancasApp_userPassword');
              await SecureStore.deleteItemAsync('FinancasApp_userToken');
              await setBiometricEnabled(false);
              throw new Error('Sessão expirada. Configure a biometria novamente.');
            }
          } else {
            // Legacy password-based biometric authentication
            await signIn({ email, password });
            return true;
          }
        } else {
          throw new Error('Credenciais biométricas não encontradas. Configure novamente nas configurações.');
        }
      } else {
        throw new Error('Autenticação biométrica cancelada ou falhou.');
      }
    } catch (error) {
      throw error;
    }
  };

  const silentBiometricReauth = async (): Promise<boolean> => {
    try {
      // Check if biometric is enabled and supported
      const biometricEnabled = await AsyncStorage.getItem("@FinancasApp:biometricEnabled");
      if (biometricEnabled !== "true" || !isBiometricSupported) {
        return false;
      }

      // Try to get stored credentials
      const email = await SecureStore.getItemAsync("FinancasApp_userEmail");
      const password = await SecureStore.getItemAsync("FinancasApp_userPassword");
      const storedToken = await SecureStore.getItemAsync("FinancasApp_userToken");
      
      if (!email || !password) {
        return false;
      }

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sessão expirada. Autentique-se novamente",
        fallbackLabel: "Fazer login manual",
        cancelLabel: "Cancelar",
      });

      if (result.success) {
        // Check if this is a token-based biometric setup
        if (password === 'BIOMETRIC_TOKEN_AUTH' && storedToken) {
          try {
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            const meResponse = await api.get<User>("/users/me");
            
            // Token is valid, restore user session
            setUser(meResponse.data);
            setToken(storedToken);
            
            await AsyncStorage.setItem("@FinancasApp:user", JSON.stringify(meResponse.data));
            await AsyncStorage.setItem("@FinancasApp:token", storedToken);
            
            return true;
          } catch (tokenError) {
            // Token is expired or invalid, cleanup and return false
            await SecureStore.deleteItemAsync('FinancasApp_userEmail');
            await SecureStore.deleteItemAsync('FinancasApp_userPassword');
            await SecureStore.deleteItemAsync('FinancasApp_userToken');
            await setBiometricEnabled(false);
            return false;
          }
        } else {
          // Legacy password-based biometric authentication
          await signIn({ email, password });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  // Registra as funções globalmente após suas definições
  useEffect(() => {
    setGlobalSignOut(signOut);
    setGlobalBiometricReauth(silentBiometricReauth);
  }, [signOut, silentBiometricReauth]);

  const refreshBiometricState = async () => {
    if (!isBiometricSupported) {
      return;
    }
    
    try {
      const biometricEnabled = await AsyncStorage.getItem("@FinancasApp:biometricEnabled");
      setIsBiometricEnabled(biometricEnabled === "true");
    } catch (error) {
      // Silent error handling
    }
  };

  const setBiometricEnabled = async (enabled: boolean) => {
    setIsBiometricEnabled(enabled);
    
    // Also persist to AsyncStorage to ensure it's saved
    try {
      await AsyncStorage.setItem("@FinancasApp:biometricEnabled", enabled ? "true" : "false");
    } catch (error) {
      // Silent error handling
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isBiometricSupported,
        isBiometricEnabled,
        signIn,
        signUp,
        signOut,
        authenticateWithBiometrics,
        silentBiometricReauth,
        setIsBiometricEnabled: setBiometricEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}
