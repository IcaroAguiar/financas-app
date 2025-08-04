// @/components/CentralActionButton/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60, // Match tab bar height
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: -20, // Elevate above tab bar
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow for elevation effect
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // Border to match Mercado Pago style
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});