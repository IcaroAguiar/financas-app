import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Linking, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import Icon from '@/components/Icon';
import FloatingActionButton from '@/components/FloatingActionButton';
import DebtDetailsModal from '@/components/DebtDetailsModal';
import AddDebtorModal from '@/components/AddDebtorModal';
import ChargeDebtModal from '@/components/ChargeDebtModal';
import RegisterPaymentModal from '@/components/RegisterPaymentModal';
import { useDebtors } from '@/contexts/DebtorContext';
import { Debtor as ApiDebtor, Debt as ApiDebt, CreateDebtorData, CreateDebtData, UpdateDebtData, updateDebtor, updateDebt, deleteDebtor, updateDebtNotification, getDebtsByDebtor, createPayment, getDebtById, createDebt } from '@/api/debtorService';
import { theme } from '@/styles/theme';
import { useToast } from '@/hooks/useToast';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { scheduleDueDateNotification, cancelMultipleNotifications } from '@/utils/notifications';

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
    debts,
    loading, 
    refreshing, 
    refreshData, 
    addDebtor,
    addDebt,
    getTotalDebtForDebtor, 
    getTotalPendingDebtForDebtor,
    getPendingDebtsForDebtor,
    getDebtsByDebtorId
  } = useDebtors();
  
  const toast = useToast();
  const { showConfirmation } = useConfirmation();

  const [selectedDebtor, setSelectedDebtor] = useState<ApiDebtor | null>(null);
  const [showDebtDetails, setShowDebtDetails] = useState(false);
  const [showAddDebtor, setShowAddDebtor] = useState(false);
  const [showChargeDebt, setShowChargeDebt] = useState(false);
  const [chargeDebtDebtor, setChargeDebtDebtor] = useState<ApiDebtor | null>(null);
  const [editingDebtor, setEditingDebtor] = useState<ApiDebtor | null>(null);
  const [editingDebt, setEditingDebt] = useState<ApiDebt | null>(null);
  
  // Payment modal state
  const [showRegisterPayment, setShowRegisterPayment] = useState(false);
  const [paymentDebtId, setPaymentDebtId] = useState<string>('');
  const [paymentDebtorName, setPaymentDebtorName] = useState<string>('');
  const [paymentRemainingAmount, setPaymentRemainingAmount] = useState<number>(0);
  
  // Loading state for debt status changes
  const [updatingDebtIds, setUpdatingDebtIds] = useState<Set<string>>(new Set());


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

  const handleMarkDebtPaid = async (debtId: string) => {
    // Prevent double-click by checking if already updating
    if (updatingDebtIds.has(debtId)) {
      console.log(`DebtorsScreen: Debt ${debtId} is already being updated, ignoring request`);
      return;
    }
    
    // Find the debt directly in the debts context
    const debt = debts.find(d => d.id === debtId);
    if (!debt) {
      console.error(`Debt with ID ${debtId} not found`);
      return;
    }
    
    const isCurrentlyPaid = debt.status === 'PAGA';
    const newStatus = isCurrentlyPaid ? 'PENDENTE' : 'PAGA';
    const originalStatus = debt.status;
    
    console.log(`DebtorsScreen: Changing debt ${debtId} status from ${originalStatus} to ${newStatus}`);
    
    // Mark as updating
    setUpdatingDebtIds(prev => new Set(prev).add(debtId));
    
    // Optimistic update - update UI immediately
    debt.status = newStatus as any;
    
    // Close modals immediately for better UX
    setSelectedDebtor(null);
    setShowDebtDetails(false);
    
    try {
      // Call backend API to persist the status change
      await updateDebt(debtId, { status: newStatus });
      
      // Refresh context data to ensure consistency
      await refreshData();
      
      // Show success message
      toast.showSuccess({ 
        message: newStatus === 'PAGA' ? '✅ Dívida marcada como PAGA!' : '⏳ Dívida marcada como PENDENTE!' 
      });
      
    } catch (error) {
      // Rollback on error
      debt.status = originalStatus as any;
      await refreshData();
      
      console.error('Error updating debt status:', error);
      toast.showError({ message: 'Erro ao alterar status da dívida. Tente novamente.' });
      
    } finally {
      // Remove from updating set
      setUpdatingDebtIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(debtId);
        return newSet;
      });
    }
  };

  const handleMarkPartialPayment = async (debtId: string) => {
    try {
      // Get debt details to populate payment modal
      const debt = await getDebtById(debtId);
      const debtor = debtors.find(d => d.id === debt.debtorId);
      
      // Calculate remaining amount (total - paid amount)
      const remainingAmount = debt.remainingAmount || debt.totalAmount;
      
      // Set payment modal data
      setPaymentDebtId(debtId);
      setPaymentDebtorName(debtor?.name || 'Devedor');
      setPaymentRemainingAmount(remainingAmount);
      setShowRegisterPayment(true);
    } catch (error) {
      console.error('Error loading debt for payment:', error);
      toast.showError({ message: 'Erro ao carregar detalhes da dívida. Tente novamente.' });
    }
  };

  const sendWhatsAppMessage = (phone: string, debtorName: string, totalDebt: number) => {
    console.log('📱 sendWhatsAppMessage called - Phone:', phone, 'Debtor:', debtorName, 'Amount:', totalDebt);
    
    const formattedAmount = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(totalDebt);
    
    const message = `Olá, ${debtorName}! Este é um lembrete sobre sua dívida pendente no valor de ${formattedAmount}. Por favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!\n\n(Mensagem enviada via Ascend, meu app de controle financeiro!)`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    console.log('📱 WhatsApp URL:', url);
    
    Linking.canOpenURL(url).then((supported) => {
      console.log('📱 WhatsApp supported:', supported);
      if (supported) {
        console.log('📱 Opening WhatsApp...');
        Linking.openURL(url);
      } else {
        console.log('📱 WhatsApp not supported, showing error');
        toast.showError({ message: 'WhatsApp não está instalado neste dispositivo' });
      }
    }).catch((error) => {
      console.error('📱 Error checking WhatsApp support:', error);
      toast.showError({ message: 'Erro ao abrir WhatsApp: ' + error.message });
    });
  };

  const handleCreateDebtorAndDebt = async (debtorData: CreateDebtorData, debtData: CreateDebtData, wantsReminder?: boolean) => {
    try {
      if (editingDebtor) {
        // Edit mode - update the debtor (only if debtor data changed)
        await updateDebtor(editingDebtor.id, debtorData);
        
        // If we're editing an existing debt, update it
        if (editingDebt) {
          await updateDebt(editingDebt.id, {
            description: debtData.description,
            totalAmount: debtData.totalAmount,
            dueDate: debtData.dueDate,
            isInstallment: debtData.isInstallment,
            installmentCount: debtData.installmentCount,
            installmentFrequency: debtData.installmentFrequency
          });
        } else {
          // Add new debt to existing debtor
          const debtDataWithDebtorId = {
            ...debtData,
            debtorId: editingDebtor.id
          };
          
          console.log('📝 Creating new debt with data:', JSON.stringify(debtDataWithDebtorId, null, 2));
          console.log('📝 Debtor ID:', editingDebtor.id);
          console.log('📝 Description:', debtData.description);
          console.log('📝 Total Amount:', debtData.totalAmount);
          console.log('📝 Due Date:', debtData.dueDate);
          
          const createdDebt = await createDebt(debtDataWithDebtorId);
          
          // Schedule notification if user wants reminder
          if (wantsReminder && createdDebt) {
            try {
              const notificationId = await scheduleDueDateNotification({
                id: createdDebt.id,
                description: createdDebt.description,
                totalAmount: createdDebt.totalAmount,
                dueDate: createdDebt.dueDate,
                debtorId: createdDebt.debtorId,
                debtor: {
                  name: editingDebtor.name
                }
              });
              
              // Store the notificationId in the debt record
              if (notificationId) {
                try {
                  await updateDebtNotification(createdDebt.id, notificationId);
                  console.log(`Lembrete agendado e salvo para nova dívida ${createdDebt.id}: ${notificationId}`);
                } catch (updateError) {
                  console.warn('Erro ao salvar ID da notificação:', updateError);
                }
              }
            } catch (notificationError) {
              console.warn('Erro ao agendar lembrete para nova dívida:', notificationError);
            }
          }
        }
      } else {
        // Create mode - create both debtor and debt
        const createdDebtor = await addDebtor(debtorData);
        
        // Then create the debt for that debtor
        const debtDataWithDebtorId = {
          ...debtData,
          debtorId: createdDebtor.id
        };
        
        const createdDebt = await createDebt(debtDataWithDebtorId);
        
        // Schedule notification if user wants reminder
        if (wantsReminder && createdDebt) {
          try {
            const notificationId = await scheduleDueDateNotification({
              id: createdDebt.id,
              description: createdDebt.description,
              totalAmount: createdDebt.totalAmount,
              dueDate: createdDebt.dueDate,
              debtorId: createdDebt.debtorId,
              debtor: {
                name: createdDebtor.name
              }
            });
            
            // Store the notificationId in the debt record
            if (notificationId) {
              try {
                await updateDebtNotification(createdDebt.id, notificationId);
                console.log(`Lembrete agendado e salvo para a dívida ${createdDebt.id}: ${notificationId}`);
              } catch (updateError) {
                console.warn('Erro ao salvar ID da notificação:', updateError);
                // The notification is still scheduled, but we couldn't save the ID
              }
            }
          } catch (notificationError) {
            // Don't fail the entire process if notification fails
            console.warn('Erro ao agendar lembrete:', notificationError);
          }
        }
      }
      
      // Refresh data to show the updated/new data
      await refreshData();
      
    } catch (error) {
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const handleCloseAddDebtorModal = () => {
    setEditingDebtor(null);
    setEditingDebt(null);
    setShowAddDebtor(false);
  };

  const sendEmail = (email: string, debtorName: string, totalDebt: number) => {
    console.log('📧 sendEmail called - Email:', email, 'Debtor:', debtorName, 'Amount:', totalDebt);
    
    const formattedAmount = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(totalDebt);
    
    const subject = 'Lembrete - Dívida Pendente';
    const body = `Olá, ${debtorName}! Este é um lembrete sobre sua dívida pendente no valor de ${formattedAmount}. Por favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!\n\n(Mensagem enviada via Ascend, meu app de controle financeiro!)`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    console.log('📧 Email URL:', url);
    
    Linking.canOpenURL(url).then((supported) => {
      console.log('📧 Email supported:', supported);
      if (supported) {
        console.log('📧 Opening email app...');
        Linking.openURL(url);
      } else {
        console.log('📧 Email not supported, showing error');
        toast.showError({ message: 'Não foi possível abrir o aplicativo de email' });
      }
    }).catch((error) => {
      console.error('📧 Error checking email support:', error);
      toast.showError({ message: 'Erro ao abrir app de email: ' + error.message });
    });
  };

  const showContactOptions = (debtor: ApiDebtor) => {
    console.log('📞 showContactOptions called for:', debtor.name, '- Email:', !!debtor.email, '- Phone:', !!debtor.phone);
    
    if (!debtor.email && !debtor.phone) {
      toast.showError({ message: 'Esta pessoa não possui informações de contato cadastradas.' });
      return;
    }
    
    setChargeDebtDebtor(debtor);
    setShowChargeDebt(true);
    console.log('📞 Charge modal should now be visible');
  };

  const showDebtorActions = (debtor: ApiDebtor) => {
    console.log('⚙️ showDebtorActions called for:', debtor.name);
    
    const debtorDebts = getDebtsByDebtorId(debtor.id);
    const hasPendingDebt = debtorDebts.length > 0;
    
    console.log('⚙️ Debtor has', debtorDebts.length, 'debts, hasPendingDebt:', hasPendingDebt);
    
    // First action: Edit or Delete choice
    showConfirmation({
      title: `Ações - ${debtor.name}`,
      message: 'O que deseja fazer?',
      confirmText: 'Editar',
      cancelText: 'Excluir',
      confirmVariant: 'primary',
      onConfirm: () => {
        // Show edit options
        if (hasPendingDebt) {
          showConfirmation({
            title: 'Tipo de Edição',
            message: 'Como deseja editar?',
            confirmText: 'Editar Dados',
            cancelText: 'Editar com Dívida',
            onConfirm: () => handleEditDebtor(debtor),
            onCancel: () => {
              const firstDebt = debtorDebts.find(d => d.status === 'PENDENTE') || debtorDebts[0];
              handleEditDebtor(debtor, firstDebt);
            }
          });
        } else {
          handleEditDebtor(debtor);
        }
      },
      onCancel: () => {
        // Confirm deletion
        showConfirmation({
          title: '🗑️ Confirmar Exclusão',
          message: `Tem certeza que deseja excluir ${debtor.name}?\n\n(Apenas visual - não afeta servidor)`,
          confirmText: 'SIM, Excluir',
          cancelText: 'Cancelar',
          confirmVariant: 'danger',
          onConfirm: () => handleDeleteDebtor(debtor)
        });
      }
    });
  };

  const handleEditDebtor = (debtor: ApiDebtor, debt?: ApiDebt) => {
    console.log('✏️ handleEditDebtor called for:', debtor.name, 'with debt:', !!debt);
    setEditingDebtor(debtor);
    setEditingDebt(debt || null);
    setShowAddDebtor(true);
    console.log('✏️ AddDebtor modal should now be visible');
  };

  const handleAddNewDebt = (debtor: { id: string; name: string; email?: string; phone?: string }) => {
    // Close debt details modal first
    setShowDebtDetails(false);
    setSelectedDebtor(null);
    
    // Find the full debtor object for editing
    const fullDebtor = debtors.find(d => d.id === debtor.id);
    if (!fullDebtor) {
      toast.showError({ message: 'Devedor não encontrado' });
      return;
    }
    
    // Open add debtor modal in "add debt only" mode
    setEditingDebtor(fullDebtor);
    setEditingDebt(null);
    setShowAddDebtor(true);
    
    console.log(`Adding new debt for debtor: ${debtor.name}`);
  };

  const handleDeleteDebtor = (debtor: ApiDebtor) => {
    console.log('🗑️ handleDeleteDebtor called for:', debtor.name);
    
    // Frontend-only deletion: Mark all debtor's debts as deleted
    const debtorDebts = getDebtsByDebtorId(debtor.id);
    
    console.log(`🗑️ Deleting debtor ${debtor.name} with ${debtorDebts.length} debts`);
    
    debtorDebts.forEach(debt => {
      debt.status = 'DELETED' as any;
      console.log(`🗑️ Marked debt ${debt.id} as DELETED`);
    });
    
    // Also mark the debtor as deleted in a custom property
    (debtor as any).deleted = true;
    
    toast.showSuccess({ message: `🗑️ ${debtor.name} removido da lista!` });
    
    // Force UI refresh
    setSelectedDebtor(null);
    setShowDebtDetails(false);
    
    // Trigger a context refresh to update the debtor list
    refreshData();
    console.log('🗑️ Delete operation completed');
  };

  const handleWhatsApp = () => {
    if (chargeDebtDebtor?.phone) {
      // Use pending debt amount for charge messages, not total debt (which includes paid debts)
      const pendingAmount = getTotalPendingDebtForDebtor(chargeDebtDebtor.id);
      console.log('📱 Sending WhatsApp to:', chargeDebtDebtor.name, '- Amount: R$', pendingAmount);
      sendWhatsAppMessage(chargeDebtDebtor.phone, chargeDebtDebtor.name, pendingAmount);
      setShowChargeDebt(false);
    }
  };

  const handleEmail = () => {
    if (chargeDebtDebtor?.email) {
      // Use pending debt amount for charge messages, not total debt (which includes paid debts)
      const pendingAmount = getTotalPendingDebtForDebtor(chargeDebtDebtor.id);
      console.log('📧 Sending Email to:', chargeDebtDebtor.name, '- Amount: R$', pendingAmount);
      sendEmail(chargeDebtDebtor.email, chargeDebtDebtor.name, pendingAmount);
      setShowChargeDebt(false);
    }
  };

  const renderDebtor = ({ item }: { item: ApiDebtor }) => (
    <View style={styles.debtorCard}>
      <View style={styles.debtorHeader}>
        <View style={styles.debtorInfo}>
          <View style={styles.debtorNameRow}>
            <Text style={styles.debtorName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => showDebtorActions(item)}
            >
              <Icon name="more-horizontal" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.contactInfo}>
            {item.email && (
              <View style={styles.contactItem}>
                <Icon name="mail" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.contactText} numberOfLines={1} ellipsizeMode="tail">{item.email}</Text>
              </View>
            )}
            {item.phone && (
              <View style={styles.contactItem}>
                <Icon name="phone" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.contactText} numberOfLines={1} ellipsizeMode="tail">{item.phone}</Text>
              </View>
            )}
            {!item.email && !item.phone && (
              <Text style={styles.noContactText} numberOfLines={1} ellipsizeMode="tail">Sem contato cadastrado</Text>
            )}
          </View>
        </View>
        <View style={styles.debtInfo}>
          {(() => {
            const pendingCount = getPendingDebtsForDebtor(item.id);
            const pendingDebtAmount = getTotalPendingDebtForDebtor(item.id);
            
            return pendingCount > 0 ? (
              <>
                <Text style={[styles.debtAmount, styles.pendingDebt]} numberOfLines={1} ellipsizeMode="tail">
                  R$ {pendingDebtAmount.toFixed(2)}
                </Text>
                <Text style={styles.pendingCount} numberOfLines={1} ellipsizeMode="tail">
                  {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.debtAmount, styles.paidDebt]} numberOfLines={1} ellipsizeMode="tail">
                  SEM PENDÊNCIAS
                </Text>
                <Text style={[styles.pendingCount, { color: theme.colors.success || '#4CAF50' }]} numberOfLines={1} ellipsizeMode="tail">
                  Todas as dívidas pagas
                </Text>
              </>
            );
          })()}
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
        
        {getTotalPendingDebtForDebtor(item.id) > 0 && (item.email || item.phone) && (
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
          <Text style={styles.summaryTitle} numberOfLines={1} ellipsizeMode="tail">Resumo</Text>
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
                R$ {debtors.reduce((sum, debtor) => sum + getTotalPendingDebtForDebtor(debtor.id), 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Total Pendente
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
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }} numberOfLines={1} ellipsizeMode="tail">Carregando cobranças...</Text>
          </View>
        ) : debtors.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: theme.colors.textPrimary, marginBottom: 8 }} numberOfLines={1} ellipsizeMode="tail">Nenhuma cobrança encontrada</Text>
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }} numberOfLines={2} ellipsizeMode="tail">
              Adicione uma nova cobrança usando o botão + ou verifique sua conexão com a internet
            </Text>
          </View>
        ) : (
          <FlatList
            data={debtors.filter(debtor => !(debtor as any).deleted)}
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
            totalDebt: getTotalPendingDebtForDebtor(selectedDebtor.id),
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
          onAddNewDebt={handleAddNewDebt}
        />

        <AddDebtorModal
          visible={showAddDebtor}
          editingDebtor={editingDebtor}
          editingDebt={editingDebt}
          onClose={handleCloseAddDebtorModal}
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

        <RegisterPaymentModal
          visible={showRegisterPayment}
          debtId={paymentDebtId}
          debtorName={paymentDebtorName}
          remainingAmount={paymentRemainingAmount}
          onClose={() => setShowRegisterPayment(false)}
          onPaymentCreated={refreshData}
        />
      </View>
    </SafeAreaView>
  );
}