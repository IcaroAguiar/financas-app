// @/screens/RegisterScreen/index.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./styles";
import { RegisterScreenProps } from "@/navigation/types";
import { useAuth } from "@/contexts/AuthContext";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import BrandHeader from "@/components/BrandHeader";

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }
    setIsSigningUp(true);
    try {
      // CORREÇÃO: Passando todos os campos necessários (name, email, password)
      await signUp({ name, email, password });
      // Se o cadastro e login subsequente funcionarem, o AppNavigator cuidará do resto
    } catch (error: any) {
      // Usando nosso logger da API para dar um erro detalhado
      const errorMessage =
        error.response?.data?.error ||
        "Não foi possível criar a conta. Tente novamente.";
      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <CustomInput
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />
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
        title="Cadastrar"
        onPress={handleRegister}
        disabled={isSigningUp}
      />
      {isSigningUp && <ActivityIndicator style={{ marginTop: 20 }} />}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>
          Já tem uma conta? Voltar para o Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
