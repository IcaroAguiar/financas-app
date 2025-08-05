// src/components/AddEditAccountModal/index.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { useAccounts } from '@/contexts/AccountContext';
import { Account, CreateAccountRequest, UpdateAccountRequest } from '@/api/accountService';
import { useToast } from '@/hooks/useToast';

interface AddEditAccountModalProps {
  visible: boolean;
  onClose: () => void;
  account?: Account | null;
  onAccountSaved?: () => void;
}

const ACCOUNT_TYPES = [
  'Conta Corrente',
  'Conta Poupança',
  'Cartão de Crédito',
  'Carteira',
  'Investimento',
  'Outro'
];

export default function AddEditAccountModal({ visible, onClose, account, onAccountSaved }: AddEditAccountModalProps) {
  const { addAccount, editAccount } = useAccounts();
  const toast = useToast();
  
  const [name, setName] = useState('');
  const [type, setType] = useState('Conta Corrente');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const isEditing = Boolean(account);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type);
      setBalance(account.balance?.toString() || '0');
    } else {
      resetForm();
    }
  }, [account, visible]);

  const resetForm = () => {
    setName('');
    setType('Conta Corrente');
    setBalance('');
    setShowTypePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Converte para centavos
    const cents = parseInt(numbers, 10);
    
    if (isNaN(cents)) return '';
    
    // Converte para reais
    const reais = cents / 100;
    
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleBalanceChange = (value: string) => {
    const formatted = formatCurrency(value);
    setBalance(formatted);
  };

  const parseBalance = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    
    // Remove pontos e vírgulas, converte vírgula para ponto
    const cleaned = formattedValue.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    
    return isNaN(parsed) ? 0 : parsed;
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.showError({ message: 'Nome da conta é obrigatório' });
      return false;
    }

    if (!type) {
      toast.showError({ message: 'Tipo da conta é obrigatório' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const accountData = {
        name: name.trim(),
        type,
        balance: parseBalance(balance),
      };

      if (isEditing && account) {
        await editAccount(account.id, accountData as UpdateAccountRequest);
        toast.showSuccess({ message: 'Conta atualizada com sucesso!' });
      } else {
        await addAccount(accountData as CreateAccountRequest);
        toast.showSuccess({ message: 'Conta criada com sucesso!' });
      }

      handleClose();
      onAccountSaved?.(); // Call the callback if provided
    } catch (error: any) {
      toast.showError({ message: error.message || 'Erro ao salvar conta' });
    } finally {
      setLoading(false);
    }
  };

  const renderTypePicker = () => (
    <View style={styles.typePickerContainer}>
      <Text style={styles.typePickerTitle}>Selecione o tipo da conta:</Text>
      {ACCOUNT_TYPES.map((accountType) => (
        <TouchableOpacity
          key={accountType}
          style={[
            styles.typeOption,
            type === accountType && styles.typeOptionSelected
          ]}
          onPress={() => {
            setType(accountType);
            setShowTypePicker(false);
          }}
        >
          <Text style={[
            styles.typeOptionText,
            type === accountType && styles.typeOptionTextSelected
          ]}>
            {accountType}
          </Text>
          {type === accountType && (
            <Icon name="check" size={16} color="#007AFF" />
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.cancelTypeSelection}
        onPress={() => setShowTypePicker(false)}
      >
        <Text style={styles.cancelTypeText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Editar Conta' : 'Nova Conta'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView 
            contentContainerStyle={styles.form}
            enableOnAndroid={true}
            extraHeight={120}
            extraScrollHeight={120}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome da Conta *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Nubank, Bradesco, Carteira..."
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo *</Text>
              <TouchableOpacity
                style={styles.typeSelector}
                onPress={() => setShowTypePicker(true)}
              >
                <Text style={styles.typeSelectorText}>{type}</Text>
                <Icon name="chevron-down" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Saldo Inicial</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={balance}
                  onChangeText={handleBalanceChange}
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.hint}>
                O saldo inicial pode ser ajustado posteriormente
              </Text>
            </View>
          </KeyboardAwareScrollView>

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

          {showTypePicker && renderTypePicker()}
        </View>
      </View>
    </Modal>
  );
}