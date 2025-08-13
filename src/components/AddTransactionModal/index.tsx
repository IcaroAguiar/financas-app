// @/components/AddTransactionModal/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./styles";
import CustomInput from "@/components/CustomInput";
import { TransactionType } from "@/types/transactions";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import { theme } from "@/styles/theme";
import { CreateTransactionData, UpdateTransactionData } from '@/api/transactionService';
import { useAccounts } from '@/contexts/AccountContext';
import { Account } from '@/api/accountService';
import { Transaction } from '@/types/transactions';
import AddEditAccountModal from '@/components/AddEditAccountModal';
import { useToast } from '@/hooks/useToast';
import { useDebtors } from '@/contexts/DebtorContext';
import { SubscriptionFrequency } from '@/api/subscriptionService';
import { useCategories } from '@/contexts/CategoryContext';
import { Category } from '@/types/category';
import AddCategoryModal from '@/components/AddCategoryModal';
import { predefinedCategories, getPredefinedCategoriesByType, PredefinedCategory } from '@/data/categories';

interface CreateCategoryData {
  name: string;
  color?: string;
}


interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<CreateTransactionData, "date">) => void;
  onUpdate?: (id: string, data: Omit<UpdateTransactionData, "date">) => void;
  transaction?: Transaction | null; // For editing mode
  initialType?: TransactionType;
}

export default function AddTransactionModal({
  visible,
  onClose,
  onSave,
  onUpdate,
  transaction,
  initialType = "DESPESA",
}: AddTransactionModalProps) {
  const { accounts, refreshData } = useAccounts();
  const { debts } = useDebtors();
  const { categories, addCategory, refreshCategories } = useCategories();
  const toast = useToast();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>(initialType);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  
  // New states for subscription and debt payment options
  const [isRecurring, setIsRecurring] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<SubscriptionFrequency>('MONTHLY');
  const [selectedDebtId, setSelectedDebtId] = useState<string | undefined>(undefined);
  const [showDebtPicker, setShowDebtPicker] = useState(false);
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  
  // Payment plan states (parcelamento)
  const [isInstallmentPlan, setIsInstallmentPlan] = useState(false);
  const [installmentCount, setInstallmentCount] = useState('1');
  const [installmentFrequency, setInstallmentFrequency] = useState<'MONTHLY' | 'WEEKLY'>('MONTHLY');
  const [firstInstallmentDate, setFirstInstallmentDate] = useState('');

  // Check if we're in editing mode
  const isEditing = Boolean(transaction);

  // Update type when initialType changes or populate form when editing
  useEffect(() => {
    if (transaction) {
      // Populate form with transaction data for editing
      setDescription(transaction.description);
      setAmount(formatCurrency((transaction.amount * 100).toString())); // Convert to cents format for mask
      setType(transaction.type);
      setSelectedAccountId(transaction.account?.id);
      setSelectedCategoryId(transaction.category?.id);
      
      // Set recurring transaction fields
      setIsRecurring(transaction.isRecurring === true);
      if (transaction.subscriptionFrequency) {
        setSubscriptionFrequency(transaction.subscriptionFrequency);
      }
      
      // Set payment plan fields
      setIsInstallmentPlan(Boolean(transaction.isInstallmentPlan));
      if (transaction.installmentCount) {
        setInstallmentCount(transaction.installmentCount.toString());
      }
      if (transaction.installmentFrequency) {
        setInstallmentFrequency(transaction.installmentFrequency);
      }
      if (transaction.firstInstallmentDate) {
        setFirstInstallmentDate(transaction.firstInstallmentDate);
      }
    } else {
      setType(initialType);
    }
  }, [initialType, transaction]);

  // Currency formatting functions - Simplified and reliable approach
  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // If empty, return empty
    if (!numericValue) return '';
    
    // Convert to cents (divide by 100 to get proper decimal places)
    const cents = parseInt(numericValue, 10);
    const reais = cents / 100;
    
    // Format as Brazilian currency
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);
  };

  const parseCurrencyToNumber = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    
    // Remove currency symbols, spaces, and thousand separators
    let numericString = formattedValue.replace(/[R$\s.]/g, '');
    
    // Convert Brazilian decimal comma to dot
    numericString = numericString.replace(',', '.');
    
    return parseFloat(numericString) || 0;
  };

  // Payment plan helper functions
  const formatDate = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  const handleFirstInstallmentDateChange = (text: string) => {
    const formatted = formatDate(text);
    setFirstInstallmentDate(formatted);
  };

  const calculateInstallmentValue = () => {
    const totalAmount = parseCurrencyToNumber(amount);
    const count = parseInt(installmentCount) || 1;
    return totalAmount / count;
  };

  const formatInstallmentInfo = () => {
    if (!isInstallmentPlan) return '';
    const installmentValue = calculateInstallmentValue();
    const count = parseInt(installmentCount) || 1;
    const frequency = installmentFrequency === 'MONTHLY' ? 'mensais' : 'semanais';
    return `${count}x de ${formatCurrency((installmentValue * 100).toString())} ${frequency}`;
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType(initialType);
    setSelectedAccountId(undefined);
    setSelectedCategoryId(undefined);
    setShowAccountPicker(false);
    setShowCategoryPicker(false);
    setIsRecurring(false);
    setSubscriptionFrequency('MONTHLY');
    setSelectedDebtId(undefined);
    setIsPartialPayment(false);
    setIsInstallmentPlan(false);
    setInstallmentCount('1');
    setInstallmentFrequency('MONTHLY');
    setFirstInstallmentDate('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };

  const handleSave = () => {
    // Validação
    if (!description || !amount) {
      toast.showError({ message: "Descrição e valor são obrigatórios." });
      return;
    }
    
    const numericAmount = parseCurrencyToNumber(amount);
    
    if (numericAmount <= 0) {
      toast.showError({ message: "O valor deve ser maior que zero." });
      return;
    }

    // Validation for payment plans
    if (isInstallmentPlan) {
      if (!firstInstallmentDate.trim()) {
        toast.showError({ message: "Data da primeira parcela é obrigatória." });
        return;
      }

      const count = parseInt(installmentCount);
      if (!count || count < 1 || count > 48) {
        toast.showError({ message: "Número de parcelas deve ser entre 1 e 48." });
        return;
      }
    }
    
    if (isEditing && transaction && onUpdate) {
      // Editing mode - update existing transaction
      const updateData: Omit<UpdateTransactionData, "date"> = {
        description,
        amount: numericAmount,
        type,
        categoryId: selectedCategoryId,
        accountId: selectedAccountId,
      };
      
      onUpdate(transaction.id, updateData);
    } else {
      // Creation mode - create new transaction
      const transactionData: Omit<CreateTransactionData, "date"> = {
        description,
        amount: numericAmount,
        type,
        categoryId: selectedCategoryId,
        accountId: selectedAccountId,
        isRecurring,
        subscriptionFrequency: isRecurring ? subscriptionFrequency : undefined,
        debtId: isPartialPayment ? selectedDebtId : undefined,
        // Payment plan data
        isInstallmentPlan,
        installmentCount: isInstallmentPlan ? parseInt(installmentCount) : undefined,
        installmentFrequency: isInstallmentPlan ? installmentFrequency : undefined,
        firstInstallmentDate: isInstallmentPlan ? firstInstallmentDate : undefined,
      };
      
      onSave(transactionData);
    }
    
    resetForm();
  };

  const getSelectedAccountName = () => {
    if (!selectedAccountId) return "Nenhuma";
    const account = accounts.find(acc => acc.id === selectedAccountId);
    return account ? account.name : "Nenhuma";
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return "Nenhuma";
    
    // Check user categories first
    const userCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (userCategory) return userCategory.name;
    
    // Check predefined categories
    const predefinedCategory = predefinedCategories.find(cat => cat.id === selectedCategoryId);
    if (predefinedCategory) return predefinedCategory.name;
    
    return "Nenhuma";
  };

  const getSelectedDebtName = () => {
    if (!selectedDebtId) return "Selecione uma dívida";
    const debt = debts.find(debt => debt.id === selectedDebtId);
    return debt ? `${debt.description} - R$ ${debt.totalAmount.toFixed(2)}` : "Selecione uma dívida";
  };

  const handleAddAccount = () => {
    setShowAccountPicker(false);
    setShowAddAccountModal(true);
  };

  const handleAccountCreated = async () => {
    setShowAddAccountModal(false);
    await refreshData(); // Refresh the accounts list
    setShowAccountPicker(true); // Reopen the account picker
  };

  const handleAddCategory = () => {
    setShowCategoryPicker(false);
    setShowAddCategoryModal(true);
  };

  const handleCategoryCreated = async (categoryData: CreateCategoryData) => {
    try {
      await addCategory(categoryData);
      await refreshCategories(); // Refresh the categories list
      // The new category will be available after refresh
      toast.showSuccess({ message: "Categoria criada com sucesso!" });
    } catch (error) {
      toast.showError({ message: "Erro ao criar categoria" });
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      useNativeDriver={false}
      hideModalContentWhileAnimating={false}
      avoidKeyboard={true}
      coverScreen={false}
    >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={50}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalView}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "DESPESA"
                  ? styles.typeButtonSelected
                  : styles.typeButtonUnselected,
              ]}
              onPress={() => setType("DESPESA")}
            >
              <Text
                style={[
                  styles.typeText,
                  type === "DESPESA"
                    ? styles.typeTextSelected
                    : styles.typeTextUnselected,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "RECEITA"
                  ? styles.typeButtonSelected
                  : styles.typeButtonUnselected,
              ]}
              onPress={() => setType("RECEITA")}
            >
              <Text
                style={[
                  styles.typeText,
                  type === "RECEITA"
                    ? styles.typeTextSelected
                    : styles.typeTextUnselected,
                ]}
              >
                Recebimento
              </Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            placeholder="Descrição (Ex: Supermercado)"
            value={description}
            onChangeText={setDescription}
          />
          <CustomInput
            placeholder="Valor (Ex: R$ 150,00)"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />

          {/* Category Selector */}
          <View style={styles.accountSelectorContainer}>
            <Text style={styles.accountLabel}>Categoria (Opcional)</Text>
            <TouchableOpacity
              style={styles.accountSelector}
              onPress={() => setShowCategoryPicker(true)}
            >
              <View style={styles.accountSelectorContent}>
                <Icon name="list" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.accountSelectorText}>
                  {getSelectedCategoryName()}
                </Text>
              </View>
              <Icon name="chevron-down" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Account Selector */}
          <View style={styles.accountSelectorContainer}>
            <Text style={styles.accountLabel}>Conta/Banco (Opcional)</Text>
            <TouchableOpacity
              style={styles.accountSelector}
              onPress={() => setShowAccountPicker(true)}
            >
              <View style={styles.accountSelectorContent}>
                <Icon name="credit-card" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.accountSelectorText}>
                  {getSelectedAccountName()}
                </Text>
              </View>
              <Icon name="chevron-down" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Subscription/Recurring Option */}
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
                {isRecurring && <Icon name="check" size={16} color={theme.colors.surface} />}
              </View>
              <Text style={styles.checkboxLabel}>Tornar recorrente</Text>
            </TouchableOpacity>
            
            {isRecurring && (
              <View style={styles.frequencySelector}>
                <Text style={styles.accountLabel}>Frequência:</Text>
                <View style={styles.frequencyButtons}>
                  {(['MONTHLY', 'WEEKLY', 'YEARLY'] as SubscriptionFrequency[]).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        subscriptionFrequency === freq && styles.frequencyButtonSelected
                      ]}
                      onPress={() => setSubscriptionFrequency(freq)}
                    >
                      <Text style={[
                        styles.frequencyButtonText,
                        subscriptionFrequency === freq && styles.frequencyButtonTextSelected
                      ]}>
                        {freq === 'MONTHLY' ? 'Mensal' : freq === 'WEEKLY' ? 'Semanal' : 'Anual'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Partial Payment Option (only for RECEITA type) */}
          {type === 'RECEITA' && debts.filter(debt => debt.status === 'PENDENTE').length > 0 && (
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsPartialPayment(!isPartialPayment)}
              >
                <View style={[styles.checkbox, isPartialPayment && styles.checkboxChecked]}>
                  {isPartialPayment && <Icon name="check" size={16} color={theme.colors.surface} />}
                </View>
                <Text style={styles.checkboxLabel}>Pagamento parcelado</Text>
              </TouchableOpacity>
              
              {isPartialPayment && (
                <View style={styles.debtSelectorContainer}>
                  <Text style={styles.accountLabel}>Dívida:</Text>
                  <TouchableOpacity
                    style={styles.accountSelector}
                    onPress={() => setShowDebtPicker(true)}
                  >
                    <View style={styles.accountSelectorContent}>
                      <Icon name="dollar-sign" size={20} color={theme.colors.text.secondary} />
                      <Text style={styles.accountSelectorText}>
                        {getSelectedDebtName()}
                      </Text>
                    </View>
                    <Icon name="chevron-down" size={20} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Payment Plan Option (Parcelamento) - Only for DESPESA type */}
          {type === 'DESPESA' && !isRecurring && !isPartialPayment && (
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsInstallmentPlan(!isInstallmentPlan)}
              >
                <View style={[styles.checkbox, isInstallmentPlan && styles.checkboxChecked]}>
                  {isInstallmentPlan && <Icon name="check" size={16} color={theme.colors.surface} />}
                </View>
                <Text style={styles.checkboxLabel}>Parcelar pagamento</Text>
              </TouchableOpacity>
              
              {isInstallmentPlan && (
                <>
                  <View style={styles.installmentRow}>
                    <View style={[styles.installmentInput, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.accountLabel}>Nº de Parcelas:</Text>
                      <CustomInput
                        placeholder="2"
                        value={installmentCount}
                        onChangeText={setInstallmentCount}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    
                    <View style={[styles.installmentInput, { flex: 2, marginLeft: 8 }]}>
                      <Text style={styles.accountLabel}>Frequência:</Text>
                      <View style={styles.frequencySelector}>
                        <TouchableOpacity
                          style={[
                            styles.frequencyButton,
                            installmentFrequency === 'MONTHLY' && styles.frequencyButtonSelected
                          ]}
                          onPress={() => setInstallmentFrequency('MONTHLY')}
                        >
                          <Text style={[
                            styles.frequencyButtonText,
                            installmentFrequency === 'MONTHLY' && styles.frequencyButtonTextSelected
                          ]}>
                            Mensal
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.frequencyButton,
                            installmentFrequency === 'WEEKLY' && styles.frequencyButtonSelected
                          ]}
                          onPress={() => setInstallmentFrequency('WEEKLY')}
                        >
                          <Text style={[
                            styles.frequencyButtonText,
                            installmentFrequency === 'WEEKLY' && styles.frequencyButtonTextSelected
                          ]}>
                            Semanal
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.installmentDateContainer}>
                    <Text style={styles.accountLabel}>Data da 1ª Parcela:</Text>
                    <CustomInput
                      placeholder="DD/MM/AAAA"
                      value={firstInstallmentDate}
                      onChangeText={handleFirstInstallmentDateChange}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>

                  {amount && installmentCount && parseInt(installmentCount) > 1 && (
                    <View style={styles.installmentPreview}>
                      <Text style={styles.previewLabel}>Resumo do Parcelamento:</Text>
                      <Text style={styles.previewText}>{formatInstallmentInfo()}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          <View style={styles.actionButtonsContainer}>
            {/* Botão de Cancelar agora tem largura controlada */}
            <View style={styles.buttonWrapper}>
              <CustomButton
                title="Cancelar"
                variant="ghost"
                onPress={handleClose}
              />
            </View>

            {/* Botão de Salvar também */}
            <View style={styles.buttonWrapper}>
              <CustomButton title={isEditing ? "Atualizar" : "Salvar"} onPress={handleSave} />
            </View>
          </View>
          </View>
        </KeyboardAwareScrollView>

      {/* Account Picker Modal */}
      {showAccountPicker && (
        <View style={styles.accountPickerOverlay}>
          <View style={styles.accountPickerContainer}>
            <Text style={styles.accountPickerTitle}>Selecione uma conta:</Text>
            
            {/* Option for "Nenhuma" */}
            <TouchableOpacity
              style={[
                styles.accountOption,
                !selectedAccountId && styles.accountOptionSelected
              ]}
              onPress={() => {
                setSelectedAccountId(undefined);
                setShowAccountPicker(false);
              }}
            >
              <View style={styles.accountOptionContent}>
                <Icon name="x" size={20} color={theme.colors.text.secondary} />
                <Text style={[
                  styles.accountOptionText,
                  !selectedAccountId && styles.accountOptionTextSelected
                ]}>
                  Nenhuma
                </Text>
              </View>
              {!selectedAccountId && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </TouchableOpacity>

            {/* User accounts */}
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  selectedAccountId === account.id && styles.accountOptionSelected
                ]}
                onPress={() => {
                  setSelectedAccountId(account.id);
                  setShowAccountPicker(false);
                }}
              >
                <View style={styles.accountOptionContent}>
                  <Icon name="credit-card" size={20} color={theme.colors.text.secondary} />
                  <View>
                    <Text style={[
                      styles.accountOptionText,
                      selectedAccountId === account.id && styles.accountOptionTextSelected
                    ]}>
                      {account.name}
                    </Text>
                    <Text style={styles.accountOptionType}>{account.type}</Text>
                  </View>
                </View>
                {selectedAccountId === account.id && (
                  <Icon name="check" size={16} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            {/* Add Account Button */}
            <TouchableOpacity
              style={styles.addAccountButton}
              onPress={handleAddAccount}
            >
              <View style={styles.accountOptionContent}>
                <Icon name="plus" size={20} color={theme.colors.primary} />
                <Text style={styles.addAccountText}>
                  Criar Nova Conta
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelAccountSelection}
              onPress={() => setShowAccountPicker(false)}
            >
              <Text style={styles.cancelAccountText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Debt Picker Modal */}
      {showDebtPicker && (
        <View style={styles.accountPickerOverlay}>
          <View style={styles.accountPickerContainer}>
            <Text style={styles.accountPickerTitle}>Selecione a dívida:</Text>
            
            {/* Pending debts */}
            {debts.filter(debt => debt.status === 'PENDENTE').map((debt) => (
              <TouchableOpacity
                key={debt.id}
                style={[
                  styles.accountOption,
                  selectedDebtId === debt.id && styles.accountOptionSelected
                ]}
                onPress={() => {
                  setSelectedDebtId(debt.id);
                  setShowDebtPicker(false);
                }}
              >
                <View style={styles.accountOptionContent}>
                  <Icon name="dollar-sign" size={20} color={theme.colors.text.secondary} />
                  <View>
                    <Text style={[
                      styles.accountOptionText,
                      selectedDebtId === debt.id && styles.accountOptionTextSelected
                    ]}>
                      {debt.description}
                    </Text>
                    <Text style={styles.accountOptionType}>
                      Total: R$ {debt.totalAmount.toFixed(2)} • {debt.debtor?.name}
                    </Text>
                  </View>
                </View>
                {selectedDebtId === debt.id && (
                  <Icon name="check" size={16} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelAccountSelection}
              onPress={() => setShowDebtPicker(false)}
            >
              <Text style={styles.cancelAccountText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <View style={styles.accountPickerOverlay}>
          <View style={styles.accountPickerContainer}>
            <Text style={styles.accountPickerTitle}>Selecione uma categoria:</Text>
            
            <ScrollView
              style={styles.categoryScrollView}
              contentContainerStyle={styles.categoryScrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* Option for "Nenhuma" */}
              <TouchableOpacity
                style={[
                  styles.accountOption,
                  !selectedCategoryId && styles.accountOptionSelected
                ]}
                onPress={() => {
                  setSelectedCategoryId(undefined);
                  setShowCategoryPicker(false);
                }}
              >
                <View style={styles.accountOptionContent}>
                  <Icon name="x" size={20} color={theme.colors.text.secondary} />
                  <Text style={[
                    styles.accountOptionText,
                    !selectedCategoryId && styles.accountOptionTextSelected
                  ]}>
                    Nenhuma
                  </Text>
                </View>
                {!selectedCategoryId && (
                  <Icon name="check" size={16} color={theme.colors.primary} />
                )}
              </TouchableOpacity>

              {/* Predefined Categories Section */}
              {(type === 'RECEITA' || type === 'DESPESA') && getPredefinedCategoriesByType(type).length > 0 && (
                <>
                  <View style={styles.categorySectionHeader}>
                    <Text style={styles.categorySectionTitle}>Categorias Principais</Text>
                  </View>
                  
                  {getPredefinedCategoriesByType(type).map((predefinedCategory) => (
                    <TouchableOpacity
                      key={`predefined-${predefinedCategory.id}`}
                      style={[
                        styles.accountOption,
                        selectedCategoryId === predefinedCategory.id && styles.accountOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedCategoryId(predefinedCategory.id);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View style={styles.accountOptionContent}>
                        <View style={styles.predefinedIconContainer}>
                          <Icon 
                            name={predefinedCategory.icon as any} 
                            size={18} 
                            color={predefinedCategory.color} 
                          />
                        </View>
                        <Text style={[
                          styles.accountOptionText,
                          selectedCategoryId === predefinedCategory.id && styles.accountOptionTextSelected
                        ]}>
                          {predefinedCategory.name}
                        </Text>
                      </View>
                      {selectedCategoryId === predefinedCategory.id && (
                        <Icon name="check" size={16} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {/* User Categories Section */}
              {categories.length > 0 && (
                <>
                  <View style={styles.categorySectionHeader}>
                    <Text style={styles.categorySectionTitle}>Suas Categorias</Text>
                  </View>
                  
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={`user-${category.id}`}
                      style={[
                        styles.accountOption,
                        selectedCategoryId === category.id && styles.accountOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedCategoryId(category.id);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View style={styles.accountOptionContent}>
                        <View style={[
                          styles.categoryColorIndicator,
                          { backgroundColor: category.color || theme.colors.primary }
                        ]} />
                        <Text style={[
                          styles.accountOptionText,
                          selectedCategoryId === category.id && styles.accountOptionTextSelected
                        ]}>
                          {category.name}
                        </Text>
                      </View>
                      {selectedCategoryId === category.id && (
                        <Icon name="check" size={16} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {/* Add Category Button */}
              <TouchableOpacity
                style={styles.addAccountButton}
                onPress={handleAddCategory}
              >
                <View style={styles.accountOptionContent}>
                  <Icon name="plus" size={20} color={theme.colors.primary} />
                  <Text style={styles.addAccountText}>
                    Criar Nova Categoria
                  </Text>
                </View>
                <Icon name="chevron-right" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelAccountSelection}
              onPress={() => setShowCategoryPicker(false)}
            >
              <Text style={styles.cancelAccountText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Add Account Modal */}
      <AddEditAccountModal
        visible={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        onAccountSaved={handleAccountCreated}
        account={null}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        visible={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleCategoryCreated}
      />
    </Modal>
  );
}
