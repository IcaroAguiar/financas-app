// @/components/GlobalHeader/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    // Sombra sutil para criar profundidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sides,
    paddingVertical: theme.spacing.md,
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    left: theme.spacing.sides,
  },
  title: {
    fontSize: theme.typography.subheader.fontSize,
    fontWeight: theme.typography.subheader.fontWeight,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.bold,
  },
  bellButton: {
    position: 'absolute',
    right: theme.spacing.sides,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
});