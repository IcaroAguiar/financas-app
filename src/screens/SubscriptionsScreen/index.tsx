// src/screens/SubscriptionsScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import Icon from '@/components/Icon';
import FloatingActionButton from '@/components/FloatingActionButton';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { Subscription, formatFrequency, formatNextPaymentDate, getSubscriptionColor } from '@/api/subscriptionService';
import { theme } from '@/styles/theme';
import { useToast } from '@/hooks/useToast';

export default function SubscriptionsScreen() {
  const { 
    subscriptions, 
    loading, 
    refreshing, 
    summary,
    refreshSubscriptions,
    deleteSubscriptionById,
    toggleSubscriptionById,
    processAllSubscriptions
  } = useSubscriptions();
  
  const toast = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const handleAddSubscription = () => {
    setEditingSubscription(null);
    setModalVisible(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setModalVisible(true);
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    toast.showConfirmation({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a assinatura "${subscription.name}"?\n\nEsta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await deleteSubscriptionById(subscription.id);
          toast.showSuccess({ message: 'Assinatura excluída com sucesso!' });
        } catch (error: any) {
          toast.showError({ message: error.message || 'Erro ao excluir assinatura' });
        }
      },
    });
  };

  const handleToggleSubscription = async (subscription: Subscription) => {
    try {
      await toggleSubscriptionById(subscription.id);
      const action = subscription.isActive ? 'pausada' : 'reativada';
      toast.showSuccess({ message: `Assinatura ${action} com sucesso!` });
    } catch (error: any) {
      toast.showError({ message: error.message || 'Erro ao alterar status da assinatura' });
    }
  };

  const handleProcessSubscriptions = async () => {
    try {
      const result = await processAllSubscriptions();
      if (result.processedCount > 0) {
        toast.showSuccess({ 
          message: `${result.processedCount} assinatura(s) processada(s) com sucesso!` 
        });
      } else {
        toast.showInfo({ 
          message: 'Nenhuma assinatura precisava ser processada no momento.' 
        });
      }
    } catch (error: any) {
      toast.showError({ message: error.message || 'Erro ao processar assinaturas' });
    }
  };

  const getFilteredSubscriptions = () => {
    switch (filterStatus) {
      case 'active':
        return subscriptions.filter(s => s.isActive);
      case 'inactive':
        return subscriptions.filter(s => !s.isActive);
      default:
        return subscriptions;
    }
  };

  const renderSubscriptionItem = ({ item }: { item: Subscription }) => (
    <View style={styles.subscriptionCard}>
      <View style={styles.subscriptionHeader}>
        <View style={styles.subscriptionIcon}>
          <Icon 
            name="calendar" 
            size={20} 
            color={getSubscriptionColor(item.type, item.isOverdue)} 
          />
        </View>
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionName}>{item.name}</Text>
          <Text style={styles.subscriptionDescription}>
            {formatFrequency(item.frequency)} • {item.type === 'RECEITA' ? 'Receita' : 'Despesa'}
          </Text>
          {item.category && (
            <Text style={styles.subscriptionCategory}>📂 {item.category.name}</Text>
          )}
        </View>
        <View style={styles.subscriptionActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleEditSubscription(item)}
          >
            <Icon name="edit-2" size={16} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleToggleSubscription(item)}
          >
            <Icon 
              name={item.isActive ? "pause" : "play"} 
              size={16} 
              color={item.isActive ? theme.colors.warning : theme.colors.success} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDeleteSubscription(item)}
          >
            <Icon name="trash-2" size={16} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.subscriptionDetails}>
        <View style={styles.subscriptionAmount}>
          <Text style={styles.amountLabel}>Valor</Text>
          <Text style={[
            styles.amountValue, 
            { color: getSubscriptionColor(item.type, item.isOverdue) }
          ]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
        
        <View style={styles.subscriptionNext}>
          <Text style={styles.nextLabel}>Próximo Pagamento</Text>
          <Text style={[
            styles.nextValue,
            item.isOverdue && styles.overdueText
          ]}>
            {formatNextPaymentDate(item.nextPaymentDate)}
          </Text>
        </View>
      </View>

      {!item.isActive && (
        <View style={styles.inactiveBadge}>
          <Text style={styles.inactiveBadgeText}>Pausada</Text>
        </View>
      )}

      {item.isOverdue && (
        <View style={styles.overdueBadge}>
          <Text style={styles.overdueBadgeText}>Vencida</Text>
        </View>
      )}
    </View>
  );

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Ativas</Text>
        <Text style={styles.summaryValue}>{summary.totalActive}</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Receita Mensal</Text>
        <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
          {formatCurrency(summary.monthlyIncome)}
        </Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Despesa Mensal</Text>
        <Text style={[styles.summaryValue, { color: theme.colors.danger }]}>
          {formatCurrency(summary.monthlyExpense)}
        </Text>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filterStatus === 'all' && styles.activeFilterButton]}
        onPress={() => setFilterStatus('all')}
      >
        <Text style={[styles.filterText, filterStatus === 'all' && styles.activeFilterText]}>
          Todas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filterStatus === 'active' && styles.activeFilterButton]}
        onPress={() => setFilterStatus('active')}
      >
        <Text style={[styles.filterText, filterStatus === 'active' && styles.activeFilterText]}>
          Ativas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filterStatus === 'inactive' && styles.activeFilterButton]}
        onPress={() => setFilterStatus('inactive')}
      >
        <Text style={[styles.filterText, filterStatus === 'inactive' && styles.activeFilterText]}>
          Pausadas
        </Text>
      </TouchableOpacity>
      
      {/* Process button */}
      <TouchableOpacity
        style={styles.processButton}
        onPress={handleProcessSubscriptions}
      >
        <Icon name="refresh-cw" size={14} color={theme.colors.primary} />
        <Text style={styles.processButtonText}>Processar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="calendar" size={48} color={theme.colors.text.light} />
      <Text style={styles.emptyTitle}>Nenhuma assinatura encontrada</Text>
      <Text style={styles.emptyDescription}>
        Comece criando sua primeira assinatura{'\\n'}
        tocando no botão + abaixo
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando assinaturas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredSubscriptions = getFilteredSubscriptions();

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.content}>
        {renderSummaryCards()}
        {renderFilters()}
        
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={renderSubscriptionItem}
          contentContainerStyle={[
            styles.listContainer,
            filteredSubscriptions.length === 0 && styles.emptyListContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshSubscriptions}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FloatingActionButton onPress={handleAddSubscription} />

      <AddSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        subscription={editingSubscription}
      />
    </SafeAreaView>
  );
}