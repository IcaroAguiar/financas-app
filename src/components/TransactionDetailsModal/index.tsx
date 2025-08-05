import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { useToast } from '@/hooks/useToast';

interface TransactionInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
}

interface TransactionWithInstallments {
  id: string;
  description: string;
  totalAmount: number;
  originalAmount: number;
  type: 'RECEITA' | 'DESPESA';
  date: Date;
  account?: { name: string };
  category?: { name: string };
  isInstallmentPlan: boolean;
  installmentCount?: number;
  installmentFrequency?: 'MONTHLY' | 'WEEKLY';
  installments?: TransactionInstallment[];
}

interface TransactionDetailsModalProps {
  visible: boolean;
  transaction: TransactionWithInstallments | null;
  onClose: () => void;
  onMarkInstallmentPaid: (transactionId: string, installmentId: string) => void;
  onMarkTransactionPaid?: (transactionId: string) => void;
  onMarkPartialPayment?: (transactionId: string, amount: number) => void;
}

export default function TransactionDetailsModal({
  visible,
  transaction,
  onClose,
  onMarkInstallmentPaid,
  onMarkTransactionPaid,
  onMarkPartialPayment,
}: TransactionDetailsModalProps) {
  const toast = useToast();
  
  if (!transaction) return null;

  // Payment functionality
  const handleMarkTransactionAsPaid = () => {
    toast.showConfirmation({
      title: 'Confirmar Pagamento',
      message: `Deseja marcar "${transaction.description}" como paga?\n\nValor: ${formatCurrency(transaction.totalAmount)}`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        onMarkTransactionPaid?.(transaction.id);
        toast.showSuccess({ message: 'Transação marcada como paga!' });
      }
    });
  };

  const handlePartialPayment = () => {
    toast.showConfirmation({
      title: 'Pagamento Parcial',
      message: `Registrar pagamento parcial para "${transaction.description}"?`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        const partialAmount = transaction.totalAmount * 0.5; // Placeholder: 50% payment
        onMarkPartialPayment?.(transaction.id, partialAmount);
        toast.showSuccess({ message: 'Pagamento parcial registrado!' });
      }
    });
  };

  // Calculate installment progress for display
  const getInstallmentProgress = () => {
    if (!transaction.isInstallmentPlan || !transaction.installments) return null;
    
    const totalInstallments = transaction.installments.length;
    const paidInstallments = transaction.installments.filter(inst => inst.status === 'PAGO').length;
    
    return {
      paid: paidInstallments,
      total: totalInstallments,
      percentage: totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0
    };
  };

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
      case 'ATRASADO': return '#F44336';
      case 'PENDENTE': return '#FF9800';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAGO': return 'check-circle';
      case 'ATRASADO': return 'alert-circle';
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

  const renderInstallment = (installment: TransactionInstallment) => {
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
            onPress={() => onMarkInstallmentPaid(transaction.id, installment.id)}
            style={styles.payButton}
          />
        )}
      </View>
    );
  };

  const progress = getInstallmentProgress();
  const isExpense = transaction.type === 'DESPESA';
  const isPaid = transaction.installments ? 
    transaction.installments.every(inst => inst.status === 'PAGO') :
    false; // For non-installment transactions, we'd need a status field

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Detalhes da Transação</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Transaction Summary */}
          <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionTitle}>{transaction.description}</Text>
              <View style={[styles.typeBadge, { backgroundColor: isExpense ? '#F44336' : '#4CAF50' }]}>
                <Icon name={isExpense ? 'trending-down' : 'trending-up'} size={16} color="#fff" />
                <Text style={styles.typeText}>{isExpense ? 'DESPESA' : 'RECEITA'}</Text>
              </View>
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.transactionAmount}>
                {formatCurrency(transaction.totalAmount)}
              </Text>
              <Text style={styles.transactionDate}>
                {transaction.date.toLocaleDateString('pt-BR')}
              </Text>
              {transaction.category && (
                <Text style={styles.transactionCategory}>
                  Categoria: {transaction.category.name}
                </Text>
              )}
              {transaction.account && (
                <Text style={styles.transactionAccount}>
                  Conta: {transaction.account.name}
                </Text>
              )}
            </View>

            {/* Installment Progress */}
            {transaction.isInstallmentPlan && progress && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    {progress.paid}/{progress.total} parcelas pagas
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {progress.percentage.toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${progress.percentage}%` }
                    ]} 
                  />
                </View>
              </View>
            )}

            {/* Payment Actions */}
            {!isPaid && (
              <View style={styles.paymentActions}>
                <CustomButton
                  title="Pagamento Total"
                  onPress={handleMarkTransactionAsPaid}
                  style={styles.paymentButton}
                  variant="primary"
                />
                {!transaction.isInstallmentPlan && (
                  <CustomButton
                    title="Pagamento Parcial"
                    onPress={handlePartialPayment}
                    style={styles.paymentButton}
                    variant="secondary"
                  />
                )}
              </View>
            )}
          </View>

          {/* Installments List */}
          {transaction.isInstallmentPlan && transaction.installments && (
            <View style={styles.installmentsSection}>
              <Text style={styles.installmentsTitle}>
                Parcelamento ({transaction.installments.length} parcelas)
              </Text>
              {transaction.installments.map(renderInstallment)}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}