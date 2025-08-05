// src/screens/SubscriptionsScreen/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.text.light,
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  activeFilterText: {
    color: theme.colors.surface,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginLeft: 'auto',
  },
  processButtonText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },

  // Subscription Cards
  listContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  subscriptionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  subscriptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subscriptionDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  subscriptionCategory: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Subscription Details
  subscriptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  subscriptionAmount: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  amountValue: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  subscriptionNext: {
    alignItems: 'flex-end',
  },
  nextLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  nextValue: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
  },
  overdueText: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.bold,
  },

  // Status Badges
  inactiveBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.text.light,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  inactiveBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    color: theme.colors.surface,
    textTransform: 'uppercase',
  },
  overdueBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  overdueBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    color: theme.colors.surface,
    textTransform: 'uppercase',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});