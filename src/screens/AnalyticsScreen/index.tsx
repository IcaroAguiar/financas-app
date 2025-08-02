import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import BrandHeader from '@/components/BrandHeader';
import PieChart from '@/components/Charts/PieChart';
import LineChart from '@/components/Charts/LineChart';
import Icon from '@/components/Icon';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'3M' | '6M' | '1Y'>('6M');
  
  // Mock data - replace with real API calls
  const monthlyData: MonthlyData[] = [
    { month: 'Jan', income: 4500, expenses: 2100, balance: 2400 },
    { month: 'Fev', income: 4500, expenses: 2300, balance: 2200 },
    { month: 'Mar', income: 5200, expenses: 1800, balance: 3400 },
    { month: 'Abr', income: 4500, expenses: 2500, balance: 2000 },
    { month: 'Mai', income: 4800, expenses: 2200, balance: 2600 },
    { month: 'Jun', income: 4500, expenses: 1900, balance: 2600 },
  ];

  const categoryExpenses: CategoryExpense[] = [
    { category: 'Alimentação', amount: 1200, color: '#FF6B6B', percentage: 35.3 },
    { category: 'Transporte', amount: 800, color: '#4ECDC4', percentage: 23.5 },
    { category: 'Lazer', amount: 600, color: '#45B7D1', percentage: 17.6 },
    { category: 'Saúde', amount: 400, color: '#96CEB4', percentage: 11.8 },
    { category: 'Outros', amount: 400, color: '#FFEAA7', percentage: 11.8 },
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  
  const incomeChange = ((currentMonth.income - previousMonth.income) / previousMonth.income * 100);
  const expenseChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses * 100);
  const balanceChange = ((currentMonth.balance - previousMonth.balance) / previousMonth.balance * 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value: number, isExpense = false) => {
    if (isExpense) {
      return value > 0 ? '#F44336' : '#4CAF50'; // Red for increase, green for decrease in expenses
    }
    return value >= 0 ? '#4CAF50' : '#F44336'; // Green for increase, red for decrease
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? 'trending-up' : 'trending-down';
  };

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader useIcon={true} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Análises</Text>
          <View style={styles.periodSelector}>
            {(['3M', '6M', '1Y'] as const).map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.activePeriodButton
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.activePeriodText
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Recebimentos</Text>
              <View style={styles.changeIndicator}>
                <Icon 
                  name={getChangeIcon(incomeChange)} 
                  size={14} 
                  color={getChangeColor(incomeChange)} 
                />
                <Text style={[styles.changeText, { color: getChangeColor(incomeChange) }]}>
                  {formatPercentage(incomeChange)}
                </Text>
              </View>
            </View>
            <Text style={styles.summaryAmount}>
              {formatCurrency(currentMonth.income)}
            </Text>
            <Text style={styles.summarySubtitle}>vs mês anterior</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Despesas</Text>
              <View style={styles.changeIndicator}>
                <Icon 
                  name={getChangeIcon(expenseChange)} 
                  size={14} 
                  color={getChangeColor(expenseChange, true)} 
                />
                <Text style={[styles.changeText, { color: getChangeColor(expenseChange, true) }]}>
                  {formatPercentage(expenseChange)}
                </Text>
              </View>
            </View>
            <Text style={styles.summaryAmount}>
              {formatCurrency(currentMonth.expenses)}
            </Text>
            <Text style={styles.summarySubtitle}>vs mês anterior</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Saldo</Text>
              <View style={styles.changeIndicator}>
                <Icon 
                  name={getChangeIcon(balanceChange)} 
                  size={14} 
                  color={getChangeColor(balanceChange)} 
                />
                <Text style={[styles.changeText, { color: getChangeColor(balanceChange) }]}>
                  {formatPercentage(balanceChange)}
                </Text>
              </View>
            </View>
            <Text style={[styles.summaryAmount, { color: currentMonth.balance >= 0 ? '#4CAF50' : '#F44336' }]}>
              {formatCurrency(currentMonth.balance)}
            </Text>
            <Text style={styles.summarySubtitle}>vs mês anterior</Text>
          </View>
        </View>

        {/* Monthly Trend Chart */}
        <LineChart 
          data={monthlyData.map(item => ({ label: item.month, value: item.balance }))}
          title="Evolução do Saldo Mensal"
          color="#2196F3"
        />

        {/* Income vs Expenses Chart */}
        <LineChart 
          data={monthlyData.map(item => ({ label: item.month, value: item.income }))}
          title="Recebimentos Mensais"
          color="#4CAF50"
        />

        <LineChart 
          data={monthlyData.map(item => ({ label: item.month, value: item.expenses }))}
          title="Despesas Mensais"
          color="#F44336"
        />

        {/* Category Breakdown */}
        <PieChart 
          data={categoryExpenses.map(item => ({
            label: item.category,
            value: item.amount,
            color: item.color
          }))}
          title="Gastos por Categoria"
        />

        {/* Financial Goals Section */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Metas Financeiras</Text>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Meta de Economia Mensal</Text>
              <Text style={styles.goalAmount}>R$ 1.500</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '86.7%' }]} />
            </View>
            <View style={styles.goalStats}>
              <Text style={styles.goalProgress}>R$ 1.300 / R$ 1.500</Text>
              <Text style={styles.goalPercentage}>86.7%</Text>
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Reduzir Gastos com Alimentação</Text>
              <Text style={styles.goalAmount}>R$ 1.000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '120%', backgroundColor: '#F44336' }]} />
            </View>
            <View style={styles.goalStats}>
              <Text style={styles.goalProgress}>R$ 1.200 / R$ 1.000</Text>
              <Text style={[styles.goalPercentage, { color: '#F44336' }]}>120%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}