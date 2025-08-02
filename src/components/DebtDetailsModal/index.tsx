import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';

interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  interestApplied?: number;
}

interface Debt {
  id: string;
  description: string;
  totalAmount: number;
  originalAmount: number;
  dueDate: Date;
  status: 'PENDENTE' | 'PAGA' | 'ATRASADA';
  debtorId: string;
  interestRate?: number;
  installments?: Installment[];
  isInstallment: boolean;
  installmentCount?: number;
}

interface Debtor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalDebt: number;
  pendingDebts: number;
  overdueDebts: number;
}

interface DebtDetailsModalProps {
  visible: boolean;
  debtor: Debtor | null;
  debts: Debt[];
  onClose: () => void;
  onMarkInstallmentPaid: (debtId: string, installmentId: string) => void;
}

export default function DebtDetailsModal({
  visible,
  debtor,
  debts,
  onClose,
  onMarkInstallmentPaid,
}: DebtDetailsModalProps) {
  if (!debtor) return null;

  // Safety checks
  const safeDebtor = {
    ...debtor,
    totalDebt: debtor.totalDebt || 0,
    pendingDebts: debtor.pendingDebts || 0,
    overdueDebts: debtor.overdueDebts || 0,
  };

  const safeDebts = Array.isArray(debts) ? debts : [];

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO': return '#4CAF50';
      case 'ATRASADO': case 'ATRASADA': return '#F44336';
      case 'PENDENTE': return '#FF9800';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAGO': return 'check-circle';
      case 'ATRASADO': case 'ATRASADA': return 'alert-circle';
      case 'PENDENTE': return 'clock';
      default: return 'help-circle';
    }
  };

  const calculateDaysOverdue = (dueDate: Date | string) => {
    try {
      const today = new Date();
      const due = new Date(dueDate);
      if (isNaN(due.getTime())) {
        return 0;
      }
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.warn('Error calculating days overdue:', error);
      return 0;
    }
  };

  const renderInstallment = (debt: Debt, installment: Installment) => {
    const daysOverdue = installment.status === 'ATRASADO' ? calculateDaysOverdue(installment.dueDate) : 0;
    
    return (
      <View key={installment.id} style={styles.installmentCard}>
        <View style={styles.installmentHeader}>
          <View style={styles.installmentInfo}>
            <Text style={styles.installmentNumber}>
              Parcela {installment.installmentNumber}
            </Text>
            <Text style={styles.installmentAmount}>
              {formatCurrency(installment.amount)}
              {installment.interestApplied && installment.interestApplied > 0 && (
                <Text style={styles.interestAmount}>
                  + {formatCurrency(installment.interestApplied)} juros
                </Text>
              )}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(installment.status) }]}>
            <Icon name={getStatusIcon(installment.status)} size={16} color="#fff" />
            <Text style={styles.statusText}>{installment.status}</Text>
          </View>
        </View>
        
        <View style={styles.installmentDetails}>
          <Text style={styles.dueDate}>
            Vencimento: {installment.dueDate ? new Date(installment.dueDate).toLocaleDateString('pt-BR') : 'Data inválida'}
          </Text>
          {installment.paidDate && (
            <Text style={styles.paidDate}>
              Pago em: {new Date(installment.paidDate).toLocaleDateString('pt-BR')}
            </Text>
          )}
          {daysOverdue > 0 && (
            <Text style={styles.overdueText}>
              {daysOverdue} dia{daysOverdue !== 1 ? 's' : ''} em atraso
            </Text>
          )}
        </View>

        {installment.status !== 'PAGO' && (
          <CustomButton
            title="Marcar como Pago"
            onPress={() => onMarkInstallmentPaid(debt.id, installment.id)}
            style={styles.payButton}
          />
        )}
      </View>
    );
  };

  const renderDebt = (debt: Debt) => (
    <View key={debt.id} style={styles.debtCard}>
      <View style={styles.debtHeader}>
        <Text style={styles.debtTitle}>{debt.description}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(debt.status) }]}>
          <Icon name={getStatusIcon(debt.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{debt.status}</Text>
        </View>
      </View>

      <View style={styles.debtInfo}>
        <View style={styles.amountInfo}>
          <Text style={styles.originalAmount}>
            Valor Original: {formatCurrency(debt.originalAmount)}
          </Text>
          {debt.totalAmount !== debt.originalAmount && (
            <Text style={styles.currentAmount}>
              Valor Atual: {formatCurrency(debt.totalAmount)}
            </Text>
          )}
          {debt.interestRate && (
            <Text style={styles.interestRate}>
              Taxa: {debt.interestRate}% ao mês
            </Text>
          )}
        </View>
        
        {!debt.isInstallment && (
          <Text style={styles.dueDate}>
            Vencimento: {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('pt-BR') : 'Data inválida'}
          </Text>
        )}
      </View>

      {debt.isInstallment && debt.installments && (
        <View style={styles.installmentsSection}>
          <Text style={styles.installmentsTitle}>
            Parcelamento ({debt.installments.length} parcelas)
          </Text>
          {debt.installments.map(installment => renderInstallment(debt, installment))}
        </View>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Dívidas de {safeDebtor.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumo</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total em Dívidas:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(safeDebtor.totalDebt)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dívidas Pendentes:</Text>
              <Text style={styles.summaryValue}>{safeDebtor.pendingDebts}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dívidas em Atraso:</Text>
              <Text style={[styles.summaryValue, { color: '#F44336' }]}>{safeDebtor.overdueDebts}</Text>
            </View>
          </View>

          {safeDebts.map(renderDebt)}
        </ScrollView>
      </View>
    </Modal>
  );
}