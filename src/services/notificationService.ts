import { Product } from '@/store/useProductStore';

export class NotificationService {
  private static intervalId: NodeJS.Timeout | null = null;
  private static lastCheckedProducts: string[] = [];

  static async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  static sendNotification(title: string, body: string, icon?: string, tag?: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon, tag });
    }
  }

  static async checkExpiryAlarms(products: Product[]) {
    const currentTime = new Date().toISOString();
    const currentProductIds = products.map(p => p.id).sort().join(',');

    // Only send notifications if products have changed or it's been a while
    if (currentProductIds === this.lastCheckedProducts.join(',')) {
      return;
    }

    this.lastCheckedProducts = products.map(p => p.id);

    products.forEach((product) => {
      const daysLeft = product.daysUntilExpiry;

      // Send notifications based on urgency
      if (daysLeft === 7) {
        this.sendNotification(
          '📅 Expiry Reminder',
          `${product.name} expires in 1 week`,
          undefined,
          `expiry-${product.id}-7d`
        );
      } else if (daysLeft === 3) {
        this.sendNotification(
          '⚠️ Expiry Alert',
          `${product.name} expires in 3 days!`,
          undefined,
          `expiry-${product.id}-3d`
        );
      } else if (daysLeft === 1) {
        this.sendNotification(
          '🚨 Urgent Alert',
          `${product.name} expires tomorrow!`,
          undefined,
          `expiry-${product.id}-1d`
        );
      } else if (daysLeft === 0) {
        this.sendNotification(
          '❌ Expired Today',
          `${product.name} expired today!`,
          undefined,
          `expiry-${product.id}-expired`
        );
      } else if (daysLeft < 0 && Math.abs(daysLeft) <= 7) {
        this.sendNotification(
          '💀 Expired',
          `${product.name} expired ${Math.abs(daysLeft)} days ago`,
          undefined,
          `expiry-${product.id}-past`
        );
      }
    });
  }

  static startAlarmChecks(products: Product[]) {
    // Check immediately on start
    this.checkExpiryAlarms(products);

    // Set up hourly checks
    this.intervalId = setInterval(() => {
      this.checkExpiryAlarms(products);
    }, 60 * 60 * 1000); // Check every hour
  }

  static stopAlarmChecks() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static updateProducts(products: Product[]) {
    this.checkExpiryAlarms(products);
  }
}
