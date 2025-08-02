// src/contexts/TransactionContext/index.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType } from '@/types/transactions';
import { CreateTransactionData, getTransactions, createTransaction } from '@/api/transactionService';
import { Alert } from 'react-native';

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
  refreshTransactions: () => Promise<void>;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
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
      .filter(t => t.type === "RECEBIMENTO")
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
      console.error('Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as transações.');
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
      console.error('Erro ao atualizar transações:', error);
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

  const getTransactionsByType = (type: TransactionType): Transaction[] => {
    return transactions.filter(transaction => transaction.type === type);
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
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
    refreshTransactions,
    getTransactionsByType,
    getRecentTransactions,
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