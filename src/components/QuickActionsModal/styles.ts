// @/components/QuickActionsModal/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sides,
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.header.fontSize,
    fontWeight: theme.typography.header.fontWeight,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.bold,
  },
  closeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  actionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.subheader.fontWeight,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.bold,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
  },
  cancelButtonContainer: {
    marginTop: theme.spacing.sm,
  },
});