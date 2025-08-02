// src/components/CustomButton/index.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { styles } from "./styles";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  textStyle?: StyleProp<TextStyle>;
}

export default function CustomButton({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  textStyle,
  ...props
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.buttonContainer,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    isDisabled && styles.disabledContainer,
  ];

  const finalTextStyle: StyleProp<TextStyle> = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === "primary" || variant === "danger" ? "#ffffff" : "#2a9d8f"} 
          />
          <Text style={[finalTextStyle, { marginLeft: 8 }]}>Carregando...</Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.contentContainer}>
          {iconPosition === "left" && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={finalTextStyle}>{title}</Text>
          {iconPosition === "right" && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      );
    }

    return <Text style={finalTextStyle}>{title}</Text>;
  };

  return (
    <TouchableOpacity 
      style={[containerStyle, props.style]} 
      disabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
