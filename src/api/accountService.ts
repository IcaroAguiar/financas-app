// src/api/accountService.ts

import api from './axiosConfig';

export interface Account {
  id: string;
  name: string;
  type: string;
  balance?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateAccountRequest {
  name: string;
  type: string;
  balance?: number;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: string;
  balance?: number;
}

// Criar uma nova conta
export const createAccount = async (accountData: CreateAccountRequest): Promise<Account> => {
  try {
    const response = await api.post('/accounts', accountData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao criar conta');
  }
};

// Listar todas as contas do usuário
export const getAllAccounts = async (): Promise<Account[]> => {
  try {
    const response = await api.get('/accounts');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar contas');
  }
};

// Obter conta por ID
export const getAccountById = async (id: string): Promise<Account> => {
  try {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar conta');
  }
};

// Atualizar uma conta
export const updateAccount = async (id: string, accountData: UpdateAccountRequest): Promise<Account> => {
  try {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao atualizar conta');
  }
};

// Deletar uma conta
export const deleteAccount = async (id: string): Promise<void> => {
  try {
    await api.delete(`/accounts/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao deletar conta');
  }
};