// src/contexts/TransactionContext/index.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType } from '@/types/transactions';
import { 
  CreateTransactionData, 
  UpdateTransactionData, 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  markTransactionInstallmentPaid,
  markTransactionPaid,
  registerPartialPayment
} from '@/api/transactionService';

interface TransactionContextData {
  transactions: Transaction[];
  loading: boolean;
  refreshing: boolean;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  loadTransactions: () => Promise<void>;
  addTransaction: (data: CreateTransactionData) => Promise<void>;
  updateTransactionById: (id: string, data: UpdateTransactionData) => Promise<void>;
  deleteTransactionById: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  
  // Payment plan functions
  markInstallmentPaid: (transactionId: string, installmentId: string) => Promise<void>;
  markTransactionPaid: (transactionId: string) => Promise<void>;
  registerPartialPayment: (transactionId: string, amount: number) => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const calculateSummary = (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter(t => t.type === "RECEITA")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === "DESPESA")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  };

  const summary = calculateSummary(transactions);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response);
    } catch (error: any) {
      // Context doesn't show UI alerts - let calling components handle errors
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    setRefreshing(true);
    try {
      const response = await getTransactions();
      setTransactions(response);
    } catch (error: any) {
    } finally {
      setRefreshing(false);
    }
  };

  const addTransaction = async (data: CreateTransactionData) => {
    try {
      const newTransaction = await createTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível salvar a transação.';
      throw new Error(errorMessage);
    }
  };

  const updateTransactionById = async (id: string, data: UpdateTransactionData) => {
    try {
      const updatedTransaction = await updateTransaction(id, data);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível atualizar a transação.';
      throw new Error(errorMessage);
    }
  };

  const deleteTransactionById = async (id: string) => {
    try {
      console.log(`Attempting to delete transaction with ID: ${id}`);
      await deleteTransaction(id);
      console.log(`Backend deletion successful for transaction: ${id}`);
      
      setTransactions(prev => {
        const filtered = prev.filter(transaction => transaction.id !== id);
        console.log(`UI state updated. Removed transaction ${id}. Previous count: ${prev.length}, New count: ${filtered.length}`);
        return filtered;
      });
    } catch (error: any) {
      console.error(`Failed to delete transaction ${id}:`, error);
      const errorMessage = error.response?.data?.error || 'Não foi possível excluir a transação.';
      throw new Error(errorMessage);
    }
  };

  const getTransactionsByType = (type: TransactionType): Transaction[] => {
    return transactions.filter(transaction => transaction.type === type);
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Payment plan functions
  const markInstallmentPaid = async (transactionId: string, installmentId: string) => {
    try {
      await markTransactionInstallmentPaid(transactionId, installmentId);
      // Refresh transactions to get updated installment status
      await refreshTransactions();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível marcar a parcela como paga.';
      throw new Error(errorMessage);
    }
  };

  const markTransactionPaidById = async (transactionId: string) => {
    try {
      const updatedTransaction = await markTransactionPaid(transactionId);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId ? updatedTransaction : transaction
        )
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível marcar a transação como paga.';
      throw new Error(errorMessage);
    }
  };

  const registerPartialPaymentById = async (transactionId: string, amount: number) => {
    try {
      const result = await registerPartialPayment(transactionId, amount);
      // Update the transaction with the updated data
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId ? result.transaction : transaction
        )
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível registrar o pagamento parcial.';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const contextValue: TransactionContextData = {
    transactions,
    loading,
    refreshing,
    summary,
    loadTransactions,
    addTransaction,
    updateTransactionById,
    deleteTransactionById,
    refreshTransactions,
    getTransactionsByType,
    getRecentTransactions,
    markInstallmentPaid,
    markTransactionPaid: markTransactionPaidById,
    registerPartialPayment: registerPartialPaymentById,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextData => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions deve ser usado dentro de um TransactionProvider');
  }
  return context;
};