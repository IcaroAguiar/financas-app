import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border + '40',
    // Enhanced shadow for modern card feel
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    // Add subtle inner shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  description: {
    fontSize: 16,
    fontWeight: '600', // More consistent with app patterns
    color: theme.colors.text.primary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    ...theme.typography.body, // Use consistent body typography
    fontWeight: '400', // Lighter weight for secondary text
    color: theme.colors.text.secondary,
    flex: 1,
    opacity: 0.8,
  },
  installmentBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  installmentBadgeText: {
    fontSize: 11,
    fontWeight: '600', // More consistent weight
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  recurringBadge: {
    backgroundColor: theme.colors.warning + '15',
    borderColor: theme.colors.warning + '30',
  },
  recurringBadgeText: {
    color: theme.colors.warning,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700', // More consistent with app patterns
    textAlign: 'right',
    letterSpacing: -0.3,
    minWidth: 100,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    ...theme.typography.caption, // Use consistent caption typography
    color: theme.colors.text.secondary,
    opacity: 0.8, // Slightly more visible
    marginTop: 2,
    fontWeight: '400', // Consistent with caption style
  },
});
