// src/contexts/SubscriptionContext/index.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Subscription,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscriptionStatus,
  processSubscriptions,
  getUpcomingSubscriptions,
  ProcessSubscriptionsResponse
} from '@/api/subscriptionService';

interface SubscriptionContextData {
  subscriptions: Subscription[];
  loading: boolean;
  refreshing: boolean;
  summary: {
    totalActive: number;
    totalInactive: number;
    totalOverdue: number;
    monthlyIncome: number;
    monthlyExpense: number;
  };
  loadSubscriptions: () => Promise<void>;
  addSubscription: (data: CreateSubscriptionData) => Promise<void>;
  updateSubscriptionById: (id: string, data: UpdateSubscriptionData) => Promise<void>;
  deleteSubscriptionById: (id: string) => Promise<void>;
  toggleSubscriptionById: (id: string) => Promise<void>;
  processAllSubscriptions: () => Promise<ProcessSubscriptionsResponse>;
  refreshSubscriptions: () => Promise<void>;
  getActiveSubscriptions: () => Subscription[];
  getInactiveSubscriptions: () => Subscription[];
  getOverdueSubscriptions: () => Subscription[];
  getUpcomingPayments: (days?: number) => Promise<Subscription[]>;
}

interface SubscriptionProviderProps {
  children: ReactNode;
}

const SubscriptionContext = createContext<SubscriptionContextData>({} as SubscriptionContextData);

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const calculateSummary = (subscriptions: Subscription[]) => {
    const activeSubscriptions = subscriptions.filter(s => s.isActive);
    const inactiveSubscriptions = subscriptions.filter(s => !s.isActive);
    const overdueSubscriptions = subscriptions.filter(s => s.isOverdue);
    
    // Calculate monthly recurring amounts
    const monthlyIncome = activeSubscriptions
      .filter(s => s.type === 'RECEITA')
      .reduce((sum, s) => {
        // Convert to monthly equivalent
        let monthlyAmount = s.amount;
        switch (s.frequency) {
          case 'DAILY':
            monthlyAmount = s.amount * 30;
            break;
          case 'WEEKLY':
            monthlyAmount = s.amount * 4;
            break;
          case 'MONTHLY':
            monthlyAmount = s.amount;
            break;
          case 'YEARLY':
            monthlyAmount = s.amount / 12;
            break;
        }
        return sum + monthlyAmount;
      }, 0);

    const monthlyExpense = activeSubscriptions
      .filter(s => s.type === 'DESPESA')
      .reduce((sum, s) => {
        // Convert to monthly equivalent
        let monthlyAmount = s.amount;
        switch (s.frequency) {
          case 'DAILY':
            monthlyAmount = s.amount * 30;
            break;
          case 'WEEKLY':
            monthlyAmount = s.amount * 4;
            break;
          case 'MONTHLY':
            monthlyAmount = s.amount;
            break;
          case 'YEARLY':
            monthlyAmount = s.amount / 12;
            break;
        }
        return sum + monthlyAmount;
      }, 0);

    return {
      totalActive: activeSubscriptions.length,
      totalInactive: inactiveSubscriptions.length,
      totalOverdue: overdueSubscriptions.length,
      monthlyIncome,
      monthlyExpense,
    };
  };

  const summary = calculateSummary(subscriptions);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await getSubscriptions();
      setSubscriptions(response);
    } catch (error: any) {
      console.error('Erro ao carregar assinaturas:', error);
      // Context doesn't show UI alerts - let calling components handle errors
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscriptions = async () => {
    setRefreshing(true);
    try {
      const response = await getSubscriptions();
      setSubscriptions(response);
    } catch (error: any) {
      console.error('Erro ao atualizar assinaturas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const addSubscription = async (data: CreateSubscriptionData) => {
    try {
      const newSubscription = await createSubscription(data);
      setSubscriptions(prev => [newSubscription, ...prev]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível salvar a assinatura.';
      throw new Error(errorMessage);
    }
  };

  const updateSubscriptionById = async (id: string, data: UpdateSubscriptionData) => {
    try {
      const updatedSubscription = await updateSubscription(id, data);
      setSubscriptions(prev => 
        prev.map(subscription => 
          subscription.id === id ? updatedSubscription : subscription
        )
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível atualizar a assinatura.';
      throw new Error(errorMessage);
    }
  };

  const deleteSubscriptionById = async (id: string) => {
    try {
      await deleteSubscription(id);
      setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível excluir a assinatura.';
      throw new Error(errorMessage);
    }
  };

  const toggleSubscriptionById = async (id: string) => {
    try {
      const updatedSubscription = await toggleSubscriptionStatus(id);
      setSubscriptions(prev => 
        prev.map(subscription => 
          subscription.id === id ? updatedSubscription : subscription
        )
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível alterar o status da assinatura.';
      throw new Error(errorMessage);
    }
  };

  const processAllSubscriptions = async (): Promise<ProcessSubscriptionsResponse> => {
    try {
      const result = await processSubscriptions();
      // Refresh subscriptions after processing
      await refreshSubscriptions();
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível processar as assinaturas.';
      throw new Error(errorMessage);
    }
  };

  const getActiveSubscriptions = (): Subscription[] => {
    return subscriptions.filter(subscription => subscription.isActive);
  };

  const getInactiveSubscriptions = (): Subscription[] => {
    return subscriptions.filter(subscription => !subscription.isActive);
  };

  const getOverdueSubscriptions = (): Subscription[] => {
    return subscriptions.filter(subscription => subscription.isOverdue);
  };

  const getUpcomingPayments = async (days: number = 7): Promise<Subscription[]> => {
    try {
      return await getUpcomingSubscriptions(days);
    } catch (error: any) {
      console.error('Erro ao buscar próximos pagamentos:', error);
      return [];
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const contextValue: SubscriptionContextData = {
    subscriptions,
    loading,
    refreshing,
    summary,
    loadSubscriptions,
    addSubscription,
    updateSubscriptionById,
    deleteSubscriptionById,
    toggleSubscriptionById,
    processAllSubscriptions,
    refreshSubscriptions,
    getActiveSubscriptions,
    getInactiveSubscriptions,
    getOverdueSubscriptions,
    getUpcomingPayments,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = (): SubscriptionContextData => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
};