import styled from 'styled-components/native';
import { theme } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.lg}px;
  justify-content: center;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 60px;
  left: ${theme.spacing.lg}px;
  z-index: 1;
`;

export const BackButtonText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.primary};
  font-weight: 500;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
  margin-top: 60px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl}px;
  line-height: 24px;
  padding: 0 ${theme.spacing.lg}px;
`;

export const TokenInfo = styled.View`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.sm}px;
  margin-bottom: ${theme.spacing.md}px;
`;

export const TokenText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-family: 'monospace';
`;

export const FormContainer = styled.View`
  gap: ${theme.spacing.lg}px;
`;

export const InputContainer = styled.View`
  gap: ${theme.spacing.xs}px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const Input = styled.TextInput`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  font-size: 16px;
  color: ${theme.colors.text};
  min-height: 48px;
`;

export const ButtonContainer = styled.View`
  margin-top: ${theme.spacing.md}px;
`;