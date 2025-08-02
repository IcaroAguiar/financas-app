// src/api/authService.ts
import api from "./axiosConfig";
import { User } from "@/types/user";
// Tipagem para a resposta de login da nossa API
export interface SignInResponse {
  token: string;
}

// Tipagem para os dados de login
export interface SignInCredentials {
  email: string;
  password: string;
}

// Tipagem para os dados de cadastro
export interface SignUpCredentials extends SignInCredentials {
  name: string;
}

export const signIn = async (
  credentials: SignInCredentials
): Promise<SignInResponse> => {
  const response = await api.post<SignInResponse>("/users/login", credentials);
  return response.data;
};

export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  const response = await api.post<User>("/users", credentials);
  return response.data;
};

// Tipagem para atualização de perfil
export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await api.patch<User>("/users/profile", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};
