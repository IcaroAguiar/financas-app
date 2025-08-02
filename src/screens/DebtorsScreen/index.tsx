import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Linking, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import Icon from '@/components/Icon';
import FloatingActionButton from '@/components/FloatingActionButton';
import DebtDetailsModal from '@/components/DebtDetailsModal';
import AddDebtorModal from '@/components/AddDebtorModal';
import { useDebtors } from '@/contexts/DebtorContext';
import { Debtor as ApiDebtor, Debt as ApiDebt } from '@/api/debtorService';
import { theme } from '@/styles/theme';

// Debtor interface imported from debtorService.ts

interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  interestApplied?: number;
}

interface Debt {
  id: string;
  description: string;
  totalAmount: number;
  originalAmount: number;
  dueDate: Date;
  status: 'PENDENTE' | 'PAGA' | 'ATRASADA';
  debtorId: string;
  interestRate?: number; // Monthly interest rate percentage
  installments?: Installment[];
  isInstallment: boolean;
  installmentCount?: number;
}

export default function DebtorsScreen() {
  const { 
    debtors, 
    loading, 
    refreshing, 
    refreshData, 
    addDebtor,
    getTotalDebtForDebtor, 
    getPendingDebtsForDebtor,
    getDebtsByDebtorId
  } = useDebtors();

  const [selectedDebtor, setSelectedDebtor] = useState<ApiDebtor | null>(null);
  const [showDebtDetails, setShowDebtDetails] = useState(false);
  const [showAddDebtor, setShowAddDebtor] = useState(false);


  // Mock debt details with installments
  const getDebtorDebts = (debtorId: string): Debt[] => {
    const mockDebts: { [key: string]: Debt[] } = {
      '1': [
        {
          id: 'debt1',
          description: 'Empréstimo Pessoal',
          totalAmount: 1200.00,
          originalAmount: 1000.00,
          dueDate: new Date(2025, 6, 15),
          status: 'ATRASADA',
          debtorId: '1',
          interestRate: 2.5, // 2.5% ao mês
          isInstallment: true,
          installmentCount: 4,
          installments: [
            {
              id: 'inst1',
              installmentNumber: 1,
              amount: 300.00,
              dueDate: new Date(2025, 5, 15),
              paidDate: new Date(2025, 5, 20),
              status: 'PAGO',
              interestApplied: 0
            },
            {
              id: 'inst2',
              installmentNumber: 2,
              amount: 300.00,
              dueDate: new Date(2025, 6, 15),
              status: 'ATRASADO',
              interestApplied: 50.00
            },
            {
              id: 'inst3',
              installmentNumber: 3,
              amount: 300.00,
              dueDate: new Date(2025, 7, 15),
              status: 'PENDENTE'
            },
            {
              id: 'inst4',
              installmentNumber: 4,
              amount: 300.00,
              dueDate: new Date(2025, 8, 15),
              status: 'PENDENTE'
            }
          ]
        },
        {
          id: 'debt2',
          description: 'Material de Construção',
          totalAmount: 450.00,
          originalAmount: 450.00,
          dueDate: new Date(2025, 8, 10),
          status: 'PENDENTE',
          debtorId: '1',
          isInstallment: false
        }
      ],
      '2': [
        {
          id: 'debt3',
          description: 'Serviços de Consultoria',
          totalAmount: 825.00,
          originalAmount: 750.00,
          dueDate: new Date(2025, 7, 20),
          status: 'PENDENTE',
          debtorId: '2',
          interestRate: 1.8,
          isInstallment: true,
          installmentCount: 3,
          installments: [
            {
              id: 'inst5',
              installmentNumber: 1,
              amount: 275.00,
              dueDate: new Date(2025, 6, 20),
              status: 'PENDENTE'
            },
            {
              id: 'inst6',
              installmentNumber: 2,
              amount: 275.00,
              dueDate: new Date(2025, 7, 20),
              status: 'PENDENTE'
            },
            {
              id: 'inst7',
              installmentNumber: 3,
              amount: 275.00,
              dueDate: new Date(2025, 8, 20),
              status: 'PENDENTE'
            }
          ]
        }
      ]
    };
    return mockDebts[debtorId] || [];
  };

  const handleMarkInstallmentPaid = (debtId: string, installmentId: string) => {
    Alert.alert(
      'Confirmar Pagamento',
      'Deseja marcar esta parcela como paga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // TODO: Implement API call to mark installment as paid
            Alert.alert('Sucesso', 'Parcela marcada como paga!');
            setShowDebtDetails(false);
          }
        }
      ]
    );
  };

  const sendWhatsAppMessage = (phone: string, debtorName: string, totalDebt: number) => {
    const message = `Olá ${debtorName}! Este é um lembrete sobre sua dívida pendente no valor de R$ ${totalDebt.toFixed(2)}. Por favor, entre em contato para acertarmos os detalhes do pagamento. Obrigado!`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'WhatsApp não está instalado neste dispositivo');
      }
    });
  };

  const sendEmail = (email: string, debtorName: string, totalDebt: number) => {
    const subject = 'Lembrete - Dívida Pendente';
    const body = `Olá ${debtorName}!\n\nEste é um lembrete sobre sua dívida pendente no valor de R$ ${totalDebt.toFixed(2)}.\n\nPor favor, entre em contato para acertarmos os detalhes do pagamento.\n\nObrigado!`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo de email');
      }
    });
  };

  const showContactOptions = (debtor: ApiDebtor) => {
    const options = [];
    
    if (debtor.phone) {
      options.push({
        text: 'WhatsApp',
        onPress: () => sendWhatsAppMessage(debtor.phone!, debtor.name, getTotalDebtForDebtor(debtor.id))
      });
    }
    
    if (debtor.email) {
      options.push({
        text: 'Email',
        onPress: () => sendEmail(debtor.email!, debtor.name, getTotalDebtForDebtor(debtor.id))
      });
    }
    
    if (options.length === 0) {
      Alert.alert('Sem contatos', 'Este devedor não possui informações de contato cadastradas.');
      return;
    }
    
    options.push({ text: 'Cancelar', style: 'cancel' });
    
    Alert.alert(
      'Cobrar Dívida',
      `Como deseja entrar em contato com ${debtor.name}?`,
      options as any
    );
  };

  const renderDebtor = ({ item }: { item: ApiDebtor }) => (
    <View style={styles.debtorCard}>
      <View style={styles.debtorHeader}>
        <View style={styles.debtorInfo}>
          <Text style={styles.debtorName}>{item.name}</Text>
          <View style={styles.contactInfo}>
            {item.email && (
              <View style={styles.contactItem}>
                <Icon name="mail" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.contactText}>{item.email}</Text>
              </View>
            )}
            {item.phone && (
              <View style={styles.contactItem}>
                <Icon name="phone" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.contactText}>{item.phone}</Text>
              </View>
            )}
            {!item.email && !item.phone && (
              <Text style={styles.noContactText}>Sem contato cadastrado</Text>
            )}
          </View>
        </View>
        <View style={styles.debtInfo}>
          <Text style={[styles.debtAmount, getTotalDebtForDebtor(item.id) > 0 ? styles.pendingDebt : styles.paidDebt]}>
            R$ {getTotalDebtForDebtor(item.id).toFixed(2)}
          </Text>
          <Text style={styles.pendingCount}>
            {getPendingDebtsForDebtor(item.id)} pendente{getPendingDebtsForDebtor(item.id) !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.debtorActions}>
        <TouchableOpacity
          style={[
            styles.viewDebtsButton,
            {
              backgroundColor: theme.colors.primary,
              paddingVertical: 14,
              paddingHorizontal: 12,
              borderRadius: 20,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
            }
          ]}
          onPress={() => {
            setSelectedDebtor(item);
            setShowDebtDetails(true);
          }}
        >
          <Text style={{
            color: theme.colors.surface,
            fontSize: 14,
            fontWeight: '600',
            fontFamily: theme.fonts.bold,
            textAlign: 'center'
          }}>
            Ver Detalhes
          </Text>
        </TouchableOpacity>
        
        {getTotalDebtForDebtor(item.id) > 0 && (item.email || item.phone) && (
          <TouchableOpacity
            style={[
              styles.chargeButton,
              {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.primary,
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 20,
                minHeight: 48,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
              }
            ]}
            onPress={() => showContactOptions(item)}
          >
            <Text style={{
              color: theme.colors.primary,
              fontSize: 14,
              fontWeight: '600',
              fontFamily: theme.fonts.bold,
              textAlign: 'center'
            }}>
              Cobrar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {debtors.length}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Devedores
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                R$ {debtors.reduce((sum, debtor) => sum + getTotalDebtForDebtor(debtor.id), 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Total Dívidas
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {debtors.reduce((sum, debtor) => sum + getPendingDebtsForDebtor(debtor.id), 0)}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                Pendentes
              </Text>
            </View>
          </View>
        </View>
        
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>Carregando devedores...</Text>
          </View>
        ) : debtors.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: theme.colors.textPrimary, marginBottom: 8 }}>Nenhum devedor encontrado</Text>
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
              Adicione um novo devedor usando o botão + ou verifique sua conexão com a internet
            </Text>
          </View>
        ) : (
          <FlatList
            data={debtors}
            keyExtractor={(item) => item.id}
            renderItem={renderDebtor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshData}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        )}

        <FloatingActionButton 
          onPress={() => setShowAddDebtor(true)} 
        />

        <DebtDetailsModal
          visible={showDebtDetails}
          debtor={selectedDebtor ? {
            ...selectedDebtor,
            totalDebt: getTotalDebtForDebtor(selectedDebtor.id),
            pendingDebts: getPendingDebtsForDebtor(selectedDebtor.id),
            overdueDebts: 0 // TODO: Implement overdue calculation when needed
          } : null}
          debts={selectedDebtor ? getDebtsByDebtorId(selectedDebtor.id).map((debt: ApiDebt) => ({
            ...debt,
            originalAmount: debt.totalAmount, // Use totalAmount as originalAmount for API debts
            isInstallment: false, // API debts don't have installment info yet
            dueDate: new Date(debt.dueDate), // Convert string to Date
            installments: [], // No installments from API yet
          })) : []}
          onClose={() => setShowDebtDetails(false)}
          onMarkInstallmentPaid={handleMarkInstallmentPaid}
        />

        <AddDebtorModal
          visible={showAddDebtor}
          onClose={() => setShowAddDebtor(false)}
          onSubmit={addDebtor}
        />
      </View>
    </SafeAreaView>
  );
}