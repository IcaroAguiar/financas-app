import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import Icon from "@/components/Icon";
import { getPredefinedCategoryByName, getPredefinedCategoryById } from '@/data/categories';
import { getUniqueIconForCustomCategory } from '@/utils/categoryIconMapper';


type TransactionType = "RECEITA" | "DESPESA" | "PAGO";

interface TransactionItemProps {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  onPress: (transactionId: string) => void;
  isInstallmentPlan?: boolean;
  date?: string; // Optional date for display
  currentInstallment?: number; // Current installment number
  totalInstallments?: number; // Total number of installments
  isRecurring?: boolean; // Recurring transaction indicator
  categoryId?: string | null; // ID da categoria para buscar ícone correto
  predefinedCategory?: { id: string; name: string; color: string }; // Categoria pré-definida
}

export default function TransactionItem({
  id,
  description,
  category,
  amount,
  type,
  onPress,
  isInstallmentPlan,
  date,
  currentInstallment,
  totalInstallments,
  isRecurring,
  categoryId,
  predefinedCategory,
}: TransactionItemProps) {
  const isRevenue = type === "RECEITA";
  const isPaid = type === "PAGO";
  const amountColor = isRevenue ? theme.colors.success : isPaid ? theme.colors.success : theme.colors.error;

  // Get category icon from predefined categories, fallback to transaction type icons
  let categoryData = null;
  
  // Priority 1: If predefinedCategory is provided, get full data by ID to include icon
  if (predefinedCategory?.id) {
    categoryData = getPredefinedCategoryById(predefinedCategory.id);
  }
  // Priority 2: Try to get predefined category by categoryId
  else if (categoryId) {
    categoryData = getPredefinedCategoryById(categoryId);
  }
  // Priority 3: Try to get predefined category by category name (legacy)
  else if (category && category !== "Sem Categoria") {
    categoryData = getPredefinedCategoryByName(category);
  }
  
  // Use predefined category icon if available, check for custom category, or use transaction type icons
  let iconName: string;
  let iconColor: string;
  
  if (categoryData) {
    // Predefined category found
    iconName = categoryData.icon;
    iconColor = categoryData.color;
  } else if (category && category !== "Sem Categoria") {
    // This is a custom user category - use unique icon based on name
    iconName = getUniqueIconForCustomCategory(category);
    iconColor = theme.colors.primary; // Use primary color for custom categories
    console.log(`Custom category: ${category}, assigned icon: ${iconName}`);
  } else {
    // No category or "Sem Categoria" - use transaction type icons
    switch (type) {
      case "RECEITA":
        iconName = "coins";
        iconColor = theme.colors.success;
        break;
      case "PAGO":
        iconName = "check-circle";
        iconColor = theme.colors.success;
        break;
      case "DESPESA":
      default:
        iconName = "wallet";
        iconColor = theme.colors.error;
        break;
    }
  }
  
  const categoryIcon = iconName as any;
  const categoryColor = iconColor;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  const formattedDate = date ? new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }) : null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={1}
    >
      {/* Small Category Icon (replacing large arrow icons) */}
      <View style={styles.categoryIconContainer}>
        <Icon 
          name={categoryIcon} 
          size={24} 
          color={categoryColor} 
        />
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <View style={styles.categoryRow}>
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
          {isInstallmentPlan && currentInstallment && totalInstallments && (
            <View style={styles.installmentBadge}>
              <Text style={styles.installmentBadgeText} numberOfLines={1} ellipsizeMode="tail">
                {currentInstallment}/{totalInstallments}
              </Text>
            </View>
          )}
          {isRecurring && (
            <View style={[styles.installmentBadge, styles.recurringBadge]}>
              <Text style={[styles.installmentBadgeText, styles.recurringBadgeText]} numberOfLines={1} ellipsizeMode="tail">
                RECORRENTE
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Amount and Date */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1} ellipsizeMode="tail">
          {isRevenue ? '+' : isPaid ? '✓' : ''}{formattedAmount}
        </Text>
        {formattedDate && (
          <Text style={styles.dateText} numberOfLines={1} ellipsizeMode="tail">
            {formattedDate}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
