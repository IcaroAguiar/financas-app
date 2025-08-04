// @/components/CentralActionButton/index.tsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import Icon from '@/components/Icon';

interface CentralActionButtonProps {
  onPress: () => void;
}

export default function CentralActionButton({ onPress }: CentralActionButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onPress}
        accessible={true}
        accessibilityLabel="Ações rápidas"
        activeOpacity={0.8}
      >
        <View style={styles.innerCircle}>
          <Icon name="plus" size={28} color="#ffffff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}