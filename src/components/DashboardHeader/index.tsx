import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import Icon from '@/components/Icon';

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ 
  userName
}: DashboardHeaderProps) {
  // Função para pegar saudação baseada na hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Pega primeira letra do nome do usuário para o avatar
  const getInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : 'U';
  };

  // Pega primeiro nome do usuário
  const getFirstName = () => {
    return userName ? userName.split(" ")[0] : 'Usuário';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Avatar circular */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        
        {/* Saudação */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
            {getGreeting()}, {getFirstName()}!
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            Aqui está o resumo das suas finanças
          </Text>
        </View>
      </View>

    </View>
  );
}