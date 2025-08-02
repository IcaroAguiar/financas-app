// @/components/GlobalHeader/index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AscendLogo from '@/components/AscendLogo';
import { styles } from './styles';

interface GlobalHeaderProps {
  title: string;
}

export default function GlobalHeader({ title }: GlobalHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <AscendLogo width={30} height={30} color="#1c1c1c" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}