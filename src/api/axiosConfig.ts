// src/api/axiosConfig.ts
import axios, { AxiosResponse, AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "@env";

// Global reference to signOut function for token expiration handling
let globalSignOut: (() => void) | null = null;

// Function to set the global signOut reference
export const setGlobalSignOut = (signOutFunction: () => void) => {
  globalSignOut = signOutFunction;
};

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
      console.error('Erro ao buscar token:', error);
    }

    // Só logamos em ambiente de desenvolvimento para não poluir o console de produção
    if (__DEV__) {
      const url = config.url;
      const method = config.method?.toUpperCase();

      console.log(`[API Request] 🚀: ${method} ${url}`);

      // Loga o corpo da requisição (payload), se houver um
      if (config.data) {
        console.log("[Payload] 📦:", JSON.stringify(config.data, null, 2));
      }
    }
    // É obrigatório retornar a config para que a requisição continue
    return config;
  },
  (error) => {
    // Trata erros que acontecem ANTES da requisição ser enviada
    if (__DEV__) {
      console.error("[API Request Error] 🔥:", error);
    }
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA ---
// Este código é executado DEPOIS que uma resposta é recebida
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Se a resposta for bem-sucedida (status 2xx), apenas a retornamos
    if (__DEV__) {
      console.log(
        `[API Response] ✅: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    // Trata todos os erros de resposta (status 4xx, 5xx)
    if (__DEV__) {
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();
      const status = error.response?.status;
      const errorData = error.response?.data;

      console.error(`[API Response Error] ❌: ${method} ${url}`);
      console.error(`[Error Status] 📉: ${status}`);
      if (errorData) {
        console.error("[Error Data] 📄:", JSON.stringify(errorData, null, 2));
      }
    }

    // Trata token expirado (401 Unauthorized)
    if (error.response?.status === 401) {
      if (__DEV__) {
        console.warn('[Token Expiration] 🔒: Token expirado, fazendo logout automático...');
      }
      
      try {
        // Remove token do AsyncStorage
        await AsyncStorage.removeItem('@FinancasApp:token');
        await AsyncStorage.removeItem('@FinancasApp:user');
        
        // Chama a função de signOut global se disponível
        if (globalSignOut) {
          globalSignOut();
          if (__DEV__) {
            console.info('[Token Expiration] ✅: Usuário deslogado automaticamente');
          }
        } else {
          console.warn('[Token Expiration] ⚠️: globalSignOut não está disponível');
        }
      } catch (storageError) {
        console.error('Erro ao processar logout automático:', storageError);
      }
    }

    // É obrigatório rejeitar a promise para que o bloco .catch() do nosso app possa tratar o erro
    return Promise.reject(error);
  }
);

export default api;
