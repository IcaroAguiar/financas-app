// @/components/QuickActionsModal/index.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import Icon from '@/components/Icon';
import CustomButton from '@/components/CustomButton';

interface QuickActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTransaction: () => void;
  onAddReminder: () => void;
  onAddDebtor: () => void;
  onAddSubscription: () => void;
}

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function QuickActionsModal({
  visible,
  onClose,
  onAddTransaction,
  onAddReminder,
  onAddDebtor,
  onAddSubscription,
}: QuickActionsModalProps) {
  
  const quickActions: QuickActionItem[] = [
    {
      id: 'transaction',
      title: 'Nova Transação',
      description: 'Registrar receita ou despesa',
      icon: 'dollar-sign',
      color: '#007AFF',
      onPress: onAddTransaction,
    },
    {
      id: 'reminder',
      title: 'Novo Lembrete',
      description: 'Criar lembrete de pagamento',
      icon: 'bell',
      color: '#FF9500',
      onPress: onAddReminder,
    },
    {
      id: 'subscription',
      title: 'Nova Assinatura',
      description: 'Criar assinatura recorrente',
      icon: 'calendar',
      color: '#AF52DE',
      onPress: onAddSubscription,
    },
    {
      id: 'debtor',
      title: 'Nova Cobrança',
      description: 'Registrar nova dívida a receber',
      icon: 'users',
      color: '#34C759',
      onPress: onAddDebtor,
    },
  ];

  const handleActionPress = (action: QuickActionItem) => {
    action.onPress();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Ações Rápidas</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionsContainer}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionItem}
                  onPress={() => handleActionPress(action)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <Icon name={action.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#C7C7CC" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.cancelButtonContainer}>
              <CustomButton
                title="Cancelar"
                variant="ghost"
                onPress={onClose}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}