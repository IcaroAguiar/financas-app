// @/types/transaction.ts
import { Category } from "@/types/category";
import { Account } from "@/api/accountService";

export type TransactionType = "RECEITA" | "DESPESA" | "PAGO";

export interface TransactionInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  transactionId: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // A data virá como uma string ISO da API
  type: TransactionType;
  category?: Category; // A categoria é opcional
  categoryId?: string | null;
  predefinedCategory?: { // Para categorias pré-definidas
    id: string;
    name: string;
    color: string;
  };
  account?: Account; // A conta é opcional
  accountId?: string | null;
  userId: string;
  isRecurring?: boolean; // Added missing field for recurring transactions
  
  // Recurring/subscription fields
  subscriptionFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  subscriptionId?: string; // Reference to the subscription if created from recurring transaction
  
  // Payment plan fields
  isInstallmentPlan?: boolean;
  installmentCount?: number;
  installmentFrequency?: 'MONTHLY' | 'WEEKLY';
  installmentAmount?: number;
  firstInstallmentDate?: string;
  installments?: TransactionInstallment[];
}
