// src/components/ConfirmationModal/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { theme } from '@/styles/theme';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancel}
      style={styles.modal}
    >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon 
                name={confirmVariant === 'danger' ? 'alert-triangle' : 'help-circle'} 
                size={24} 
                color={confirmVariant === 'danger' ? theme.colors.danger : theme.colors.primary} 
              />
            </View>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.message} numberOfLines={3} ellipsizeMode="tail">{message}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <CustomButton
              title={cancelText}
              variant="secondary"
              onPress={onCancel}
              style={styles.button}
              disabled={loading}
            />
            <CustomButton
              title={confirmText}
              variant={confirmVariant}
              onPress={onConfirm}
              style={styles.button}
              loading={loading}
            />
          </View>
        </View>
    </Modal>
  );
};

export default ConfirmationModal;