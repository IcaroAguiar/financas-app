import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { styles } from './styles';

export interface MonthData {
  id: string;
  month: number;
  year: number;
  displayText: string;
  isSelected: boolean;
}

interface MonthSelectorProps {
  months: MonthData[];
  selectedMonth: string;
  onMonthSelect: (monthId: string) => void;
}

export default function MonthSelector({
  months,
  selectedMonth,
  onMonthSelect
}: MonthSelectorProps) {
  
  const renderMonth = ({ item }: { item: MonthData }) => (
    <TouchableOpacity
      style={[
        styles.monthButton,
        item.isSelected && styles.monthButtonSelected
      ]}
      onPress={() => onMonthSelect(item.id)}
    >
      <Text
        style={[
          styles.monthText,
          item.isSelected && styles.monthTextSelected
        ]}
        numberOfLines={1}
      >
        {item.displayText}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={months}
        renderItem={renderMonth}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}