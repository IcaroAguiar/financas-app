import React, { useState, useEffect } from 'react';
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
  BackButtonText,
  TokenInfo,
  TokenText
} from './styles';
import { CustomButton } from '@/components/CustomButton';
import { useToast } from '@/hooks/useToast';
import { resetPassword, verifyResetToken } from '@/api/authService';

type ResetPasswordScreenNavigationProp = StackNavigationProp<
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
  const { toast } = useToast();

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
        toast.error('Token inválido ou expirado.');
        navigation.navigate('Login');
      }
    } catch (error) {
      toast.error('Erro ao verificar token.');
      navigation.navigate('Login');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error('Por favor, digite a nova senha.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      
      await resetPassword({ token, newPassword });
      
      toast.success('Senha redefinida com sucesso!');
      
      // Navigate back to login with a small delay to show success message
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('Token inválido ou expirado')) {
          toast.error('Token expirado. Solicite um novo reset de senha.');
          navigation.navigate('ForgotPassword');
        } else {
          toast.error(errorMessage || 'Dados inválidos.');
        }
      } else if (error.response?.status >= 500) {
        toast.error('Erro no servidor. Tente novamente mais tarde.');
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <Container>
        <Title>Verificando token...</Title>
        <Subtitle>Aguarde um momento.</Subtitle>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container>
        <Title>Token inválido</Title>
        <Subtitle>O token de reset expirou ou é inválido.</Subtitle>
        <CustomButton
          title="Voltar ao login"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
        />
      </Container>
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
      <Container>
        <BackButton onPress={() => navigation.navigate('Login')}>
          <BackButtonText>← Voltar ao login</BackButtonText>
        </BackButton>

        <Title>Redefinir senha</Title>
        <Subtitle>
          Digite sua nova senha para a conta {userEmail}
        </Subtitle>

        {__DEV__ && (
          <TokenInfo>
            <TokenText>🔑 Token: {token.substring(0, 20)}...</TokenText>
          </TokenInfo>
        )}

        <FormContainer>
          <InputContainer>
            <Label>Nova senha</Label>
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Digite sua nova senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </InputContainer>

          <InputContainer>
            <Label>Confirmar nova senha</Label>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Digite novamente sua nova senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </InputContainer>

          <ButtonContainer>
            <CustomButton
              title="Redefinir senha"
              onPress={handleResetPassword}
              loading={isLoading}
              variant="primary"
            />
          </ButtonContainer>
        </FormContainer>
      </Container>
    </KeyboardAwareScrollView>
  );
}