// @/components/AddTransactionModal/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  modalView: {
    width: "90%",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginBottom: 24,
    color: theme.colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  // Estilos adicionais para botões de tipo (Recebimento/Despesa)
  typeSelector: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeButtonUnselected: {
    borderColor: "#ccc",
  },
  typeText: {
    fontFamily: theme.fonts.regular,
  },
  typeTextSelected: {
    color: "white",
  },
  typeTextUnselected: {
    color: theme.colors.textSecondary,
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
    paddingHorizontal: 20, 
  },
  buttonWrapper: {
    width: "45%", // Cada botão ocupa quase metade do espaço
  },
});
