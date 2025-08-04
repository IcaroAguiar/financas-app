import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { CreateDebtorData } from '@/api/debtorService';

interface AddDebtorModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDebtorData) => Promise<void>;
}

export default function AddDebtorModal({ visible, onClose, onSubmit }: AddDebtorModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      Alert.alert('Erro', 'Email inválido');
      return false;
    }

    if (phone && !phone.match(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)) {
      // Format validation for Brazilian phone numbers
      if (!phone.match(/^\d{10,11}$/)) {
        Alert.alert('Erro', 'Telefone deve ter 10 ou 11 dígitos');
        return false;
      }
    }

    return true;
  };

  const formatPhone = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // Apply Brazilian phone format
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const debtorData: CreateDebtorData = {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      };

      await onSubmit(debtorData);
      Alert.alert('Sucesso', 'Cobrança criada com sucesso!');
      handleClose();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar a cobrança');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Nova Cobrança</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome da pessoa"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o email (opcional)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o telefone (opcional)"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                returnKeyType="done"
                maxLength={15}
              />
            </View>

            <Text style={styles.note}>
              * Campos obrigatórios{'\n'}
              Adicione pelo menos email ou telefone para facilitar o contato
            </Text>
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Cancelar"
              onPress={handleClose}
              variant="secondary"
              style={styles.cancelButton}
            />
            <CustomButton
              title="Criar Cobrança"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}