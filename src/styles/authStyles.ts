import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between', // Distribui o espaço
    padding: 24,
  },
  brandHeader: {
    marginBottom: 48, // Aumenta o espaço abaixo do logo
  },
  linkText: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    marginTop: 20,
    padding: 10,
  },
  biometricButton: {
    alignSelf: 'center',
    marginVertical: 24,
  },
});
