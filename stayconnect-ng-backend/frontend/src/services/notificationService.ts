import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type: 'message' | 'booking' | 'withdrawal' | 'review' | 'general';
  [key: string]: any;
}

export interface LocalNotificationOptions {
  title: string;
  body: string;
  data?: NotificationData;
  sound?: boolean;
  badge?: number;
}

class NotificationService {
  private expoPushToken: string | null = null;

  // Register for push notifications and get Expo push token
  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Check if device is a physical device (not simulator)
      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }

      // Get Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await this.configureAndroidChannel();
      }

      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Configure Android notification channel
  private async configureAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#007AFF',
    });
  }

  // Get the current Expo push token
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Check if push notifications are enabled
  async areNotificationsEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  // Send a local notification immediately
  async sendLocalNotification(options: LocalNotificationOptions): Promise<string> {
    const { title, body, data, sound = true, badge } = options;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: sound ? 'default' : undefined,
        badge,
      },
      trigger: null, // null trigger sends immediately
    });

    return notificationId;
  }

  // Schedule a local notification for later
  async scheduleNotification(
    options: LocalNotificationOptions,
    seconds: number
  ): Promise<string> {
    const { title, body, data, sound = true, badge } = options;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: sound ? 'default' : undefined,
        badge,
      },
      trigger: {
        type: 'timeInterval',
        seconds,
      } as Notifications.TimeIntervalTriggerInput,
    });

    return notificationId;
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Clear badge count
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // Set badge count
  async setBadge(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  // Dismiss a specific notification
  async dismissNotification(notificationId: string): Promise<void> {
    await Notifications.dismissNotificationAsync(notificationId);
  }

  // Dismiss all notifications
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  // Send notification for new message
  async notifyNewMessage(senderName: string, message: string): Promise<string> {
    return this.sendLocalNotification({
      title: `New message from ${senderName}`,
      body: message.length > 50 ? message.substring(0, 50) + '...' : message,
      data: { type: 'message' },
    });
  }

  // Send notification for new booking
  async notifyNewBooking(propertyTitle: string, guestName: string): Promise<string> {
    return this.sendLocalNotification({
      title: 'New Booking!',
      body: `${guestName} booked ${propertyTitle}`,
      data: { type: 'booking' },
    });
  }

  // Send notification for withdrawal approved
  async notifyWithdrawalApproved(amount: number): Promise<string> {
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

    return this.sendLocalNotification({
      title: 'Withdrawal Approved',
      body: `Your withdrawal of ${formattedAmount} has been approved`,
      data: { type: 'withdrawal' },
    });
  }

  // Send notification for new review
  async notifyNewReview(propertyTitle: string, rating: number): Promise<string> {
    return this.sendLocalNotification({
      title: 'New Review!',
      body: `Your property "${propertyTitle}" received a ${rating}-star review`,
      data: { type: 'review' },
    });
  }

  // Send notification for booking status update
  async notifyBookingStatus(status: string, propertyTitle: string): Promise<string> {
    return this.sendLocalNotification({
      title: 'Booking Update',
      body: `Your booking for "${propertyTitle}" is now ${status}`,
      data: { type: 'booking' },
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
