import React, { useState, useEffect } from "react";
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
import DashboardHeader from "@/components/DashboardHeader";
import SummaryMetricCard from "@/components/SummaryMetricCard";
import MonthSelector, { MonthData } from "@/components/MonthSelector";
import AddTransactionModal from "@/components/AddTransactionModal";
import { CreateTransactionData, getMonthlySummary, MonthlySummary } from '@/api/transactionService';
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
  
  // Balance visibility state
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  // Month selection state
  const currentDate = new Date();
  const currentMonthId = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthId);
  
  // Monthly summary state
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [loadingMonthlySummary, setLoadingMonthlySummary] = useState(false);


  // Calculando dados reais das cobranças e dívidas
  const debtSummary = {
    pendingDebts: debts
      .filter((debt) => debt.status === "PENDENTE")
      .reduce((total, debt) => total + debt.totalAmount, 0),
    totalDebtors: debtors.length,
  };

  // Generate months for selector (6 months back and 6 months forward from current)
  const generateMonths = (): MonthData[] => {
    const months: MonthData[] = [];
    const today = new Date();
    
    // Generate 6 months back and 6 months forward (13 months total including current)
    for (let i = -6; i <= 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const id = `${month}-${year}`;
      
      const monthNames = [
        'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
        'jul', 'ago', 'set', 'out', 'nov', 'dez'
      ];
      
      months.push({
        id,
        month,
        year,
        displayText: `${monthNames[date.getMonth()]}/${year.toString().slice(-2)}`,
        isSelected: id === selectedMonth
      });
    }
    
    return months;
  };

  const monthsData = generateMonths();
  const recentTransactions = getRecentTransactions(4);

  // Function to fetch monthly data
  const fetchMonthlySummary = async (monthId: string) => {
    try {
      setLoadingMonthlySummary(true);
      const [month, year] = monthId.split('-').map(Number);
      const summary = await getMonthlySummary(month, year);
      setMonthlySummary(summary);
    } catch (error) {
      console.error('Erro ao buscar resumo mensal:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados mensais');
    } finally {
      setLoadingMonthlySummary(false);
    }
  };

  // Load initial monthly data
  useEffect(() => {
    fetchMonthlySummary(selectedMonth);
  }, [selectedMonth]);

  // Month selector handler
  const handleMonthSelect = (monthId: string) => {
    setSelectedMonth(monthId);
    fetchMonthlySummary(monthId);
  };

  // Year selector handler
  const handleYearSelect = () => {
    const currentYear = new Date().getFullYear();
    const yearId = `year-${currentYear}`;
    
    // For now, just show current year summary (we could implement a full year view later)
    Alert.alert(
      "Total do Ano",
      `Visualização anual para ${currentYear} será implementada em breve!`,
      [{ text: "OK" }]
    );
  };

  // Calendar press handler
  const handleCalendarPress = () => {
    // Calendar modal functionality is handled within MonthSelector
    console.log("Calendar pressed - modal will open");
  };

  // Dashboard Header handlers
  const handleToggleBalance = () => {
    setIsBalanceVisible(prev => !prev);
  };


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


  // Determine which data to display (monthly or general)
  const displayData = monthlySummary || {
    totalIncome: summary.totalIncome,
    totalExpenses: summary.totalExpenses,
    balance: summary.balance,
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

  const isBalanceNegative = displayData.balance < 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || debtorsRefreshing || loadingMonthlySummary}
            onRefresh={async () => {
              await Promise.all([
                refreshTransactions(),
                refreshDebtors(),
                fetchMonthlySummary(selectedMonth)
              ]);
            }}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <DashboardHeader
          userName={user?.name || 'Usuário'}
        />

        {/* Month Selector */}
        <MonthSelector
          months={monthsData}
          selectedMonth={selectedMonth}
          onMonthSelect={handleMonthSelect}
          onYearSelect={handleYearSelect}
          onCalendarPress={handleCalendarPress}
        />

        {/* Main Summary Card */}
        <View
          style={[
            styles.mainSummaryCard,
            {
              backgroundColor: isBalanceNegative
                ? theme.colors.error
                : theme.colors.primary,
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle} numberOfLines={1} ellipsizeMode="tail">
              {monthlySummary ? `Resultado ${monthlySummary.period.monthName}` : 'Saldo Atual'}
            </Text>
            <TouchableOpacity style={styles.visibilityToggle} onPress={handleToggleBalance}>
              <Icon 
                name={isBalanceVisible ? "eye" : "eye-off"} 
                size={20} 
                color={theme.colors.surface} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.mainBalance} numberOfLines={1} ellipsizeMode="tail">
            {isBalanceVisible ? formatCurrency(displayData.balance) : "•••••"}
          </Text>
        </View>

        {/* Summary Metrics Cards */}
        <View style={styles.metricsRow}>
          <SummaryMetricCard
            title="Receitas"
            value={`+${formatCurrency(displayData.totalIncome)}`}
            color={theme.colors.success}
            isVisible={isBalanceVisible}
          />
          <SummaryMetricCard
            title="Despesas"
            value={`-${formatCurrency(displayData.totalExpenses)}`}
            color={theme.colors.error}
            isVisible={isBalanceVisible}
          />
          <SummaryMetricCard
            title="Resultado"
            value={formatCurrency(displayData.balance)}
            color={displayData.balance >= 0 ? theme.colors.success : theme.colors.error}
            isVisible={isBalanceVisible}
          />
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
