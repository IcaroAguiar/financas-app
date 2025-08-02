// @/components/BrandHeader/styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  // O estilo aplicado diretamente à imagem
  logoImage: {
    // Definimos uma largura fixa para a imagem.
    // Ajuste este valor para maior ou menor conforme seu gosto.
    width: 200,
    marginBottom: 5, // Espaçamento abaixo da logo
  },
  // Container para o ícone e texto
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto da marca
  brandText: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});
