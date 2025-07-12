// src/components/CustomButton/index.tsx
import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

// O componente aceitará uma prop 'title' e todas as outras de um TouchableOpacity
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

// Usamos TouchableOpacity para ter controle total sobre o estilo
export default function CustomButton({ title, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
