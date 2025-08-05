// src/components/AddSubscriptionModal/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { useCategories } from '@/contexts/CategoryContext';
import { useAccounts } from '@/contexts/AccountContext';
import { Subscription, CreateSubscriptionData, UpdateSubscriptionData, SubscriptionFrequency, TransactionType, formatFrequency } from '@/api/subscriptionService';
import { theme } from '@/styles/theme';
import { useToast } from '@/hooks/useToast';

interface AddSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

const FREQUENCIES: SubscriptionFrequency[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
const TRANSACTION_TYPES: TransactionType[] = ['RECEITA', 'DESPESA'];

export default function AddSubscriptionModal({ visible, onClose, subscription }: AddSubscriptionModalProps) {
  const { addSubscription, updateSubscriptionById } = useSubscriptions();
  const { categories } = useCategories();
  const { accounts } = useAccounts();
  const toast = useToast();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('DESPESA');
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const isEditing = Boolean(subscription);

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setDescription(subscription.description || '');
      setAmount(formatCurrency((subscription.amount * 100).toString()));
      setType(subscription.type);
      setFrequency(subscription.frequency);
      setStartDate(subscription.startDate.split('T')[0]); // Extract date part
      setEndDate(subscription.endDate ? subscription.endDate.split('T')[0] : '');
      setSelectedCategoryId(subscription.categoryId);
      setSelectedAccountId(subscription.accountId);
    } else {
      resetForm();
    }
  }, [subscription, visible]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setAmount('');
    setType('DESPESA');
    setFrequency('MONTHLY');
    setStartDate(new Date().toISOString().split('T')[0]); // Today's date
    setEndDate('');
    setSelectedCategoryId(undefined);
    setSelectedAccountId(undefined);
    setShowTypePicker(false);
    setShowFrequencyPicker(false);
    setShowCategoryPicker(false);
    setShowAccountPicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Currency formatting
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\\D/g, '');
    if (!numericValue) return '';
    const cents = parseInt(numericValue, 10);
    const reais = cents / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);
  };

  const parseCurrencyToNumber = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    let numericString = formattedValue.replace(/[R$\\s.]/g, '');
    numericString = numericString.replace(',', '.');
    return parseFloat(numericString) || 0;
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.showError({ message: 'Nome da assinatura é obrigatório' });
      return false;
    }

    if (!amount || parseCurrencyToNumber(amount) <= 0) {
      toast.showError({ message: 'Valor deve ser maior que zero' });
      return false;
    }

    if (!startDate) {
      toast.showError({ message: 'Data de início é obrigatória' });
      return false;
    }

    // Validate end date if provided
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      toast.showError({ message: 'Data de fim deve ser posterior à data de início' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const subscriptionData = {
        name: name.trim(),
        description: description.trim() || undefined,
        amount: parseCurrencyToNumber(amount),
        type,
        frequency,
        startDate,
        endDate: endDate || undefined,
        categoryId: selectedCategoryId,
        accountId: selectedAccountId,
      };

      if (isEditing && subscription) {
        await updateSubscriptionById(subscription.id, subscriptionData as UpdateSubscriptionData);
        toast.showSuccess({ message: 'Assinatura atualizada com sucesso!' });
      } else {
        await addSubscription(subscriptionData as CreateSubscriptionData);
        toast.showSuccess({ message: 'Assinatura criada com sucesso!' });
      }

      handleClose();
    } catch (error: any) {
      toast.showError({ message: error.message || 'Erro ao salvar assinatura' });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return 'Nenhuma';
    const category = categories.find(cat => cat.id === selectedCategoryId);
    return category ? category.name : 'Nenhuma';
  };

  const getSelectedAccountName = () => {
    if (!selectedAccountId) return 'Nenhuma';
    const account = accounts.find(acc => acc.id === selectedAccountId);
    return account ? account.name : 'Nenhuma';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Editar Assinatura' : 'Nova Assinatura'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome da Assinatura *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Netflix, Spotify, Academia..."
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição adicional..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor *</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo *</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowTypePicker(true)}
              >
                <Text style={styles.selectorText}>
                  {type === 'RECEITA' ? 'Receita' : 'Despesa'}
                </Text>
                <Icon name="chevron-down" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>

            {/* Frequency */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Frequência *</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowFrequencyPicker(true)}
              >
                <Text style={styles.selectorText}>{formatFrequency(frequency)}</Text>
                <Icon name="chevron-down" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>

            {/* Start Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Início *</Text>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#999"
              />
            </View>

            {/* End Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Fim (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#999"
              />
              <Text style={styles.hint}>
                Deixe vazio para assinatura sem data de término
              </Text>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria (Opcional)</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={styles.selectorText}>{getSelectedCategoryName()}</Text>
                <Icon name="chevron-down" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>

            {/* Account */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Conta (Opcional)</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowAccountPicker(true)}
              >
                <Text style={styles.selectorText}>{getSelectedAccountName()}</Text>
                <Icon name="chevron-down" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              title="Cancelar"
              variant="secondary"
              onPress={handleClose}
              style={styles.footerButton}
            />
            <CustomButton
              title={isEditing ? 'Salvar' : 'Criar'}
              variant="primary"
              onPress={handleSubmit}
              loading={loading}
              style={styles.footerButton}
            />
          </View>

          {/* Type Picker */}
          {showTypePicker && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Selecione o tipo:</Text>
                {TRANSACTION_TYPES.map((transactionType) => (
                  <TouchableOpacity
                    key={transactionType}
                    style={[
                      styles.pickerOption,
                      type === transactionType && styles.pickerOptionSelected
                    ]}
                    onPress={() => {
                      setType(transactionType);
                      setShowTypePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      type === transactionType && styles.pickerOptionTextSelected
                    ]}>
                      {transactionType === 'RECEITA' ? 'Receita' : 'Despesa'}
                    </Text>
                    {type === transactionType && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.pickerCancel}
                  onPress={() => setShowTypePicker(false)}
                >
                  <Text style={styles.pickerCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Frequency Picker */}
          {showFrequencyPicker && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Selecione a frequência:</Text>
                {FREQUENCIES.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.pickerOption,
                      frequency === freq && styles.pickerOptionSelected
                    ]}
                    onPress={() => {
                      setFrequency(freq);
                      setShowFrequencyPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      frequency === freq && styles.pickerOptionTextSelected
                    ]}>
                      {formatFrequency(freq)}
                    </Text>
                    {frequency === freq && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.pickerCancel}
                  onPress={() => setShowFrequencyPicker(false)}
                >
                  <Text style={styles.pickerCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Category Picker */}
          {showCategoryPicker && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Selecione a categoria:</Text>
                
                {/* None option */}
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    !selectedCategoryId && styles.pickerOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedCategoryId(undefined);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    !selectedCategoryId && styles.pickerOptionTextSelected
                  ]}>
                    Nenhuma
                  </Text>
                  {!selectedCategoryId && (
                    <Icon name="check" size={16} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>

                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.pickerOption,
                      selectedCategoryId === category.id && styles.pickerOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedCategoryId(category.id);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedCategoryId === category.id && styles.pickerOptionTextSelected
                    ]}>
                      {category.name}
                    </Text>
                    {selectedCategoryId === category.id && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity
                  style={styles.pickerCancel}
                  onPress={() => setShowCategoryPicker(false)}
                >
                  <Text style={styles.pickerCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Account Picker */}
          {showAccountPicker && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Selecione a conta:</Text>
                
                {/* None option */}
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    !selectedAccountId && styles.pickerOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedAccountId(undefined);
                    setShowAccountPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    !selectedAccountId && styles.pickerOptionTextSelected
                  ]}>
                    Nenhuma
                  </Text>
                  {!selectedAccountId && (
                    <Icon name="check" size={16} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>

                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.pickerOption,
                      selectedAccountId === account.id && styles.pickerOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedAccountId(account.id);
                      setShowAccountPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedAccountId === account.id && styles.pickerOptionTextSelected
                    ]}>
                      {account.name} ({account.type})
                    </Text>
                    {selectedAccountId === account.id && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity
                  style={styles.pickerCancel}
                  onPress={() => setShowAccountPicker(false)}
                >
                  <Text style={styles.pickerCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}