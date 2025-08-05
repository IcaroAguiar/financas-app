// src/api/subscriptionService.ts
import api from './axiosConfig';

export type SubscriptionFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type TransactionType = 'RECEITA' | 'DESPESA';

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: TransactionType;
  frequency: SubscriptionFrequency;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  nextPaymentDate: string;
  lastProcessedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId?: string;
  accountId?: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  account?: {
    id: string;
    name: string;
    type: string;
  };
  // Computed fields
  isOverdue?: boolean;
  transactionCount?: number;
}

export interface CreateSubscriptionData {
  name: string;
  description?: string;
  amount: number;
  type: TransactionType;
  frequency: SubscriptionFrequency;
  startDate: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
}

export interface UpdateSubscriptionData {
  name?: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  frequency?: SubscriptionFrequency;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  categoryId?: string;
  accountId?: string;
}

export interface UpcomingSubscription extends Subscription {
  daysUntilPayment: number;
}

export interface ProcessSubscriptionsResponse {
  message: string;
  processedCount: number;
  createdTransactions: number;
  subscriptions: Subscription[];
}

// Listar todas as assinaturas do usuário
export const getSubscriptions = async (): Promise<Subscription[]> => {
  const response = await api.get<Subscription[]>('/subscriptions');
  return response.data;
};

// Buscar assinatura específica
export const getSubscriptionById = async (id: string): Promise<Subscription> => {
  const response = await api.get<Subscription>(`/subscriptions/${id}`);
  return response.data;
};

// Criar nova assinatura
export const createSubscription = async (data: CreateSubscriptionData): Promise<Subscription> => {
  const response = await api.post<Subscription>('/subscriptions', data);
  return response.data;
};

// Atualizar assinatura
export const updateSubscription = async (id: string, data: UpdateSubscriptionData): Promise<Subscription> => {
  const response = await api.put<Subscription>(`/subscriptions/${id}`, data);
  return response.data;
};

// Deletar assinatura
export const deleteSubscription = async (id: string): Promise<void> => {
  await api.delete(`/subscriptions/${id}`);
};

// Pausar/Despausar assinatura
export const toggleSubscriptionStatus = async (id: string): Promise<Subscription> => {
  const response = await api.patch<Subscription>(`/subscriptions/${id}/toggle`);
  return response.data;
};

// Processar assinaturas manualmente
export const processSubscriptions = async (): Promise<ProcessSubscriptionsResponse> => {
  const response = await api.post<ProcessSubscriptionsResponse>('/subscriptions/process');
  return response.data;
};

// Buscar assinaturas que vencerão em breve
export const getUpcomingSubscriptions = async (days: number = 7): Promise<Subscription[]> => {
  const response = await api.get<Subscription[]>(`/subscriptions/upcoming?days=${days}`);
  return response.data;
};

// Utilitários para formatação
export const formatFrequency = (frequency: SubscriptionFrequency): string => {
  const frequencyMap = {
    DAILY: 'Diariamente',
    WEEKLY: 'Semanalmente',
    MONTHLY: 'Mensalmente',
    YEARLY: 'Anualmente'
  };
  return frequencyMap[frequency] || frequency;
};

export const formatNextPaymentDate = (nextPaymentDate: string): string => {
  const date = new Date(nextPaymentDate);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Venceu há ${Math.abs(diffDays)} dias`;
  } else if (diffDays === 0) {
    return 'Vence hoje';
  } else if (diffDays === 1) {
    return 'Vence amanhã';
  } else if (diffDays <= 7) {
    return `Vence em ${diffDays} dias`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

export const getSubscriptionIcon = (frequency: SubscriptionFrequency): string => {
  const iconMap = {
    DAILY: 'calendar',
    WEEKLY: 'calendar',
    MONTHLY: 'calendar',
    YEARLY: 'calendar'
  };
  return iconMap[frequency] || 'calendar';
};

export const getSubscriptionColor = (type: TransactionType, isOverdue?: boolean): string => {
  if (isOverdue) return '#FF3B30'; // Red for overdue
  return type === 'RECEITA' ? '#34C759' : '#FF9500'; // Green for income, orange for expense
};