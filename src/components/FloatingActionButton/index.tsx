// @/components/FloatingActionButton/index.tsx
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon from "@/components/Icon";
import { styles } from "./styles";
import { theme } from "@/styles/theme";

export default function FloatingActionButton(props: TouchableOpacityProps) {
  return (
    <TouchableOpacity style={styles.container} {...props}>
      <Icon name="plus" size={32} color={theme.colors.surface} />
    </TouchableOpacity>
  );
}
