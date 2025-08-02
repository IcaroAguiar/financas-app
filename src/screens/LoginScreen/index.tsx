// src/screens/LoginScreen/index.tsx
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
// Importando com nossos novos aliases!
import { styles } from "./styles";
import { LoginScreenProps } from "@/navigation/types";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityIndicator, Alert } from "react-native";
import BrandHeader from "@/components/BrandHeader";

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSigningIn, setIsSigningIn] = useState(false); // Estado de loading local

  const { signIn } = useAuth(); // Pega a função do contexto

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }
    setIsSigningIn(true);
    try {
      await signIn({ email, password });
      // Se chegar aqui, o AppNavigator vai mudar de tela sozinho!
    } catch (error: any) {
      Alert.alert(
        "Erro de Login",
        error.response?.data?.error || "Não foi possível fazer o login."
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <BrandHeader useIcon={true} logoColor="#FFFFFF" />

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

      <CustomButton
        title="Entrar"
        onPress={handleLogin}
        disabled={isSigningIn}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
