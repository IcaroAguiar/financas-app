// src/components/CustomButton/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  buttonContainer: {
    // O botão agora não ocupa 100% da largura
    alignSelf: 'stretch', // Estica para preencher o contâiner pai, se necessário, mas respeita o padding
    backgroundColor: theme.colors.primary, // Cor primária (verde)
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center', // Centraliza o texto
    justifyContent: 'center',
    elevation: 2, // Sombra sutil para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.surface, // Texto branco
    fontSize: 16,
    textTransform: 'uppercase', // Deixa o texto em maiúsculas
  },
});
