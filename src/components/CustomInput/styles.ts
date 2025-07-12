// src/components/CustomInput/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme"; // <-- Usando nosso novo alias!

export const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    backgroundColor: theme.colors.surface,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textPrimary,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e3", // Um cinza claro para a borda
    fontSize: 16,
    marginBottom: 16,
  },
});
