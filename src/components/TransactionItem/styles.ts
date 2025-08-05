import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: theme.spacing.md, // Reduced from 16 to 12
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36, // Slightly reduced for smaller screens
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm, // Reduced from 12 to 8
  },
  textContainer: {
    flex: 1,
    flexShrink: 1, // Allow text container to shrink if necessary
  },
  description: {
    fontSize: 15, // Reduced from 16 for smaller screens
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
    flexShrink: 1, // Allow text to shrink if necessary
  },
  category: {
    fontSize: 13, // Reduced from 14 for smaller screens
    color: theme.colors.textSecondary,
    marginBottom: 2,
    flexShrink: 1, // Allow text to shrink if necessary
  },
  account: {
    fontSize: 12,
    color: theme.colors.primary,
    marginBottom: 2,
    flexShrink: 1,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15, // Reduced from 16 for smaller screens
    fontWeight: 'bold',
    marginBottom: 2,
    flexShrink: 1, // Allow text to shrink if necessary
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  
  // Installment progress styles
  installmentProgress: {
    marginTop: 8,
  },
  installmentText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressPercentage: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
    minWidth: 35,
    textAlign: 'right',
  },
});
