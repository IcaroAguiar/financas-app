// src/contexts/AccountContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, getAllAccounts, createAccount, updateAccount, deleteAccount, CreateAccountRequest, UpdateAccountRequest } from '@/api/accountService';

interface AccountContextType {
  accounts: Account[];
  loading: boolean;
  refreshing: boolean;
  refreshData: () => Promise<void>;
  addAccount: (accountData: CreateAccountRequest) => Promise<Account>;
  editAccount: (id: string, accountData: UpdateAccountRequest) => Promise<Account>;
  removeAccount: (id: string) => Promise<void>;
  getAccountById: (id: string) => Account | undefined;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Erro ao atualizar contas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const addAccount = async (accountData: CreateAccountRequest): Promise<Account> => {
    try {
      const newAccount = await createAccount(accountData);
      setAccounts(prev => [newAccount, ...prev]);
      return newAccount;
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      throw error;
    }
  };

  const editAccount = async (id: string, accountData: UpdateAccountRequest): Promise<Account> => {
    try {
      const updatedAccount = await updateAccount(id, accountData);
      setAccounts(prev => prev.map(account => 
        account.id === id ? updatedAccount : account
      ));
      return updatedAccount;
    } catch (error) {
      console.error('Erro ao editar conta:', error);
      throw error;
    }
  };

  const removeAccount = async (id: string): Promise<void> => {
    try {
      await deleteAccount(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Erro ao remover conta:', error);
      throw error;
    }
  };

  const getAccountById = (id: string): Account | undefined => {
    return accounts.find(account => account.id === id);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const value: AccountContextType = {
    accounts,
    loading,
    refreshing,
    refreshData,
    addAccount,
    editAccount,
    removeAccount,
    getAccountById,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccounts deve ser usado dentro de um AccountProvider');
  }
  return context;
};