export interface Coordinates {
  lat?: string;
  lon?: string;
  city?: string;
  country?: string;
}

export interface Prayer {
  key: string;
  name: string;
  arabic: string;
  index: number;
}

export interface PrayerTimingsData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
  [key: string]: string | undefined;
}

export interface HijriDate {
  date: string;
  day: string;
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

export interface GregorianDate {
  date: string;
  day: string;
  month: {
    number: number;
    en: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

export interface MethodInfo {
  id: number;
  name: string;
  params: {
    Fajr: number;
    Isha: number;
  };
}

export interface MetaData {
  method: MethodInfo;
  latitude: number;
  longitude: number;
  timezone: string;
  school: string;
  midnightMode: string;
  offset?: {
    Imsak?: number;
    Fajr?: number;
    Sunrise?: number;
    Dhuhr?: number;
    Asr?: number;
    Maghrib?: number;
    Isha?: number;
    Midnight?: number;
  };
}

export interface DateInfo {
  readable: string;
  timestamp: string;
  hijri: HijriDate;
  gregorian: GregorianDate;
}

export interface PrayerTimesData {
  timings: PrayerTimingsData;
  date: DateInfo;
  meta: MetaData;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: PrayerTimesData;
}

export interface Reminder {
  id: string;
  prayerKey: string;
  minutesBefore: number;
  enabled: boolean;
  lastTriggered?: number;
}

export interface PrayerReminder {
  prayer: Prayer;
  scheduledTime: Date;
  reminderTime: Date;
  triggered: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  playAzanAtPrayerTime: boolean;
}

export interface CustomAlarm {
  id: string;
  name: string; // e.g., "Fajr 2 Rakah Sunnah", "Dhuhr Nafl", etc.
  alarmType: 'sunnah' | 'nafl' | 'tahajjud' | 'custom'; // Prayer type
  basePrayer: string; // e.g., "Fajr", "Dhuhr"
  time: string; // HH:mm format
  enabled: boolean;
  audioFile: 'fajr' | 'general' | 'custom'; // Which audio to play
  volume?: number; // 0-100, overrides global if set
  label?: string; // Custom label for the alarm
  createdAt?: number; // Timestamp
  lastTriggered?: number; // Last trigger timestamp
  notificationEnabled?: boolean; // Show browser notification
}

export interface AlarmNotification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  audioUrl?: string;
  timestamp: number;
  duration?: number; // How long to show notification
}

export interface SavedLocation {
  id: string;
  name: string; // User-friendly name (e.g., "My Home", "Office")
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  createdAt: number;
  isFavorite?: boolean;
}

export interface LocationQuery {
  city: string;
  country: string;
  searchTerm?: string; // Full search term for display
}

export interface SearchHistory {
  id: string;
  city: string;
  country: string;
  searchedAt: number;
  searchCount: number; // How many times searched
  lastSearched: number;
}

export interface LocationStatistics {
  totalSearches: number;
  lastSearchedLocation?: SavedLocation;
  mostFrequentLocation?: SavedLocation;
  favoriteCount: number;
  savedLocationCount: number;
}

export interface LocationComparison {
  location1: SavedLocation;
  location2: SavedLocation;
  prayerTimes1?: PrayerTimesResponse;
  prayerTimes2?: PrayerTimesResponse;
  timezoneOffset?: number;
}

export interface PrayerTimeStats {
  locationId: string;
  prayerName: string;
  time: string;
  hijriDate: string;
  gregorianDate: string;
  method: string;
  timezone: string;
}

// ==================== CALCULATION METHODS & MADHAB ====================
export type CalculationMethod = 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type MadhabSchool = 0 | 1 | 2 | 3; // 0=Shafi'i, 1=Hanafi, 2=Maliki, 3=Hanbali

export interface CalculationMethodConfig {
  id: CalculationMethod;
  name: string;
  region: string;
  fajrAngle: number;
  ishaAngle: number;
  description: string;
}

export interface MadhabConfig {
  school: MadhabSchool;
  name: string;
  arabicName: string;
  description: string;
  asrMethod: 'shadow1x' | 'shadow2x'; // Shafi'i: 1x, Hanafi: 2x
}

export interface HighLatitudeAdjustment {
  method: 'midnight' | 'nearest-latitude' | 'angle-based' | 'fraction-of-night';
  name: string;
  description: string;
  enabled: boolean;
}

// ==================== MONTHLY TIMETABLE ====================
export interface DailyPrayerTiming {
  date: string;
  hijriDate?: string;
  gregorianDate?: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak?: string;
  midnight?: string;
}

export interface MonthlyTimetable {
  month: number;
  year: number;
  hijriMonth?: string;
  hijriYear?: number;
  location: SavedLocation;
  method: CalculationMethodConfig;
  madhab: MadhabConfig;
  timings: DailyPrayerTiming[];
  generatedAt: number;
}

// ==================== HIJRI DATE & LUNAR CALENDAR ====================
export interface HijriDateWithCorrection {
  calculated: HijriDate;
  observed: HijriDate;
  isManuallySet: boolean;
  lunarObservation?: {
    moonAge: number;
    visibility: 'visible' | 'invisible' | 'uncertain';
    observedBy: string[];
    observationDate: string;
  };
  correctionNotes?: string;
}

export interface LunarCalendarEvent {
  id: string;
  name: string;
  arabicName: string;
  hijriDate: HijriDate;
  description: string;
  prayerModification?: {
    fajrTime?: string;
    dhuhrTime?: string;
  };
  icon: string;
}

// ==================== QIBLA COMPASS & MAP ====================
export interface QiblaDirection {
  azimuth: number; // Degrees from north (0-360)
  magneticDeclination: number;
  trueNorth: number;
  description: string;
  isAccurate: boolean;
}

export interface QiblaCompassState {
  currentAzimuth: number;
  qiblaAzimuth: number;
  deviation: number; // Difference from Qibla direction
  isCompassReady: boolean;
  accuracy: number; // Compass accuracy in degrees
  lastUpdate: number;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  kabaLatitude: number;
  kabaLongitude: number;
  distance: number; // km
  bearing: number; // Azimuth/bearing
  zoom: number;
}

// ==================== NOTIFICATIONS & ADHAN AUDIO ====================
export type NotificationType = 'prayer-time' | 'reminder' | 'hijri-event' | 'custom';

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  light: boolean;
  priority: 'low' | 'default' | 'high' | 'max';
  silentHours?: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
}

export interface CustomAdhan {
  id: string;
  name: string;
  prayer: string; // Which prayer (Fajr, Dhuhr, etc.)
  audioUrl: string; // Local file path or remote URL
  duration: number; // seconds
  fileSize: number; // bytes
  uploadedAt: number;
  isDefault: boolean;
  metadata?: {
    reciterName?: string;
    language?: string;
    quality?: 'low' | 'medium' | 'high';
  };
}

export interface AudioAsset {
  id: string;
  type: 'adhan' | 'takbeer' | 'lori' | 'custom';
  prayer?: string;
  occasion?: string;
  localPath: string;
  remoteUrl?: string;
  cached: boolean;
  cacheSize: number;
  lastCached?: number;
}

export interface FCMConfig {
  enabled: boolean;
  fcmToken?: string;
  topics: string[];
  deliveryTime?: string; // HH:mm for batch delivery
}

// ==================== WIDGETS ====================
export interface WidgetConfig {
  id: string;
  type: 'small' | 'medium' | 'large';
  platform: 'android' | 'ios';
  displayNextPrayer: boolean;
  displayCountdown: boolean;
  displayTemperature: boolean;
  displayLocation: boolean;
  refreshInterval: number; // milliseconds
  updateFrequency: 'realtime' | 'hourly' | 'every-15min';
}

export interface WidgetData {
  nextPrayer: {
    name: string;
    arabicName: string;
    time: string;
    countdownText: string;
  };
  location: string;
  date: string;
  hijriDate: string;
  temperature?: number;
  updateTime: number;
}

// ==================== OFFLINE & TRAVEL MODE ====================
export interface CacheConfig {
  enabled: boolean;
  maxSize: number; // MB
  expirationDays: number;
  autoSync: boolean;
  lastSyncTime?: number;
}

export interface TravelMode {
  enabled: boolean;
  destinationLocation: SavedLocation;
  departureDate: string;
  returnDate: string;
  timezone: string;
  useDestinationMethod: boolean;
  notifications: boolean;
  offlineMode: boolean;
  cachedDays: number;
}

export interface OfflineData {
  prayerTimes: { [key: string]: PrayerTimesResponse }; // Date as key
  locations: SavedLocation[];
  settings: UserSettings;
  lastUpdated: number;
  expiresAt: number;
}

export interface ServiceWorkerConfig {
  enabled: boolean;
  cacheStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate';
  precachePrayerDays: number;
}

// ==================== USER SETTINGS & SYNC ====================
export interface UserSettings {
  userId?: string;
  calculationMethod: CalculationMethod;
  madhab: MadhabSchool;
  highLatitudeMethod: HighLatitudeAdjustment['method'];
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ar' | 'ur' | 'id' | 'fr';
  location: SavedLocation;
  notifications: NotificationSettings;
  audioSettings: AudioSettings;
  customAdhans: CustomAdhan[];
  reminderSettings: Reminder[];
  cacheConfig: CacheConfig;
  travelMode: TravelMode | null;
  widgetConfig: WidgetConfig[];
  syncSettings: {
    enabled: boolean;
    cloudProvider?: 'firebase' | 'supabase' | 'custom';
    lastSyncTime?: number;
    autoSync: boolean;
    syncInterval: number; // milliseconds
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
    reduceMotion: boolean;
    colorBlindMode?: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  };
  createdAt: number;
  updatedAt: number;
}

export interface CloudSyncPayload {
  userId: string;
  settings: UserSettings;
  prayerHistory: PrayerRecord[];
  locations: SavedLocation[];
  customAdhans: CustomAdhan[];
  timestamp: number;
  deviceId: string;
}

// ==================== PRAYER TRACKING ====================
export type PrayerStatus = 'performed' | 'missed' | 'qada' | 'qasr' | 'not-applicable';

export interface PrayerRecord {
  id: string;
  prayer: string; // Fajr, Dhuhr, etc.
  date: string; // YYYY-MM-DD
  hijriDate: string;
  status: PrayerStatus;
  actualTime?: string; // When it was actually performed
  location?: SavedLocation;
  notes?: string;
  withJamaah: boolean; // Performed in congregation?
  sujoodDuration?: number; // seconds
  recordedAt: number;
}

export interface PrayerHistory {
  totalPerformed: number;
  totalMissed: number;
  totalQada: number;
  currentStreak: number; // Consecutive prayers performed
  longestStreak: number;
  avgConsistency: number; // Percentage
  byMonth: { [month: string]: PrayerRecord[] };
  recentRecords: PrayerRecord[];
}

export interface PrayerStats {
  prayer: string;
  performanceRate: number; // Percentage
  consistencyTrend: number[]; // Last 7 days
  averageDelay: number; // minutes
  notes: string;
}

// ==================== FIQH NOTES & REFERENCES ====================
export interface FiqhNote {
  id: string;
  title: string;
  arabicTitle: string;
  category: 'salah' | 'wudu' | 'ihram' | 'sunnahs' | 'makruhs' | 'conditions' | 'pillars' | 'obligatory';
  madhab: MadhabSchool[];
  content: string;
  arabicContent?: string;
  hadithReference?: {
    collection: string; // Sahih Bukhari, Sahih Muslim, etc.
    hadithNumber: string;
    gradeOfAuthenticity: string;
  };
  scholarNotes?: string;
  relevantPrayers?: string[]; // Which prayers this applies to
  createdAt: number;
  source?: string;
}

export interface IslamicReference {
  id: string;
  type: 'hadith' | 'quran-verse' | 'fatwa' | 'book-reference';
  title: string;
  arabicTitle: string;
  source: string;
  text: string;
  arabicText?: string;
  relevance: string[];
  scholar?: string;
  explanation?: string;
  links?: string[];
}

export interface JurisprudenceGuide {
  prayer: string; // Which prayer
  madhab: MadhabSchool;
  conditions: string[];
  obligatoryActs: string[];
  sunnahActs: string[];
  makruhActs: string[];
  invalidators: string[];
  notes: FiqhNote[];
  references: IslamicReference[];
}

// ==================== UI/UX & ACCESSIBILITY ====================
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  customColors?: {
    [key: string]: string;
  };
}

export interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  reduceMotion: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  keyboardNavigation: boolean;
  focusIndicator: boolean;
  textToSpeech: boolean;
}

export interface UILayout {
  compactMode: boolean;
  hideInactiveElements: boolean;
  showExtendedInfo: boolean;
  layoutPreset: 'standard' | 'minimal' | 'detailed' | 'prayer-focused';
}