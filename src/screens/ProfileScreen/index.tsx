// @/screens/ProfileScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Switch } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { useDebtors } from '@/contexts/DebtorContext';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/CustomButton';
import GlobalHeader from '@/components/GlobalHeader';
import Icon from '@/components/Icon';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, token, signOut, isBiometricSupported, isBiometricEnabled, setIsBiometricEnabled } = useAuth();
  const { summary } = useTransactions();
  const { debtors } = useDebtors();
  const { showSuccess, showError } = useToast();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  const handleBiometricToggle = async (value: boolean) => {
    if (!isBiometricSupported) {
      showError({ message: 'Seu dispositivo não suporta autenticação biométrica.' });
      return;
    }

    if (value) {
      // Check if user is logged in (has valid token)
      if (!user || !token) {
        showError({ message: 'Você precisa estar logado para habilitar a biometria.' });
        return;
      }
      
      // Enable biometrics - show confirmation modal
      setShowConfirmationModal(true);
    } else {
      // Disable biometrics
      try {
        await SecureStore.deleteItemAsync('FinancasApp_userEmail');
        await SecureStore.deleteItemAsync('FinancasApp_userPassword');
        await SecureStore.deleteItemAsync('FinancasApp_userToken');
        await setIsBiometricEnabled(false);
        showSuccess({ message: 'Login com biometria desabilitado.' });
      } catch (error) {
        showError({ message: 'Não foi possível desabilitar a biometria.' });
      }
    }
  };

  const handleEnableBiometrics = async () => {
    try {
      // Store the current session information for biometric use
      await SecureStore.setItemAsync('FinancasApp_userEmail', user?.email || '');
      // Store a special marker indicating this is a token-based biometric setup
      await SecureStore.setItemAsync('FinancasApp_userPassword', 'BIOMETRIC_TOKEN_AUTH');
      // Store the current token for biometric authentication
      await SecureStore.setItemAsync('FinancasApp_userToken', token || '');
      
      // Update biometric state (includes AsyncStorage save)
      await setIsBiometricEnabled(true);
      setShowConfirmationModal(false);
      
      showSuccess({ message: 'Login com biometria habilitado.' });
    } catch (error: any) {
      showError({ message: 'Erro ao habilitar biometria. Tente novamente.' });
    }
  };

  const handleCancelConfirmationModal = () => {
    setShowConfirmationModal(false);
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
            <Text style={styles.summaryLabel}>Cobranças</Text>
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
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          {isBiometricSupported && (
            <View style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Icon name="lock" size={20} color="#6c757d" />
                <Text style={styles.optionText}>Login com Biometria</Text>
              </View>
              <Switch value={isBiometricEnabled} onValueChange={handleBiometricToggle} />
            </View>
          )}

          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => Alert.alert('Ajuda', 'Navegar para a tela de ajuda.')}
          >
            <View style={styles.optionContent}>
              <Icon name="help-circle" size={20} color="#6c757d" />
              <Text style={styles.optionText}>Ajuda e Suporte</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => navigation.getParent()?.navigate('Accounts')}
          >
            <View style={styles.optionContent}>
              <Icon name="credit-card" size={20} color="#6c757d" />
              <Text style={styles.optionText}>Minhas Contas</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#6c757d" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => Alert.alert('Exportar', 'Iniciar o fluxo de exportação.')}
          >
            <View style={styles.optionContent}>
              <Icon name="bar-chart" size={20} color="#6c757d" />
              <Text style={styles.optionText}>Exportar Relatório</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#6c757d" />
          </TouchableOpacity>
        </View>

        {/* --- Botão de Sair da Conta --- */}
        <View style={styles.logoutContainer}>
          <CustomButton
            title="Sair da Conta"
            variant="danger"
            size="large"
            onPress={handleSignOut}
            icon={<Icon name="log-out" size={18} color="#ffffff" />}
            iconPosition="left"
          />
        </View>
        
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelConfirmationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Habilitar Login com Biometria</Text>
            <Text style={styles.modalDescription}>
              Deseja habilitar o login com biometria para facilitar o acesso ao aplicativo?
            </Text>
            
            <View style={styles.modalButtons}>
              <CustomButton
                title="Cancelar"
                variant="secondary"
                onPress={handleCancelConfirmationModal}
                style={styles.modalButton}
              />
              <CustomButton
                title="Confirmar"
                variant="primary"
                onPress={handleEnableBiometrics}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}