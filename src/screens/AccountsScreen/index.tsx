// src/screens/AccountsScreen/index.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import Icon from '@/components/Icon';
import FloatingActionButton from '@/components/FloatingActionButton';
import GlobalHeader from '@/components/GlobalHeader';
import AddEditAccountModal from '@/components/AddEditAccountModal';
import { useAccounts } from '@/contexts/AccountContext';
import { Account } from '@/api/accountService';
import { theme } from '@/styles/theme';
import { useToast } from '@/hooks/useToast';

export default function AccountsScreen() {
  const { 
    accounts, 
    loading, 
    refreshing, 
    refreshData, 
    removeAccount 
  } = useAccounts();
  
  const toast = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setModalVisible(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setModalVisible(true);
  };

  const handleDeleteAccount = (account: Account) => {
    toast.showConfirmation({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a conta "${account.name}"?\n\nEsta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await removeAccount(account.id);
          toast.showSuccess({ message: 'Conta excluída com sucesso!' });
        } catch (error: any) {
          toast.showError({ message: error.message || 'Erro ao excluir conta' });
        }
      },
    });
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountIcon}>
          <Icon 
            name="credit-card" 
            size={20} 
            color={theme.colors.primary} 
          />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.accountType}>{item.type}</Text>
        </View>
        <View style={styles.accountActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleEditAccount(item)}
          >
            <Icon name="edit-2" size={16} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDeleteAccount(item)}
          >
            <Icon name="trash-2" size={16} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.accountBalance}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={styles.balanceValue}>{formatCurrency(item.balance)}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="credit-card" size={48} color={theme.colors.text.light} />
      <Text style={styles.emptyTitle}>Nenhuma conta encontrada</Text>
      <Text style={styles.emptyDescription}>
        Comece criando sua primeira conta{'\n'}
        tocando no botão + abaixo
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <GlobalHeader title="Minhas Contas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando contas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader title="Minhas Contas" />
      
      <View style={styles.content}>
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderAccountItem}
          contentContainerStyle={[
            styles.listContainer,
            accounts.length === 0 && styles.emptyListContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshData}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FloatingActionButton
        onPress={handleAddAccount}
      />

      <AddEditAccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        account={editingAccount}
      />
    </SafeAreaView>
  );
}