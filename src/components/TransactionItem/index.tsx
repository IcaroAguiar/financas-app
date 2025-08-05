import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "@/styles/theme";


type TransactionType = "RECEITA" | "DESPESA";

interface TransactionItemProps {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  onPress: (transactionId: string) => void;
  // Optional installment indicator
  isInstallmentPlan?: boolean;
}

export default function TransactionItem({
  id,
  description,
  category,
  amount,
  type,
  onPress,
  isInstallmentPlan,
}: TransactionItemProps) {
  const isRevenue = type === "RECEITA";
  const amountColor = isRevenue ? theme.colors.success : theme.colors.error;
  const iconName = isRevenue ? "arrow-up-circle" : "arrow-down-circle";
  const iconColor = isRevenue ? theme.colors.success : theme.colors.error;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      
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
              <Text style={styles.installmentBadgeText}>Parcelado</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.amount, { color: amountColor }]}>
        {isRevenue ? '+' : ''}{formattedAmount}
      </Text>
    </TouchableOpacity>
  );
}
