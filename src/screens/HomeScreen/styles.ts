import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md, // More conservative padding (12 instead of 16)
    paddingBottom: 120, // Increased space for tab bar and safe area
    flexGrow: 1, // Important for contentContainerStyle to work properly
  },
  welcomeSection: {
    marginBottom: theme.spacing.sections,
    marginTop: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.header,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  // New main summary card styles
  mainSummaryCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    ...theme.typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  visibilityToggle: {
    padding: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainBalance: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.white,
    letterSpacing: -0.5,
    textAlign: 'left',
  },
  // New metrics row styles
  metricsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sections,
    gap: theme.spacing.xs,
  },
  quickActionsSection: {
    marginBottom: theme.spacing.sections,
  },
  sectionTitle: {
    ...theme.typography.subheader,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  debtsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  debtStat: {
    alignItems: 'center',
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.warning,
    marginBottom: theme.spacing.xs,
  },
  debtCount: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  debtLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  transactionsList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  transactionCategory: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  analyticsDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
    minHeight: 48,
  },
  analyticsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.white,
  },
});
