import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { Transaction } from '@/types/transactions';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { theme } from '@/styles/theme';
import { styles } from './styles';

interface TransactionBottomSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  onMarkPaid: (transactionId: string) => void;
  onPartialPayment: (transactionId: string, amount: number) => void;
  onStopRecurring?: (transactionId: string) => void;
}

export default function TransactionBottomSheet({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMarkPaid,
  onPartialPayment,
  onStopRecurring,
}: TransactionBottomSheetProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const { showConfirmation } = useConfirmation();
  if (!transaction) return null;

  const isRevenue = transaction.type === 'RECEITA';
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = new Date(transaction.date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.contentWrapper}>
            <View style={styles.handle} />
            <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[
              styles.typeIcon,
              { backgroundColor: isRevenue ? theme.colors.success + '20' : theme.colors.error + '20' }
            ]}>
              <Icon 
                name={isRevenue ? 'arrow-up-circle' : 'arrow-down-circle'} 
                size={24} 
                color={isRevenue ? theme.colors.success : theme.colors.error}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.transactionTitle} numberOfLines={2}>
                {transaction.description}
              </Text>
              <Text style={styles.transactionCategory}>
                {transaction.category?.name || 'Sem categoria'}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={[
              styles.transactionAmount,
              { color: isRevenue ? theme.colors.success : theme.colors.error }
            ]}>
              {isRevenue ? '+' : ''}{formattedAmount}
            </Text>
            <TouchableOpacity 
              style={styles.optionsButton}
              onPress={() => setShowOptionsMenu(!showOptionsMenu)}
            >
              <Icon name="more-horizontal" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options Menu */}
        {showOptionsMenu && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                onEdit(transaction.id);
                setShowOptionsMenu(false);
                onClose();
              }}
            >
              <Icon name="edit-2" size={16} color={theme.colors.text.primary} />
              <Text style={styles.optionText}>Editar</Text>
            </TouchableOpacity>
            {/* Stop Recurring Option for recurring transactions */}
            {transaction.isRecurring === true && onStopRecurring && (
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => {
                  onStopRecurring(transaction.id);
                  setShowOptionsMenu(false);
                  onClose();
                }}
              >
                <Icon name="pause" size={16} color={theme.colors.warning} />
                <Text style={[styles.optionText, { color: theme.colors.warning }]}>Parar Recorrência</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.optionItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                onDelete(transaction.id);
                setShowOptionsMenu(false);
                onClose();
              }}
            >
              <Icon name="trash-2" size={16} color={theme.colors.error} />
              <Text style={[styles.optionText, { color: theme.colors.error }]}>
                {transaction.isRecurring === true ? 'Excluir Esta Ocorrência' : 'Excluir'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Data</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="clock" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Horário</Text>
            <Text style={styles.detailValue}>{formattedTime}</Text>
          </View>

          {transaction.account && (
            <View style={styles.detailRow}>
              <Icon name="credit-card" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Conta</Text>
              <Text style={styles.detailValue}>{transaction.account.name}</Text>
            </View>
          )}

          {transaction.isInstallmentPlan && (
            <View style={styles.detailRow}>
              <Icon name="repeat" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Parcelamento</Text>
              <Text style={styles.detailValue}>
                {transaction.installmentCount} parcelas
              </Text>
            </View>
          )}

          {transaction.isRecurring && (
            <View style={styles.detailRow}>
              <Icon name="calendar" size={16} color={theme.colors.warning} />
              <Text style={styles.detailLabel}>Recorrente</Text>
              <Text style={styles.detailValue}>
                {transaction.subscriptionFrequency === 'DAILY' ? 'Diário' :
                 transaction.subscriptionFrequency === 'WEEKLY' ? 'Semanal' :
                 transaction.subscriptionFrequency === 'MONTHLY' ? 'Mensal' :
                 transaction.subscriptionFrequency === 'YEARLY' ? 'Anual' : 'Recorrente'}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Actions */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Pagar Parcela"
            variant="secondary"
            onPress={() => {
              Alert.prompt(
                'Pagar Parcela',
                'Digite o valor do pagamento:',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Confirmar',
                    onPress: (value) => {
                      if (value) {
                        const amount = parseFloat(value.replace(',', '.'));
                        if (!isNaN(amount) && amount > 0) {
                          onPartialPayment(transaction.id, amount);
                          onClose();
                        }
                      }
                    }
                  }
                ],
                'plain-text',
                '',
                'numeric'
              );
            }}
            style={styles.actionButton}
          />
          <CustomButton
            title="Marcar como Pago"
            variant="primary"
            onPress={() => {
              if (transaction.type === 'DESPESA') {
                showConfirmation({
                  title: 'Confirmar Pagamento',
                  message: 'Esta despesa será marcada como paga e movida para a categoria "Pagos". Deseja continuar?',
                  confirmText: 'Confirmar',
                  cancelText: 'Cancelar',
                  onConfirm: () => {
                    onMarkPaid(transaction.id);
                    onClose();
                  }
                });
              } else {
                onMarkPaid(transaction.id);
                onClose();
              }
            }}
            style={styles.actionButton}
          />
        </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}