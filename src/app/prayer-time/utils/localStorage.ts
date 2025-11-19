/**
 * ===== PRAYER TIME APP - LOCAL STORAGE UTILITIES =====
 * Handles all persistent data storage for production reliability
 * Features: Auto-save, validation, error recovery, migration
 */

// ========== STORAGE KEYS ==========
export const STORAGE_KEYS = {
  CUSTOM_ALARMS: 'prayer-time-custom-alarms',
  REMINDER_SETTINGS: 'prayer-time-reminders',
  THEME_PREFERENCE: 'prayer-time-theme',
  AUDIO_UPLOADS: 'prayer-time-audio-uploads',
  PRAYER_STATS: 'prayer-time-stats',
  NOTIFICATION_HISTORY: 'prayer-time-notifications',
  FAVORITE_LOCATIONS: 'prayer-time-locations',
  VOLUME_PREFERENCE: 'prayer-time-volume',
  CACHE_PRAYER_TIMES: 'prayer-time-cache',
  LAST_SYNC: 'prayer-time-last-sync',
} as const;

// ========== TYPES ==========
export interface CustomAlarm {
  id: string;
  name: string;
  hour: number;
  minute: number;
  enabled: boolean;
  sound: 'adhan' | 'bell' | 'fajr-azan' | 'all-azan' | 'eid-takbeer' | 'eid-adha' | 'hajj-takbeer' | 'islamic-lori' | 'zil-hajj' | 'custom';
  customAudioUrl?: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface ReminderSettings {
  [prayer: string]: number; // minutes before prayer
}

export interface PrayerStats {
  today: number;
  streak: number;
  thisMonth: number;
  total: number;
  dailyHistory: Record<string, any>; // YYYY-MM-DD: DailyPrayerRecord
  monthlyStats?: Record<string, number>; // YYYY-MM: count
  yearlyStats?: Record<string, number>; // YYYY: count
  completionRate?: number; // 0-100
  longestStreak?: number; // max streak ever
  lastUpdated?: number; // timestamp
}

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  type: 'alarm' | 'reminder' | 'notification';
  alarmId?: string;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  method?: number;
  school?: number;
  savedAt: number;
}

// ========== SAFE STORAGE OPERATIONS ==========

/**
 * Safely retrieve data from localStorage with error handling
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue; // SSR safety
    
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    const parsed = JSON.parse(stored);
    return parsed as T;
  } catch (error) {
    console.error(`❌ Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Safely save data to localStorage with validation
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false; // SSR safety
    
    // Validate JSON serialization
    const serialized = JSON.stringify(value);
    
    // Check storage quota (estimate)
    if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
      console.warn(`⚠️ Data too large for key ${key}`);
      return false;
    }
    
    localStorage.setItem(key, serialized);
    console.log(`✅ Saved to localStorage: ${key}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error(`❌ localStorage quota exceeded for ${key}`);
      // Try to clear old notification history to free space
      clearOldNotifications();
    } else {
      console.error(`❌ Error writing to localStorage (${key}):`, error);
    }
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    console.log(`✅ Removed from localStorage: ${key}`);
  } catch (error) {
    console.error(`❌ Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Clear all prayer time app data from localStorage
 */
export function clearAllStorage(): void {
  try {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('✅ Cleared all prayer time storage');
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
  }
}

// ========== ALARM STORAGE ==========

/**
 * Load all custom alarms from storage
 */
export function loadAlarms(): CustomAlarm[] {
  return getFromStorage<CustomAlarm[]>(STORAGE_KEYS.CUSTOM_ALARMS, []);
}

/**
 * Save all alarms to storage
 */
export function saveAlarms(alarms: CustomAlarm[]): boolean {
  // Sort by time for consistency
  const sorted = [...alarms].sort((a, b) => {
    if (a.hour !== b.hour) return a.hour - b.hour;
    return a.minute - b.minute;
  });
  return saveToStorage(STORAGE_KEYS.CUSTOM_ALARMS, sorted);
}

/**
 * Add alarm and persist
 */
export function addAlarm(alarm: CustomAlarm): boolean {
  const alarms = loadAlarms();
  alarms.push(alarm);
  return saveAlarms(alarms);
}

/**
 * Update alarm and persist
 */
export function updateAlarm(id: string, updates: Partial<CustomAlarm>): boolean {
  const alarms = loadAlarms();
  const index = alarms.findIndex(a => a.id === id);
  if (index === -1) return false;
  
  alarms[index] = {
    ...alarms[index],
    ...updates,
    updatedAt: Date.now(),
  };
  return saveAlarms(alarms);
}

/**
 * Delete alarm and persist
 */
export function deleteAlarm(id: string): boolean {
  const alarms = loadAlarms();
  const filtered = alarms.filter(a => a.id !== id);
  return saveAlarms(filtered);
}

/**
 * Toggle alarm enabled state and persist
 */
export function toggleAlarm(id: string): boolean {
  const alarms = loadAlarms();
  const alarm = alarms.find(a => a.id === id);
  if (!alarm) return false;
  
  alarm.enabled = !alarm.enabled;
  alarm.updatedAt = Date.now();
  return saveAlarms(alarms);
}

// ========== REMINDER STORAGE ==========

/**
 * Load reminder settings from storage
 */
export function loadReminderSettings(): ReminderSettings {
  const defaults: ReminderSettings = {
    Fajr: 15,
    Sunrise: 0,
    Dhuhr: 10,
    Asr: 10,
    Maghrib: 5,
    Isha: 5,
  };
  return getFromStorage<ReminderSettings>(STORAGE_KEYS.REMINDER_SETTINGS, defaults);
}

/**
 * Save reminder settings to storage
 */
export function saveReminderSettings(settings: ReminderSettings): boolean {
  return saveToStorage(STORAGE_KEYS.REMINDER_SETTINGS, settings);
}

/**
 * Update single reminder setting and persist
 */
export function updateReminderSetting(prayer: string, minutes: number): boolean {
  const settings = loadReminderSettings();
  settings[prayer] = Math.max(0, minutes); // Prevent negative values
  return saveReminderSettings(settings);
}

// ========== THEME STORAGE ==========

/**
 * Load theme preference from storage
 */
export function loadThemePreference(): 'light' | 'dark' {
  const saved = getFromStorage<'light' | 'dark'>(STORAGE_KEYS.THEME_PREFERENCE, 'light');
  
  // If no saved preference, detect system preference
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE)) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  
  return saved;
}

/**
 * Save theme preference to storage
 */
export function saveThemePreference(theme: 'light' | 'dark'): boolean {
  return saveToStorage(STORAGE_KEYS.THEME_PREFERENCE, theme);
}

// ========== PRAYER STATS STORAGE ==========

/**
 * Load prayer statistics from storage
 */
export function loadPrayerStats(): PrayerStats {
  const defaults: PrayerStats = {
    today: 0,
    streak: 0,
    thisMonth: 0,
    total: 0,
    dailyHistory: {},
  };
  return getFromStorage<PrayerStats>(STORAGE_KEYS.PRAYER_STATS, defaults);
}

/**
 * Save prayer statistics to storage
 */
export function savePrayerStats(stats: PrayerStats): boolean {
  return saveToStorage(STORAGE_KEYS.PRAYER_STATS, stats);
}

/**
 * Mark prayer completed for today
 */
export function markPrayerCompleted(prayerName: string): void {
  const stats = loadPrayerStats();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  if (!stats.dailyHistory[today]) {
    stats.dailyHistory[today] = true;
    stats.today += 1;
    stats.total += 1;
  }
  
  savePrayerStats(stats);
}

// ========== NOTIFICATION HISTORY ==========

/**
 * Load notification history from storage
 */
export function loadNotificationHistory(): NotificationRecord[] {
  return getFromStorage<NotificationRecord[]>(STORAGE_KEYS.NOTIFICATION_HISTORY, []);
}

/**
 * Add notification to history and persist
 */
export function addNotification(record: Omit<NotificationRecord, 'id'>): void {
  const history = loadNotificationHistory();
  const notification: NotificationRecord = {
    ...record,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  // Keep only last 1000 notifications
  if (history.length > 1000) {
    history.shift();
  }
  
  history.push(notification);
  saveToStorage(STORAGE_KEYS.NOTIFICATION_HISTORY, history);
}

/**
 * Clear old notifications (older than 30 days)
 */
export function clearOldNotifications(): void {
  const history = loadNotificationHistory();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const filtered = history.filter(n => n.timestamp > thirtyDaysAgo);
  saveToStorage(STORAGE_KEYS.NOTIFICATION_HISTORY, filtered);
}

/**
 * Get notification history for a specific alarm
 */
export function getAlarmNotifications(alarmId: string): NotificationRecord[] {
  const history = loadNotificationHistory();
  return history.filter(n => n.alarmId === alarmId);
}

// ========== LOCATION STORAGE ==========

/**
 * Load favorite locations from storage
 */
export function loadFavoriteLocations(): FavoriteLocation[] {
  return getFromStorage<FavoriteLocation[]>(STORAGE_KEYS.FAVORITE_LOCATIONS, []);
}

/**
 * Save favorite locations to storage
 */
export function saveFavoriteLocations(locations: FavoriteLocation[]): boolean {
  return saveToStorage(STORAGE_KEYS.FAVORITE_LOCATIONS, locations);
}

/**
 * Add favorite location and persist
 */
export function addFavoriteLocation(location: Omit<FavoriteLocation, 'id' | 'savedAt'>): FavoriteLocation {
  const locations = loadFavoriteLocations();
  const newLocation: FavoriteLocation = {
    ...location,
    id: `loc-${Date.now()}`,
    savedAt: Date.now(),
  };
  locations.push(newLocation);
  saveFavoriteLocations(locations);
  return newLocation;
}

/**
 * Delete favorite location and persist
 */
export function deleteFavoriteLocation(id: string): boolean {
  const locations = loadFavoriteLocations();
  const filtered = locations.filter(l => l.id !== id);
  return saveFavoriteLocations(filtered);
}

// ========== CACHE MANAGEMENT ==========

/**
 * Load cached prayer times
 */
export function loadCachedPrayerTimes(city: string, country: string): any {
  const cache = getFromStorage<Record<string, any>>(STORAGE_KEYS.CACHE_PRAYER_TIMES, {});
  const key = `${city}-${country}`;
  const cached = cache[key];
  
  if (!cached) return null;
  
  // Check if cache is fresh (less than 24 hours old)
  const age = Date.now() - cached.timestamp;
  if (age > 24 * 60 * 60 * 1000) {
    // Cache expired, delete it
    delete cache[key];
    saveToStorage(STORAGE_KEYS.CACHE_PRAYER_TIMES, cache);
    return null;
  }
  
  return cached.data;
}

/**
 * Save prayer times to cache
 */
export function cachePrayerTimes(city: string, country: string, data: any): void {
  const cache = getFromStorage<Record<string, any>>(STORAGE_KEYS.CACHE_PRAYER_TIMES, {});
  const key = `${city}-${country}`;
  
  cache[key] = {
    timestamp: Date.now(),
    data,
  };
  
  saveToStorage(STORAGE_KEYS.CACHE_PRAYER_TIMES, cache);
}

// ========== VALIDATION ==========

/**
 * Validate custom alarm data
 */
export function validateAlarm(alarm: Partial<CustomAlarm>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!alarm.name || alarm.name.trim().length === 0) {
    errors.push('Alarm name is required');
  }
  if (alarm.name && alarm.name.length > 50) {
    errors.push('Alarm name must be 50 characters or less');
  }
  if (typeof alarm.hour !== 'number' || alarm.hour < 0 || alarm.hour > 23) {
    errors.push('Hour must be between 0 and 23');
  }
  if (typeof alarm.minute !== 'number' || alarm.minute < 0 || alarm.minute > 59) {
    errors.push('Minute must be between 0 and 59');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate reminder settings
 */
export function validateReminderMinutes(minutes: number): boolean {
  return typeof minutes === 'number' && minutes >= 0 && minutes <= 60;
}

// ========== MIGRATION & CLEANUP ==========

/**
 * Initialize storage with defaults and perform migrations
 */
export function initializeStorage(): void {
  try {
    // Ensure all required keys exist with defaults
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_ALARMS)) {
      saveAlarms([]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REMINDER_SETTINGS)) {
      saveReminderSettings(loadReminderSettings());
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRAYER_STATS)) {
      savePrayerStats(loadPrayerStats());
    }
    
    console.log('✅ Storage initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
  }
}

/**
 * Get storage statistics
 */
export function getStorageStats(): {
  alarmsCount: number;
  notificationsCount: number;
  locationsCount: number;
  estimatedSize: string;
} {
  const alarms = loadAlarms();
  const notifications = loadNotificationHistory();
  const locations = loadFavoriteLocations();
  
  // Rough estimation of storage size
  const estimatedBytes = 
    JSON.stringify(alarms).length +
    JSON.stringify(notifications).length +
    JSON.stringify(locations).length;
  
  const estimatedKB = (estimatedBytes / 1024).toFixed(2);
  
  return {
    alarmsCount: alarms.length,
    notificationsCount: notifications.length,
    locationsCount: locations.length,
    estimatedSize: `${estimatedKB} KB`,
  };
}
