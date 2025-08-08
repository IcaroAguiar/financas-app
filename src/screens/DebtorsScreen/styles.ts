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
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 6,
    minHeight: 60,
    justifyContent: 'center',
    maxWidth: '33.33%',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 6,
    textAlign: 'center',
    width: '100%',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
  },
  listContainer: {
    paddingBottom: 120, // Increased space for tab bar
  },
  debtorCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  debtorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  debtorInfo: {
    flex: 1,
    marginRight: 12,
  },
  debtorNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  debtorName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  moreOptionsButton: {
    padding: 4,
    borderRadius: 4,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  noContactText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  debtInfo: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pendingDebt: {
    color: theme.colors.error,
  },
  paidDebt: {
    color: theme.colors.success,
  },
  pendingCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  overdueCount: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
  },
  debtorActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDebtsButton: {
    flex: 1,
  },
  chargeButton: {
    flex: 1,
  },
  newDebtorButton: {
    position: 'absolute',
    bottom: 80, // Adjusted to account for tab bar
    left: 20,
    right: 20,
  },
});