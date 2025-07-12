import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1, // Ocupa o espaço restante
  },
  description: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  category: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  amount: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});
