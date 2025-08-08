// src/components/RegisterPaymentModal/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Icon from '@/components/Icon';
import { createPayment, getDebtById, updateDebtNotification } from '@/api/debtorService';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { useToast } from '@/hooks/useToast';
import { cancelScheduledNotification } from '@/utils/notifications';

interface RegisterPaymentModalProps {
  visible: boolean;
  debtId: string;
  debtorName: string;
  remainingAmount: number;
  onClose: () => void;
  onPaymentCreated: () => void;
}

export default function RegisterPaymentModal({
  visible,
  debtId,
  debtorName,
  remainingAmount,
  onClose,
  onPaymentCreated
}: RegisterPaymentModalProps) {
  const { showConfirmation } = useConfirmation();
  const toast = useToast();
  
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setAmount('');
    setPaymentDate(new Date());
    setNotes('');
    setShowDatePicker(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const parseCurrencyInput = (input: string): number => {
    // Remove currency symbols and convert comma to dot
    const cleaned = input.replace(/[R$\s]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrencyInput = (input: string): string => {
    const value = parseCurrencyInput(input);
    if (value === 0) return '';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAmountChange = (text: string) => {
    // Allow only numbers, comma, and dot
    const cleaned = text.replace(/[^0-9,\.]/g, '');
    setAmount(cleaned);
  };

  const validateForm = (): boolean => {
    const amountValue = parseCurrencyInput(amount);
    
    if (amountValue <= 0) {
      toast.showError({ message: 'Por favor, informe um valor válido para o pagamento.' });
      return false;
    }
    
    if (amountValue > remainingAmount) {
      showConfirmation({
        title: 'Valor Excedente',
        message: `O valor informado (${formatCurrency(amountValue)}) é maior que o valor restante da dívida (${formatCurrency(remainingAmount)}). Deseja continuar?`,
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        confirmVariant: 'primary',
        onConfirm: () => submitPayment()
      });
      return false;
    }
    
    return true;
  };

  const submitPayment = async () => {
    const amountValue = parseCurrencyInput(amount);
    
    setLoading(true);
    try {
      const paymentData = {
        amount: amountValue,
        ...(paymentDate && { paymentDate: paymentDate.toISOString() }),
        ...(notes.trim() && { notes: notes.trim() })
      };
      
      await createPayment(debtId, paymentData);
      
      // Check if debt is now fully paid and cancel notification if needed
      try {
        const updatedDebt = await getDebtById(debtId);
        if (updatedDebt.status === 'PAGA' && updatedDebt.notificationId) {
          // Cancel the scheduled notification
          const cancelled = await cancelScheduledNotification(updatedDebt.notificationId);
          if (cancelled) {
            // Remove the notificationId from the debt record
            await updateDebtNotification(debtId, null);
            console.log(`Lembrete cancelado para dívida paga: ${debtId}`);
          }
        }
      } catch (notificationError) {
        // Don't fail the payment process if notification cancellation fails
        console.warn('Erro ao cancelar lembrete:', notificationError);
      }
      
      toast.showSuccess({ message: `Pagamento de ${formatCurrency(amountValue)} registrado com sucesso!` });
      handleClose();
      onPaymentCreated();
    } catch (error) {
      toast.showError({ message: 'Não foi possível registrar o pagamento. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      submitPayment();
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="x" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Registrar Pagamento</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAwareScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraHeight={120}
          extraScrollHeight={120}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.debtInfo}>
            <Text style={styles.debtorName}>{debtorName}</Text>
            <Text style={styles.remainingAmountText}>
              Valor restante: {formatCurrency(remainingAmount)}
            </Text>
          </View>

          {/* Amount Input - Required */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Valor do Pagamento <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.currencyInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0,00"
                placeholderTextColor={theme.colors.textLight}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Payment Date - Optional */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Data do Pagamento</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(paymentDate)}</Text>
              <Icon name="calendar" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Notes - Optional */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Observações</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Pagamento via PIX, transferência bancária..."
              placeholderTextColor={theme.colors.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
          </View>

          <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Registrando...' : 'Registrar Pagamento'}
            </Text>
          </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={paymentDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
}