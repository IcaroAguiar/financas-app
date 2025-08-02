import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './styles';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  title?: string;
  color?: string;
}

export default function LineChart({ data, title, color = '#2196F3' }: LineChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value);
  };

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.lineChartContainer}>
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>{formatCurrency(maxValue)}</Text>
            <Text style={styles.axisLabel}>{formatCurrency(maxValue * 0.75)}</Text>
            <Text style={styles.axisLabel}>{formatCurrency(maxValue * 0.5)}</Text>
            <Text style={styles.axisLabel}>{formatCurrency(maxValue * 0.25)}</Text>
            <Text style={styles.axisLabel}>{formatCurrency(0)}</Text>
          </View>
          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {data.map((item, index) => {
                const height = ((item.value - minValue) / range) * 150 || 5;
                return (
                  <View key={index} style={styles.barWrapper}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height,
                            backgroundColor: color,
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}