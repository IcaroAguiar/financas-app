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
    color: theme.colors.white,
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

  // Account Selector Styles
  accountSelectorContainer: {
    width: "100%",
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  accountSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  accountSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountSelectorText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },

  // Account Picker Modal Styles
  accountPickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  accountPickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: "80%",
  },
  accountPickerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  accountOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  accountOptionSelected: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  accountOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountOptionText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  accountOptionTextSelected: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },
  accountOptionType: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    marginTop: 2,
  },
  categoryColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelAccountSelection: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  cancelAccountText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.surface,
    textAlign: "center",
  },
  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    marginVertical: 4,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    backgroundColor: "rgba(0, 122, 255, 0.05)",
  },
  addAccountText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  
  // New styles for subscription and debt payment options
  optionContainer: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  frequencySelector: {
    marginTop: theme.spacing.md,
  },
  frequencyButtons: {
    flexDirection: "row",
    marginTop: theme.spacing.sm,
  },
  frequencyButton: {
    flex: 1,
    padding: theme.spacing.sm,
    marginHorizontal: 2,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  frequencyButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  frequencyButtonTextSelected: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.medium,
  },
  debtSelectorContainer: {
    marginTop: theme.spacing.md,
  },
  
  // Payment plan styles
  installmentRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: theme.spacing.md,
  },
  installmentInput: {
    marginBottom: theme.spacing.md,
  },
  installmentDateContainer: {
    marginTop: theme.spacing.md,
  },
  installmentPreview: {
    backgroundColor: "#F0F9FF",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
});
