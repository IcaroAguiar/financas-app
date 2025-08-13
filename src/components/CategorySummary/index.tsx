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
      // Check if transaction has a regular category that matches predefined
      const hasRegularCategory = transaction.category && getPredefinedCategoryByName(transaction.category.name);
      
      // Check if transaction has predefinedCategory field (for new transactions)
      const hasPredefinedCategory = transaction.predefinedCategory;
      
      return hasRegularCategory || hasPredefinedCategory;
    });
    
    // Calculate total for percentage calculation
    const totalExpenseAmount = predefinedCategoryTransactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
    
    // Group transactions by predefined category and calculate totals
    const categoryTotals: { [key: string]: number } = {};
    
    predefinedCategoryTransactions.forEach(transaction => {
      let categoryId: string | undefined;
      
      // Try to get category ID from regular category
      if (transaction.category) {
        const predefinedCategory = getPredefinedCategoryByName(transaction.category.name);
        if (predefinedCategory) {
          categoryId = predefinedCategory.id;
        }
      }
      
      // Try to get category ID from predefinedCategory field
      if (!categoryId && transaction.predefinedCategory) {
        categoryId = transaction.predefinedCategory.id;
      }
      
      if (categoryId) {
        categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + transaction.amount;
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
      {/* Vertical Bar Chart */}
      <View style={styles.chartContainer}>
        <View 
          style={[
            styles.verticalBar,
            {
              height: `${Math.max(item.percentage, 15)}%`, // Minimum 15% height for visibility
              backgroundColor: item.color, // Solid color, no translucid effect
            }
          ]}
        />
      </View>
      
      {/* Icon at bottom - separate from bar */}
      <View style={styles.categoryIconWrapper}>
        <Icon 
          name={item.icon as any} 
          size={16} 
          color={item.color} 
        />
      </View>
      
      {/* Amount and percentage below icon */}
      <Text style={styles.categoryAmount}>
        {formatCurrency(item.totalAmount)}
      </Text>
      <Text style={styles.categoryPercentage}>
        {item.percentage.toFixed(1)}%
      </Text>
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