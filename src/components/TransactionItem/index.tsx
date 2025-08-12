import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import Icon from "@/components/Icon";
import { getPredefinedCategoryByName } from '@/data/categories';


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
}: TransactionItemProps) {
  const isRevenue = type === "RECEITA";
  const isPaid = type === "PAGO";
  const amountColor = isRevenue ? theme.colors.success : isPaid ? theme.colors.success : theme.colors.error;

  // Get category icon from predefined categories, fallback to transaction type icons
  const predefinedCategory = getPredefinedCategoryByName(category);
  
  // Use predefined category icon if available, otherwise use transaction type icons (same as filters)
  let iconName: string;
  let iconColor: string;
  
  if (predefinedCategory) {
    iconName = predefinedCategory.icon;
    iconColor = predefinedCategory.color;
  } else {
    // Use same icons as transaction filters for consistency
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
