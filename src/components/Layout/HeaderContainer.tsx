// src/components/Layout/HeaderContainer.tsx
import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

interface HeaderContainerProps {
  height?: number | string;
  padding?: number;
  backgroundColor?: string;
  gradient?: boolean;
  safeAreaTop?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function HeaderContainer({
  height = 50,
  padding = 12,
  backgroundColor = '#FFFFFF',
  gradient = false,
  safeAreaTop = true,
  children,
  style,
}: HeaderContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    {
      height: typeof height === 'number' ? height : undefined,
      padding,
      backgroundColor: gradient ? 'transparent' : backgroundColor,
      paddingTop: safeAreaTop ? insets.top + (padding / 2) : padding,
    },
    style,
  ];

  if (gradient) {
    // Se gradient for implementado no futuro, adicione LinearGradient aqui
    return (
      <View style={containerStyle}>
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
}