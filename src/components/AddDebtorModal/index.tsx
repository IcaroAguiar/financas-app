import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { CreateDebtorData, CreateDebtData } from '@/api/debtorService';

interface AddDebtorModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (debtorData: CreateDebtorData, debtData: CreateDebtData) => Promise<void>;
}

export default function AddDebtorModal({ visible, onClose, onSubmit }: AddDebtorModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDescription, setDebtDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Payment plan states
  const [isInstallmentPlan, setIsInstallmentPlan] = useState(false);
  const [installmentCount, setInstallmentCount] = useState('1');
  const [installmentFrequency, setInstallmentFrequency] = useState<'MONTHLY' | 'WEEKLY'>('MONTHLY');
  const [firstInstallmentDate, setFirstInstallmentDate] = useState('');

  // Currency formatting functions
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
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
    let numericString = formattedValue.replace(/[R$\s.]/g, '');
    numericString = numericString.replace(',', '.');
    return parseFloat(numericString) || 0;
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setDebtAmount(formatted);
  };

  const formatDate = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setDueDate(formatted);
  };

  const handleFirstInstallmentDateChange = (text: string) => {
    const formatted = formatDate(text);
    setFirstInstallmentDate(formatted);
  };

  const calculateInstallmentValue = () => {
    const totalAmount = parseCurrencyToNumber(debtAmount);
    const count = parseInt(installmentCount) || 1;
    return totalAmount / count;
  };

  const formatInstallmentInfo = () => {
    if (!isInstallmentPlan) return '';
    const installmentValue = calculateInstallmentValue();
    const count = parseInt(installmentCount) || 1;
    const frequency = installmentFrequency === 'MONTHLY' ? 'mensais' : 'semanais';
    return `${count}x de ${formatCurrency((installmentValue * 100).toString())} ${frequency}`;
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDebtAmount('');
    setDebtDescription('');
    setDueDate('');
    setIsInstallmentPlan(false);
    setInstallmentCount('1');
    setInstallmentFrequency('MONTHLY');
    setFirstInstallmentDate('');
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

    if (!debtAmount || parseCurrencyToNumber(debtAmount) <= 0) {
      Alert.alert('Erro', 'Valor da dívida é obrigatório e deve ser maior que zero');
      return false;
    }

    if (!debtDescription.trim()) {
      Alert.alert('Erro', 'Descrição da dívida é obrigatória');
      return false;
    }

    if (!isInstallmentPlan && !dueDate.trim()) {
      Alert.alert('Erro', 'Data de vencimento é obrigatória');
      return false;
    }

    if (isInstallmentPlan) {
      if (!firstInstallmentDate.trim()) {
        Alert.alert('Erro', 'Data da primeira parcela é obrigatória');
        return false;
      }

      const count = parseInt(installmentCount);
      if (!count || count < 1 || count > 48) {
        Alert.alert('Erro', 'Número de parcelas deve ser entre 1 e 48');
        return false;
      }
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

      const debtData: CreateDebtData = {
        description: debtDescription.trim(),
        totalAmount: parseCurrencyToNumber(debtAmount),
        dueDate: dueDate.trim(),
        debtorId: '', // Will be filled by the handler after debtor creation
      };

      await onSubmit(debtorData, debtData);
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Nova Cobrança</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.content} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.form}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
                returnKeyType="next"
                maxLength={15}
              />
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Informações da Dívida</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor da Dívida *</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 0,00"
                value={debtAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição da Dívida *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Empréstimo pessoal, Material de construção..."
                value={debtDescription}
                onChangeText={setDebtDescription}
                autoCapitalize="sentences"
                returnKeyType="next"
                multiline
                numberOfLines={2}
              />
            </View>

            {!isInstallmentPlan && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Vencimento *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={dueDate}
                  onChangeText={handleDateChange}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={10}
                />
              </View>
            )}

            {/* Payment Plan Section */}
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Plano de Pagamento</Text>

            <View style={styles.paymentPlanToggle}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsInstallmentPlan(!isInstallmentPlan)}
              >
                <View style={[styles.checkbox, isInstallmentPlan && styles.checkboxChecked]}>
                  {isInstallmentPlan && <Icon name="check" size={16} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>Parcelar pagamento</Text>
              </TouchableOpacity>
            </View>

            {isInstallmentPlan && (
              <>
                <View style={styles.installmentRow}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Nº de Parcelas *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="2"
                      value={installmentCount}
                      onChangeText={setInstallmentCount}
                      keyboardType="numeric"
                      returnKeyType="next"
                      maxLength={2}
                    />
                  </View>
                  
                  <View style={[styles.inputGroup, { flex: 2, marginLeft: 8 }]}>
                    <Text style={styles.label}>Frequência</Text>
                    <View style={styles.frequencySelector}>
                      <TouchableOpacity
                        style={[
                          styles.frequencyButton,
                          installmentFrequency === 'MONTHLY' && styles.frequencyButtonSelected
                        ]}
                        onPress={() => setInstallmentFrequency('MONTHLY')}
                      >
                        <Text style={[
                          styles.frequencyButtonText,
                          installmentFrequency === 'MONTHLY' && styles.frequencyButtonTextSelected
                        ]}>
                          Mensal
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.frequencyButton,
                          installmentFrequency === 'WEEKLY' && styles.frequencyButtonSelected
                        ]}
                        onPress={() => setInstallmentFrequency('WEEKLY')}
                      >
                        <Text style={[
                          styles.frequencyButtonText,
                          installmentFrequency === 'WEEKLY' && styles.frequencyButtonTextSelected
                        ]}>
                          Semanal
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Data da 1ª Parcela *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    value={firstInstallmentDate}
                    onChangeText={handleFirstInstallmentDateChange}
                    keyboardType="numeric"
                    returnKeyType="done"
                    maxLength={10}
                  />
                </View>

                {debtAmount && installmentCount && parseInt(installmentCount) > 1 && (
                  <View style={styles.installmentPreview}>
                    <Text style={styles.previewLabel}>Resumo do Parcelamento:</Text>
                    <Text style={styles.previewText}>{formatInstallmentInfo()}</Text>
                  </View>
                )}
              </>
            )}

            <Text style={styles.note}>
              * Campos obrigatórios{'\n'}
              Adicione pelo menos email ou telefone para facilitar o contato
            </Text>
          </ScrollView>

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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}