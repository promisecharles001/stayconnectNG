/**
 * Analytics wrapper
 * Logs to console in development. Ready for Firebase Analytics integration.
 * To enable Firebase: npm install @react-native-firebase/app @react-native-firebase/analytics
 * and add google-services.json / GoogleService-Info.plist
 */

type EventParams = Record<string, string | number | boolean>;

class AnalyticsService {
  private static instance: AnalyticsService;
  private enabled = !__DEV__;
  private queue: { event: string; params?: EventParams }[] = [];

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async logEvent(event: string, params?: EventParams): Promise<void> {
    if (!this.enabled) {
      console.log(`[Analytics] ${event}`, params || '');
      return;
    }
    console.log(`[Analytics] ${event}`, params || '');
    this.queue.push({ event, params });
  }

  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    if (!this.enabled) {
      console.log(`[Analytics Screen] ${screenName}`);
      return;
    }
    console.log(`[Analytics Screen] ${screenName}`);
  }

  async logUserProperty(name: string, value: string): Promise<void> {
    if (!this.enabled) {
      console.log(`[Analytics User Property] ${name}: ${value}`);
      return;
    }
    console.log(`[Analytics User Property] ${name}: ${value}`);
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.enabled) {
      console.log(`[Analytics User ID] ${userId}`);
      return;
    }
    console.log(`[Analytics User ID] ${userId}`);
  }
}

export const analyticsService = AnalyticsService.getInstance();

// Convenience exports
export const logEvent = (event: string, params?: EventParams) => analyticsService.logEvent(event, params);
export const logScreenView = (screenName: string, screenClass?: string) => analyticsService.logScreenView(screenName, screenClass);
export const setUserId = (userId: string) => analyticsService.setUserId(userId);
export const logUserProperty = (name: string, value: string) => analyticsService.logUserProperty(name, value);
