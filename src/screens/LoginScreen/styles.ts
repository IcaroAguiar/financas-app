// src/screens/LoginScreen/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24, // Um pouco mais de padding
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: 40, // Aumenta o espaçamento
  },
  linkText: {
    color: theme.colors.primary,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
    marginTop: 20,
    padding: 10,
  },
});
