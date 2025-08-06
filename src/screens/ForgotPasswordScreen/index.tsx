import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '@/types/navigation';
import { 
  Container, 
  Title, 
  Subtitle, 
  FormContainer, 
  InputContainer, 
  Label, 
  Input, 
  ButtonContainer,
  BackButton,
  BackButtonText
} from './styles';
import { CustomButton } from '@/components/CustomButton';
import { useToast } from '@/hooks/useToast';
import { forgotPassword } from '@/api/authService';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
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
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Por favor, digite seu e-mail.');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Por favor, digite um e-mail válido.');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await forgotPassword({ email });
      
      // Show success message
      toast.success('Instruções enviadas! Verifique seu e-mail.');
      
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
        toast.error(error.response.data.error || 'Dados inválidos.');
      } else if (error.response?.status >= 500) {
        toast.error('Erro no servidor. Tente novamente mais tarde.');
      } else {
        toast.error('Erro inesperado. Tente novamente.');
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
      <Container>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>← Voltar</BackButtonText>
        </BackButton>

        <Title>Esqueceu sua senha?</Title>
        <Subtitle>
          Digite seu e-mail e enviaremos instruções para redefinir sua senha.
        </Subtitle>

        <FormContainer>
          <InputContainer>
            <Label>E-mail</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </InputContainer>

          <ButtonContainer>
            <CustomButton
              title="Enviar instruções"
              onPress={handleForgotPassword}
              loading={isLoading}
              variant="primary"
            />
          </ButtonContainer>
        </FormContainer>
      </Container>
    </KeyboardAwareScrollView>
  );
}