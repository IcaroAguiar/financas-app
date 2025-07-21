// @/components/BrandHeader/index.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { styles } from "./styles";

const brandLogoAsset = require("@/assets/images/brand-header-logo.png");

// A "mágica" acontece aqui: pegamos o estilo da folha
// e usamos o valor de 'width' para os cálculos.
const imageStyle = StyleSheet.flatten(styles.logoImage);
const imageWidth = imageStyle.width || 250; // Usa 250 como fallback

const imageSource = Image.resolveAssetSource(brandLogoAsset);
const imageAspectRatio = imageSource.width / imageSource.height;
const imageHeight = imageWidth / imageAspectRatio;

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={brandLogoAsset}
        style={[styles.logoImage, { height: imageHeight }]} // Combina os estilos
        resizeMode="contain"
      />
    </View>
  );
}
