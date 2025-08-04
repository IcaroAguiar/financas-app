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
import api from "@/api/axiosConfig";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  signIn(credentials: authService.SignInCredentials): Promise<void>;
  signUp(credentials: authService.SignUpCredentials): Promise<void>;
  signOut(): void;
  authenticateWithBiometrics(): Promise<void>;
  setIsBiometricEnabled(enabled: boolean): void;
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
      
      console.log('Biometric Hardware Available:', hasHardware);
      console.log('Biometric Enrolled:', isEnrolled);
      
      setIsBiometricSupported(hasHardware && isEnrolled);
      if (hasHardware && isEnrolled) {
        const biometricEnabled = await AsyncStorage.getItem(
          "@Ascend:biometricEnabled"
        );
        console.log('Biometric Setting in Storage:', biometricEnabled);
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
      }
      setIsLoading(false);
    }
    loadStoragedData();
  }, []);

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
  };

  const signUp = async (credentials: authService.SignUpCredentials) => {
    await authService.signUp(credentials);
    await signIn({ email: credentials.email, password: credentials.password });
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  };

  const authenticateWithBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Faça login no Ascend",
    });

    if (result.success) {
      const email = await SecureStore.getItemAsync("@Ascend:userEmail");
      const password = await SecureStore.getItemAsync("@Ascend:userPassword");

      if (email && password) {
        await signIn({ email, password });
      } else {
        // Handle case where credentials are not found in secure store
        console.log("Biometric credentials not found.");
      }
    } else {
      // Handle authentication failure
      console.log("Biometric authentication failed.");
    }
  };

  const setBiometricEnabled = (enabled: boolean) => {
    setIsBiometricEnabled(enabled);
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
