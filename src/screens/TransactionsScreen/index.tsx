import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionBottomSheet from "@/components/TransactionBottomSheet";
import { CreateTransactionData, UpdateTransactionData } from '@/api/transactionService';
import { useToast } from '@/hooks/useToast';

// Importando nossos componentes e tipos
import TransactionItem from "@/components/TransactionItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import Icon from "@/components/Icon";
import { theme } from "@/styles/theme";
import { useTransactions } from "@/contexts/TransactionContext";
import { useAccounts } from "@/contexts/AccountContext";
import { Transaction } from "@/types/transactions";
import { styles } from "./styles";

export default function TransactionsScreen() {
  const { 
    transactions, 
    loading, 
    refreshing, 
    summary, 
    addTransaction, 
    updateTransactionById,
    deleteTransactionById,
    refreshTransactions,
    getTransactionsByType,
    markInstallmentPaid,
    markTransactionPaid,
    registerPartialPayment
  } = useTransactions();
  
  const { accounts } = useAccounts();
  const toast = useToast();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<"ALL" | "RECEITA" | "DESPESA" | "PAGO">("ALL");
  const [filterAccountId, setFilterAccountId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  
  // Transaction bottom sheet state
  const [showTransactionBottomSheet, setShowTransactionBottomSheet] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleSaveTransaction = async (
    data: Omit<CreateTransactionData, "date">
  ) => {
    // Adicionamos a data atual ao objeto
    const transactionData: CreateTransactionData = {
      ...data,
      date: new Date().toISOString(),
    };

    try {
      // Usa o contexto para adicionar a transação
      await addTransaction(transactionData);
      setIsModalVisible(false);
      toast.showSuccess({ message: "Transação criada com sucesso!" });
    } catch (error: any) {
      toast.showError({ message: error.message });
    }
  };

  const handleUpdateTransaction = async (
    id: string,
    data: Omit<UpdateTransactionData, "date">
  ) => {
    try {
      await updateTransactionById(id, data);
      setEditingTransaction(null);
      setIsModalVisible(false);
      toast.showSuccess({ message: "Transação atualizada com sucesso!" });
    } catch (error: any) {
      toast.showError({ message: error.message });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransactionById(id);
      toast.showSuccess({ message: "Transação excluída com sucesso!" });
    } catch (error: any) {
      toast.showError({ message: error.message });
    }
  };

  const handleEditTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setEditingTransaction(transaction);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingTransaction(null);
  };

  const handleTransactionPress = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowTransactionBottomSheet(true);
    }
  };

  const handleCloseBottomSheet = () => {
    setShowTransactionBottomSheet(false);
    setSelectedTransaction(null);
  };

  const handleMarkTransactionInstallmentPaid = async (transactionId: string, installmentId: string) => {
    toast.showConfirmation({
      title: 'Confirmar Pagamento',
      message: 'Deseja marcar esta parcela como paga?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await markInstallmentPaid(transactionId, installmentId);
          toast.showSuccess({ message: 'Parcela marcada como paga!' });
        } catch (error: any) {
          toast.showError({ message: error.message });
        }
      }
    });
  };

  const handleMarkTransactionPaid = async (transactionId: string) => {
    try {
      await markTransactionPaid(transactionId);
      toast.showSuccess({ message: 'Transação marcada como paga!' });
    } catch (error: any) {
      toast.showError({ message: error.message });
    }
  };

  const handleMarkTransactionPartialPayment = async (transactionId: string, amount: number) => {
    try {
      await registerPartialPayment(transactionId, amount);
      toast.showSuccess({ message: 'Pagamento parcial registrado!' });
    } catch (error: any) {
      toast.showError({ message: error.message });
    }
  };

  const getFilteredAndSortedTransactions = () => {
    let filtered = transactions;
    
    // Aplicar filtro por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    // Aplicar filtro por conta
    if (filterAccountId) {
      filtered = filtered.filter(t => t.account?.id === filterAccountId);
    }
    
    // Aplicar ordenação
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });
  };

  // Usa o summary do contexto em vez de calcular novamente
  const totals = {
    income: summary.totalIncome,
    expenses: summary.totalExpenses,
    balance: summary.balance
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Helper function to calculate installment progress for transactions
  const getTransactionInstallmentProgress = (transaction: Transaction) => {
    // Check if this is an installment plan transaction
    if (!transaction.isInstallmentPlan || !transaction.installments) return undefined;
    
    const totalInstallments = transaction.installments.length;
    const paidInstallments = transaction.installments.filter(inst => inst.status === 'PAGO').length;
    
    if (totalInstallments === 0) return undefined;
    
    const percentage = (paidInstallments / totalInstallments) * 100;
    
    return {
      paid: paidInstallments,
      total: totalInstallments,
      percentage: Math.round(percentage * 100) / 100 // Round to 2 decimal places
    };
  };

  // Não precisamos mais do useFocusEffect pois o contexto já carrega os dados automaticamente


  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const filteredTransactions = getFilteredAndSortedTransactions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTransactions}
            colors={['#2a9d8f']}
            tintColor="#2a9d8f"
          />
        }
      >

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={[styles.summaryAmount, { color: totals.balance >= 0 ? '#4CAF50' : '#F44336' }]}>
              {formatCurrency(totals.balance)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Recebimentos</Text>
            <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>
              {formatCurrency(totals.income)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={[styles.summaryAmount, { color: '#F44336' }]}>
              {formatCurrency(totals.expenses)}
            </Text>
          </View>
        </View>

        {/* Type Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'ALL' && styles.activeFilterButton]}
              onPress={() => setFilterType('ALL')}
            >
              <Text style={[styles.filterText, filterType === 'ALL' && styles.activeFilterText]}>
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "RECEITA" && styles.activeFilterButton]}
              onPress={() => setFilterType("RECEITA")}
            >
              <Icon name="coins" size={16} color={filterType === "RECEITA" ? theme.colors.surface : theme.colors.success} />
              <Text style={[styles.filterText, filterType === "RECEITA" && styles.activeFilterText]}>
                Receitas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "DESPESA" && styles.activeFilterButton]}
              onPress={() => setFilterType("DESPESA")}
            >
              <Icon name="wallet" size={16} color={filterType === "DESPESA" ? theme.colors.surface : theme.colors.error} />
              <Text style={[styles.filterText, filterType === "DESPESA" && styles.activeFilterText]}>
                Despesas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === "PAGO" && styles.activeFilterButton]}
              onPress={() => setFilterType("PAGO")}
            >
              <Icon name="check-circle" size={16} color={filterType === "PAGO" ? theme.colors.surface : theme.colors.success} />
              <Text style={[styles.filterText, filterType === "PAGO" && styles.activeFilterText]}>
                Pagos
              </Text>
            </TouchableOpacity>
          </ScrollView>
          
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
          >
            <Icon name={sortBy === 'date' ? 'calendar' : 'dollar-sign'} size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Account Filters */}
        {accounts.length > 0 && (
          <View style={styles.accountFiltersContainer}>
            <Text style={styles.accountFiltersTitle}>Filtrar por conta:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.accountFilterButton, !filterAccountId && styles.activeAccountFilterButton]}
                onPress={() => setFilterAccountId(null)}
              >
                <Text style={[styles.accountFilterText, !filterAccountId && styles.activeAccountFilterText]}>
                  Todas as Contas
                </Text>
              </TouchableOpacity>
              

              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.accountFilterButton, filterAccountId === account.id && styles.activeAccountFilterButton]}
                  onPress={() => setFilterAccountId(account.id)}
                >
                  <Icon name="credit-card" size={14} color={filterAccountId === account.id ? theme.colors.surface : theme.colors.text.secondary} />
                  <Text style={[styles.accountFilterText, filterAccountId === account.id && styles.activeAccountFilterText]}>
                    {account.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="receipt" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {filterType === 'ALL' 
                ? 'Nenhuma transação encontrada.\nToque no + para adicionar sua primeira!'
                : filterType === 'RECEITA' 
                  ? 'Nenhuma receita encontrada.'
                  : filterType === 'DESPESA'
                    ? 'Nenhuma despesa encontrada.'
                    : 'Nenhuma transação paga encontrada.'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {filteredTransactions.map((item) => {
              return (
                <TransactionItem
                  key={item.id}
                  id={item.id}
                  description={item.description}
                  category={item.category?.name || "Sem Categoria"}
                  amount={item.amount}
                  type={item.type}
                  onPress={handleTransactionPress}
                  isInstallmentPlan={Boolean(item.isInstallmentPlan)}
                  date={item.date}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => setIsModalVisible(true)} />
      
      <AddTransactionModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        onUpdate={handleUpdateTransaction}
        transaction={editingTransaction}
      />

      <TransactionBottomSheet
        transaction={selectedTransaction}
        isOpen={showTransactionBottomSheet}
        onClose={handleCloseBottomSheet}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onMarkPaid={handleMarkTransactionPaid}
        onPartialPayment={handleMarkTransactionPartialPayment}
      />
    </SafeAreaView>
  );
}
