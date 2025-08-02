import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { useDebtors } from '@/contexts/DebtorContext';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { updateProfile, UpdateProfileData } from '@/api/authService';
import Icon from '@/components/Icon';
import { theme } from '@/styles/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { summary } = useTransactions();
  const { debtors, debts } = useDebtors();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: UpdateProfileData = {};
      if (name !== user?.name) updateData.name = name;
      if (email !== user?.email) updateData.email = email;

      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível atualizar o perfil.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Icon name="coins" size={24} color={theme.colors.success} />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalIncome)}</Text>
            <Text style={styles.summaryLabel}>Recebimentos</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Icon name="wallet" size={24} color={theme.colors.error} />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalExpenses)}</Text>
            <Text style={styles.summaryLabel}>Despesas</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Icon name="users" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.summaryValue}>{debtors.length}</Text>
            <Text style={styles.summaryLabel}>Devedores</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nome</Text>
              {isEditing ? (
                <CustomInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.name}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              {isEditing ? (
                <CustomInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Seu email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.email}</Text>
              )}
            </View>

            {isEditing ? (
              <View style={styles.actionButtons}>
                <CustomButton
                  title={isSaving ? "Salvando..." : "Salvar"}
                  variant="primary"
                  size="small"
                  onPress={handleSaveProfile}
                  loading={isSaving}
                  disabled={isSaving}
                  style={styles.saveButton}
                />
                <CustomButton
                  title="Cancelar"
                  variant="secondary"
                  size="small"
                  onPress={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                  }}
                  style={styles.cancelButton}
                />
              </View>
            ) : (
              <View style={styles.editButtonContainer}>
                <CustomButton
                  title="Editar Perfil"
                  variant="primary"
                  size="small"
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <CustomButton
            title="Alterar Senha"
            variant="outline"
            size="small"
            onPress={() => Alert.alert('Alterar Senha', 'Esta funcionalidade será implementada em breve. Você poderá alterar sua senha de acesso aqui.')}
            style={styles.settingButton}
          />
          
          <CustomButton
            title="Configurar Notificações"
            variant="outline"
            size="small"
            onPress={() => Alert.alert('Notificações', 'Esta funcionalidade será implementada em breve. Você poderá configurar suas preferências de notificação aqui.')}
            style={styles.settingButton}
          />
          
          <CustomButton
            title="Exportar Dados"
            variant="outline"
            size="small"
            onPress={() => Alert.alert('Exportar Dados', 'Esta funcionalidade será implementada em breve. Você poderá exportar seus dados financeiros em formato CSV ou PDF.')}
            style={styles.settingButton}
          />
        </View>

        {/* Logout Button - Inside scrollable area */}
        <View style={styles.logoutContainer}>
          <CustomButton
            title="Sair da Conta"
            variant="outline"
            size="small"
            onPress={handleSignOut}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
}