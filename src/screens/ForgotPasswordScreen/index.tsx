import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AuthStackParamList } from '@/navigation/types';
import { styles } from './styles';
import CustomButton from '@/components/CustomButton';
import { useToast } from '@/hooks/useToast';
import { forgotPassword } from '@/api/authService';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

type ForgotPasswordScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ForgotPassword'
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
  route: ForgotPasswordScreenRouteProp;
}

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      showError({ message: 'Por favor, digite seu e-mail.' });
      return;
    }

    if (!email.includes('@')) {
      showError({ message: 'Por favor, digite um e-mail válido.' });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await forgotPassword({ email });
      
      // Show success message
      showSuccess({ message: 'Instruções enviadas! Verifique seu e-mail.' });
      
      // If in development and we have a reset token, navigate to reset screen
      if (response.dev_reset_token) {
        console.log('🔑 Reset token for development:', response.dev_reset_token);
        // In a real app, the user would get this token via email
        navigation.navigate('ResetPassword', { 
          token: response.dev_reset_token,
          email 
        });
      } else {
        // In production, user would receive email with link
        navigation.goBack();
      }
      
    } catch (error: any) {
      console.error('Erro ao solicitar reset de senha:', error);
      
      if (error.response?.status === 400) {
        showError({ message: error.response.data.error || 'Dados inválidos.' });
      } else if (error.response?.status >= 500) {
        showError({ message: 'Erro no servidor. Tente novamente mais tarde.' });
      } else {
        showError({ message: 'Erro inesperado. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      enableOnAndroid={true}
      extraHeight={120}
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Esqueceu sua senha?</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail e enviaremos instruções para redefinir sua senha.
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Enviar instruções"
              onPress={handleForgotPassword}
              loading={isLoading}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}