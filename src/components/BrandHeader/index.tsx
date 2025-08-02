// @/components/BrandHeader/index.tsx
import React from "react";
import { Image, StyleSheet, ViewStyle, StyleProp, Text, View } from "react-native";
import { HeaderContainer } from "@/components/Layout";
import Icon from "@/components/Icon";
import { styles } from "./styles";

interface BrandHeaderProps {
  height?: number | string;
  padding?: number;
  backgroundColor?: string;
  gradient?: boolean;
  safeAreaTop?: boolean;
  style?: StyleProp<ViewStyle>;
  useIcon?: boolean;
  logoColor?: string;
  showText?: boolean;
}

const brandLogoAsset = require("@/assets/images/brand-header-logo.png");

// A "mágica" acontece aqui: pegamos o estilo da folha
// e usamos o valor de 'width' para os cálculos.
const imageStyle = StyleSheet.flatten(styles.logoImage);
const imageWidth = imageStyle.width || 250; // Usa 250 como fallback

const imageSource = Image.resolveAssetSource(brandLogoAsset);
const imageAspectRatio = imageSource.width / imageSource.height;
const imageHeight = imageWidth / imageAspectRatio;

export default function BrandHeader({
  height = 50,
  padding = 12,
  backgroundColor = '#FFFFFF',
  gradient = false,
  safeAreaTop = true,
  style,
  useIcon = false,
  logoColor = '#2a9d8f',
  showText = false,
}: BrandHeaderProps) {
  const renderLogo = () => {
    if (useIcon) {
      return (
        <View style={styles.iconContainer}>
          <Icon 
            name="trending-up" 
            size={24} 
            color={logoColor} 
          />
          <Text style={[styles.brandText, { color: logoColor }]}>
            Ascend
          </Text>
        </View>
      );
    }
    
    return (
      <Image
        source={brandLogoAsset}
        style={[
          styles.logoImage, 
          { 
            height: imageHeight,
            tintColor: logoColor !== '#2a9d8f' ? logoColor : undefined 
          }
        ]}
        resizeMode="contain"
      />
    );
  };

  return (
    <HeaderContainer
      height={height}
      padding={padding}
      backgroundColor={backgroundColor}
      gradient={gradient}
      safeAreaTop={safeAreaTop}
      style={style}
    >
      {renderLogo()}
    </HeaderContainer>
  );
}
