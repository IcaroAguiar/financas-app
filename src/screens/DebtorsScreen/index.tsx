import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Linking, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import Icon from '@/components/Icon';
import FloatingActionButton from '@/components/FloatingActionButton';
import DebtDetailsModal from '@/components/DebtDetailsModal';
import AddDebtorModal from '@/components/AddDebtorModal';
import ChargeDebtModal from '@/components/ChargeDebtModal';
import { useDebtors } from '@/contexts/DebtorContext';
import { Debtor as ApiDebtor, Debt as ApiDebt, CreateDebtorData, CreateDebtData } from '@/api/debtorService';
import { theme } from '@/styles/theme';
import { useToast } from '@/hooks/useToast';

// Debtor interface imported from debtorService.ts

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
  interestRate?: number; // Monthly interest rate percentage
  installments?: Installment[];
  isInstallment: boolean;
  installmentCount?: number;
}

export default function DebtorsScreen() {
  const { 
    debtors, 
    loading, 
    refreshing, 
    refreshData, 
    addDebtor,
    addDebt,
    getTotalDebtForDebtor, 
    getPendingDebtsForDebtor,
    getDebtsByDebtorId
  } = useDebtors();
  
  const toast = useToast();

  const [selectedDebtor, setSelectedDebtor] = useState<ApiDebtor | null>(null);
  const [showDebtDetails, setShowDebtDetails] = useState(false);
  const [showAddDebtor, setShowAddDebtor] = useState(false);
  const [showChargeDebt, setShowChargeDebt] = useState(false);
  const [chargeDebtDebtor, setChargeDebtDebtor] = useState<ApiDebtor | null>(null);


  // Get debts for a specific debtor using real API data
  const getDebtorDebts = (debtorId: string) => {
    return getDebtsByDebtorId(debtorId);
  };

  const handleMarkInstallmentPaid = (debtId: string, installmentId: string) => {
    toast.showConfirmation({
      title: 'Confirmar Pagamento',
      message: 'Deseja marcar esta parcela como paga?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        // TODO: Implement API call to mark installment as paid
        toast.showSuccess({ message: 'Parcela marcada como paga!' });
        // Refresh data to show updated status
        refreshData();
      }
    });
  };

  const handleMarkDebtPaid = (debtId: string) => {
    toast.showConfirmation({
      title: 'Confirmar Pagamento',
      message: 'Deseja marcar toda a dívida como paga?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        // TODO: Implement API call to mark entire debt as paid
        toast.showSuccess({ message: 'Dívida marcada como paga!' });
        // Refresh data to show updated status
        refreshData();
      }
    });
  };

  const handleMarkPartialPayment = (debtId: string, amount: number) => {
    // TODO: Implement API call to register partial payment
    toast.showSuccess({ message: 'Pagamento parcial registrado!' });
    // Refresh data to show updated status
    refreshData();
  };

  const sendWhatsAppMessage = (phone: string, debtorName: string, totalDebt: number) => {
    const formattedAmount = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(totalDebt);
    
    const message = `Olá, ${debtorName}! Este é um lembrete sobre sua dívida pendente no valor de ${formattedAmount}. Por favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!\n\n(Mensagem enviada via Ascend, meu app de controle financeiro!)`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'WhatsApp não está instalado neste dispositivo');
      }
    });
  };

  const handleCreateDebtorAndDebt = async (debtorData: CreateDebtorData, debtData: CreateDebtData) => {
    try {
      // First create the debtor
      const createdDebtor = await addDebtor(debtorData);
      
      // Then create the debt for that debtor
      const debtDataWithDebtorId = {
        ...debtData,
        debtorId: createdDebtor.id
      };
      
      await addDebt(debtDataWithDebtorId);
      
      // Refresh data to show the new debtor and debt
      await refreshData();
      
    } catch (error) {
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const sendEmail = (email: string, debtorName: string, totalDebt: number) => {
    const formattedAmount = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(totalDebt);
    
    const subject = 'Lembrete - Dívida Pendente';
    const body = `Olá, ${debtorName}! Este é um lembrete sobre sua dívida pendente no valor de ${formattedAmount}. Por favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!\n\n(Mensagem enviada via Ascend, meu app de controle financeiro!)`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo de email');
      }
    });
  };

  const showContactOptions = (debtor: ApiDebtor) => {
    if (!debtor.email && !debtor.phone) {
      Alert.alert('Sem contatos', 'Esta pessoa não possui informações de contato cadastradas.');
      return;
    }
    
    setChargeDebtDebtor(debtor);
    setShowChargeDebt(true);
  };

  const handleWhatsApp = () => {
    if (chargeDebtDebtor?.phone) {
      sendWhatsAppMessage(chargeDebtDebtor.phone, chargeDebtDebtor.name, getTotalDebtForDebtor(chargeDebtDebtor.id));
      setShowChargeDebt(false);
    }
  };

  const handleEmail = () => {
    if (chargeDebtDebtor?.email) {
      sendEmail(chargeDebtDebtor.email, chargeDebtDebtor.name, getTotalDebtForDebtor(chargeDebtDebtor.id));
      setShowChargeDebt(false);
    }
  };

  const renderDebtor = ({ item }: { item: ApiDebtor }) => (
    <View style={styles.debtorCard}>
      <View style={styles.debtorHeader}>
        <View style={styles.debtorInfo}>
          <Text style={styles.debtorName}>{item.name}</Text>
          <View style={styles.contactInfo}>
            {item.email && (
              <View style={styles.contactItem}>
                <Icon name="mail" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.contactText}>{item.email}</Text>
              </View>
            )}
            {item.phone && (
              <View style={styles.contactItem}>
                <Icon name="phone" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.contactText}>{item.phone}</Text>
              </View>
            )}
            {!item.email && !item.phone && (
              <Text style={styles.noContactText}>Sem contato cadastrado</Text>
            )}
          </View>
        </View>
        <View style={styles.debtInfo}>
          <Text style={[styles.debtAmount, getTotalDebtForDebtor(item.id) > 0 ? styles.pendingDebt : styles.paidDebt]}>
            R$ {getTotalDebtForDebtor(item.id).toFixed(2)}
          </Text>
          <Text style={styles.pendingCount}>
            {getPendingDebtsForDebtor(item.id)} pendente{getPendingDebtsForDebtor(item.id) !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.debtorActions}>
        <TouchableOpacity
          style={[
            styles.viewDebtsButton,
            {
              backgroundColor: theme.colors.primary,
              paddingVertical: 14,
              paddingHorizontal: 12,
              borderRadius: 20,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
            }
          ]}
          onPress={() => {
            setSelectedDebtor(item);
            setShowDebtDetails(true);
          }}
        >
          <Text style={{
            color: theme.colors.surface,
            fontSize: 14,
            fontWeight: '600',
            fontFamily: theme.fonts.bold,
            textAlign: 'center'
          }}>
            Ver Detalhes
          </Text>
        </TouchableOpacity>
        
        {getTotalDebtForDebtor(item.id) > 0 && (item.email || item.phone) && (
          <TouchableOpacity
            style={[
              styles.chargeButton,
              {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.primary,
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 20,
                minHeight: 48,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
              }
            ]}
            onPress={() => showContactOptions(item)}
          >
            <Text style={{
              color: theme.colors.primary,
              fontSize: 14,
              fontWeight: '600',
              fontFamily: theme.fonts.bold,
              textAlign: 'center'
            }}>
              Cobrar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {debtors.length}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Cobranças
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                R$ {debtors.reduce((sum, debtor) => sum + getTotalDebtForDebtor(debtor.id), 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Total Dívidas
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {debtors.reduce((sum, debtor) => sum + getPendingDebtsForDebtor(debtor.id), 0)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Pendentes
              </Text>
            </View>
          </View>
        </View>
        
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>Carregando cobranças...</Text>
          </View>
        ) : debtors.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: theme.colors.textPrimary, marginBottom: 8 }}>Nenhuma cobrança encontrada</Text>
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
              Adicione uma nova cobrança usando o botão + ou verifique sua conexão com a internet
            </Text>
          </View>
        ) : (
          <FlatList
            data={debtors}
            keyExtractor={(item) => item.id}
            renderItem={renderDebtor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshData}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        )}

        <FloatingActionButton 
          onPress={() => setShowAddDebtor(true)} 
        />

        <DebtDetailsModal
          visible={showDebtDetails}
          debtor={selectedDebtor ? {
            ...selectedDebtor,
            totalDebt: getTotalDebtForDebtor(selectedDebtor.id),
            pendingDebts: getPendingDebtsForDebtor(selectedDebtor.id),
            overdueDebts: 0 // TODO: Implement overdue calculation when needed
          } : null}
          debts={selectedDebtor ? getDebtsByDebtorId(selectedDebtor.id).map((debt: ApiDebt) => ({
            ...debt,
            originalAmount: debt.totalAmount, // Use totalAmount as originalAmount for API debts
            isInstallment: false, // API debts don't have installment info yet
            dueDate: new Date(debt.dueDate), // Convert string to Date
            installments: [], // No installments from API yet
          })) : []}
          onClose={() => setShowDebtDetails(false)}
          onMarkInstallmentPaid={handleMarkInstallmentPaid}
          onMarkDebtPaid={handleMarkDebtPaid}
          onMarkPartialPayment={handleMarkPartialPayment}
        />

        <AddDebtorModal
          visible={showAddDebtor}
          onClose={() => setShowAddDebtor(false)}
          onSubmit={handleCreateDebtorAndDebt}
        />

        <ChargeDebtModal
          visible={showChargeDebt}
          debtorName={chargeDebtDebtor?.name || ''}
          hasWhatsApp={!!chargeDebtDebtor?.phone}
          hasEmail={!!chargeDebtDebtor?.email}
          onWhatsApp={handleWhatsApp}
          onEmail={handleEmail}
          onClose={() => setShowChargeDebt(false)}
        />
      </View>
    </SafeAreaView>
  );
}