import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { styles } from './styles';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import { theme } from '@/styles/theme';

interface CreateCategoryData {
  name: string;
  color?: string;
}

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (categoryData: CreateCategoryData) => Promise<void>;
}

const COLOR_OPTIONS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#A569BD'
];

export default function AddCategoryModal({
  visible,
  onClose,
  onSave,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome da categoria.');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        name: name.trim(),
        color: selectedColor,
      });
      
      // Reset form
      setName('');
      setSelectedColor(COLOR_OPTIONS[0]);
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedColor(COLOR_OPTIONS[0]);
    onClose();
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
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
          >
            <Icon name="x" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Nova Categoria</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.inputLabel}>Nome da Categoria</Text>
          <CustomInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Alimentação, Transporte..."
            autoFocus
          />

          <View style={styles.colorSection}>
            <Text style={styles.colorLabel}>Cor da Categoria</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Icon name="check" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title="Criar Categoria"
            onPress={handleSave}
            loading={loading}
            variant="primary"
          />
        </View>
      </View>
    </Modal>
  );
}