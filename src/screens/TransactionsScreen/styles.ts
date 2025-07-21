// @/screens/TransactionsScreen/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Garante que o texto não toque as bordas
  },
  emptyText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: "center", // Centraliza o texto se ele tiver mais de uma linha
  },

  typeSelector: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 24, // Aumenta o espaçamento
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24, // Aumenta o padding
    borderRadius: 20,
    borderWidth: 1.5, // Deixa a borda mais visível
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeButtonUnselected: {
    borderColor: "#ccc",
  },
  typeText: {
    fontFamily: theme.fonts.bold, // Usa a fonte bold
    fontSize: 14,
  },
  typeTextSelected: {
    color: "white",
  },
  typeTextUnselected: {
    color: theme.colors.textSecondary,
  },

  // Novo container para os botões de ação
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Alinha à direita
    width: "100%",
    marginTop: 24,
  },
  // Wrapper para dar espaçamento entre os botões
  buttonWrapper: {
    marginLeft: 10, // Espaço entre "Cancelar" e "Salvar"
  },
});
