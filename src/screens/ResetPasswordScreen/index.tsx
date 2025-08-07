import React, { useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AuthStackParamList } from '@/navigation/types';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import { useToast } from '@/hooks/useToast';
import { resetPassword, verifyResetToken } from '@/api/authService';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ResetPassword'
>;

type ResetPasswordScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ResetPassword'
>;

interface Props {
  navigation: ResetPasswordScreenNavigationProp;
  route: ResetPasswordScreenRouteProp;
}

export function ResetPasswordScreen({ navigation, route }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { showError, showSuccess } = useToast();

  const { token, email } = route.params;

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      setIsVerifying(true);
      const response = await verifyResetToken(token);
      
      if (response.valid) {
        setTokenValid(true);
        setUserEmail(response.email || email || '');
      } else {
        showError({ message: 'Token inválido ou expirado.' });
        navigation.navigate('Login');
      }
    } catch (error) {
      showError({ message: 'Erro ao verificar token.' });
      navigation.navigate('Login');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      showError({ message: 'Por favor, digite a nova senha.' });
      return;
    }

    if (newPassword.length < 6) {
      showError({ message: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showError({ message: 'As senhas não coincidem.' });
      return;
    }

    try {
      setIsLoading(true);
      
      await resetPassword({ token, newPassword });
      
      showSuccess({ message: 'Senha redefinida com sucesso!' });
      
      // Navigate back to login with a small delay to show success message
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('Token inválido ou expirado')) {
          showError({ message: 'Token expirado. Solicite um novo reset de senha.' });
          navigation.navigate('ForgotPassword');
        } else {
          showError({ message: errorMessage || 'Dados inválidos.' });
        }
      } else if (error.response?.status >= 500) {
        showError({ message: 'Erro no servidor. Tente novamente mais tarde.' });
      } else {
        showError({ message: 'Erro inesperado. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verificando token...</Text>
        <Text style={styles.subtitle}>Aguarde um momento.</Text>
      </View>
    );
  }

  if (!tokenValid) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Token inválido</Text>
        <Text style={styles.subtitle}>O token de reset expirou ou é inválido.</Text>
        <CustomButton
          title="Voltar ao login"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      enableOnAndroid={true}
      extraHeight={120}
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>← Voltar ao login</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Redefinir senha</Text>
        <Text style={styles.subtitle}>
          Digite sua nova senha para a conta {userEmail}
        </Text>

        {__DEV__ && (
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenText}>🔑 Token: {token.substring(0, 20)}...</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nova senha</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Digite sua nova senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar nova senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Digite novamente sua nova senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Redefinir senha"
              onPress={handleResetPassword}
              loading={isLoading}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}