import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import { useDebtors } from '@/contexts/DebtorContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { theme } from '@/styles/theme';
import Icon from '@/components/Icon';

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  isCompleted: boolean;
  type: 'payment' | 'transaction' | 'custom';
}

export default function RemindersScreen() {
  const { debts, loading: debtorsLoading, refreshData } = useDebtors();
  const { refreshing: transactionsRefreshing } = useTransactions();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Generate reminders from debts and upcoming dates
  useEffect(() => {
    generateReminders();
  }, [debts]);

  const generateReminders = () => {
    const generatedReminders: Reminder[] = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    // Add debt reminders
    debts.forEach(debt => {
      if (debt.status === 'PENDENTE') {
        const dueDate = new Date(debt.dueDate);
        if (dueDate <= thirtyDaysFromNow) {
          generatedReminders.push({
            id: `debt-${debt.id}`,
            title: `Dívida vencendo: ${debt.description}`,
            description: `Valor: R$ ${debt.totalAmount.toFixed(2)} - Vencimento: ${dueDate.toLocaleDateString('pt-BR')}`,
            date: dueDate,
            isCompleted: false,
            type: 'payment'
          });
        }
      }
    });

    // Sort by date
    generatedReminders.sort((a, b) => a.date.getTime() - b.date.getTime());
    setReminders(generatedReminders);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  const markAsCompleted = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isCompleted: true }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Excluir Lembrete',
      'Tem certeza que deseja excluir este lembrete?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => setReminders(prev => prev.filter(r => r.id !== id))
        }
      ]
    );
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderCard, item.isCompleted && styles.completedCard]}>
      <View style={styles.reminderHeader}>
        <Text style={[styles.reminderTitle, item.isCompleted && styles.completedText]}>
          {item.title}
        </Text>
        <Text style={styles.reminderDate}>
          {item.date.toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={[styles.reminderDescription, item.isCompleted && styles.completedText]}>
        {item.description}
      </Text>
      <View style={styles.reminderActions}>
        {!item.isCompleted && (
          <CustomButton
            title="Concluir"
            onPress={() => markAsCompleted(item.id)}
            size="small"
            variant="secondary"
            style={styles.completeButton}
          />
        )}
        <CustomButton
          title="Excluir"
          onPress={() => deleteReminder(item.id)}
          size="small"
          variant="danger"
          style={styles.deleteButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>Carregando lembretes...</Text>
          </View>
        ) : reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Icon name="clock" size={48} color={theme.colors.textLight} />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhum lembrete encontrado</Text>
            <Text style={styles.emptyStateDescription}>
              Você não possui dívidas próximas do vencimento
            </Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={renderReminder}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        )}

        <CustomButton
          title="Novo Lembrete"
          onPress={() => {
            // TODO: Implementar modal para criar novo lembrete
            Alert.alert('Em breve', 'Funcionalidade será implementada em breve!');
          }}
          size="medium"
          style={styles.newReminderButton}
        />
      </View>
    </SafeAreaView>
  );
}