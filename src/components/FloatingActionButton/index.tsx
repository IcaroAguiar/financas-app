// @/components/FloatingActionButton/index.tsx
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "@/styles/theme";

export default function FloatingActionButton(props: TouchableOpacityProps) {
  return (
    <TouchableOpacity style={styles.container} {...props}>
      <Ionicons name="add" size={32} color={theme.colors.surface} />
    </TouchableOpacity>
  );
}
