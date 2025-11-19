/**
 * Cloud Sync, Prayer Tracking, and Notification Utilities
 */

import type {
  UserSettings,
  CloudSyncPayload,
  PrayerRecord,
  PrayerHistory,
  NotificationSettings,
  FCMConfig,
} from '../types';

// ==================== CLOUD SYNC ====================

/**
 * Initialize cloud sync (Firebase, Supabase, or custom backend)
 */
export class CloudSyncManager {
  private userId: string;
  private provider: 'firebase' | 'supabase' | 'custom';
  private apiEndpoint?: string;
  private syncQueue: CloudSyncPayload[] = [];
  private isSyncing = false;
  private lastSyncTime = 0;

  constructor(
    userId: string,
    provider: 'firebase' | 'supabase' | 'custom' = 'custom',
    apiEndpoint?: string
  ) {
    this.userId = userId;
    this.provider = provider;
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Sync user settings to cloud
   */
  async syncSettings(settings: UserSettings): Promise<boolean> {
    if (this.isSyncing) {
      // Queue for later sync
      this.syncQueue.push({
        userId: this.userId,
        settings,
        prayerHistory: [],
        locations: [],
        customAdhans: [],
        timestamp: Date.now(),
        deviceId: this.getDeviceId(),
      });
      return false;
    }

    this.isSyncing = true;

    try {
      const payload: CloudSyncPayload = {
        userId: this.userId,
        settings,
        prayerHistory: [],
        locations: [],
        customAdhans: [],
        timestamp: Date.now(),
        deviceId: this.getDeviceId(),
      };

      const success = await this.uploadPayload(payload);

      if (success) {
        this.lastSyncTime = Date.now();
        settings.syncSettings.lastSyncTime = Date.now();
        this.processQueue();
      }

      return success;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync prayer history to cloud
   */
  async syncPrayerHistory(history: PrayerRecord[]): Promise<boolean> {
    if (!navigator.onLine) {
      // Queue for sync when online
      return false;
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/sync/prayer-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          userId: this.userId,
          history,
          timestamp: Date.now(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to sync prayer history:', error);
      return false;
    }
  }

  /**
   * Pull latest settings from cloud
   */
  async pullSettings(): Promise<UserSettings | null> {
    if (!navigator.onLine) return null;

    try {
      const response = await fetch(`${this.apiEndpoint}/sync/settings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.settings;
    } catch (error) {
      console.error('Failed to pull settings:', error);
      return null;
    }
  }

  /**
   * Enable/disable auto-sync
   */
  setAutoSync(enabled: boolean, interval: number = 300000): () => void {
    if (!enabled) return () => {};

    const timer = setInterval(() => {
      if (navigator.onLine) {
        this.processQueue();
      }
    }, interval);

    return () => clearInterval(timer);
  }

  /**
   * Process queued sync items
   */
  private async processQueue(): Promise<void> {
    while (this.syncQueue.length > 0 && !this.isSyncing) {
      const payload = this.syncQueue.shift();
      if (payload) {
        await this.uploadPayload(payload);
      }
    }
  }

  /**
   * Upload sync payload to server
   */
  private async uploadPayload(payload: CloudSyncPayload): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/sync/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to upload sync payload:', error);
      return false;
    }
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string> {
    // Implementation depends on auth provider
    // For now, retrieve from localStorage
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Get unique device ID
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
      // Generate device ID from user agent and timestamp
      deviceId = `${navigator.userAgent}-${Date.now()}`.substring(0, 128);
      localStorage.setItem('deviceId', deviceId);
    }

    return deviceId;
  }

  /**
   * Resolve sync conflicts
   */
  resolveConflict(
    local: UserSettings,
    remote: UserSettings
  ): UserSettings {
    // Strategy: Use remote if newer, otherwise use local
    if (remote.updatedAt > local.updatedAt) {
      return remote;
    }
    return local;
  }
}

// ==================== PRAYER TRACKING ====================

/**
 * Track prayer performance
 */
export class PrayerTracker {
  private records: PrayerRecord[] = [];
  private storageKey = 'prayerRecords';

  constructor() {
    this.loadRecords();
  }

  /**
   * Record a prayer
   */
  recordPrayer(
    prayer: string,
    date: string,
    status: 'performed' | 'missed' | 'qada' | 'qasr',
    actualTime?: string,
    withJamaah = false,
    notes?: string
  ): PrayerRecord {
    const record: PrayerRecord = {
      id: `${prayer}-${date}-${Date.now()}`,
      prayer,
      date,
      hijriDate: this.getHijriDateForRecord(date),
      status,
      actualTime,
      withJamaah,
      notes,
      recordedAt: Date.now(),
    };

    this.records.push(record);
    this.saveRecords();

    return record;
  }

  /**
   * Update prayer record
   */
  updateRecord(recordId: string, updates: Partial<PrayerRecord>): boolean {
    const index = this.records.findIndex((r) => r.id === recordId);

    if (index === -1) return false;

    this.records[index] = { ...this.records[index], ...updates };
    this.saveRecords();

    return true;
  }

  /**
   * Delete prayer record
   */
  deleteRecord(recordId: string): boolean {
    const index = this.records.findIndex((r) => r.id === recordId);

    if (index === -1) return false;

    this.records.splice(index, 1);
    this.saveRecords();

    return true;
  }

  /**
   * Get prayer history
   */
  getHistory(): PrayerHistory {
    const byMonth: { [key: string]: PrayerRecord[] } = {};
    let totalPerformed = 0;
    let totalMissed = 0;
    let totalQada = 0;

    // Group by month
    this.records.forEach((record) => {
      const [year, month] = record.date.split('-');
      const monthKey = `${year}-${month}`;

      if (!byMonth[monthKey]) {
        byMonth[monthKey] = [];
      }

      byMonth[monthKey].push(record);

      // Count totals
      if (record.status === 'performed') totalPerformed++;
      else if (record.status === 'missed') totalMissed++;
      else if (record.status === 'qada') totalQada++;
    });

    // Calculate streaks
    const { current: currentStreak, longest: longestStreak } = this.calculateStreaks();

    // Calculate consistency
    const total = totalPerformed + totalMissed + totalQada;
    const avgConsistency = total > 0 ? (totalPerformed / total) * 100 : 0;

    return {
      totalPerformed,
      totalMissed,
      totalQada,
      currentStreak,
      longestStreak,
      avgConsistency,
      byMonth,
      recentRecords: this.records.slice(-30),
    };
  }

  /**
   * Get statistics for a specific prayer
   */
  getStatistics(prayer: string): {
    performed: number;
    missed: number;
    qada: number;
    withJamaah: number;
    rate: number;
  } {
    const prayerRecords = this.records.filter((r) => r.prayer === prayer);

    const performed = prayerRecords.filter((r) => r.status === 'performed').length;
    const missed = prayerRecords.filter((r) => r.status === 'missed').length;
    const qada = prayerRecords.filter((r) => r.status === 'qada').length;
    const withJamaah = prayerRecords.filter((r) => r.withJamaah).length;

    const total = performed + missed + qada;
    const rate = total > 0 ? (performed / total) * 100 : 0;

    return {
      performed,
      missed,
      qada,
      withJamaah,
      rate,
    };
  }

  /**
   * Get trend data for visualization
   */
  getTrendData(days: number = 30): number[] {
    const trend: number[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayRecords = this.records.filter((r) => r.date === dateStr);
      const performed = dayRecords.filter((r) => r.status === 'performed').length;

      trend.push(performed);
    }

    return trend;
  }

  /**
   * Calculate current and longest streaks
   */
  private calculateStreaks(): { current: number; longest: number } {
    const sortedRecords = [...this.records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];

    sortedRecords.forEach((record, index) => {
      if (record.status === 'performed') {
        tempStreak++;

        if (index === 0 && record.date === today) {
          currentStreak = tempStreak;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    return { current: currentStreak, longest: longestStreak };
  }

  /**
   * Get Hijri date for record (simplified)
   */
  private getHijriDateForRecord(date: string): string {
    // This is a simplified version
    // In production, use proper Hijri conversion
    return date; // Placeholder
  }

  /**
   * Save records to localStorage
   */
  private saveRecords(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.records));
    } catch (error) {
      console.error('Failed to save prayer records:', error);
    }
  }

  /**
   * Load records from localStorage
   */
  private loadRecords(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.records = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load prayer records:', error);
      this.records = [];
    }
  }

  /**
   * Export records as CSV
   */
  exportAsCSV(): void {
    const headers = ['Prayer', 'Date', 'Status', 'Actual Time', 'With Jamaah', 'Notes'];
    const rows = this.records.map((r) => [
      r.prayer,
      r.date,
      r.status,
      r.actualTime || '',
      r.withJamaah ? 'Yes' : 'No',
      r.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prayer-records-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// ==================== NOTIFICATIONS ====================

/**
 * Setup Firebase Cloud Messaging (FCM)
 */
export const initFCM = async (
  config: FCMConfig
): Promise<string | null> => {
  if (!config.enabled || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // This requires Firebase SDK setup
    // Placeholder for FCM initialization
    console.log('FCM initialization would happen here');
    return config.fcmToken || null;
  } catch (error) {
    console.error('Failed to initialize FCM:', error);
    return null;
  }
};

/**
 * Send notification
 */
export const sendNotification = (
  title: string,
  options?: NotificationOptions & { tag?: string }
): Promise<Notification | null> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return Promise.resolve(null);
  }

  if (Notification.permission !== 'granted') {
    return Promise.resolve(null);
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    return Promise.resolve(notification);
  } catch (error) {
    console.error('Failed to send notification:', error);
    return Promise.resolve(null);
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/**
 * Setup prayer time notifications
 */
export const setupPrayerNotifications = (
  prayers: string[],
  notificationSettings: NotificationSettings,
  onNotification: (prayer: string) => void
): (() => void) => {
  const intervals = prayers.map((prayer) => {
    const interval = setInterval(() => {
      if (
        notificationSettings.enabled &&
        !isInSilentHours(notificationSettings)
      ) {
        onNotification(prayer);
      }
    }, 60000); // Check every minute

    return interval;
  });

  return () => {
    intervals.forEach((interval) => clearInterval(interval));
  };
};

/**
 * Check if current time is in silent hours
 */
const isInSilentHours = (settings: NotificationSettings): boolean => {
  if (!settings.silentHours?.enabled) {
    return false;
  }

  const now = new Date();
  const [startHour, startMin] = settings.silentHours.startTime.split(':').map(Number);
  const [endHour, endMin] = settings.silentHours.endTime.split(':').map(Number);

  const startTime = new Date();
  startTime.setHours(startHour, startMin, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMin, 0);

  return now >= startTime && now <= endTime;
};

// ==================== WIDGET DATA ====================

/**
 * Generate widget data
 */
export const generateWidgetData = (
  nextPrayer: string,
  nextPrayerTime: string,
  location: string,
  date: string,
  hijriDate: string,
  temperature?: number
) => {
  const now = new Date();
  const [hours, minutes] = nextPrayerTime.split(':').map(Number);
  const prayerTime = new Date();
  prayerTime.setHours(hours, minutes, 0);

  const diff = prayerTime.getTime() - now.getTime();
  const minutesLeft = Math.floor(diff / 60000);
  const secondsLeft = Math.floor((diff % 60000) / 1000);

  const countdownText =
    minutesLeft > 0
      ? `${minutesLeft}m ${secondsLeft}s`
      : `${secondsLeft}s`;

  return {
    nextPrayer: {
      name: nextPrayer,
      arabicName: getArabicPrayerName(nextPrayer),
      time: nextPrayerTime,
      countdownText,
    },
    location,
    date,
    hijriDate,
    temperature,
    updateTime: now.getTime(),
  };
};

/**
 * Get Arabic prayer name
 */
const getArabicPrayerName = (prayer: string): string => {
  const arabicNames: { [key: string]: string } = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  return arabicNames[prayer] || prayer;
};
