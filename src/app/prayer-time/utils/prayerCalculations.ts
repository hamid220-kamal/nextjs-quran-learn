/**
 * Prayer Times Calculation Utilities
 * Implements Qibla direction, Islamic dates, high-latitude adjustments, and offline calculations
 */

import type {
  QiblaDirection,
  HijriDate,
  HighLatitudeAdjustment,
  PrayerTimingsData,
  MapLocation,
} from '../types';

// ==================== QIBLA CALCULATION ====================
/**
 * Calculate Qibla direction (azimuth from north) given user coordinates
 * Using the haversine formula and spherical law of cosines
 */
export const calculateQiblaDirection = (
  userLat: number,
  userLon: number
): QiblaDirection => {
  // Kaaba coordinates (Mecca)
  const kabaLat = 21.4225;
  const kabaLon = 39.8262;

  // Convert to radians
  const lat1 = (userLat * Math.PI) / 180;
  const lon1 = (userLon * Math.PI) / 180;
  const lat2 = (kabaLat * Math.PI) / 180;
  const lon2 = (kabaLon * Math.PI) / 180;

  // Calculate azimuth using haversine formula
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  let azimuth = (Math.atan2(y, x) * 180) / Math.PI;
  azimuth = (azimuth + 360) % 360; // Normalize to 0-360

  // Magnetic declination varies by location and time
  // Using a simplified model - in production use NOAA's API
  const magneticDeclination = getMagneticDeclination(userLat, userLon);
  const trueNorth = (azimuth - magneticDeclination + 360) % 360;

  return {
    azimuth: Math.round(azimuth * 10) / 10,
    magneticDeclination,
    trueNorth: Math.round(trueNorth * 10) / 10,
    description: getQiblaDescription(azimuth),
    isAccurate: true,
  };
};

/**
 * Estimate magnetic declination for a location (simplified model)
 * In production, use NOAA's Magnetic Declination API
 */
const getMagneticDeclination = (lat: number, lon: number): number => {
  // Simplified WMM (World Magnetic Model) approximation
  // This is a rough estimate - for accuracy, integrate with NOAA API
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  // Very simplified model - actual WMM is complex
  const declination =
    10 * Math.sin(lonRad) * Math.cos(latRad) - 5 * Math.sin(latRad);

  return declination;
};

/**
 * Get human-readable description of Qibla direction
 */
const getQiblaDescription = (azimuth: number): string => {
  const directions = [
    'North',
    'North-Northeast',
    'Northeast',
    'East-Northeast',
    'East',
    'East-Southeast',
    'Southeast',
    'South-Southeast',
    'South',
    'South-Southwest',
    'Southwest',
    'West-Southwest',
    'West',
    'West-Northwest',
    'Northwest',
    'North-Northwest',
  ];

  const index = Math.round(azimuth / 22.5) % 16;
  return directions[index];
};

/**
 * Calculate distance to Kaaba using Haversine formula
 */
export const calculateDistanceToKaaba = (
  userLat: number,
  userLon: number
): number => {
  const kabaLat = 21.4225;
  const kabaLon = 39.8262;
  const R = 6371; // Earth radius in km

  const lat1 = (userLat * Math.PI) / 180;
  const lat2 = (kabaLat * Math.PI) / 180;
  const deltaLat = ((kabaLat - userLat) * Math.PI) / 180;
  const deltaLon = ((kabaLon - userLon) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return Math.round(R * c * 10) / 10; // km
};

/**
 * Get map location data for Qibla map display
 */
export const getMapLocation = (
  userLat: number,
  userLon: number
): MapLocation => {
  const kabaLat = 21.4225;
  const kabaLon = 39.8262;

  // Calculate bearing/azimuth
  const latRad1 = (userLat * Math.PI) / 180;
  const latRad2 = (kabaLat * Math.PI) / 180;
  const lonDelta = ((kabaLon - userLon) * Math.PI) / 180;

  const y = Math.sin(lonDelta) * Math.cos(latRad2);
  const x =
    Math.cos(latRad1) * Math.sin(latRad2) -
    Math.sin(latRad1) * Math.cos(latRad2) * Math.cos(lonDelta);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  return {
    latitude: userLat,
    longitude: userLon,
    kabaLatitude: kabaLat,
    kabaLongitude: kabaLon,
    distance: calculateDistanceToKaaba(userLat, userLon),
    bearing: (bearing + 360) % 360,
    zoom: userLat > 20 && userLat < 25 ? 10 : 4, // Zoom into Mecca if close
  };
};

// ==================== HIJRI CALENDAR CONVERSION ====================
/**
 * Convert Gregorian date to Hijri (Islamic calendar)
 * Using the astronomical algorithm
 */
export const gregorianToHijri = (
  year: number,
  month: number,
  day: number
): HijriDate => {
  // Algorithm based on the Islamic calendar conversion formula
  const N = day + Math.floor(30.6001 * (month + 1)) - Math.floor(30.6001 * 1) + 365 * year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) - 621557;

  const Q = Math.floor(N / 10631);
  const R = N % 10631;
  const A = Math.floor(R / 325) + 1;
  const W = ((((A - 1) * 325) + 355) - N) * -1;
  const Q1 = Math.floor(W / 30);
  const Q2 = W % 30;

  const hijriYear = 30 * Q + 30 * A + Q1 + 1;
  const hijriMonth = Math.floor(((Q2 + 29) * 12) / 325) + 1;
  const hijriDay = (Q2 % 30) + 1;

  const monthsAr = [
    'Muharram',
    'Safar',
    'Rabi\' al-awwal',
    'Rabi\' al-thani',
    'Jumada al-awwal',
    'Jumada al-thani',
    'Rajab',
    'Sha\'ban',
    'Ramadan',
    'Shawwal',
    'Dhu al-Qi\'dah',
    'Dhu al-Hijjah',
  ];

  return {
    date: `${hijriDay}-${hijriMonth}-${hijriYear}`,
    day: String(hijriDay),
    month: {
      number: hijriMonth,
      en: monthsAr[hijriMonth - 1],
      ar: getArabicMonthName(hijriMonth),
    },
    year: String(hijriYear),
    designation: {
      abbreviated: 'AH',
      expanded: 'Anno Hegirae',
    },
  };
};

/**
 * Get Arabic month name for Hijri calendar
 */
const getArabicMonthName = (month: number): string => {
  const arabicMonths = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الثانية',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  return arabicMonths[Math.max(0, Math.min(11, month - 1))];
};

/**
 * Convert Hijri to Gregorian date
 */
export const hijriToGregorian = (
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number
): { year: number; month: number; day: number } => {
  const N =
    hijriDay +
    Math.ceil(29.5001 * (hijriMonth - 1)) +
    (hijriYear - 1) * 354 +
    Math.floor((3 + 11 * hijriYear) / 30) +
    384373;

  const Q = Math.floor(N / 146097);
  const R = N % 146097;
  const S = Math.floor(R / 36524);
  const T = R % 36524;
  const U = Math.floor(T / 365);
  const V = T % 365;

  const year = 400 * Q + 100 * S + 4 * U + Math.floor(V / 365.2425) + 1;
  const month = Math.floor((V % 365.2425) / 30.6001) + 1;
  const day = Math.floor((V % 365.2425) % 30.6001) + 1;

  return { year, month: Math.min(12, month), day: Math.min(31, day) };
};

// ==================== HIGH-LATITUDE ADJUSTMENTS ====================
/**
 * Apply high-latitude adjustments for midnight sun/moon regions
 */
export const applyHighLatitudeAdjustment = (
  timings: PrayerTimingsData,
  latitude: number,
  method: HighLatitudeAdjustment['method']
): PrayerTimingsData => {
  // High latitudes defined as > 48.5°N or < -48.5°S
  if (Math.abs(latitude) <= 48.5) {
    return timings;
  }

  const adjustedTimings = { ...timings };

  switch (method) {
    case 'midnight':
      return applyMidnightMethod(adjustedTimings, latitude);
    case 'nearest-latitude':
      return applyNearestLatitudeMethod(adjustedTimings, latitude);
    case 'angle-based':
      return applyAngleBasedMethod(adjustedTimings, latitude);
    case 'fraction-of-night':
      return applyFractionOfNightMethod(adjustedTimings, latitude);
    default:
      return adjustedTimings;
  }
};

/**
 * Midnight Method: Fajr & Isha are approximated as midway between sunset and sunrise
 */
const applyMidnightMethod = (
  timings: PrayerTimingsData,
  _latitude: number
): PrayerTimingsData => {
  const sunrise = timeToMinutes(timings.Sunrise);
  const sunset = timeToMinutes(timings.Maghrib);

  // Fajr: midway between midnight (0) and sunrise
  const fajrMinutes = Math.round(sunrise / 2);
  timings.Fajr = minutesToTime(fajrMinutes);

  // Isha: midway between sunset and midnight (1440 minutes)
  const ishaMinutes = Math.round((sunset + 1440) / 2);
  timings.Isha = minutesToTime(ishaMinutes % 1440);

  return timings;
};

/**
 * Nearest Latitude Method: Use nearest latitude with normal times
 */
const applyNearestLatitudeMethod = (
  timings: PrayerTimingsData,
  latitude: number
): PrayerTimingsData => {
  // For latitudes > 48.5°, approximate using 48.5° latitude times
  // This is a simplified version - actual implementation would fetch 48.5° data
  const reductionFactor = Math.abs(latitude) / 48.5;

  // Adjust Fajr and Isha by reducing their angle difference
  const sunrise = timeToMinutes(timings.Sunrise);
  const sunset = timeToMinutes(timings.Maghrib);

  const adjustedFajrTime = sunrise - (sunrise - timeToMinutes(timings.Fajr)) * reductionFactor;
  const adjustedIshaTime = sunset + (timeToMinutes(timings.Isha) - sunset) * reductionFactor;

  timings.Fajr = minutesToTime(Math.round(adjustedFajrTime));
  timings.Isha = minutesToTime(Math.round(adjustedIshaTime));

  return timings;
};

/**
 * Angle-Based Method: Adjust based on sun angle from horizon
 */
const applyAngleBasedMethod = (
  timings: PrayerTimingsData,
  latitude: number
): PrayerTimingsData => {
  // Typical angle-based method: Use 15° or 16° for both Fajr and Isha
  // This is a simplified version
  const angleReduction = 0.97; // Reduce angle slightly for high latitudes

  const sunrise = timeToMinutes(timings.Sunrise);
  const sunset = timeToMinutes(timings.Maghrib);

  const fajrOffset = (sunrise - timeToMinutes(timings.Fajr)) * angleReduction;
  const ishaOffset = (timeToMinutes(timings.Isha) - sunset) * angleReduction;

  timings.Fajr = minutesToTime(Math.round(sunrise - fajrOffset));
  timings.Isha = minutesToTime(Math.round(sunset + ishaOffset));

  return timings;
};

/**
 * Fraction of Night Method: Divide the night into equal parts
 */
const applyFractionOfNightMethod = (
  timings: PrayerTimingsData,
  _latitude: number
): PrayerTimingsData => {
  const sunset = timeToMinutes(timings.Maghrib);
  const sunrise = timeToMinutes(timings.Sunrise);

  // Night = sunset to sunrise (next day)
  const nightDuration = sunrise > sunset ? sunrise - sunset : 1440 - sunset + sunrise;

  // Fajr: 1/6 of night before sunrise
  const fajrTime = sunrise - nightDuration / 6;
  timings.Fajr = minutesToTime(Math.round((fajrTime + 1440) % 1440));

  // Isha: 1/6 of night after sunset
  const ishaTime = sunset + nightDuration / 6;
  timings.Isha = minutesToTime(Math.round(ishaTime % 1440));

  return timings;
};

// ==================== TIME CONVERSION UTILITIES ====================

/**
 * Convert time string (HH:mm) to minutes since midnight
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string (HH:mm)
 */
export const minutesToTime = (minutes: number): string => {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = Math.round(normalizedMinutes % 60);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Calculate time difference between two times in minutes
 */
export const timeDifference = (time1: string, time2: string): number => {
  return timeToMinutes(time2) - timeToMinutes(time1);
};

/**
 * Add minutes to a time string
 */
export const addMinutesToTime = (timeStr: string, minutes: number): string => {
  return minutesToTime(timeToMinutes(timeStr) + minutes);
};

// ==================== PRAYER TIME CALCULATIONS (OFFLINE FALLBACK) ====================

/**
 * Calculate prayer times using Dhuhr method (simplified)
 * This is a fallback for when API is unavailable
 */
export const calculatePrayerTimesOffline = (
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string,
  method: 'hanafi' | 'shafi' = 'shafi'
): Partial<PrayerTimingsData> => {
  // Simplified calculation using solar equations
  // In production, use precise astronomical algorithms

  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const T = dayOfYear / 365.25;

  // Solar declination (simplified)
  const declination =
    23.45 *
    Math.sin(
      (2 * Math.PI * (T - 0.2)) / 1
    );

  // Time equation (simplified)
  const eTime =
    229.18 *
    (0.017456 * (dayOfYear - 1) -
      7.351e-10 * Math.pow(dayOfYear - 1, 2) +
      (0.00000390793 * Math.pow(dayOfYear - 1, 3) % 1));

  // Equation of time in minutes
  const timeEquation = eTime;

  // Latitude and declination in radians
  const latRad = (latitude * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;

  // Dhuhr time: 12:00 + correction
  const dhuhrMinutes = 12 * 60 + longitude / 15 - parseInt(timezone.split('+')[1] || '0') * 60 + timeEquation;

  // Sunrise time (simplified)
  const sunrise = calculateSunrise(latRad, declRad, dhuhrMinutes);

  // Sunset time (simplified)
  const sunset = calculateSunset(latRad, declRad, dhuhrMinutes);

  // Calculate prayer times
  const fajrAngle = method === 'hanafi' ? 12 : 15;
  const asrFactor = method === 'hanafi' ? 2 : 1;
  const ishaAngle = method === 'hanafi' ? 12 : 15;

  return {
    Fajr: minutesToTime(sunrise - (fajrAngle * 4) / 60),
    Sunrise: minutesToTime(sunrise),
    Dhuhr: minutesToTime(dhuhrMinutes),
    Asr: minutesToTime(calculateAsr(latRad, declRad, sunset, asrFactor)),
    Maghrib: minutesToTime(sunset),
    Isha: minutesToTime(sunset + (ishaAngle * 4) / 60),
  };
};

/**
 * Calculate sunrise time (simplified)
 */
const calculateSunrise = (
  latRad: number,
  declRad: number,
  dhuhrMinutes: number
): number => {
  const cosH =
    -Math.tan(latRad) * Math.tan(declRad) - 1 / Math.cos(latRad) / Math.cos(declRad);
  const H = cosH <= -1 ? Math.PI : Math.acos(cosH);
  return dhuhrMinutes - (H * 180) / Math.PI / 15;
};

/**
 * Calculate sunset time (simplified)
 */
const calculateSunset = (
  latRad: number,
  declRad: number,
  dhuhrMinutes: number
): number => {
  const cosH =
    -Math.tan(latRad) * Math.tan(declRad) - 1 / Math.cos(latRad) / Math.cos(declRad);
  const H = cosH >= 1 ? 0 : Math.acos(cosH);
  return dhuhrMinutes + (H * 180) / Math.PI / 15;
};

/**
 * Calculate Asr time (simplified)
 */
const calculateAsr = (
  latRad: number,
  declRad: number,
  sunset: number,
  shadowFactor: number
): number => {
  // Simplified Asr calculation
  // In reality, need precise solar altitude calculation
  const h = Math.atan(1 / (shadowFactor + Math.tan(latRad - declRad)));
  return sunset - (h * 180) / Math.PI / 15;
};

// ==================== CALCULATION METHOD PRESETS ====================

export const CALCULATION_METHODS = {
  1: {
    id: 1,
    name: 'Ummah Al-Qura University, Mecca',
    region: 'Saudi Arabia',
    fajrAngle: 18.5,
    ishaAngle: 90,
    description: 'Official method used in Saudi Arabia',
  },
  2: {
    id: 2,
    name: 'Islamic Society of North America (ISNA)',
    region: 'North America',
    fajrAngle: 15,
    ishaAngle: 15,
    description: 'Commonly used in North America',
  },
  3: {
    id: 3,
    name: 'Muslim World League (MWL)',
    region: 'Europe, Far East',
    fajrAngle: 18,
    ishaAngle: 17,
    description: 'Used by Muslim World League',
  },
  4: {
    id: 4,
    name: 'Umm Al-Qura',
    region: 'Saudi Arabia (Default)',
    fajrAngle: 18.5,
    ishaAngle: 90,
    description: 'Standard method for Mecca',
  },
  5: {
    id: 5,
    name: 'Egyptian General Authority of Survey',
    region: 'Africa, Middle East',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    description: 'Used in Egypt and Africa',
  },
} as const;

export const MADHAB_SCHOOLS = {
  0: {
    school: 0,
    name: 'Shafi\'i',
    arabicName: 'الشافعي',
    description: 'Asr begins when shadow is 1x the object height',
    asrMethod: 'shadow1x',
  },
  1: {
    school: 1,
    name: 'Hanafi',
    arabicName: 'الحنفي',
    description: 'Asr begins when shadow is 2x the object height',
    asrMethod: 'shadow2x',
  },
  2: {
    school: 2,
    name: 'Maliki',
    arabicName: 'المالكي',
    description: 'Follows strict traditional interpretation',
    asrMethod: 'shadow1x',
  },
  3: {
    school: 3,
    name: 'Hanbali',
    arabicName: 'الحنبلي',
    description: 'Strict traditional interpretation',
    asrMethod: 'shadow1x',
  },
} as const;
