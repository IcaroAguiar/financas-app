// src/screens/RegisterScreen/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

// Usamos exatamente o mesmo layout base do Login
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: 40,
  },
  linkText: {
    color: theme.colors.primary,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
    marginTop: 20,
    padding: 10,
  },
});
