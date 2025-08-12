// @/components/CategorySummary/index.tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Icon from '@/components/Icon';
import { predefinedCategories, getPredefinedCategoryByName } from '@/data/categories';
import { Transaction } from '@/types/transactions';

interface CategorySummaryProps {
  transactions: Transaction[];
}

interface CategorySummaryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalAmount: number;
  percentage: number;
}

export default function CategorySummary({ transactions }: CategorySummaryProps) {
  
  const categorySummaryData = useMemo(() => {
    // Filter transactions to only include DESPESA type
    const expenseTransactions = transactions.filter(transaction => transaction.type === 'DESPESA');
    
    // Filter to only include transactions that match predefined categories
    const predefinedCategoryTransactions = expenseTransactions.filter(transaction => {
      return transaction.category && getPredefinedCategoryByName(transaction.category.name);
    });
    
    // Calculate total for percentage calculation
    const totalExpenseAmount = predefinedCategoryTransactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
    
    // Group transactions by predefined category and calculate totals
    const categoryTotals: { [key: string]: number } = {};
    
    predefinedCategoryTransactions.forEach(transaction => {
      const categoryName = transaction.category?.name;
      if (categoryName) {
        const predefinedCategory = getPredefinedCategoryByName(categoryName);
        if (predefinedCategory) {
          const categoryId = predefinedCategory.id;
          categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + transaction.amount;
        }
      }
    });
    
    // Convert to array and add category details
    const summaryItems: CategorySummaryItem[] = Object.entries(categoryTotals).map(([categoryId, totalAmount]) => {
      const predefinedCategory = predefinedCategories.find(cat => cat.id === categoryId);
      if (!predefinedCategory) return null;
      
      const percentage = totalExpenseAmount > 0 ? (totalAmount / totalExpenseAmount) * 100 : 0;
      
      return {
        id: categoryId,
        name: predefinedCategory.name,
        icon: predefinedCategory.icon,
        color: predefinedCategory.color,
        totalAmount,
        percentage,
      };
    }).filter(Boolean) as CategorySummaryItem[];
    
    // Sort by totalAmount descending
    return summaryItems.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [transactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  const renderCategoryItem = ({ item }: { item: CategorySummaryItem }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryIconWrapper}>
          <Icon 
            name={item.icon as any} 
            size={20} 
            color={item.color} 
          />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.categoryAmount}>
            {formatCurrency(item.totalAmount)}
          </Text>
        </View>
        <Text style={styles.categoryPercentage}>
          {item.percentage.toFixed(1)}%
        </Text>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${Math.max(item.percentage, 5)}%`, // Minimum 5% width for visibility
              backgroundColor: item.color 
            }
          ]} 
        />
      </View>
    </View>
  );
  
  if (categorySummaryData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name={"pie-chart" as any} size={20} color={theme.colors.primary} />
          <Text style={styles.title}>Resumo por Categoria</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhuma despesa em categorias principais este mês
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="pie-chart" size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Resumo por Categoria</Text>
      </View>
      
      <FlatList
        data={categorySummaryData}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
}