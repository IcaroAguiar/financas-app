// @/api/transactionService.ts
import api from "./axiosConfig";
import { Transaction, TransactionType } from "@/types/transactions";

// Tipagem para os dados que enviaremos para criar uma transação
export interface CreateTransactionData {
  description: string;
  amount: number;
  date: string; // Enviaremos a data como uma string no formato ISO
  type: TransactionType;
  categoryId?: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>("/transactions");
  return response.data;
};

// --- NOVA FUNÇÃO ---
export const createTransaction = async (
  data: CreateTransactionData
): Promise<Transaction> => {
  const response = await api.post<Transaction>("/transactions", data);
  return response.data;
};
