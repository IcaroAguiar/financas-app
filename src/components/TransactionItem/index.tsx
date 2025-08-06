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
          {isInstallmentPlan && (
            <View style={styles.installmentBadge}>
              <Text style={styles.installmentBadgeText}>PARCELADO</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Amount and Date */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isRevenue ? '+' : isPaid ? '✓' : ''}{formattedAmount}
        </Text>
        {formattedDate && (
          <Text style={styles.dateText}>
            {formattedDate}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
