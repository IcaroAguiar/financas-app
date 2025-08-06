// @/screens/LoginScreen/styles.ts (e RegisterScreen)
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Container principal para centralizar o conteúdo
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  // Wrapper para a logo, para dar um espaçamento inferior
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 48, // Espaço entre a logo e os inputs
  },
  // Inputs e botões terão seu próprio espaçamento
  formWrapper: {},
  actionsWrapper: {
    marginTop: 16, // Espaço entre os inputs e os botões
  },
  biometricButton: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  linkText: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    marginTop: 20,
    padding: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
  },
});