// @/components/CategorySummary/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border + '40',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  listContainer: {
    paddingRight: theme.spacing.md,
  },
  categoryItem: {
    width: 70,
    height: 130,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartContainer: {
    position: 'absolute',
    bottom: 70,
    left: theme.spacing.sm,
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  verticalBar: {
    width: 12,
  },
  categoryIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  categoryAmount: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 10,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  itemSeparator: {
    width: theme.spacing.md,
  },
  emptyState: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});