// Notification Service - User feedback and alerts
interface NotificationOptions {
  title?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export class NotificationService {
  // Show success notification
  showSuccess(message: string, options?: NotificationOptions) {
    this.showNotification('success', message, options);
  }

  // Show error notification
  showError(message: string, options?: NotificationOptions) {
    this.showNotification('error', message, options);
  }

  // Show warning notification
  showWarning(message: string, options?: NotificationOptions) {
    this.showNotification('warning', message, options);
  }

  // Show info notification
  showInfo(message: string, options?: NotificationOptions) {
    this.showNotification('info', message, options);
  }

  // Internal notification display logic
  private showNotification(type: 'success' | 'error' | 'warning' | 'info', message: string, options?: NotificationOptions) {
    // For now, use console and browser alert as fallback
    // In a real implementation, this would integrate with a UI notification library
    const prefix = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[type];

    console.log(`${prefix} ${options?.title || ''} ${message}`);

    // Simple browser notification for development
    if (type === 'error' || type === 'warning') {
      // Show important notifications as alerts for development
      setTimeout(() => alert(`${prefix} ${message}`), 100);
    }
  }

  // Show API connection status
  showConnectionStatus(isConnected: boolean, service: string) {
    if (isConnected) {
      this.showSuccess(`Connected to ${service}`);
    } else {
      this.showError(`${service} unavailable - connection failed`);
    }
  }

  // Show loading state
  showLoading(message: string = 'Loading...') {
    console.log(`🔄 ${message}`);
  }

  // Hide loading state
  hideLoading() {
    console.log('✅ Loading complete');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();