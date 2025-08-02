// @/components/ScreenWrapper/index.tsx
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewStyle } from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

export default function ScreenWrapper({ 
  children, 
  style,
  scrollEnabled = true,
  showsVerticalScrollIndicator = false
}: ScreenWrapperProps) {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
      >
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}