import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { styles } from './styles';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  title?: string;
}

export default function PieChart({ data, size = 200, title }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  let cumulativeValue = 0;
  const paths = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativeValue / total) * 360;
    const endAngle = ((cumulativeValue + item.value) / total) * 360;
    
    cumulativeValue += item.value;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1)
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Simplified implementation using circles for now
  // In a real app, you'd want to use a proper chart library like react-native-chart-kit
  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <View style={styles.pieChartWrapper}>
        <View style={[styles.pieChart, { width: size, height: size }]}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <View
                key={index}
                style={[
                  styles.pieSlice,
                  {
                    backgroundColor: item.color,
                    height: `${percentage}%`,
                  }
                ]}
              />
            );
          })}
        </View>
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>{formatCurrency(item.value)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}