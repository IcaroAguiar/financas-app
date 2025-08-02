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

  // Fix dynamic style references to ensure they exist
  const getVariantContainerStyle = () => {
    switch (variant) {
      case 'primary': return styles.primaryContainer;
      case 'secondary': return styles.secondaryContainer;
      case 'outline': return styles.outlineContainer;
      case 'danger': return styles.dangerContainer;
      case 'ghost': return styles.ghostContainer;
      default: return styles.primaryContainer;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'primary': return styles.primaryText;
      case 'secondary': return styles.secondaryText;
      case 'outline': return styles.outlineText;
      case 'danger': return styles.dangerText;
      case 'ghost': return styles.ghostText;
      default: return styles.primaryText;
    }
  };

  const getSizeContainerStyle = () => {
    switch (size) {
      case 'small': return styles.smallContainer;
      case 'medium': return styles.mediumContainer;
      case 'large': return styles.largeContainer;
      default: return styles.mediumContainer;
    }
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case 'small': return styles.smallText;
      case 'medium': return styles.mediumText;
      case 'large': return styles.largeText;
      default: return styles.mediumText;
    }
  };

  const containerStyle: StyleProp<ViewStyle> = [
    styles.buttonContainer,
    getVariantContainerStyle(),
    getSizeContainerStyle(),
    isDisabled && styles.disabledContainer,
  ];

  const finalTextStyle: StyleProp<TextStyle> = [
    styles.buttonText,
    getVariantTextStyle(),
    getSizeTextStyle(),
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
