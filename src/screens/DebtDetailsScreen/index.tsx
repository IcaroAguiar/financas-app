// src/screens/DebtDetailsScreen/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Icon from '@/components/Icon';
import RegisterPaymentModal from '@/components/RegisterPaymentModal';
import { getDebtById, Debt, Payment, createPayment } from '@/api/debtorService';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { useToast } from '@/hooks/useToast';

type DebtDetailsRouteParams = {
  DebtDetails: {
    debtId: string;
    debtorName: string;
  };
};

export default function DebtDetailsScreen() {
  const route = useRoute<RouteProp<DebtDetailsRouteParams, 'DebtDetails'>>();
  const navigation = useNavigation();
  const { debtId, debtorName } = route.params;
  const { showConfirmation } = useConfirmation();
  const toast = useToast();

  const [debtDetails, setDebtDetails] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRegisterPayment, setShowRegisterPayment] = useState(false);

  const loadDebtDetails = async () => {
    try {
      const response = await getDebtById(debtId);
      setDebtDetails(response);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da dívida.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDebtDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDebtDetails();
  }, [debtId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFullPayment = () => {
    if (!debtDetails || (debtDetails.remainingAmount || 0) <= 0) {
      return;
    }

    const remainingAmount = debtDetails.remainingAmount || 0;
    
    showConfirmation({
      title: 'Confirmar Pagamento Total',
      message: `Confirmar pagamento total de ${formatCurrency(remainingAmount)}?`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      confirmVariant: 'primary',
      onConfirm: async () => {
        try {
          await createPayment(debtId, {
            amount: remainingAmount,
            paymentDate: new Date().toISOString(),
            notes: 'Pagamento total da dívida'
          });
          
          toast.showSuccess({ 
            message: `Pagamento total de ${formatCurrency(remainingAmount)} registrado com sucesso!` 
          });
          
          await refreshData();
        } catch (error) {
          toast.showError({ 
            message: 'Não foi possível registrar o pagamento total. Tente novamente.' 
          });
        }
      }
    });
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentAmount}>{formatCurrency(item.amount)}</Text>
          <Text style={styles.paymentDate}>{formatDateTime(item.paymentDate)}</Text>
        </View>
        <View style={styles.paymentIcon}>
          <Icon name="check-circle" size={20} color={theme.colors.success} />
        </View>
      </View>
      {item.notes && (
        <Text style={styles.paymentNotes}>{item.notes}</Text>
      )}
    </View>
  );

  const renderEmptyPayments = () => (
    <View style={styles.emptyPayments}>
      <Icon name="credit-card" size={48} color={theme.colors.textLight} />
      <Text style={styles.emptyPaymentsText}>Nenhum pagamento registrado ainda.</Text>
      <Text style={styles.emptyPaymentsSubtext}>
        Use o botão "Registrar Pagamento" para adicionar um pagamento parcial.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!debtDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dívida não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Debt Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.debtDescription}>{debtDetails.description}</Text>
          <Text style={styles.debtorName}>Devedor: {debtDetails.debtor?.name}</Text>
          
          <View style={styles.amountContainer}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Valor Total:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(debtDetails.totalAmount)}</Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Pago:</Text>
              <Text style={styles.paidAmount}>{formatCurrency(debtDetails.paidAmount || 0)}</Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Restante:</Text>
              <Text style={[
                styles.remainingAmount,
                (debtDetails.remainingAmount || 0) <= 0 ? styles.paidText : styles.pendingText
              ]}>
                {formatCurrency(debtDetails.remainingAmount || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              debtDetails.status === 'PAGA' ? styles.paidBadge : styles.pendingBadge
            ]}>
              <Text style={[
                styles.statusText,
                debtDetails.status === 'PAGA' ? styles.paidStatusText : styles.pendingStatusText
              ]}>
                {debtDetails.status === 'PAGA' ? 'PAGA' : 'PENDENTE'}
              </Text>
            </View>
            <Text style={styles.dueDateText}>
              Vencimento: {debtDetails.dueDate ? formatDate(debtDetails.dueDate) : 'Sem vencimento'}
            </Text>
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.paymentsSection}>
          <Text style={styles.sectionTitle}>Histórico de Pagamentos</Text>
          
          <FlatList
            data={debtDetails.payments}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentItem}
            ListEmptyComponent={renderEmptyPayments}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshData}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            style={styles.paymentsList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Payment Buttons */}
        {debtDetails.status === 'PENDENTE' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.partialPaymentButton}
              onPress={() => setShowRegisterPayment(true)}
            >
              <Text style={styles.partialPaymentButtonText}>Registrar Pagamento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.fullPaymentButton}
              onPress={handleFullPayment}
            >
              <Text style={styles.fullPaymentButtonText}>Pagamento Total</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Register Payment Modal */}
      <RegisterPaymentModal
        visible={showRegisterPayment}
        debtId={debtDetails.id}
        debtorName={debtDetails.debtor?.name || ''}
        remainingAmount={debtDetails.remainingAmount || 0}
        onClose={() => setShowRegisterPayment(false)}
        onPaymentCreated={refreshData}
      />
    </SafeAreaView>
  );
}