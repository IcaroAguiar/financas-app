// @/screens/ProfileScreen/index.tsx
import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { useDebtors } from '@/contexts/DebtorContext';
import CustomButton from '@/components/CustomButton';
import GlobalHeader from '@/components/GlobalHeader';
import Icon from '@/components/Icon';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { summary } = useTransactions();
  const { debtors } = useDebtors();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* O GlobalHeader já vem da navegação, mas se não vier, podemos adicioná-lo aqui */}
      {/* <GlobalHeader title="Perfil" /> */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
        {/* --- Cards de Resumo --- */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Icon name="trending-up" size={24} color="#28a745" />
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalIncome)}</Text>
            <Text style={styles.summaryLabel}>Receitas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Icon name="trending-down" size={24} color="#dc3545" />
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalExpenses)}</Text>
            <Text style={styles.summaryLabel}>Despesas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Icon name="users" size={24} color="#2a9d8f" />
            <Text style={styles.summaryValue}>{debtors.length}</Text>
            <Text style={styles.summaryLabel}>Devedores</Text>
          </View>
        </View>

        {/* --- Card Principal --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.editButtonWrapper}>
            <CustomButton
              title="Editar Perfil"
              variant="primary"
              onPress={() => Alert.alert('Editar Perfil', 'Navegar para a tela de edição.')}
            />
          </View>
        </View>
        
        {/* --- Seção de Opções --- */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Opções</Text>
          
          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => Alert.alert('Configurações', 'Navegar para a tela de configurações.')}
          >
            <View style={styles.optionContent}>
              <Icon name="help-circle" size={20} color="#6c757d" />
              <Text style={styles.optionText}>Configurações</Text>
            </View>
            <Icon name="trending-up" size={16} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => Alert.alert('Exportar', 'Iniciar o fluxo de exportação.')}
          >
            <View style={styles.optionContent}>
              <Icon name="bar-chart" size={20} color="#6c757d" />
              <Text style={styles.optionText}>Exportar Relatório</Text>
            </View>
            <Icon name="trending-up" size={16} color="#6c757d" />
          </TouchableOpacity>
        </View>

        {/* --- Botão de Sair da Conta --- */}
        <View style={styles.logoutContainer}>
          <CustomButton
            title="Sair da Conta"
            variant="danger"
            size="large"
            onPress={handleSignOut}
            icon={<Icon name="user" size={18} color="#ffffff" />}
            iconPosition="left"
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}