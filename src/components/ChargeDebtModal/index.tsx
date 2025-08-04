// @/components/ChargeDebtModal/index.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';

interface ChargeDebtModalProps {
  visible: boolean;
  debtorName: string;
  hasWhatsApp: boolean;
  hasEmail: boolean;
  onWhatsApp: () => void;
  onEmail: () => void;
  onClose: () => void;
}

export default function ChargeDebtModal({
  visible,
  debtorName,
  hasWhatsApp,
  hasEmail,
  onWhatsApp,
  onEmail,
  onClose,
}: ChargeDebtModalProps) {
  if (!hasWhatsApp && !hasEmail) {
    return null; // Don't render if no contact options
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cobrar Dívida</Text>
          <Text style={styles.modalDescription}>
            Como deseja entrar em contato com {debtorName}?
          </Text>
          
          <View style={styles.actionButtons}>
            {hasWhatsApp && (
              <CustomButton
                title="WhatsApp"
                variant="primary"
                onPress={onWhatsApp}
                style={styles.actionButton}
                icon={<Icon name="message-circle" size={18} color="#ffffff" />}
                iconPosition="left"
              />
            )}
            
            {hasEmail && (
              <CustomButton
                title="Email"
                variant="primary"
                onPress={onEmail}
                style={styles.actionButton}
                icon={<Icon name="mail" size={18} color="#ffffff" />}
                iconPosition="left"
              />
            )}
          </View>
          
          <CustomButton
            title="Cancelar"
            variant="secondary"
            onPress={onClose}
            style={styles.cancelButton}
          />
        </View>
      </View>
    </Modal>
  );
}