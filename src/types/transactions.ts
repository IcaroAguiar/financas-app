// @/types/transaction.ts
import { Category } from "@/types/category";
export type TransactionType = "RECEITA" | "DESPESA";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // A data virá como uma string ISO da API
  type: TransactionType;
  category?: Category; // A categoria é opcional
  categoryId?: string | null;
  userId: string;
}
