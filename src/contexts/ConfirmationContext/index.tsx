// src/contexts/ConfirmationContext/index.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmationContextData {
  showConfirmation: (options: ConfirmationOptions) => void;
  hideConfirmation: () => void;
}

interface ConfirmationProviderProps {
  children: ReactNode;
}

const ConfirmationContext = createContext<ConfirmationContextData>({} as ConfirmationContextData);

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const showConfirmation = (confirmationOptions: ConfirmationOptions) => {
    setOptions(confirmationOptions);
    setIsVisible(true);
  };

  const hideConfirmation = () => {
    setIsVisible(false);
    setLoading(false);
    setTimeout(() => {
      setOptions(null);
    }, 300); // Wait for modal animation to complete
  };

  const handleConfirm = async () => {
    if (!options) return;

    try {
      setLoading(true);
      await options.onConfirm();
      hideConfirmation();
    } catch (error) {
      setLoading(false);
      // Let the calling component handle the error
      throw error;
    }
  };

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    hideConfirmation();
  };

  const contextValue: ConfirmationContextData = {
    showConfirmation,
    hideConfirmation,
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      {options && (
        <ConfirmationModal
          visible={isVisible}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          confirmVariant={options.confirmVariant}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = (): ConfirmationContextData => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation deve ser usado dentro de um ConfirmationProvider');
  }
  return context;
};