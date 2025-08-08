// src/api/debtorService.ts
import api from './axiosConfig';

export interface Debtor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Debt {
  id: string;
  description: string;
  totalAmount: number;
  dueDate: string;
  status: 'PENDENTE' | 'PAGA' | 'DELETED';
  createdAt: string;
  updatedAt: string;
  debtorId: string;
  debtor?: Debtor;
  payments?: Payment[];
  // Notification management
  notificationId?: string;
  // Calculated fields from backend
  paidAmount?: number;
  remainingAmount?: number;
}

export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  debtId: string;
}

export interface CreateDebtorData {
  name: string;
  email?: string;
  phone?: string;
}

export interface CreateDebtData {
  description: string;
  totalAmount: number;
  dueDate: string;
  debtorId: string;
  isInstallment?: boolean;
  installmentCount?: number;
  installmentFrequency?: 'MONTHLY' | 'WEEKLY';
}

export interface CreatePaymentData {
  amount: number;
  paymentDate?: string;
  notes?: string;
}

export interface UpdateDebtData {
  description?: string;
  totalAmount?: number;
  dueDate?: string;
  status?: 'PENDENTE' | 'PAGA' | 'DELETED';
  isInstallment?: boolean;
  installmentCount?: number;
  installmentFrequency?: 'MONTHLY' | 'WEEKLY';
}

// Debtor API calls
export const getDebtors = async (): Promise<Debtor[]> => {
  const response = await api.get('/debtors');
  return response.data;
};

export const createDebtor = async (data: CreateDebtorData): Promise<Debtor> => {
  const response = await api.post('/debtors', data);
  return response.data;
};

export const updateDebtor = async (id: string, data: Partial<CreateDebtorData>): Promise<Debtor> => {
  const response = await api.patch(`/debtors/${id}`, data);
  return response.data;
};

export const deleteDebtor = async (id: string): Promise<void> => {
  await api.delete(`/debtors/${id}`);
};

// Debt API calls
export const getDebts = async (): Promise<Debt[]> => {
  const response = await api.get('/debts');
  return response.data;
};

export const getDebtsByDebtor = async (debtorId: string): Promise<Debt[]> => {
  const response = await api.get(`/debts/debtor/${debtorId}`);
  return response.data;
};

export const createDebt = async (data: CreateDebtData): Promise<Debt> => {
  const response = await api.post('/debts', data);
  return response.data;
};

export const updateDebt = async (id: string, data: Partial<UpdateDebtData>): Promise<Debt> => {
  const response = await api.patch(`/debts/${id}`, data);
  return response.data;
};

export const deleteDebt = async (id: string): Promise<void> => {
  await api.delete(`/debts/${id}`);
};

// Debt Details API call
export const getDebtById = async (debtId: string): Promise<Debt> => {
  const response = await api.get(`/debts/${debtId}`);
  return response.data;
};

// Payment API calls
export const getPaymentsByDebt = async (debtId: string): Promise<Payment[]> => {
  const response = await api.get(`/debts/${debtId}/payments`);
  return response.data;
};

export const createPayment = async (debtId: string, data: CreatePaymentData): Promise<Payment> => {
  const response = await api.post(`/debts/${debtId}/payments`, data);
  return response.data;
};

export const deletePayment = async (id: string): Promise<void> => {
  await api.delete(`/payments/${id}`);
};

// Notification management
export const updateDebtNotification = async (debtId: string, notificationId: string | null): Promise<Debt> => {
  const response = await api.patch(`/debts/${debtId}`, { notificationId });
  return response.data;
};