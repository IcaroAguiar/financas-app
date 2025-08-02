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
});
