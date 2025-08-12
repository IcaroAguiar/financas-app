import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface SummaryMetricCardProps {
  title: string;
  value: string;
  color: string;
  isVisible: boolean;
}

export default function SummaryMetricCard({ 
  title, 
  value, 
  color, 
  isVisible 
}: SummaryMetricCardProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color }]} numberOfLines={1} ellipsizeMode="tail">
        {isVisible ? value : "•••••"}
      </Text>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </View>
  );
}