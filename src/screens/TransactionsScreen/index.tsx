import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AddTransactionModal from "@/components/AddTransactionModal";
import { CreateTransactionData } from '@/api/transactionService';
import { Alert } from "react-native";

// Importando nossos componentes e tipos
import TransactionItem from "@/components/TransactionItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import Icon from "@/components/Icon";
import { theme } from "@/styles/theme";
import { useTransactions } from "@/contexts/TransactionContext";
import { Transaction } from "@/types/transactions";
import { styles } from "./styles";

export default function TransactionsScreen() {
  const { 
    transactions, 
    loading, 
    refreshing, 
    summary, 
    addTransaction, 
    refreshTransactions,
    getTransactionsByType 
  } = useTransactions();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "RECEITA" | "DESPESA">("ALL");
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

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
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const getFilteredAndSortedTransactions = () => {
    let filtered = transactions;
    
    // Aplicar filtro
    if (filterType !== 'ALL') {
      filtered = transactions.filter(t => t.type === filterType);
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

  // Não precisamos mais do useFocusEffect pois o contexto já carrega os dados automaticamente

  // const handleAddTransaction = () => {
  //   console.log("Abrir modal de nova transação");
  // };

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
        style={styles.content} 
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

        {/* Filters */}
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
          </ScrollView>
          
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
          >
            <Icon name={sortBy === 'date' ? 'calendar' : 'dollar-sign'} size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="receipt" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {filterType === 'ALL' 
                ? 'Nenhuma transação encontrada.\nToque no + para adicionar sua primeira!'
                : `Nenhuma ${filterType === 'RECEITA' ? 'receita' : 'despesa'} encontrada.`
              }
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {filteredTransactions.map((item, index) => (
              <View key={item.id} style={styles.transactionItemWrapper}>
                <TransactionItem
                  description={item.description}
                  category={item.category?.name || "Sem Categoria"}
                  amount={item.amount}
                  type={item.type}
                  date={new Date(item.date)}
                />
                {index < filteredTransactions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => setIsModalVisible(true)} />
      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveTransaction}
      />
    </SafeAreaView>
  );
}
