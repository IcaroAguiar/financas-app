// @/screens/EditProfileScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import GlobalHeader from '@/components/GlobalHeader';
import Icon from '@/components/Icon';
import * as ImagePicker from 'expo-image-picker';
import * as authService from '@/api/authService';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUserProfile } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Estados para informações pessoais
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  
  // Estados para alteração de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de loading separados
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  
  // Estados de erro
  const [profileErrors, setProfileErrors] = useState<{name?: string; email?: string}>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  // Função para selecionar foto de perfil
  const handleSelectProfilePicture = async () => {
    try {
      // Solicitar permissão para acessar a galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showError({ message: 'Permissão para acessar a galeria é necessária!' });
        return;
      }

      // Mostrar opções para o usuário
      Alert.alert(
        'Foto de Perfil',
        'Escolha uma opção',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Câmera', onPress: () => openCamera() },
          { text: 'Galeria', onPress: () => openGallery() },
          ...(profilePicture ? [{ text: 'Remover Foto', style: 'destructive', onPress: () => setProfilePicture('') }] : [])
        ]
      );
    } catch (error) {
      showError({ message: 'Erro ao acessar a galeria.' });
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        showError({ message: 'Permissão para usar a câmera é necessária!' });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        console.log('📷 [EditProfile] Foto capturada da câmera - tamanho base64:', base64.length, 'caracteres');
        setProfilePicture(base64);
      }
    } catch (error) {
      showError({ message: 'Erro ao abrir a câmera.' });
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        console.log('🖼️ [EditProfile] Foto selecionada da galeria - tamanho base64:', base64.length, 'caracteres');
        setProfilePicture(base64);
      }
    } catch (error) {
      showError({ message: 'Erro ao abrir a galeria.' });
    }
  };

  // Validação de campos do perfil
  const validateProfileFields = () => {
    const newErrors: {name?: string; email?: string} = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validação de campos da senha
  const validatePasswordFields = () => {
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

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar se houve alterações no perfil
  const hasProfileChanges = () => {
    return name.trim() !== user?.name || 
           email.trim() !== user?.email || 
           profilePicture !== (user?.profilePicture || '');
  };

  // Verificar se campos de senha estão preenchidos
  const hasPasswordData = () => {
    return currentPassword.trim() || newPassword.trim() || confirmPassword.trim();
  };

  // Verificar se senha é válida para alteração
  const hasValidPasswordData = () => {
    return currentPassword.trim() && 
           newPassword.trim() && 
           confirmPassword.trim() && 
           newPassword === confirmPassword &&
           newPassword.length >= 6 &&
           newPassword !== currentPassword;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileFields()) {
      return;
    }

    if (!hasProfileChanges()) {
      showError({ message: 'Nenhuma alteração foi feita no perfil.' });
      return;
    }

    setIsLoadingProfile(true);

    try {
      const updateData: authService.UpdateProfileData = {};
      
      if (name.trim() !== user?.name) {
        updateData.name = name.trim();
      }
      
      if (email.trim() !== user?.email) {
        updateData.email = email.trim();
      }

      if (profilePicture !== (user?.profilePicture || '')) {
        updateData.profilePicture = profilePicture || null;
      }

      console.log('💾 [EditProfile] Enviando dados do perfil:', {
        hasName: !!updateData.name,
        hasEmail: !!updateData.email,
        hasProfilePicture: !!updateData.profilePicture,
        profilePictureSize: updateData.profilePicture?.length || 0
      });

      const response = await authService.updateProfile(updateData);
      
      console.log('✅ [EditProfile] Resposta recebida:', {
        message: response.message,
        hasUser: !!response.user,
        userHasProfilePicture: !!response.user?.profilePicture
      });
      
      // Atualizar o contexto com os novos dados
      await updateUserProfile(response.user);
      
      showSuccess({ message: response.message });
    } catch (error: any) {
      console.log('❌ [EditProfile] Erro ao atualizar perfil:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar perfil. Tente novamente.';
      showError({ message: errorMessage });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordFields()) {
      return;
    }

    setIsLoadingPassword(true);

    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      
      // Limpar campos da senha após sucesso
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      showSuccess({ message: response.message });
    } catch (error: any) {
      console.log('❌ [EditProfile] Erro ao alterar senha:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Erro ao alterar senha. Tente novamente.';
      showError({ message: errorMessage });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleCancel = () => {
    if (hasProfileChanges() || hasPasswordData()) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Tem certeza que deseja sair?',
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

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader 
        title="Editar Perfil" 
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
          {/* Seção de Informações Pessoais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <Text style={styles.sectionDescription}>
              Atualize sua foto, nome e e-mail
            </Text>

            {/* Foto de Perfil */}
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity 
                style={styles.profilePictureButton}
                onPress={handleSelectProfilePicture}
              >
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={styles.profilePictureImage} />
                ) : (
                  <View style={styles.profilePicturePlaceholder}>
                    <Icon name="user" size={40} color="#6c757d" />
                  </View>
                )}
                <View style={styles.profilePictureOverlay}>
                  <Icon name="camera" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.profilePictureLabel}>Toque para alterar foto</Text>
            </View>

            <View style={styles.inputContainer}>
              <View>
                <Text style={styles.inputLabel}>Nome completo</Text>
                <CustomInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (profileErrors.name) {
                      setProfileErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="Digite seu nome completo"
                  autoCapitalize="words"
                  autoCorrect={false}
                  style={[styles.input, profileErrors.name ? styles.inputError : undefined]}
                />
                {profileErrors.name && <Text style={styles.errorText}>{profileErrors.name}</Text>}
              </View>

              <View>
                <Text style={styles.inputLabel}>E-mail</Text>
                <CustomInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (profileErrors.email) {
                      setProfileErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, profileErrors.email ? styles.inputError : undefined]}
                />
                {profileErrors.email && <Text style={styles.errorText}>{profileErrors.email}</Text>}
              </View>
            </View>

            <CustomButton
              title="Salvar Informações"
              variant="primary"
              onPress={handleSaveProfile}
              loading={isLoadingProfile}
              disabled={!hasProfileChanges()}
              style={styles.sectionButton}
            />
          </View>

          {/* Seção de Alteração de Senha */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            <Text style={styles.sectionDescription}>
              Por segurança, digite sua senha atual para confirmar a alteração
            </Text>

            <View style={styles.inputContainer}>
              <View>
                <Text style={styles.inputLabel}>Senha atual</Text>
                <CustomInput
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (passwordErrors.currentPassword) {
                      setPasswordErrors(prev => ({ ...prev, currentPassword: undefined }));
                    }
                  }}
                  placeholder="Digite sua senha atual"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, passwordErrors.currentPassword ? styles.inputError : undefined]}
                />
                {passwordErrors.currentPassword && <Text style={styles.errorText}>{passwordErrors.currentPassword}</Text>}
              </View>

              <View>
                <Text style={styles.inputLabel}>Nova senha</Text>
                <CustomInput
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (passwordErrors.newPassword) {
                      setPasswordErrors(prev => ({ ...prev, newPassword: undefined }));
                    }
                  }}
                  placeholder="Digite sua nova senha"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, passwordErrors.newPassword ? styles.inputError : undefined]}
                />
                {passwordErrors.newPassword && <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>}
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
                <CustomInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="Confirme sua nova senha"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, passwordErrors.confirmPassword ? styles.inputError : undefined]}
                />
                {passwordErrors.confirmPassword && <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text>}
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

            <CustomButton
              title="Alterar Senha"
              variant="danger"
              onPress={handleChangePassword}
              loading={isLoadingPassword}
              disabled={!hasValidPasswordData()}
              style={styles.sectionButton}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Fechar"
            variant="secondary"
            onPress={handleCancel}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}