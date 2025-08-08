// @/components/QuickActionCard/index.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from '@/components/Icon';
import { styles } from './styles';

interface QuickActionCardProps {
  title: string;
  icon: 'plus' | 'minus' | 'users' | 'bell' | 'home' | 'home-filled' | 'list' | 'list-search' | 'user' | 
        'trending-up' | 'trending-down' | 'bar-chart' | 'mail' | 'phone' | 'calendar' | 
        'dollar-sign' | 'receipt' | 'wallet' | 'coins' | 'close' | 'alert-circle' | 'checkmark-circle' | 'clock' | 
        'help-circle';
  color: string;
  onPress: () => void;
}

export default function QuickActionCard({ title, icon, color, onPress }: QuickActionCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
    </TouchableOpacity>
  );
}