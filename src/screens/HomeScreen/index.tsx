import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { HomeScreenProps } from "@/navigation/types";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { useDebtors } from "@/contexts/DebtorContext";
import { Transaction } from "@/types/transactions";
import Icon from "@/components/Icon";
import QuickActionCard from "@/components/QuickActionCard";
import DashboardCard from "@/components/DashboardCard";
import AddTransactionModal from "@/components/AddTransactionModal";
import { CreateTransactionData } from '@/api/transactionService';
import { theme } from "@/styles/theme";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const { summary, getRecentTransactions, refreshing, refreshTransactions, addTransaction } =
    useTransactions();

  const {
    debtors,
    debts,
    refreshing: debtorsRefreshing,
    refreshData: refreshDebtors,
  } = useDebtors();


  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTransactionType, setModalTransactionType] = useState<"RECEITA" | "DESPESA">("DESPESA");


  // Calculando dados reais das cobranças e dívidas
  const debtSummary = {
    pendingDebts: debts
      .filter((debt) => debt.status === "PENDENTE")
      .reduce((total, debt) => total + debt.totalAmount, 0),
    totalDebtors: debtors.length,
  };

  const recentTransactions = getRecentTransactions(4);

  // Handler functions for interactions
  const handleOpenTransactionModal = (type: "RECEITA" | "DESPESA") => {
    setModalTransactionType(type);
    setIsModalVisible(true);
  };

  const handleSaveTransaction = async (data: Omit<CreateTransactionData, "date">) => {
    const transactionData: CreateTransactionData = {
      ...data,
      date: new Date().toISOString(),
    };

    try {
      await addTransaction(transactionData);
      setIsModalVisible(false);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const renderTransaction = (transaction: Transaction) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Icon
          name={transaction.type === "RECEITA" ? "coins" : "wallet"}
          size={20}
          color={
            transaction.type === "RECEITA"
              ? theme.colors.success
              : theme.colors.error
          }
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription} numberOfLines={1} ellipsizeMode="tail">
          {transaction.description}
        </Text>
        <Text style={styles.transactionCategory} numberOfLines={1} ellipsizeMode="tail">
          {transaction.category?.name || "Sem categoria"}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.transactionAmountText,
            {
              color:
                transaction.type === "RECEITA"
                  ? theme.colors.success
                  : theme.colors.error,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {transaction.type === "RECEITA" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.transactionDate} numberOfLines={1} ellipsizeMode="tail">
          {new Date(transaction.date).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </View>
  );

  const isBalanceNegative = summary.balance < 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || debtorsRefreshing}
            onRefresh={async () => {
              await Promise.all([refreshTransactions(), refreshDebtors()]);
            }}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
            {getGreeting()}, {user?.name?.split(" ")[0]}!
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            Aqui está o resumo das suas finanças
          </Text>
        </View>

        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            {
              backgroundColor: isBalanceNegative
                ? theme.colors.error
                : theme.colors.primary,
            },
          ]}
        >
          <Text style={styles.balanceLabel} numberOfLines={1} ellipsizeMode="tail">Saldo Atual</Text>
          <Text style={styles.balanceAmount} numberOfLines={1} ellipsizeMode="tail">
            {formatCurrency(summary.balance)}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Text style={styles.incomeAmount} numberOfLines={1} ellipsizeMode="tail">
                +{formatCurrency(summary.totalIncome)}
              </Text>
              <Text style={styles.balanceItemLabel} numberOfLines={1} ellipsizeMode="tail">Recebimentos</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.expenseAmount} numberOfLines={1} ellipsizeMode="tail">
                -{formatCurrency(summary.totalExpenses)}
              </Text>
              <Text style={styles.balanceItemLabel} numberOfLines={1} ellipsizeMode="tail">Despesas</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <QuickActionCard
              title="Novo Recebimento"
              icon="plus"
              color={theme.colors.success}
              onPress={() => handleOpenTransactionModal("RECEITA")}
            />
            <QuickActionCard
              title="Nova Despesa"
              icon="minus"
              color={theme.colors.error}
              onPress={() => handleOpenTransactionModal("DESPESA")}
            />
            <QuickActionCard
              title="Contas"
              icon="wallet"
              color={theme.colors.primary}
              onPress={() => navigation.getParent()?.navigate("Accounts")}
            />
            <QuickActionCard
              title="Lembretes"
              icon="bell"
              color={theme.colors.warning}
              onPress={() => navigation.getParent()?.navigate("Reminders")}
            />
          </View>
        </View>

        {/* Debts Overview */}
        <DashboardCard
          title="Dívidas a Receber"
          onSeeAll={() => navigation.getParent()?.navigate("Debtors")}
          seeAllText="Ver todas"
        >
          <View style={styles.debtsStats}>
            <View style={styles.debtStat}>
              <Text style={styles.debtAmount} numberOfLines={1} ellipsizeMode="tail">
                {formatCurrency(debtSummary.pendingDebts)}
              </Text>
              <Text style={styles.debtLabel} numberOfLines={1} ellipsizeMode="tail">Total Pendente</Text>
            </View>
            <View style={styles.debtStat}>
              <Text style={styles.debtCount} numberOfLines={1} ellipsizeMode="tail">{debtSummary.totalDebtors}</Text>
              <Text style={styles.debtLabel} numberOfLines={1} ellipsizeMode="tail">Cobranças</Text>
            </View>
          </View>
        </DashboardCard>


        {/* Analytics Preview */}
        <DashboardCard
          title="Análise Financeira"
          onSeeAll={() => Alert.alert("Em Breve", "Funcionalidade de relatórios será implementada em breve!")}
          seeAllText="Ver relatório"
        >
          <Text style={styles.analyticsDescription} numberOfLines={2} ellipsizeMode="tail">
            Acompanhe seus gastos, tendências e metas financeiras com gráficos
            detalhados
          </Text>
          <TouchableOpacity 
            style={styles.analyticsButton}
            onPress={() => Alert.alert("Em Breve", "Funcionalidade de análises será implementada em breve!")}
          >
            <Icon name="bar-chart" size={20} color={theme.colors.surface} />
            <Text style={styles.analyticsButtonText} numberOfLines={1} ellipsizeMode="tail">Abrir Análises</Text>
          </TouchableOpacity>
        </DashboardCard>

        {/* Recent Transactions */}
        <DashboardCard
          title="Transações Recentes"
          onSeeAll={() => navigation.navigate("Transactions")}
          seeAllText="Ver todas"
        >
          <View style={styles.transactionsList}>
            {recentTransactions.map(renderTransaction)}
          </View>
        </DashboardCard>
      </ScrollView>

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveTransaction}
        initialType={modalTransactionType}
      />
    </View>
  );
}
