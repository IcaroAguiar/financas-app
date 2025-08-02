// @/components/AddTransactionModal/index.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./styles";
import CustomInput from "@/components/CustomInput";
import { TransactionType } from "@/types/transactions";
import CustomButton from "@/components/CustomButton";
import { theme } from "@/styles/theme";
import { CreateTransactionData } from '@/api/transactionService';


interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<CreateTransactionData, "date">) => void;
  initialType?: TransactionType;
}

export default function AddTransactionModal({
  visible,
  onClose,
  onSave,
  initialType = "DESPESA",
}: AddTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>(initialType);

  // Update type when initialType changes
  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const handleSave = () => {
    // Validação
    if (!description || !amount) {
      Alert.alert("Erro", "Descrição e valor são obrigatórios.");
      return;
    }
    // Lógica para salvar virá no Dia 9
    onSave({ description, amount: parseFloat(amount), type });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={50}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalView}>
          <Text style={styles.title}>Nova Transação</Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "DESPESA"
                  ? styles.typeButtonSelected
                  : styles.typeButtonUnselected,
              ]}
              onPress={() => setType("DESPESA")}
            >
              <Text
                style={[
                  styles.typeText,
                  type === "DESPESA"
                    ? styles.typeTextSelected
                    : styles.typeTextUnselected,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "RECEITA"
                  ? styles.typeButtonSelected
                  : styles.typeButtonUnselected,
              ]}
              onPress={() => setType("RECEITA")}
            >
              <Text
                style={[
                  styles.typeText,
                  type === "RECEITA"
                    ? styles.typeTextSelected
                    : styles.typeTextUnselected,
                ]}
              >
                Recebimento
              </Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            placeholder="Descrição (Ex: Supermercado)"
            value={description}
            onChangeText={setDescription}
          />
          <CustomInput
            placeholder="Valor (Ex: 150.00)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <View style={styles.actionButtonsContainer}>
            {/* Botão de Cancelar agora tem largura controlada */}
            <View style={styles.buttonWrapper}>
              <CustomButton
                title="Cancelar"
                variant="ghost"
                onPress={onClose}
              />
            </View>

            {/* Botão de Salvar também */}
            <View style={styles.buttonWrapper}>
              <CustomButton title="Salvar" onPress={handleSave} />
            </View>
          </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}
