// src/components/CustomButton/index.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { styles } from "./styles";

// O componente aceitará uma prop 'title' e todas as outras de um TouchableOpacity
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "ghost"; // Nossa nova prop de variante!
}

export default function CustomButton({
  title,
  variant = "primary",
  ...props
}: CustomButtonProps) {
  // Escolhe o estilo do container baseado na variante
  const containerStyle: StyleProp<ViewStyle> = [
    styles.buttonContainer,
    variant === "primary" ? styles.primaryContainer : styles.ghostContainer,
  ];

  // Escolhe o estilo do texto baseado na variante
  const textStyle: StyleProp<TextStyle> = [
    styles.buttonText,
    variant === "primary" ? styles.primaryText : styles.ghostText,
  ];

  return (
    // Aplicamos os estilos dinâmicos aqui
    // A 'style' prop que vem do TouchableOpacityProps pode sobrescrever nossos estilos
    <TouchableOpacity style={[containerStyle, props.style]} {...props}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}
