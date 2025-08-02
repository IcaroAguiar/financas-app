// @/components/DashboardCard/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.sections,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.subheader,
    color: theme.colors.textPrimary,
  },
  seeAllText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});