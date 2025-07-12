import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "@/styles/theme";


type TransactionType = "RECEITA" | "DESPESA";

interface TransactionItemProps {
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export default function TransactionItem({
  description,
  category,
  amount,
  type,
}: TransactionItemProps) {
  const isRevenue = type === "RECEITA";
  const amountColor = isRevenue ? theme.colors.primary : "#E53E3E"; // Vermelho para despesa
  const iconName = isRevenue ? "arrow-up-circle" : "arrow-down-circle";
  const iconColor = isRevenue ? theme.colors.primary : "#E53E3E";

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
      >
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {formattedAmount}
      </Text>
    </View>
  );
}
