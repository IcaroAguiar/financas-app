// src/components/CustomInput/index.tsx
import React, { useState } from "react";
import { TextInput, TextInputProps, View, TouchableOpacity } from "react-native";
import Icon from "@/components/Icon";
import { styles } from "./styles";
import { theme } from "@/styles/theme";

interface CustomInputProps extends TextInputProps {
  showPasswordToggle?: boolean;
}

export default function CustomInput({ showPasswordToggle, secureTextEntry, ...props }: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Determina se deve mostrar o toggle baseado na prop ou se secureTextEntry está ativado
  const shouldShowToggle = showPasswordToggle || secureTextEntry;
  
  // Controla a visibilidade da senha
  const actualSecureTextEntry = shouldShowToggle ? (secureTextEntry && !isPasswordVisible) : secureTextEntry;

  if (shouldShowToggle) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputWithIcon}
          placeholderTextColor="#999"
          secureTextEntry={actualSecureTextEntry}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
}
