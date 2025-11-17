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