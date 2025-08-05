import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { theme } from '@/styles/theme';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { useToast } from '@/hooks/useToast';

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  isCompleted: boolean;
  type: 'payment' | 'transaction' | 'custom';
}

interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
}

export default function AddReminderModal({ visible, onClose, onSubmit }: AddReminderModalProps) {
  const { showConfirmation } = useConfirmation();
  const toast = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<'payment' | 'transaction' | 'custom'>('custom');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setType('custom');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.showError({ message: 'Título é obrigatório' });
      return false;
    }

    if (!description.trim()) {
      toast.showError({ message: 'Descrição é obrigatória' });
      return false;
    }

    if (date < new Date()) {
      toast.showError({ message: 'A data deve ser futura' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const reminderData = {
        title: title.trim(),
        description: description.trim(),
        date,
        type,
      };

      onSubmit(reminderData);
      toast.showSuccess({ message: 'Lembrete criado com sucesso!' });
      handleClose();
    } catch (error: any) {
      toast.showError({ message: error.message || 'Não foi possível criar o lembrete' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const TypeButton = ({ 
    reminderType, 
    icon, 
    label, 
    selected 
  }: { 
    reminderType: 'payment' | 'transaction' | 'custom', 
    icon: 'credit-card' | 'trending-up' | 'bell', 
    label: string, 
    selected: boolean 
  }) => (
    <TouchableOpacity
      style={[styles.typeButton, selected && styles.typeButtonSelected]}
      onPress={() => setType(reminderType)}
    >
      <Icon 
        name={icon} 
        size={24} 
        color={selected ? theme.colors.surface : theme.colors.textSecondary} 
      />
      <Text style={[styles.typeButtonText, selected && styles.typeButtonTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Novo Lembrete</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraHeight={120}
          extraScrollHeight={120}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Lembrete</Text>
              <View style={styles.typeSelector}>
                <TypeButton
                  reminderType="payment"
                  icon="credit-card"
                  label="Pagamento"
                  selected={type === 'payment'}
                />
                <TypeButton
                  reminderType="transaction"
                  icon="trending-up"
                  label="Transação"
                  selected={type === 'transaction'}
                />
                <TypeButton
                  reminderType="custom"
                  icon="bell"
                  label="Personalizado"
                  selected={type === 'custom'}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o título do lembrete"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite uma descrição detalhada"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoCapitalize="sentences"
                returnKeyType="done"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data e Hora *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateButtonContent}>
                  <View>
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                    <Text style={styles.timeText}>{formatTime(date)}</Text>
                  </View>
                  <Icon name="calendar" size={24} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.note}>
              * Campos obrigatórios{'\n'}
              O lembrete será exibido na tela de lembretes na data selecionada
            </Text>

            <View style={styles.actions}>
              <CustomButton
                title="Cancelar"
                onPress={handleClose}
                variant="secondary"
                style={styles.cancelButton}
              />
              <CustomButton
                title="Criar Lembrete"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
}