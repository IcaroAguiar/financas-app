// @/screens/LoginScreen/index.tsx
import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { LoginScreenProps } from "@/navigation/types";
import { useAuth } from "@/contexts/AuthContext";
import BrandHeader from "@/components/BrandHeader";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { theme } from "@/styles/theme";

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const {
    signIn,
    isBiometricSupported,
    isBiometricEnabled,
    authenticateWithBiometrics,
  } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }
    setIsSigningIn(true);
    try {
      await signIn({ email, password });
    } catch (error: any) {
      Alert.alert(
        "Erro de Login",
        error.response?.data?.error || "Não foi possível fazer o login."
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsSigningIn(true);
    try {
      const success = await authenticateWithBiometrics();
      if (!success) {
        Alert.alert("Erro Biométrico", "Não foi possível autenticar com biometria.");
      }
    } catch (error: any) {
      Alert.alert("Erro Biométrico", error.message || "Não foi possível autenticar com biometria.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BrandHeader />

        <CustomInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotPasswordText}>Recuperar senha</Text>
          </TouchableOpacity>
        </View>

        {isBiometricSupported && isBiometricEnabled && (
          <TouchableOpacity
            onPress={handleBiometricLogin}
            style={styles.biometricButton}
            disabled={isSigningIn}
          >
            <MaterialIcons
              name="fingerprint"
              size={32}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}

        {isSigningIn && (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginVertical: 20 }}
          />
        )}

        {!isSigningIn && (
          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            disabled={isSigningIn}
          />
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
