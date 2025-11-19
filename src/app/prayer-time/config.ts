/**
 * Prayer Times App Configuration
 * Central configuration for all app features
 */

import type {
  CalculationMethod,
  MadhabSchool,
  NotificationSettings,
  CacheConfig,
  UserSettings,
  AccessibilityConfig,
  WidgetConfig,
  FCMConfig,
} from '../types';

// ==================== CALCULATION METHODS ====================

export const DEFAULT_CALCULATION_METHOD: CalculationMethod = 4; // Umm Al-Qura
export const DEFAULT_MADHAB: MadhabSchool = 0; // Shafi'i

export const CALCULATION_METHODS_CONFIG = {
  1: { name: 'Ummah Al-Qura University, Mecca', region: 'Saudi Arabia', fajrAngle: 18.5, ishaAngle: 90 },
  2: { name: 'Islamic Society of North America (ISNA)', region: 'North America', fajrAngle: 15, ishaAngle: 15 },
  3: { name: 'Muslim World League (MWL)', region: 'Europe, Far East', fajrAngle: 18, ishaAngle: 17 },
  4: { name: 'Umm Al-Qura (Default)', region: 'Saudi Arabia', fajrAngle: 18.5, ishaAngle: 90 },
  5: { name: 'Egyptian General Authority of Survey', region: 'Africa, Middle East', fajrAngle: 19.5, ishaAngle: 17.5 },
  7: { name: 'Al Kareem University', region: 'Kuwait', fajrAngle: 18, ishaAngle: 17.5 },
  8: { name: 'DIYANET', region: 'Turkey', fajrAngle: 18, ishaAngle: 17 },
  9: { name: 'JAKIM', region: 'Malaysia', fajrAngle: 20, ishaAngle: 18 },
  10: { name: 'Singapore', region: 'Singapore', fajrAngle: 20, ishaAngle: 18 },
  11: { name: 'MUIS', region: 'Singapore', fajrAngle: 20, ishaAngle: 18 },
  12: { name: 'ISRA', region: 'Malaysia', fajrAngle: 20, ishaAngle: 18 },
  13: { name: 'MOON SIGHT', region: 'Custom', fajrAngle: 18, ishaAngle: 17 },
  14: { name: 'UCT', region: 'South Africa', fajrAngle: 18, ishaAngle: 17 },
};

export const MADHAB_CONFIG = {
  0: { name: 'Shafi\'i', arabicName: 'الشافعي', asrMethod: 'shadow1x' as const },
  1: { name: 'Hanafi', arabicName: 'الحنفي', asrMethod: 'shadow2x' as const },
  2: { name: 'Maliki', arabicName: 'المالكي', asrMethod: 'shadow1x' as const },
  3: { name: 'Hanbali', arabicName: 'الحنبلي', asrMethod: 'shadow1x' as const },
};

// ==================== PRAYER CONFIGURATION ====================

export const PRAYERS = [
  { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', index: 1, color: '#6b4ce6', icon: '🌙' },
  { key: 'Sunrise', name: 'Sunrise', arabic: 'الشروق', index: 2, color: '#ff9800', icon: '🌅' },
  { key: 'Dhuhr', name: 'Dhuhr', arabic: 'الظهر', index: 3, color: '#ffc107', icon: '☀️' },
  { key: 'Asr', name: 'Asr', arabic: 'العصر', index: 4, color: '#ff9800', icon: '🌤️' },
  { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', index: 5, color: '#f44336', icon: '🌆' },
  { key: 'Isha', name: 'Isha', arabic: 'العشاء', index: 6, color: '#1a237e', icon: '🌃' },
];

export const PRAYER_NAMES_ARABIC: { [key: string]: string } = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// ==================== NOTIFICATION CONFIGURATION ====================

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  sound: true,
  vibration: true,
  light: true,
  priority: 'high',
  silentHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '06:00',
  },
};

export const REMINDER_MINUTES = [1, 2, 5, 10, 15, 20, 30, 45, 60];

export const DEFAULT_REMINDERS = [
  { prayer: 'Fajr', minutesBefore: 15 },
  { prayer: 'Dhuhr', minutesBefore: 5 },
  { prayer: 'Asr', minutesBefore: 5 },
  { prayer: 'Maghrib', minutesBefore: 2 },
  { prayer: 'Isha', minutesBefore: 5 },
];

// ==================== CACHE CONFIGURATION ====================

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  maxSize: 100, // MB
  expirationDays: 30,
  autoSync: true,
  lastSyncTime: undefined,
};

export const CACHE_KEYS = {
  prayerTimes: 'prayerTimes',
  savedLocations: 'savedLocations',
  searchHistory: 'locationSearchHistory',
  locationStats: 'locationStatistics',
  userSettings: 'userSettings',
  prayerRecords: 'prayerRecords',
  customAdhans: 'customAdhans',
  travelMode: 'travelMode',
};

// ==================== OFFLINE CONFIGURATION ====================

export const HIGH_LATITUDE_THRESHOLD = 48.5; // Degrees

export const HIGH_LATITUDE_METHODS = [
  {
    method: 'midnight' as const,
    name: 'Midnight Method',
    description: 'Fajr and Isha are approximated as midway between midnight/sunset and sunrise',
  },
  {
    method: 'nearest-latitude' as const,
    name: 'Nearest Latitude Method',
    description: 'Use times from nearest latitude with normal sunset',
  },
  {
    method: 'angle-based' as const,
    name: 'Angle-Based Method',
    description: 'Reduce sun angle by fixed percentage for high latitudes',
  },
  {
    method: 'fraction-of-night' as const,
    name: 'Fraction of Night Method',
    description: 'Divide night into equal fractions for Fajr and Isha',
  },
];

// ==================== WIDGET CONFIGURATION ====================

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  id: 'widget-default',
  type: 'medium',
  platform: 'android',
  displayNextPrayer: true,
  displayCountdown: true,
  displayTemperature: false,
  displayLocation: true,
  refreshInterval: 60000, // 1 minute
  updateFrequency: 'realtime',
};

export const WIDGET_SIZES = {
  small: { width: 100, height: 100, minWidth: 100, minHeight: 100 },
  medium: { width: 200, height: 110, minWidth: 200, minHeight: 110 },
  large: { width: 200, height: 250, minWidth: 200, minHeight: 250 },
};

// ==================== ACCESSIBILITY CONFIGURATION ====================

export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  highContrast: false,
  largeText: false,
  screenReaderOptimized: true,
  reduceMotion: false,
  colorBlindMode: 'none',
  keyboardNavigation: true,
  focusIndicator: true,
  textToSpeech: false,
};

export const COLOR_BLIND_PALETTES = {
  none: {
    fajr: '#6b4ce6',
    dhuhr: '#ffc107',
    asr: '#ff9800',
    maghrib: '#f44336',
    isha: '#1a237e',
  },
  deuteranopia: {
    fajr: '#1f77b4',
    dhuhr: '#ff7f0e',
    asr: '#2ca02c',
    maghrib: '#d62728',
    isha: '#9467bd',
  },
  protanopia: {
    fajr: '#0173b2',
    dhuhr: '#de8f05',
    asr: '#cc78bc',
    maghrib: '#ca9161',
    isha: '#949494',
  },
  tritanopia: {
    fajr: '#ee7733',
    dhuhr: '#0077bb',
    asr: '#33bbee',
    maghrib: '#ee3377',
    isha: '#cc3311',
  },
};

// ==================== SYNC CONFIGURATION ====================

export const DEFAULT_SYNC_SETTINGS = {
  enabled: true,
  cloudProvider: 'custom' as const,
  autoSync: true,
  syncInterval: 300000, // 5 minutes
};

export const FCM_TOPICS = [
  'prayer-notifications',
  'hijri-events',
  'ramadan-updates',
  'prayer-reminders',
  'app-updates',
];

export const DEFAULT_FCM_CONFIG: FCMConfig = {
  enabled: false,
  topics: FCM_TOPICS,
  deliveryTime: '04:00',
};

// ==================== API CONFIGURATION ====================

export const API_CONFIG = {
  aladhan: {
    baseUrl: 'https://api.aladhan.com/v1',
    endpoints: {
      timings: '/timings',
      timingsByCity: '/timingsByCity',
      methodsList: '/methods',
      hijri: '/hijriToGregorian',
      qibla: '/qibla',
    },
    timeout: 10000, // 10 seconds
    retries: 3,
  },
  custom: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    endpoints: {
      sync: '/sync',
      prayerRecords: '/prayer-records',
      adhans: '/adhans',
    },
    timeout: 15000,
    retries: 2,
  },
};

// ==================== DEFAULT USER SETTINGS ====================

export const DEFAULT_USER_SETTINGS: Partial<UserSettings> = {
  calculationMethod: DEFAULT_CALCULATION_METHOD,
  madhab: DEFAULT_MADHAB,
  highLatitudeMethod: 'midnight',
  theme: 'auto',
  language: 'en',
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  cacheConfig: DEFAULT_CACHE_CONFIG,
  travelMode: null,
  syncSettings: DEFAULT_SYNC_SETTINGS,
  accessibility: DEFAULT_ACCESSIBILITY_CONFIG,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// ==================== FEATURE FLAGS ====================

export const FEATURE_FLAGS = {
  enableOfflineMode: true,
  enableCloudSync: true,
  enablePrayerTracking: true,
  enableWidgets: true,
  enableTravelMode: true,
  enableCustomAdhans: true,
  enableFiqhNotes: true,
  enableQiblaCompass: true,
  enableHijriDate: true,
  enableMonthlyTimetable: true,
  enableHighLatitudeAdjustments: true,
};

// ==================== STORAGE LIMITS ====================

export const STORAGE_LIMITS = {
  maxCacheSize: 100 * 1024 * 1024, // 100 MB
  maxAudioFileSize: 10 * 1024 * 1024, // 10 MB per audio
  maxPrayerRecordsAge: 365, // days
  maxSearchHistoryItems: 100,
  maxSavedLocations: 50,
  maxCustomAdhans: 20,
};

// ==================== TIMING CONFIGURATION ====================

export const TIMING_CONFIG = {
  prayerTimeFetchInterval: 3600000, // 1 hour
  widgetUpdateInterval: 60000, // 1 minute
  syncInterval: 300000, // 5 minutes
  cacheCleanupInterval: 86400000, // 1 day
  notificationCheckInterval: 60000, // 1 minute
  gpsUpdateInterval: 300000, // 5 minutes for continuous location
};

// ==================== ISLAMIC CALENDAR EVENTS ====================

export const ISLAMIC_EVENTS = [
  {
    name: 'Ramadan',
    hijriMonth: 9,
    hijriDay: 1,
    duration: 30,
    category: 'fasting',
    importance: 'critical',
  },
  {
    name: 'Laylat al-Qadr',
    hijriMonth: 9,
    hijriDay: 27,
    duration: 1,
    category: 'worship',
    importance: 'critical',
  },
  {
    name: 'Eid al-Fitr',
    hijriMonth: 10,
    hijriDay: 1,
    duration: 3,
    category: 'celebration',
    importance: 'critical',
  },
  {
    name: 'Hajj',
    hijriMonth: 12,
    hijriDay: 8,
    duration: 6,
    category: 'pilgrimage',
    importance: 'critical',
  },
  {
    name: 'Arafah Day',
    hijriMonth: 12,
    hijriDay: 9,
    duration: 1,
    category: 'pilgrimage',
    importance: 'critical',
  },
  {
    name: 'Eid al-Adha',
    hijriMonth: 12,
    hijriDay: 10,
    duration: 4,
    category: 'celebration',
    importance: 'critical',
  },
];

// ==================== CITY COORDINATES ====================

export const MAJOR_CITIES = {
  Mecca: { lat: 21.4225, lon: 39.8262, timezone: 'Asia/Riyadh' },
  Medina: { lat: 24.5247, lon: 39.5692, timezone: 'Asia/Riyadh' },
  'New York': { lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  London: { lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  Tokyo: { lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  Sydney: { lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  Dubai: { lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  Istanbul: { lat: 41.0082, lon: 28.9784, timezone: 'Europe/Istanbul' },
  Cairo: { lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
  Jakarta: { lat: -6.2088, lon: 106.8456, timezone: 'Asia/Jakarta' },
};

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  networkError: 'Unable to fetch data. Please check your connection.',
  invalidLocation: 'Could not find the specified location. Please try again.',
  permissionDenied: 'Location permission was denied. Please enable location access.',
  timeout: 'Request timed out. Please try again.',
  invalidCache: 'Cache data is corrupted. Clearing and reloading...',
  syncFailed: 'Sync failed. Changes will be saved locally and synced when online.',
};

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  locationSaved: 'Location saved successfully!',
  settingsSaved: 'Settings saved successfully!',
  syncCompleted: 'All changes synced successfully!',
  prayerRecorded: 'Prayer recorded successfully!',
  adhanUploaded: 'Custom Adhan uploaded successfully!',
};

export default {
  PRAYERS,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_MADHAB,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_CACHE_CONFIG,
  DEFAULT_ACCESSIBILITY_CONFIG,
  FEATURE_FLAGS,
  TIMING_CONFIG,
  API_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
