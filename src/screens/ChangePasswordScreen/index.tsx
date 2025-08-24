// @/screens/ChangePasswordScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import GlobalHeader from '@/components/GlobalHeader';
import Icon from '@/components/Icon';
import * as authService from '@/api/authService';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Validação da força da senha
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Muito fraca', color: '#dc3545' };
    if (password.length < 8) return { strength: 2, label: 'Fraca', color: '#fd7e14' };
    
    let score = 2;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score >= 5) return { strength: 4, label: 'Muito forte', color: '#28a745' };
    if (score >= 4) return { strength: 3, label: 'Forte', color: '#20c997' };
    return { strength: 2, label: 'Média', color: '#ffc107' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Validação de campos
  const validateFields = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'Nova senha deve ser diferente da atual';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      
      showSuccess({ message: response.message });
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao alterar senha. Tente novamente.';
      showError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentPassword || newPassword || confirmPassword) {
      Alert.alert(
        'Descartar alterações?',
        'Tem certeza que deseja sair sem salvar as alterações?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const hasValidData = () => {
    return currentPassword.trim() && 
           newPassword.trim() && 
           confirmPassword.trim() && 
           newPassword === confirmPassword &&
           newPassword.length >= 6 &&
           newPassword !== currentPassword;
  };

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader 
        title="Alterar Senha" 
        showBack
        onBackPress={handleCancel}
        isModal={true}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Alterar Senha</Text>
            <Text style={styles.description}>
              Por segurança, digite sua senha atual para confirmar a alteração
            </Text>

            <View style={styles.inputContainer}>
              <View>
                <Text style={styles.inputLabel}>Senha atual</Text>
                <View style={styles.passwordContainer}>
                  <CustomInput
                    value={currentPassword}
                    onChangeText={(text) => {
                      setCurrentPassword(text);
                      if (errors.currentPassword) {
                        setErrors(prev => ({ ...prev, currentPassword: undefined }));
                      }
                    }}
                    placeholder="Digite sua senha atual"
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.passwordInput, errors.currentPassword ? styles.inputError : undefined]}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Icon 
                      name={showCurrentPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color="#6c757d"
                    />
                  </TouchableOpacity>
                </View>
                {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
              </View>

              <View>
                <Text style={styles.inputLabel}>Nova senha</Text>
                <View style={styles.passwordContainer}>
                  <CustomInput
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      if (errors.newPassword) {
                        setErrors(prev => ({ ...prev, newPassword: undefined }));
                      }
                    }}
                    placeholder="Digite sua nova senha"
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.passwordInput, errors.newPassword ? styles.inputError : undefined]}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Icon 
                      name={showNewPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color="#6c757d"
                    />
                  </TouchableOpacity>
                </View>
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
              </View>

              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <Text style={styles.strengthLabel}>Força da senha:</Text>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthSegment,
                          {
                            backgroundColor: passwordStrength.strength >= level 
                              ? passwordStrength.color 
                              : '#e9ecef'
                          }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              <View>
                <Text style={styles.inputLabel}>Confirmar nova senha</Text>
                <View style={styles.passwordContainer}>
                  <CustomInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    placeholder="Confirme sua nova senha"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.passwordInput, errors.confirmPassword ? styles.inputError : undefined]}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon 
                      name={showConfirmPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color="#6c757d"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Dicas para uma senha forte:</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Pelo menos 8 caracteres</Text>
                <Text style={styles.tipItem}>• Combine letras maiúsculas e minúsculas</Text>
                <Text style={styles.tipItem}>• Inclua números</Text>
                <Text style={styles.tipItem}>• Use caracteres especiais (!@#$%)</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cancelar"
            variant="secondary"
            onPress={handleCancel}
            style={styles.button}
          />
          
          <CustomButton
            title="Alterar Senha"
            variant="primary"
            onPress={handleChangePassword}
            loading={isLoading}
            disabled={!hasValidData()}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}