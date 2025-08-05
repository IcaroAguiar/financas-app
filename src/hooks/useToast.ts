// src/hooks/useToast.ts
import Toast from 'react-native-toast-message';
import { useConfirmation } from '@/contexts/ConfirmationContext';

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
}

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useToast = () => {
  const { showConfirmation: showConfirmationModal } = useConfirmation();

  const showSuccess = ({ title = 'Sucesso', message, duration = 3000 }: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: duration,
      position: 'top',
      topOffset: 60,
    });
  };

  const showError = ({ title = 'Erro', message, duration = 4000 }: ToastOptions) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: duration,
      position: 'top',
      topOffset: 60,
    });
  };

  const showInfo = ({ title = 'Informação', message, duration = 3000 }: ToastOptions) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: duration,
      position: 'top',
      topOffset: 60,
    });
  };

  const showWarning = ({ title = 'Atenção', message, duration = 3500 }: ToastOptions) => {
    Toast.show({
      type: 'error', // Using error type with custom styling for warning
      text1: title,
      text2: message,
      visibilityTime: duration,
      position: 'top',
      topOffset: 60,
    });
  };

  const showConfirmation = (options: ConfirmationOptions) => {
    showConfirmationModal(options);
  };

  const hide = () => {
    Toast.hide();
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showConfirmation,
    hide,
  };
};