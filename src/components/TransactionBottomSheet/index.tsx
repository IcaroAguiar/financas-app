import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
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
  const snapPoints = useMemo(() => ['40%'], []);
  
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  React.useEffect(() => {
    if (isOpen && transaction) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, transaction]);

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
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.container}>
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
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}