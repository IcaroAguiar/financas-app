// @/components/DashboardCard/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
  seeAllText?: string;
}

export default function DashboardCard({ title, children, onSeeAll, seeAllText = "Ver todas" }: DashboardCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>{seeAllText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}