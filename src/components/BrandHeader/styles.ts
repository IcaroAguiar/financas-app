// @/components/BrandHeader/styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // O container do cabeçalho
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 5, // Espaçamento abaixo da logo
  },
  // O estilo aplicado diretamente à imagem
  logoImage: {
    // Definimos uma largura fixa para a imagem.
    // Ajuste este valor para maior ou menor conforme seu gosto.
    width: 450,
  },
});
