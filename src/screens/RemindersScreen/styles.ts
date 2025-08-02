import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.sides,
  },
  listContainer: {
    paddingBottom: 100,
  },
  reminderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.6,
    borderLeftColor: theme.colors.success,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reminderTitle: {
    ...theme.typography.subheader,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  reminderDate: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
  },
  reminderDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  completeButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  newReminderButton: {
    position: 'absolute',
    bottom: 80, // Adjusted to account for tab bar
    left: theme.spacing.sides,
    right: theme.spacing.sides,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sections,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyStateTitle: {
    ...theme.typography.subheader,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});