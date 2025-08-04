// @/components/BrandHeader/index.tsx
import React from "react";
import { Image, StyleSheet } from "react-native";
import { styles } from "./styles";

const brandLogoAsset = require("@/assets/images/brand-header-logo.png");

// Obtém as dimensões originais da imagem UMA VEZ
const imageSource = Image.resolveAssetSource(brandLogoAsset);
const imageAspectRatio = imageSource.width / imageSource.height;

// Define a largura desejada como uma porcentagem
const LOGO_WIDTH_PERCENTAGE = 0.75; // 75% da largura da tela

export default function BrandHeader() {
  return (
    <Image
      source={brandLogoAsset}
      style={styles.logoImage}
      resizeMode="contain"
    />
  );
}

