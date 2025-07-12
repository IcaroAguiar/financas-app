// src/screens/HomeScreen/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  // --- A PROPRIEDADE QUE FALTAVA ---
  // Este estilo controla a largura do container do botão de logout
  buttonContainer: {
    width: "60%",
  },
});
