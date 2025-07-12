// src/api/axiosConfig.ts
import axios, { AxiosResponse, AxiosError } from "axios";
import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Este código é executado ANTES de cada requisição ser enviada
api.interceptors.request.use(
  (config) => {
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
  (error: AxiosError) => {
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
    // É obrigatório rejeitar a promise para que o bloco .catch() do nosso app possa tratar o erro
    return Promise.reject(error);
  }
);

export default api;
