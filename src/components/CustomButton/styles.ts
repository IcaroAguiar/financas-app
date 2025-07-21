// @/components/CustomButton/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  // Container base, comum a todas as variantes
  buttonContainer: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // Texto base, comum a todas as variantes
  buttonText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    textTransform: "uppercase",
  },

  // --- VARIANTES DE ESTILO ---

  // Estilo para o container da variante 'primary'
  primaryContainer: {
    backgroundColor: theme.colors.primary,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Estilo para o texto da variante 'primary'
  primaryText: {
    color: theme.colors.surface,
  },

  // Estilo para o container da variante 'ghost' (sem fundo)
  ghostContainer: {
    backgroundColor: "transparent",
  },
  // Estilo para o texto da variante 'ghost'
  ghostText: {
    color: theme.colors.textSecondary,
  },
});
