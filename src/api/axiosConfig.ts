// src/api/axiosConfig.ts
import axios, { AxiosResponse, AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "@env";

// Global reference to signOut function for token expiration handling
let globalSignOut: (() => void) | null = null;
let globalBiometricReauth: (() => Promise<boolean>) | null = null;

// Function to set the global signOut reference
export const setGlobalSignOut = (signOutFunction: () => void) => {
  globalSignOut = signOutFunction;
};

// Function to set the global biometric re-auth reference
export const setGlobalBiometricReauth = (biometricReauthFunction: () => Promise<boolean>) => {
  globalBiometricReauth = biometricReauthFunction;
};

console.log('🔄 AxiosConfig: Configurando API com baseURL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Este código é executado ANTES de cada requisição ser enviada
api.interceptors.request.use(
  async (config) => {
    // Adiciona o token de autenticação se disponível
    try {
      const token = await AsyncStorage.getItem('@FinancasApp:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
    }

    
    // É obrigatório retornar a config para que a requisição continue
    return config;
  },
  (error) => {
    // Trata erros que acontecem ANTES da requisição ser enviada
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA ---
// Este código é executado DEPOIS que uma resposta é recebida
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Se a resposta for bem-sucedida (status 2xx), apenas a retornamos
    return response;
  },
  async (error: AxiosError) => {
    
    // Trata todos os erros de resposta (status 4xx, 5xx)

    // Trata token expirado (401 Unauthorized)
    if (error.response?.status === 401) {
      
      try {
        // First, try biometric re-authentication if available
        if (globalBiometricReauth) {
          const reauthSuccess = await globalBiometricReauth();
          if (reauthSuccess) {
            // Retry the original request with new token
            const originalRequest = error.config;
            const token = await AsyncStorage.getItem('@FinancasApp:token');
            if (token && originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api.request(originalRequest);
            }
          }
        }

        // If biometric re-auth failed or not available, force logout
        await AsyncStorage.removeItem('@FinancasApp:token');
        await AsyncStorage.removeItem('@FinancasApp:user');
        
        // Chama a função de signOut global se disponível
        if (globalSignOut) {
          globalSignOut();
        }
      } catch (storageError) {
        // If everything fails, still try to logout
        if (globalSignOut) {
          globalSignOut();
        }
      }
    }

    // É obrigatório rejeitar a promise para que o bloco .catch() do nosso app possa tratar o erro
    return Promise.reject(error);
  }
);

export default api;
