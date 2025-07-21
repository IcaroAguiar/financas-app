// @/screens/TransactionsScreen/index.tsx
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AddTransactionModal from "@/components/AddTransactionModal";
import { CreateTransactionData } from '@/api/transactionService';
import { Alert } from "react-native";


// Importando nossos componentes e tipos
import TransactionItem from "@/components/TransactionItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import { theme } from "@/styles/theme";
import { getTransactions, createTransaction } from "@/api/transactionService";
import { Transaction } from "@/types/transactions";
import { styles } from "./styles"; // Importando os estilos do arquivo separado

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar o modal

  const handleSaveTransaction = async (
    data: Omit<CreateTransactionData, "date">
  ) => {
    // Adicionamos a data atual ao objeto
    const transactionData: CreateTransactionData = {
      ...data,
      date: new Date().toISOString(),
    };

    try {
      // Chama a nossa API para criar a transação
      await createTransaction(transactionData);

      // Fecha o modal e atualiza a lista de transações
      setIsModalVisible(false);
      setIsLoading(true); // Mostra o loading enquanto a lista é atualizada
      await loadTransactions();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Não foi possível salvar a transação.";
      Alert.alert("Erro", errorMessage);
    }
  };
  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      // Aqui poderíamos mostrar um alerta para o usuário
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadTransactions();
    }, [])
  );

  // const handleAddTransaction = () => {
  //   console.log("Abrir modal de nova transação");
  // };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas Transações</Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma transação registrada ainda. Pressione '+' para adicionar sua
            primeira!
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              description={item.description}
              category={item.category?.name || "Sem Categoria"}
              amount={item.amount}
              type={item.type}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FloatingActionButton onPress={() => setIsModalVisible(true)} />
      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveTransaction}
      />
    </SafeAreaView>
  );
}
