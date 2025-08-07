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
    paddingHorizontal: theme.spacing.md, // More conservative padding (12 instead of 16)
    paddingBottom: 120, // Space for tab bar and floating button
    flexGrow: 1, // Important for contentContainerStyle to work properly
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: theme.spacing.lg,
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
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if necessary
  },
  summaryAmount: {
    fontSize: 16, // Reduced from 18 for smaller screens
    fontWeight: '600', // Use specific weight instead of 'bold'
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
    fontSize: 14, // Use consistent sizing with theme
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
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  
  // Account Filter Styles
  accountFiltersContainer: {
    marginBottom: 20,
  },
  accountFiltersTitle: {
    fontSize: 15, // Match theme body size for consistency
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 10,
    marginLeft: 4,
  },
  accountFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
    gap: 4,
    flexShrink: 1,
  },
  activeAccountFilterButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  accountFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  activeAccountFilterText: {
    color: '#fff',
  },
});
