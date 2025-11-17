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