import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Transaction Card Styles
  transactionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  transactionInfo: {
    marginBottom: 16,
  },
  transactionAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  transactionDate: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  transactionAccount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  
  // Progress Section Styles
  progressSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  
  // Payment Actions Styles
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  paymentButton: {
    flex: 1,
    minHeight: 44,
  },
  
  // Installments Section Styles
  installmentsSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  installmentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  
  // Installment Card Styles
  installmentCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  installmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  installmentInfo: {
    flex: 1,
  },
  installmentNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  installmentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  installmentDetails: {
    marginBottom: 12,
  },
  dueDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  paidDate: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  overdueText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    minHeight: 36,
  },
});