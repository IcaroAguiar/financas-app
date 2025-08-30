// @/components/CategorySummary/index.tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Icon from '@/components/Icon';
import { predefinedCategories, getPredefinedCategoryByName } from '@/data/categories';
import { Transaction } from '@/types/transactions';
import { getUniqueIconForCustomCategory } from '@/utils/categoryIconMapper';

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
    
    // Filter to include transactions that have ANY category (predefined or user-created)
    const categorizedTransactions = expenseTransactions.filter(transaction => {
      // Has predefined category
      const hasPredefinedCategory = transaction.predefinedCategory;
      // Has user-created category
      const hasUserCategory = transaction.category;
      // Has predefined category by name match (legacy)
      const hasLegacyPredefined = transaction.category && getPredefinedCategoryByName(transaction.category.name);
      
      return hasPredefinedCategory || hasUserCategory || hasLegacyPredefined;
    });
    
    // Calculate total for percentage calculation
    const totalExpenseAmount = categorizedTransactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
    
    // Group transactions by category and calculate totals
    const categoryTotals: { [key: string]: { amount: number; category: any } } = {};
    
    categorizedTransactions.forEach(transaction => {
      let categoryKey: string | undefined;
      let categoryData: any;
      
      // Priority 1: predefinedCategory field (new format)
      if (transaction.predefinedCategory) {
        categoryKey = `predefined_${transaction.predefinedCategory.id}`;
        categoryData = {
          type: 'predefined',
          ...transaction.predefinedCategory,
          icon: predefinedCategories.find(cat => cat.id === transaction.predefinedCategory!.id)?.icon || 'tag'
        };
      }
      // Priority 2: user-created category
      else if (transaction.category) {
        // Check if it's a legacy predefined category by name
        const predefinedMatch = getPredefinedCategoryByName(transaction.category.name);
        if (predefinedMatch) {
          categoryKey = `predefined_${predefinedMatch.id}`;
          categoryData = {
            ...predefinedMatch,
            type: 'predefined'
          };
        } else {
          // It's a genuine user-created category
          categoryKey = `user_${transaction.category.id}`;
          const customIcon = getUniqueIconForCustomCategory(transaction.category.name);
          console.log(`CategorySummary - Custom category: ${transaction.category.name}, assigned icon: ${customIcon}`);
          categoryData = {
            type: 'user',
            id: transaction.category.id,
            name: transaction.category.name,
            color: transaction.category.color || theme.colors.primary,
            icon: customIcon // Dynamic icon for user categories
          };
        }
      }
      
      if (categoryKey && categoryData) {
        if (!categoryTotals[categoryKey]) {
          categoryTotals[categoryKey] = { amount: 0, category: categoryData };
        }
        categoryTotals[categoryKey].amount += transaction.amount;
      }
    });
    
    // Convert to array and add category details
    const summaryItems: CategorySummaryItem[] = Object.entries(categoryTotals).map(([categoryKey, data]) => {
      const { amount: totalAmount, category } = data;
      const percentage = totalExpenseAmount > 0 ? (totalAmount / totalExpenseAmount) * 100 : 0;
      
      return {
        id: categoryKey,
        name: category.name,
        icon: category.icon,
        color: category.color,
        totalAmount,
        percentage,
      };
    });
    
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
            Nenhuma despesa categorizada este mês
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