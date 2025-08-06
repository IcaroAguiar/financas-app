import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
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
}

export default function TransactionBottomSheet({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TransactionBottomSheetProps) {
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
          <Text style={[
            styles.transactionAmount,
            { color: isRevenue ? theme.colors.success : theme.colors.error }
          ]}>
            {isRevenue ? '+' : ''}{formattedAmount}
          </Text>
        </View>

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
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Editar"
            variant="secondary"
            onPress={() => {
              onEdit(transaction.id);
              onClose();
            }}
            style={styles.actionButton}
          />
          <CustomButton
            title="Excluir"
            variant="danger"
            onPress={() => {
              onDelete(transaction.id);
              onClose();
            }}
            style={styles.actionButton}
          />
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}