// src/screens/RegisterScreen/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Importando com os aliases
import { styles } from "./styles";
import { RegisterScreenProps } from "@/navigation/types";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = () => {
    console.log("Tentativa de Cadastro com:", { name, email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>
      {/* Usando nossos componentes padronizados */}
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
      <CustomButton title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>
          Já tem uma conta? Voltar para o Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
