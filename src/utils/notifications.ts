import * as Notifications from 'expo-notifications';

export interface Debt {
  id: string;
  description: string;
  totalAmount: number;
  dueDate: string;
  debtorId: string;
  debtor?: {
    name: string;
  };
}

// Configura o número de dias de antecedência para o lembrete
const DAYS_BEFORE_REMINDER = 3;

/**
 * Agenda uma notificação local para lembrar o usuário sobre uma dívida próxima do vencimento
 * @param debt Objeto da dívida contendo informações necessárias
 * @returns Promise<string | null> ID da notificação agendada ou null se houve erro
 */
export async function scheduleDueDateNotification(debt: Debt): Promise<string | null> {
  try {
    // Verificar se as permissões foram concedidas
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissões de notificação não concedidas');
      return null;
    }

    // Calcular a data de lembrete (3 dias antes do vencimento)
    const dueDate = new Date(debt.dueDate);
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(dueDate.getDate() - DAYS_BEFORE_REMINDER);

    // Verificar se a data de lembrete já passou
    const now = new Date();
    if (reminderDate <= now) {
      console.log('Data de lembrete já passou, não será agendada');
      return null;
    }

    // Formatar o valor para exibição
    const formattedAmount = (debt.totalAmount / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    // Agendar a notificação
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Cobrança: Ascend',
        body: `A cobrança de "${debt.debtor?.name || 'Devedor'}" no valor de ${formattedAmount} está próxima do vencimento!`,
        data: {
          debtId: debt.id,
          type: 'debt_reminder',
        },
        sound: true,
      },
      trigger: {
        type: 'date',
        date: reminderDate
      } as Notifications.DateTriggerInput,
    });

    console.log(`Notificação agendada com ID: ${notificationId} para ${reminderDate.toLocaleString('pt-BR')}`);
    return notificationId;

  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
}

/**
 * Cancela uma notificação agendada
 * @param notificationId ID da notificação a ser cancelada
 * @returns Promise<boolean> true se cancelada com sucesso
 */
export async function cancelScheduledNotification(notificationId: string): Promise<boolean> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notificação cancelada: ${notificationId}`);
    return true;
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
    return false;
  }
}

/**
 * Cancela múltiplas notificações
 * @param notificationIds Array de IDs de notificações
 * @returns Promise<boolean> true se todas foram canceladas
 */
export async function cancelMultipleNotifications(notificationIds: string[]): Promise<boolean> {
  try {
    const promises = notificationIds.map(id => 
      Notifications.cancelScheduledNotificationAsync(id)
    );
    await Promise.all(promises);
    console.log(`${notificationIds.length} notificações canceladas`);
    return true;
  } catch (error) {
    console.error('Erro ao cancelar múltiplas notificações:', error);
    return false;
  }
}

/**
 * Lista todas as notificações agendadas (para debug)
 * @returns Promise<Notifications.NotificationRequest[]>
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`Notificações agendadas: ${notifications.length}`);
    return notifications;
  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    return [];
  }
}