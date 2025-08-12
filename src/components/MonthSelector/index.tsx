import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Text, View, Modal } from 'react-native';
import { styles } from './styles';
import Icon from '@/components/Icon';
import { theme } from '@/styles/theme';

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
  onYearSelect?: () => void;
  onCalendarPress?: () => void;
}

export default function MonthSelector({
  months,
  selectedMonth,
  onMonthSelect,
  onYearSelect,
  onCalendarPress
}: MonthSelectorProps) {
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Create a sliding window of months: 2 past, current, 2 future
  const getDisplayMonths = () => {
    const today = new Date();
    const currentMonthId = `${today.getMonth() + 1}-${today.getFullYear()}`;
    
    const windowMonths = [];
    for (let i = -2; i <= 2; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const id = `${month}-${year}`;
      
      const monthNames = [
        'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
        'jul', 'ago', 'set', 'out', 'nov', 'dez'
      ];
      
      windowMonths.push({
        id,
        month,
        year,
        displayText: `${monthNames[date.getMonth()]}/${year.toString().slice(-2)}`,
        isSelected: id === selectedMonth
      });
    }
    
    return windowMonths;
  };

  const displayMonths = getDisplayMonths();
  
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

  const handleYearSelect = () => {
    const currentYear = new Date().getFullYear();
    const yearId = `year-${currentYear}`;
    onYearSelect?.();
  };

  const handleCalendarPress = () => {
    setShowFullCalendar(true);
    onCalendarPress?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorRow}>
        {/* Month selector */}
        <FlatList
          data={displayMonths}
          renderItem={renderMonth}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={styles.monthList}
        />
        
        {/* Year Total Button */}
        <TouchableOpacity
          style={styles.yearButton}
          onPress={handleYearSelect}
        >
          <Text style={styles.yearButtonText}>Total do Ano</Text>
        </TouchableOpacity>
        
        {/* Calendar Icon */}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleCalendarPress}
        >
          <Icon name="calendar" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Full Calendar Modal - Simple implementation */}
      <Modal
        visible={showFullCalendar}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFullCalendar(false)}
      >
        <View style={styles.calendarModal}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Selecionar Período</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFullCalendar(false)}
            >
              <Icon name="x" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={months}
            renderItem={renderMonth}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.calendarGrid}
            ItemSeparatorComponent={() => <View style={styles.calendarSeparator} />}
          />
        </View>
      </Modal>
    </View>
  );
}