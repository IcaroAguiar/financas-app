// @/api/transactionService.ts
import api from "./axiosConfig";
import { Transaction, TransactionType } from "@/types/transactions";
import { SubscriptionFrequency } from "./subscriptionService";

// Tipagem para os dados que enviaremos para criar uma transação
export interface CreateTransactionData {
  description: string;
  amount: number;
  date: string; // Enviaremos a data como uma string no formato ISO
  type: TransactionType;
  categoryId?: string;
  accountId?: string;
  isRecurring?: boolean;
  subscriptionFrequency?: SubscriptionFrequency;
  debtId?: string; // For partial debt payments
  // Payment plan fields
  isInstallmentPlan?: boolean;
  installmentCount?: number;
  installmentFrequency?: 'MONTHLY' | 'WEEKLY';
  firstInstallmentDate?: string;
}

// Tipagem para os dados que enviaremos para atualizar uma transação
export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  date?: string;
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
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

// Atualizar transação existente
export const updateTransaction = async (
  id: string,
  data: UpdateTransactionData
): Promise<Transaction> => {
  const response = await api.put<Transaction>(`/transactions/${id}`, data);
  return response.data;
};

// Deletar transação
export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

// Payment plan functions
export const markTransactionInstallmentPaid = async (
  transactionId: string,
  installmentId: string
): Promise<any> => {
  const response = await api.put(`/transactions/${transactionId}/installments/${installmentId}/pay`);
  return response.data;
};

export const markTransactionPaid = async (transactionId: string): Promise<Transaction> => {
  const response = await api.put<Transaction>(`/transactions/${transactionId}/pay`);
  return response.data;
};

export const registerPartialPayment = async (
  transactionId: string,
  amount: number
): Promise<{
  transaction: Transaction;
  paidAmount: number;
  remainingAmount: number;
}> => {
  const response = await api.post(`/transactions/${transactionId}/partial-payment`, { amount });
  return response.data;
};

// Monthly summary data interface
export interface MonthlySummary {
  period: {
    month: number;
    year: number;
    monthName: string;
  };
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

// Get monthly summary with optional month/year filters
export const getMonthlySummary = async (month?: number, year?: number): Promise<MonthlySummary> => {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  
  const response = await api.get<MonthlySummary>(`/transactions/monthly-summary?${params.toString()}`);
  return response.data;
};

// Get transactions with optional month/year filters
export const getTransactionsFiltered = async (month?: number, year?: number): Promise<Transaction[]> => {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  
  const response = await api.get<Transaction[]>(`/transactions?${params.toString()}`);
  return response.data;
};
