// src/components/CustomInput/index.tsx
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

// Usando 'TextInputProps', nosso componente aceitará todas as propriedades de um TextInput padrão
export default function CustomInput(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#999" // Cor para o texto do placeholder
      {...props} // Passa todas as outras props (value, onChangeText, etc.) para o TextInput
    />
  );
}
