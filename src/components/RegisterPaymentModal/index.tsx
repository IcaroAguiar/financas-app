// src/components/RegisterPaymentModal/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Icon from '@/components/Icon';
import { createPayment } from '@/api/debtorService';

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
      Alert.alert('Erro', 'Por favor, informe um valor válido para o pagamento.');
      return false;
    }
    
    if (amountValue > remainingAmount) {
      Alert.alert(
        'Valor Excedente', 
        `O valor informado (${formatCurrency(amountValue)}) é maior que o valor restante da dívida (${formatCurrency(remainingAmount)}). Deseja continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => submitPayment() }
        ]
      );
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
      
      Alert.alert(
        'Sucesso', 
        `Pagamento de ${formatCurrency(amountValue)} registrado com sucesso!`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              handleClose();
              onPaymentCreated();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      Alert.alert('Erro', 'Não foi possível registrar o pagamento. Tente novamente.');
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
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="x" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Registrar Pagamento</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        </ScrollView>

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
      </KeyboardAvoidingView>
    </Modal>
  );
}