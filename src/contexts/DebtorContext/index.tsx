// src/contexts/DebtorContext/index.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Debtor, Debt, getDebtors, getDebts, createDebtor, createDebt, CreateDebtorData, CreateDebtData } from '@/api/debtorService';
import { Alert } from 'react-native';

interface DebtorContextData {
  debtors: Debtor[];
  debts: Debt[];
  loading: boolean;
  refreshing: boolean;
  loadDebtors: () => Promise<void>;
  loadDebts: () => Promise<void>;
  addDebtor: (data: CreateDebtorData) => Promise<Debtor>;
  addDebt: (data: CreateDebtData) => Promise<void>;
  refreshData: () => Promise<void>;
  getDebtorById: (id: string) => Debtor | undefined;
  getDebtsByDebtorId: (debtorId: string) => Debt[];
  getTotalDebtForDebtor: (debtorId: string) => number;
  getPendingDebtsForDebtor: (debtorId: string) => number;
}

interface DebtorProviderProps {
  children: ReactNode;
}

const DebtorContext = createContext<DebtorContextData>({} as DebtorContextData);

export const DebtorProvider: React.FC<DebtorProviderProps> = ({ children }) => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDebtors = async () => {
    setLoading(true);
    try {
      const response = await getDebtors();
      setDebtors(response);
    } catch (error: any) {
      // API error handled silently
    } finally {
      setLoading(false);
    }
  };

  const loadDebts = async () => {
    try {
      const response = await getDebts();
      setDebts(response);
    } catch (error: any) {
      // API error handled silently
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadDebtors(), loadDebts()]);
    } catch (error: any) {
    } finally {
      setRefreshing(false);
    }
  };

  const addDebtor = async (data: CreateDebtorData): Promise<Debtor> => {
    try {
      const newDebtor = await createDebtor(data);
      setDebtors(prev => [...prev, newDebtor]);
      return newDebtor;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível criar a cobrança.';
      throw new Error(errorMessage);
    }
  };

  const addDebt = async (data: CreateDebtData) => {
    try {
      const newDebt = await createDebt(data);
      setDebts(prev => [...prev, newDebt]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível criar a dívida.';
      throw new Error(errorMessage);
    }
  };

  const getDebtorById = (id: string): Debtor | undefined => {
    return debtors.find(debtor => debtor.id === id);
  };

  const getDebtsByDebtorId = (debtorId: string): Debt[] => {
    return debts.filter(debt => debt.debtorId === debtorId);
  };

  const getTotalDebtForDebtor = (debtorId: string): number => {
    return debts
      .filter(debt => debt.debtorId === debtorId && (debt.status === 'PENDENTE' || !debt.status))
      .reduce((total, debt) => total + debt.totalAmount, 0);
  };

  const getPendingDebtsForDebtor = (debtorId: string): number => {
    return debts.filter(debt => debt.debtorId === debtorId && (debt.status === 'PENDENTE' || !debt.status)).length;
  };

  useEffect(() => {
    loadDebtors();
    loadDebts();
  }, []);

  const contextValue: DebtorContextData = {
    debtors,
    debts,
    loading,
    refreshing,
    loadDebtors,
    loadDebts,
    addDebtor,
    addDebt,
    refreshData,
    getDebtorById,
    getDebtsByDebtorId,
    getTotalDebtForDebtor,
    getPendingDebtsForDebtor,
  };

  return (
    <DebtorContext.Provider value={contextValue}>
      {children}
    </DebtorContext.Provider>
  );
};

export const useDebtors = (): DebtorContextData => {
  const context = useContext(DebtorContext);
  if (!context) {
    throw new Error('useDebtors deve ser usado dentro de um DebtorProvider');
  }
  return context;
};