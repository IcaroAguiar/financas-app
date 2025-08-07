// @ts-nocheck
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  triggerDate?: Date;
  repeat?: boolean;
}

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return finalStatus === 'granted';
    } catch (error) {
      return false;
    }
  }

  async scheduleNotification(notification: NotificationData): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Notification permissions not granted');
      }

      const notificationRequest: Notifications.NotificationRequestInput = {
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: notification.triggerDate 
          ? { date: notification.triggerDate }
          : null,
      };

      const identifier = await Notifications.scheduleNotificationAsync(notificationRequest);
      return identifier;
    } catch (error) {
      return null;
    }
  }

  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      return [];
    }
  }

  // Debt reminder notifications
  async scheduleDebtReminder(debtorName: string, amount: number, dueDate: Date): Promise<string | null> {
    const twoDaysBefore = new Date(dueDate);
    twoDaysBefore.setDate(dueDate.getDate() - 2);
    twoDaysBefore.setHours(9, 0, 0, 0); // 9 AM

    const oneDayBefore = new Date(dueDate);
    oneDayBefore.setDate(dueDate.getDate() - 1);
    oneDayBefore.setHours(9, 0, 0, 0); // 9 AM

    const onDueDate = new Date(dueDate);
    onDueDate.setHours(9, 0, 0, 0); // 9 AM

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    // Schedule 2 days before
    await this.scheduleNotification({
      id: `debt-${debtorName}-2days`,
      title: 'Lembrete de Cobrança',
      body: `${debtorName} deve ${formatCurrency(amount)}. Vencimento em 2 dias.`,
      triggerDate: twoDaysBefore,
      data: { type: 'debt_reminder', debtorName, amount, daysLeft: 2 }
    });

    // Schedule 1 day before
    await this.scheduleNotification({
      id: `debt-${debtorName}-1day`,
      title: 'Lembrete de Cobrança',
      body: `${debtorName} deve ${formatCurrency(amount)}. Vencimento amanhã!`,
      triggerDate: oneDayBefore,
      data: { type: 'debt_reminder', debtorName, amount, daysLeft: 1 }
    });

    // Schedule on due date
    return await this.scheduleNotification({
      id: `debt-${debtorName}-due`,
      title: 'Cobrança Vencida!',
      body: `A dívida de ${debtorName} (${formatCurrency(amount)}) venceu hoje.`,
      triggerDate: onDueDate,
      data: { type: 'debt_due', debtorName, amount, daysLeft: 0 }
    });
  }

  // Budget alert notifications
  async scheduleBudgetAlert(category: string, spent: number, budget: number): Promise<string | null> {
    const percentage = (spent / budget) * 100;
    
    if (percentage >= 80) {
      return await this.scheduleNotification({
        id: `budget-alert-${category}`,
        title: 'Alerta de Orçamento',
        body: `Você já gastou ${percentage.toFixed(0)}% do orçamento de ${category} este mês.`,
        data: { type: 'budget_alert', category, spent, budget, percentage }
      });
    }
    
    return null;
  }

  // Monthly summary notification
  async scheduleMonthlyReminder(): Promise<string | null> {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    nextMonth.setHours(9, 0, 0, 0); // 9 AM on first day of next month

    return await this.scheduleNotification({
      id: 'monthly-summary',
      title: 'Resumo Mensal Disponível',
      body: 'Confira como foram seus gastos e recebimentos no mês passado.',
      triggerDate: nextMonth,
      data: { type: 'monthly_summary' }
    });
  }

  // Weekly financial check notification
  async scheduleWeeklyReminder(): Promise<string | null> {
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay())); // Next Sunday
    nextSunday.setHours(19, 0, 0, 0); // 7 PM

    return await this.scheduleNotification({
      id: 'weekly-check',
      title: 'Revisão Semanal',
      body: 'Que tal revisar seus gastos da semana e planejar a próxima?',
      triggerDate: nextSunday,
      data: { type: 'weekly_reminder' }
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;