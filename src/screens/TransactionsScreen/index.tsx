// @/screens/TransactionsScreen/index.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import TransactionItem from "@/components/TransactionItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import { theme } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";

// DADOS MOCKADOS (provisórios, até conectarmos na API no Dia 7)
const MOCK_TRANSACTIONS = [
  {
    id: "1",
    description: "Salário",
    category: "Receitas",
    amount: 5000,
    type: "RECEITA" as const,
  },
  {
    id: "2",
    description: "Aluguel",
    category: "Moradia",
    amount: 1500,
    type: "DESPESA" as const,
  },
  {
    id: "3",
    description: "Supermercado",
    category: "Alimentação",
    amount: 450,
    type: "DESPESA" as const,
  },
  {
    id: "4",
    description: "Venda de Item",
    category: "Receitas",
    amount: 250,
    type: "RECEITA" as const,
  },
];

export default function TransactionsScreen() {
  const handleAddTransaction = () => {
    // No Dia 7, isso abrirá um modal/nova tela
    console.log("Abrir modal de nova transação");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas Transações</Text>

      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem {...item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} // O padding horizontal agora vai aqui
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton onPress={handleAddTransaction} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // O padding principal foi removido daqui e colocado na FlatList e no Title
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 20,
    paddingHorizontal: 20, // Padding para o título
    paddingTop: 10, // Um pequeno respiro no topo
  },
});
