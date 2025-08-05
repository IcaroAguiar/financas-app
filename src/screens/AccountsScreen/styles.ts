// src/screens/AccountsScreen/styles.ts

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
  listContainer: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontFamily: theme.fonts.regular,
  },
  // Account Card Styles
  accountCard: {
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
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  accountBalance: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});