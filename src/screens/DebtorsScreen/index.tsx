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
  dueDate?: Date;
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
  
  // Local deleted items (frontend-only)
  const [deletedDebtorIds, setDeletedDebtorIds] = useState<Set<string>>(new Set());
  const [deletedDebtIds, setDeletedDebtIds] = useState<Set<string>>(new Set());


  // Get debts for a specific debtor using real API data, filtering out deleted ones
  const getDebtorDebts = (debtorId: string) => {
    return getDebtsByDebtorId(debtorId).filter(debt => !deletedDebtIds.has(debt.id));
  };

  // Local versions that consider deleted items
  const getLocalTotalPendingDebtForDebtor = (debtorId: string) => {
    const debtorDebts = getDebtorDebts(debtorId);
    return debtorDebts
      .filter(debt => debt.status === 'PENDENTE')
      .reduce((sum, debt) => sum + debt.totalAmount, 0);
  };

  const getLocalPendingDebtsForDebtor = (debtorId: string) => {
    const debtorDebts = getDebtorDebts(debtorId);
    return debtorDebts.filter(debt => debt.status === 'PENDENTE').length;
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
      
      // Cancel notification if debt is marked as PAID
      if (newStatus === 'PAGA' && debt.notificationId) {
        try {
          const cancelResult = await cancelMultipleNotifications([debt.notificationId]);
          if (cancelResult) {
            console.log(`✅ Notificação cancelada para dívida paga: ${debt.notificationId}`);
            // Clear the notificationId from the debt record
            await updateDebtNotification(debtId, null);
          }
        } catch (notificationError) {
          console.warn('Erro ao cancelar notificação da dívida paga:', notificationError);
        }
      }
      
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
    
    // Validate phone number
    if (!phone || phone.trim().length === 0) {
      console.error('📱 Invalid phone number:', phone);
      toast.showError({ message: 'Número de telefone inválido' });
      return;
    }
    
    // Clean phone number (remove spaces, dashes, parentheses, etc)
    const cleanPhone = phone.replace(/[^\d]/g, '');
    console.log('📱 Cleaned phone number:', cleanPhone);
    
    if (cleanPhone.length < 10) {
      console.error('📱 Phone number too short after cleaning:', cleanPhone);
      toast.showError({ message: 'Número de telefone muito curto' });
      return;
    }
    
    const formattedAmount = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(totalDebt);
    
    // Get pending debts with descriptions for this debtor
    const debtorId = chargeDebtDebtor?.id;
    const pendingDebts = debtorId ? getDebtsByDebtorId(debtorId)
      .filter(debt => debt.status === 'PENDENTE' && !deletedDebtIds.has(debt.id)) : [];
    
    // Build debt details for the message
    let debtDetails = '';
    if (pendingDebts.length > 0) {
      debtDetails = '\n\nDetalhes das dívidas:\n';
      pendingDebts.forEach((debt, index) => {
        const debtAmount = new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(debt.totalAmount);
        debtDetails += `${index + 1}. ${debt.description} - ${debtAmount}\n`;
      });
    }
    
    const message = `Olá, ${debtorName}! Este é um lembrete sobre sua(s) dívida(s) pendente(s) no valor total de ${formattedAmount}.${debtDetails}\nPor favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!\n\n(Mensagem enviada via Ascend, meu app de controle financeiro!)`;
    
    // Try multiple WhatsApp URL formats
    const urls = [
      `whatsapp://send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`,
      `whatsapp://send/?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`,
      `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`,
      `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`,
      `whatsapp://send?text=${encodeURIComponent(message)}&phone=55${cleanPhone}`
    ];
    
    console.log('📱 Trying WhatsApp URLs:', urls);
    
    const tryOpenWhatsApp = async (urlIndex = 0) => {
      if (urlIndex >= urls.length) {
        // Last resort: try the simplest WhatsApp format
        console.log('📱 All standard URLs failed, trying last resort...');
        try {
          const lastResortUrl = `whatsapp://send?text=${encodeURIComponent(`${debtorName}: ${formattedAmount} - Por favor entre em contato para acertar o pagamento. Obrigado!`)}`;
          console.log('📱 Last resort URL:', lastResortUrl);
          await Linking.openURL(lastResortUrl);
          toast.showSuccess({ message: '✅ WhatsApp aberto! Por favor, insira o número manualmente.' });
          return;
        } catch (error: any) {
          console.log('📱 Last resort also failed:', error?.message || error);
          toast.showError({ message: 'WhatsApp não está instalado ou não pode ser aberto neste dispositivo. Por favor, instale o WhatsApp.' });
        }
        return;
      }
      
      const url = urls[urlIndex];
      console.log(`📱 Trying URL ${urlIndex + 1}:`, url);
      
      try {
        // First, try to open directly (sometimes canOpenURL is overly restrictive)
        console.log(`📱 Attempting direct open for URL ${urlIndex + 1}...`);
        await Linking.openURL(url);
        console.log('📱 WhatsApp opened successfully via direct method');
        toast.showSuccess({ message: '✅ Mensagem enviada para o WhatsApp!' });
        return;
      } catch (directError: any) {
        console.log(`📱 Direct open failed for URL ${urlIndex + 1}:`, directError?.message || directError);
        
        // If direct open fails, check if it's supported first
        try {
          const supported = await Linking.canOpenURL(url);
          console.log(`📱 URL ${urlIndex + 1} supported via canOpenURL:`, supported);
          
          if (supported) {
            console.log(`📱 Opening WhatsApp with URL ${urlIndex + 1} after canOpenURL check...`);
            await Linking.openURL(url);
            console.log('📱 WhatsApp opened successfully after support check');
            toast.showSuccess({ message: '✅ Mensagem enviada para o WhatsApp!' });
            return;
          } else {
            // Try next URL
            console.log(`📱 URL ${urlIndex + 1} not supported, trying next...`);
            await tryOpenWhatsApp(urlIndex + 1);
          }
        } catch (supportError) {
          console.error(`📱 Support check error for URL ${urlIndex + 1}:`, supportError);
          // Try next URL
          await tryOpenWhatsApp(urlIndex + 1);
        }
      }
    };
    
    tryOpenWhatsApp();
  };

  const handleCreateDebtorAndDebt = async (debtorData: CreateDebtorData, debtData: CreateDebtData, wantsReminder?: boolean) => {
    try {
      if (editingDebtor) {
        // Edit mode - update the debtor (only if debtor data changed)
        console.log('🔧 About to update debtor:', {
          debtorId: editingDebtor.id,
          debtorData: JSON.stringify(debtorData, null, 2),
          editingDebtor: JSON.stringify(editingDebtor, null, 2)
        });
        
        try {
          await updateDebtor(editingDebtor.id, debtorData);
          console.log('🔧 Debtor update successful');
        } catch (updateError: any) {
          console.error('🔧 Debtor update failed:', updateError);
          console.error('🔧 Error message:', updateError?.message);
          console.error('🔧 Error response:', updateError?.response?.data);
          throw updateError; // Re-throw to be handled by outer catch
        }
        
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
          console.log('🚀 ABOUT TO CALL createDebt API...');
          
          const createdDebt = await createDebt(debtDataWithDebtorId);
          console.log('✅ API CALL COMPLETED, response:', createdDebt);
          
          // Schedule notification if user wants reminder
          if (wantsReminder && createdDebt) {
            try {
              const notificationId = await scheduleDueDateNotification({
                id: createdDebt.id,
                description: createdDebt.description,
                totalAmount: createdDebt.totalAmount,
                dueDate: createdDebt.dueDate || new Date().toISOString(),
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
        
        console.log('🚀 ABOUT TO CALL createDebt API for new debtor...');
        console.log('📝 Final debt data:', JSON.stringify(debtDataWithDebtorId, null, 2));
        const createdDebt = await createDebt(debtDataWithDebtorId);
        console.log('✅ API CALL COMPLETED for new debtor, response:', createdDebt);
        
        // Schedule notification if user wants reminder
        if (wantsReminder && createdDebt) {
          try {
            const notificationId = await scheduleDueDateNotification({
              id: createdDebt.id,
              description: createdDebt.description,
              totalAmount: createdDebt.totalAmount,
              dueDate: createdDebt.dueDate || new Date().toISOString(),
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
    
    // Validate email
    if (!email || email.trim().length === 0) {
      console.error('📧 Invalid email:', email);
      toast.showError({ message: 'Endereço de email inválido' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error('📧 Email format invalid:', email);
      toast.showError({ message: 'Formato de email inválido' });
      return;
    }
    
    const formattedAmount = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(totalDebt);
    
    // Get pending debts with descriptions for this debtor
    const debtorId = chargeDebtDebtor?.id;
    const pendingDebts = debtorId ? getDebtsByDebtorId(debtorId)
      .filter(debt => debt.status === 'PENDENTE' && !deletedDebtIds.has(debt.id)) : [];
    
    // Build debt details for the message
    let debtDetails = '';
    if (pendingDebts.length > 0) {
      debtDetails = '\n\nDetalhes das dívidas:\n';
      pendingDebts.forEach((debt, index) => {
        const debtAmount = new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(debt.totalAmount);
        debtDetails += `${index + 1}. ${debt.description} - ${debtAmount}\n`;
      });
    }
    
    const subject = 'Lembrete - Dívida Pendente';
    const body = `Olá, ${debtorName}! Este é um lembrete sobre sua(s) dívida(s) pendente(s) no valor total de ${formattedAmount}.${debtDetails}\nPor favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!\n\n(Mensagem enviada via Ascend, meu app de controle financeiro!)`;
    const url = `mailto:${email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    console.log('📧 Email URL:', url);
    console.log('📧 Subject:', subject);
    console.log('📧 Body:', body);
    
    Linking.canOpenURL(url).then((supported) => {
      console.log('📧 Email supported:', supported);
      if (supported) {
        console.log('📧 Opening email app...');
        return Linking.openURL(url).then(() => {
          console.log('📧 Email app opened successfully');
          toast.showSuccess({ message: '✅ Email aberto no aplicativo padrão!' });
        });
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
  };

  const showDebtorActions = (debtor: ApiDebtor) => {
    console.log('⚙️ showDebtorActions called for:', debtor.name);
    
    const debtorDebts = getDebtorDebts(debtor.id);
    
    // Simplified approach: Show edit/delete choice directly  
    showConfirmation({
      title: `${debtor.name}`,
      message: 'Escolha uma ação:',
      confirmText: 'Editar',
      cancelText: 'Excluir',
      confirmVariant: 'primary',
      onConfirm: () => {
        console.log('⚙️ Edit confirmed for:', debtor.name);
        // Direct edit - use first pending debt if exists
        const firstPendingDebt = debtorDebts.find(d => d.status === 'PENDENTE');
        handleEditDebtor(debtor, firstPendingDebt);
      },
      onCancel: () => {
        console.log('⚙️ Delete confirmed for:', debtor.name);
        handleDeleteDebtor(debtor);
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

  const handleEditDebt = (debt: any) => {
    console.log('✏️ handleEditDebt called for debt:', debt.description);
    
    // Find the API debt from context
    const apiDebt = debts.find(d => d.id === debt.id);
    if (!apiDebt) {
      toast.showError({ message: 'Dívida não encontrada' });
      return;
    }
    
    // Find the debtor for this debt
    const debtorForDebt = debtors.find(d => d.id === debt.debtorId);
    if (!debtorForDebt) {
      toast.showError({ message: 'Devedor não encontrado' });
      return;
    }
    
    // Set editing state and open modal
    setEditingDebtor(debtorForDebt);
    setEditingDebt(apiDebt);
    setShowDebtDetails(false);
    setSelectedDebtor(null);
    setShowAddDebtor(true);
    
    console.log('✏️ Edit debt modal should now be visible');
  };

  const handleDeleteDebt = async (debtId: string) => {
    console.log('🗑️ handleDeleteDebt called for debt ID:', debtId);
    
    // Frontend-only deletion: Add to deleted set
    const debt = debts.find(d => d.id === debtId);
    if (!debt) {
      toast.showError({ message: 'Dívida não encontrada' });
      return;
    }
    
    console.log(`🗑️ Deleting debt: ${debt.description}`);
    
    // Cancel notification if debt has one scheduled
    if (debt.notificationId) {
      try {
        const cancelResult = await cancelMultipleNotifications([debt.notificationId]);
        if (cancelResult) {
          console.log(`✅ Notificação cancelada para dívida deletada: ${debt.notificationId}`);
          // Clear the notificationId from the debt record
          await updateDebtNotification(debtId, null);
        }
      } catch (notificationError) {
        console.warn('Erro ao cancelar notificação da dívida deletada:', notificationError);
      }
    }
    
    // Add to deleted set (frontend-only)
    setDeletedDebtIds(prev => new Set([...prev, debtId]));
    
    toast.showSuccess({ message: `🗑️ Dívida "${debt.description}" removida da lista!` });
    
    // Force UI refresh
    setShowDebtDetails(false);
    setSelectedDebtor(null);
    
    console.log('🗑️ Delete debt operation completed');
  };

  const handleDeleteDebtor = async (debtor: ApiDebtor) => {
    console.log('🗑️ handleDeleteDebtor called for:', debtor.name);
    
    // Frontend-only deletion: Add debtor to deleted set
    const debtorDebts = getDebtorDebts(debtor.id);
    
    console.log(`🗑️ Deleting debtor ${debtor.name} with ${debtorDebts.length} debts`);
    
    // Cancel all notifications for debtor's debts
    const notificationIds = debtorDebts
      .filter(debt => debt.notificationId)
      .map(debt => debt.notificationId!);
    
    if (notificationIds.length > 0) {
      try {
        const cancelResult = await cancelMultipleNotifications(notificationIds);
        if (cancelResult) {
          console.log(`✅ ${notificationIds.length} notificações canceladas para devedor ${debtor.name}`);
          
          // Clear notificationIds from all debt records
          for (const debt of debtorDebts) {
            if (debt.notificationId) {
              try {
                await updateDebtNotification(debt.id, null);
              } catch (updateError) {
                console.warn(`Erro ao limpar notificationId da dívida ${debt.id}:`, updateError);
              }
            }
          }
        }
      } catch (notificationError) {
        console.warn(`Erro ao cancelar notificações do devedor ${debtor.name}:`, notificationError);
      }
    }
    
    // Add debtor to deleted set
    setDeletedDebtorIds(prev => new Set([...prev, debtor.id]));
    
    // Also add all their debts to deleted set
    const debtIds = debtorDebts.map(debt => debt.id);
    if (debtIds.length > 0) {
      setDeletedDebtIds(prev => new Set([...prev, ...debtIds]));
    }
    
    toast.showSuccess({ message: `🗑️ ${debtor.name} removido da lista!` });
    
    // Force UI refresh
    setSelectedDebtor(null);
    setShowDebtDetails(false);
    
    console.log('🗑️ Delete operation completed');
  };

  const handleWhatsApp = () => {
    if (chargeDebtDebtor?.phone) {
      const pendingAmount = getLocalTotalPendingDebtForDebtor(chargeDebtDebtor.id);
      console.log('📱 Sending WhatsApp to:', chargeDebtDebtor.name, '- Phone:', chargeDebtDebtor.phone, '- Amount: R$', pendingAmount);
      sendWhatsAppMessage(chargeDebtDebtor.phone, chargeDebtDebtor.name, pendingAmount);
      setShowChargeDebt(false);
    } else {
      toast.showError({ message: 'Número de telefone não encontrado para este devedor.' });
    }
  };

  const handleEmail = () => {
    if (chargeDebtDebtor?.email) {
      const pendingAmount = getLocalTotalPendingDebtForDebtor(chargeDebtDebtor.id);
      console.log('📧 Sending Email to:', chargeDebtDebtor.name, '- Email:', chargeDebtDebtor.email, '- Amount: R$', pendingAmount);
      sendEmail(chargeDebtDebtor.email, chargeDebtDebtor.name, pendingAmount);
      setShowChargeDebt(false);
    } else {
      toast.showError({ message: 'Email não encontrado para este devedor.' });
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
              onPress={() => {
                console.log('🔘 More options button pressed for:', item.name);
                showDebtorActions(item);
              }}
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
            const pendingCount = getLocalPendingDebtsForDebtor(item.id);
            const pendingDebtAmount = getLocalTotalPendingDebtForDebtor(item.id);
            
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
        
        {getLocalTotalPendingDebtForDebtor(item.id) > 0 && (item.email || item.phone) && (
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
                {debtors.filter(debtor => !deletedDebtorIds.has(debtor.id)).length}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Cobranças
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                R$ {debtors
                  .filter(debtor => !deletedDebtorIds.has(debtor.id))
                  .reduce((sum, debtor) => sum + getLocalTotalPendingDebtForDebtor(debtor.id), 0)
                  .toFixed(2)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Total Pendente
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {debtors
                  .filter(debtor => !deletedDebtorIds.has(debtor.id))
                  .reduce((sum, debtor) => sum + getLocalPendingDebtsForDebtor(debtor.id), 0)}
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
            data={debtors.filter(debtor => !deletedDebtorIds.has(debtor.id))}
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
            totalDebt: getLocalTotalPendingDebtForDebtor(selectedDebtor.id),
            pendingDebts: getLocalPendingDebtsForDebtor(selectedDebtor.id),
            overdueDebts: 0 // TODO: Implement overdue calculation when needed
          } : null}
          debts={selectedDebtor ? getDebtsByDebtorId(selectedDebtor.id)
            .filter((debt: ApiDebt) => !deletedDebtIds.has(debt.id))
            .map((debt: ApiDebt) => ({
              ...debt,
              originalAmount: debt.totalAmount, // Use totalAmount as originalAmount for API debts
              isInstallment: false, // API debts don't have installment info yet
              dueDate: debt.dueDate ? new Date(debt.dueDate) : new Date(), // Convert string to Date
              installments: [], // No installments from API yet
            })) : []}
          onClose={() => setShowDebtDetails(false)}
          onMarkInstallmentPaid={handleMarkInstallmentPaid}
          onMarkDebtPaid={handleMarkDebtPaid}
          onMarkPartialPayment={handleMarkPartialPayment}
          onAddNewDebt={handleAddNewDebt}
          onEditDebt={handleEditDebt}
          onDeleteDebt={handleDeleteDebt}
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