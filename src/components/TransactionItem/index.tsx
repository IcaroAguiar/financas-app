import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import Icon from "@/components/Icon";
import { useToast } from "@/hooks/useToast";


type TransactionType = "RECEITA" | "DESPESA";

interface TransactionItemProps {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  date?: Date;
  account?: string;
  onEdit?: (transactionId: string) => void;
  onDelete?: (transactionId: string) => void;
  onViewDetails?: (transactionId: string) => void;
  // Payment plan properties
  isInstallmentPlan?: boolean;
  installmentProgress?: {
    paid: number;
    total: number;
    percentage: number;
  };
}

export default function TransactionItem({
  id,
  description,
  category,
  amount,
  type,
  date,
  account,
  onEdit,
  onDelete,
  onViewDetails,
  isInstallmentPlan,
  installmentProgress,
}: TransactionItemProps) {
  const toast = useToast();
  const isRevenue = type === "RECEITA";
  const amountColor = isRevenue ? theme.colors.primary : "#E53E3E"; // Vermelho para despesa
  const iconName = isRevenue ? "arrow-up-circle" : "arrow-down-circle";
  const iconColor = isRevenue ? theme.colors.primary : "#E53E3E";

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  const handleDelete = () => {
    toast.showConfirmation({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir esta transação?",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      onConfirm: () => onDelete?.(id),
    });
  };

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
        {account && (
          <Text style={styles.account}>📱 {account}</Text>
        )}
        {date && (
          <Text style={styles.date}>
            {date.toLocaleDateString('pt-BR')}
          </Text>
        )}
        
        {/* Installment Progress */}
        {isInstallmentPlan && installmentProgress && (
          <View style={styles.installmentProgress}>
            <Text style={styles.installmentText}>
              {installmentProgress.paid}/{installmentProgress.total} parcelas pagas
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${installmentProgress.percentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercentage}>
                {installmentProgress.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isRevenue ? '+' : '-'}{formattedAmount}
        </Text>
        {date && (
          <Text style={styles.time}>
            {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
      
      {/* Action buttons */}
      {(onEdit || onDelete || onViewDetails) && (
        <View style={styles.actionsContainer}>
          {onViewDetails && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onViewDetails(id)}
            >
              <Icon name="eye" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(id)}
            >
              <Icon name="edit-2" size={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Icon name="trash-2" size={16} color={theme.colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
