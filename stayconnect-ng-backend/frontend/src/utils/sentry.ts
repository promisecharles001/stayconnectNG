/**
 * Sentry error monitoring integration
 * Call initSentry() early in app startup.
 */

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

let isInitialized = false;

export function initSentry(): void {
  if (isInitialized) return;
  if (!SENTRY_DSN) {
    console.log('[Sentry] No DSN configured — error reporting disabled.');
    return;
  }

  // Sentry init would go here when @sentry/react-native is installed
  // Example:
  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   environment: __DEV__ ? 'development' : 'production',
  //   enableNative: !__DEV__,
  // });

  isInitialized = true;
  console.log('[Sentry] Initialized');
}

/**
 * Manually capture an exception for logging
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  console.error('[Sentry]', error, context);
  // When Sentry is installed:
  // Sentry.captureException(error, { extra: context });
}

/**
 * Log a breadcrumb for debugging user flows
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
  console.log(`[Breadcrumb] ${category}: ${message}`, data);
  // When Sentry is installed:
  // Sentry.addBreadcrumb({ message, category, data });
}
