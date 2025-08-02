// @/components/FloatingActionButton/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    position: "absolute", // Flutua sobre o conteúdo
    bottom: 90, // Increased to account for tab bar height (60px + 30px margin)
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30, // Deixa o botão redondo
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
