import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import BrandHeader from '@/components/BrandHeader';
import CustomButton from '@/components/CustomButton';
import notificationService from '@/services/notificationService';

interface NotificationSettings {
  debtReminders: boolean;
  budgetAlerts: boolean;
  weeklySummary: boolean;
  monthlySummary: boolean;
  transactionReminders: boolean;
}

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    debtReminders: true,
    budgetAlerts: true,
    weeklySummary: true,
    monthlySummary: true,
    transactionReminders: false,
  });

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const permission = await notificationService.requestPermissions();
    setHasPermission(permission);
  };

  const requestPermission = async () => {
    const permission = await notificationService.requestPermissions();
    setHasPermission(permission);
    
    if (!permission) {
      Alert.alert(
        'Permissão Negada',
        'Para receber notificações, ative as permissões nas configurações do seu dispositivo.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (!hasPermission) {
      requestPermission();
      return;
    }

    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const testNotification = async () => {
    if (!hasPermission) {
      requestPermission();
      return;
    }

    await notificationService.scheduleNotification({
      id: 'test-notification',
      title: 'Teste de Notificação',
      body: 'Suas notificações estão funcionando corretamente!',
      triggerDate: new Date(Date.now() + 3000), // 3 seconds from now
    });

    Alert.alert('Sucesso', 'Notificação de teste enviada! Você deve recebê-la em alguns segundos.');
  };

  const renderSettingItem = (
    key: keyof NotificationSettings,
    title: string,
    description: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[key] && hasPermission}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
        thumbColor={settings[key] && hasPermission ? '#fff' : '#f4f3f4'}
        disabled={!hasPermission}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader useIcon={true} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Notificações</Text>

        {!hasPermission && (
          <View style={styles.permissionAlert}>
            <Text style={styles.alertTitle}>Permissões Necessárias</Text>
            <Text style={styles.alertText}>
              Para receber notificações, você precisa permitir que o app envie notificações.
            </Text>
            <CustomButton
              title="Permitir Notificações"
              onPress={requestPermission}
              style={styles.permissionButton}
            />
          </View>
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Lembretes de Dívidas</Text>
          {renderSettingItem(
            'debtReminders',
            'Lembretes de Cobrança',
            'Receba notificações sobre dívidas próximas do vencimento'
          )}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Controle de Gastos</Text>
          {renderSettingItem(
            'budgetAlerts',
            'Alertas de Orçamento',
            'Seja notificado quando atingir 80% do orçamento de uma categoria'
          )}
          {renderSettingItem(
            'transactionReminders',
            'Lembrete de Transações',
            'Lembrete diário para registrar suas transações'
          )}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Resumos Periódicos</Text>
          {renderSettingItem(
            'weeklySummary',
            'Resumo Semanal',
            'Receba um resumo dos seus gastos toda semana'
          )}
          {renderSettingItem(
            'monthlySummary',
            'Resumo Mensal',
            'Receba um relatório completo no início de cada mês'
          )}
        </View>

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Teste</Text>
          <CustomButton
            title="Enviar Notificação de Teste"
            onPress={testNotification}
            style={styles.testButton}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Sobre as Notificações</Text>
          <Text style={styles.infoText}>
            • As notificações de dívidas são enviadas 2 dias antes, 1 dia antes e no dia do vencimento{'\n'}
            • Os alertas de orçamento são enviados quando você atinge 80% do limite{'\n'}
            • Os resumos são enviados automaticamente nos períodos configurados{'\n'}
            • Você pode desativar qualquer tipo de notificação a qualquer momento
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}