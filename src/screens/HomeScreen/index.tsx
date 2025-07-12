// src/screens/HomeScreen/index.tsx
import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { HomeScreenProps } from "@/navigation/types";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";

export default function HomeScreen({}: HomeScreenProps) {
  const { signOut, user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user?.name}!</Text>
      <Text style={styles.subtitle}>
        Sua jornada para o controle financeiro começa aqui.
      </Text>
      <View style={styles.buttonContainer}>
        <CustomButton title="Sair" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}
