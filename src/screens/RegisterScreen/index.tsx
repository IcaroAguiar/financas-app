import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  View,
  SafeAreaView,
} from "react-native";
import { styles } from "./styles";
import { RegisterScreenProps } from "@/navigation/types";
import { useAuth } from "@/contexts/AuthContext";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import BrandHeader from "@/components/BrandHeader";
import { theme } from "@/styles/theme";

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    if (password.length < 6) {
      return Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
    }
    setIsSigningUp(true);
    try {
      await signUp({ name, email, password });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Não foi possível criar a conta. Tente novamente.";
      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <BrandHeader  />
        <View>
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
          <CustomInput
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <View>
          {isSigningUp ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <CustomButton
              title="Cadastrar"
              onPress={handleRegister}
              disabled={isSigningUp}
            />
          )}

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>
              Já tem uma conta? Voltar para o Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
