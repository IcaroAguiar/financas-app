import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md, // More conservative padding (12 instead of 16)
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.md, // Reduced padding for smaller screens
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryLabel: {
    fontSize: 12, // Reduced for smaller screens
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if necessary
  },
  summaryAmount: {
    fontSize: 16, // Reduced from 18 for smaller screens
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if necessary
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.md, // Reduced from 16 to 12
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
    gap: 6,
    flexShrink: 1, // Allow buttons to shrink if necessary
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13, // Reduced from 14 for smaller screens
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flexShrink: 1, // Allow text to shrink if necessary
  },
  activeFilterText: {
    color: '#fff',
  },
  sortButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  transactionsList: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionItemWrapper: {
    paddingHorizontal: theme.spacing.md, // Reduced from 16 to 12
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.md, // Consistent with reduced padding
    marginRight: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
});
