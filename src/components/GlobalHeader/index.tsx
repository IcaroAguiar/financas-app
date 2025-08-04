// @/components/GlobalHeader/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AscendLogo from '@/components/AscendLogo';
import Icon from '@/components/Icon';
import { styles } from './styles';

interface GlobalHeaderProps {
  title: string;
}

export default function GlobalHeader({ title }: GlobalHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBellPress = () => {
    // @ts-ignore - Navigation types will be complex to fix for this scope
    navigation.getParent()?.navigate('Reminders');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <AscendLogo width={30} height={30} color="#1c1c1c" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.bellButton} 
          onPress={handleBellPress}
          accessible={true}
          accessibilityLabel="Ver lembretes"
        >
          <Icon name="bell" size={22} color="#1c1c1c" />
        </TouchableOpacity>
      </View>
    </View>
  );
}