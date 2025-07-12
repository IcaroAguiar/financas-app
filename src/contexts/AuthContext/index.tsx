// @/contexts/AuthContext/index.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user";
import * as authService from "@/api/authService";
import api from "@/api/axiosConfig";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn(credentials: authService.SignInCredentials): Promise<void>;
  signUp(credentials: authService.SignUpCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega o token e o usuário do armazenamento ao iniciar o app
    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem("@FinancasApp:user");
      const storagedToken = await AsyncStorage.getItem("@FinancasApp:token");

      if (storagedToken && storagedUser) {
        setUser(JSON.parse(storagedUser));
        setToken(storagedToken);
        // Coloca o token no cabeçalho de todas as futuras requisições do axios
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
    // A API não retorna o usuário no login, então pegamos do token ou de uma rota /me
    // Por simplicidade, vamos usar uma rota /me fictícia
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
    const newUser = await authService.signUp(credentials);
    // Após o cadastro, o ideal é fazer o login para obter o token
    await signIn({ email: credentials.email, password: credentials.password });
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}
