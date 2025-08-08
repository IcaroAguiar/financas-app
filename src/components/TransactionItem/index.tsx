import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import Icon from "@/components/Icon";


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
  const iconName = isRevenue ? "arrow-up-circle" : isPaid ? "check-circle" : "arrow-down-circle";
  const iconColor = isRevenue ? theme.colors.success : isPaid ? theme.colors.success : theme.colors.error;

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
      {/* Icon with gradient-like background */}
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isRevenue ? '#10B98120' : isPaid ? '#10B98120' : '#EF444420' }
      ]}>
        <Icon 
          name={iconName} 
          size={26} 
          color={iconColor} 
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
