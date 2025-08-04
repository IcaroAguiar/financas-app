// @/screens/LoginScreen/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // O container agora usa space-evenly
  container: {
    flex: 1,
    justifyContent: 'space-evenly', // <-- MUDANÇA PRINCIPAL
    paddingHorizontal: 24,
  },
  
  // Criamos containers lógicos para cada bloco
  formContainer: {
    width: '100%',
  },
  actionsContainer: {
    width: '100%',
  },

  // Estilo do botão de biometria
  biometricButton: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  
  // Estilo do link de navegação
  linkText: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    marginTop: 20,
    padding: 10,
  },
});