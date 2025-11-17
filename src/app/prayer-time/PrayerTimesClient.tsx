'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerTimesResponse, Prayer, Coordinates, Reminder, AudioSettings, CustomAlarm, SavedLocation, LocationQuery, SearchHistory, LocationStatistics } from './types';
import styles from './PrayerTime.module.css';

interface PrayerTimesClientProps {
  initialPrayerTimes: PrayerTimesResponse | null;
  initialError: string | null;
  initialCoords: Coordinates;
  initialLocation?: string;
}

export default function PrayerTimesClient({
  initialPrayerTimes,
  initialError,
  initialCoords,
  initialLocation = 'Mecca, Saudi Arabia',
}: PrayerTimesClientProps) {
  const [prayerTimes, setPrayerTimes] = useState(initialPrayerTimes);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ prayer: Prayer; time: Date } | null>(null);
  const [location, setLocation] = useState(initialLocation);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: false,
    volume: 0.7,
    playAzanAtPrayerTime: true,
  });
  const [triggeredReminders, setTriggeredReminders] = useState<Set<string>>(new Set());
  const [expandedReminders, setExpandedReminders] = useState(false);
  const [islamicLoriEnabled, setIslamicLoriEnabled] = useState(false);
  const [showSpecialFeatures, setShowSpecialFeatures] = useState(false);
  const [specialOccasionSettings, setSpecialOccasionSettings] = useState({
    eidEnabled: false,
    eidUlAdhaEnabled: false,
    hajjEnabled: false,
    zilHajjEnabled: false,
  });
  const [customAlarms, setCustomAlarms] = useState<CustomAlarm[]>([]);
  const [showCustomAlarmPanel, setShowCustomAlarmPanel] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmName, setNewAlarmName] = useState('');
  const [newAlarmType, setNewAlarmType] = useState<'sunnah' | 'nafl' | 'tahajjud' | 'custom'>('sunnah');
  const [newAlarmBasePrayer, setNewAlarmBasePrayer] = useState('Fajr');
  const [triggeredAlarms, setTriggeredAlarms] = useState<Set<string>>(new Set());
  
  // Custom location feature states
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [locationSearchError, setLocationSearchError] = useState<string | null>(null);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [saveLocationName, setSaveLocationName] = useState('');
  const [showSaveLocationForm, setShowSaveLocationForm] = useState(false);
  const [lastSearchedLocation, setLastSearchedLocation] = useState<LocationQuery | null>(null);
  
  // Enhanced digital features
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStatistics>({
    totalSearches: 0,
    favoriteCount: 0,
    savedLocationCount: 0,
  });
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showLocationStats, setShowLocationStats] = useState(false);
  const [sortLocationBy, setSortLocationBy] = useState<'favorite' | 'recent' | 'name' | 'timezone'>('favorite');
  const [filterByTimezone, setFilterByTimezone] = useState<string>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareLocation1, setCompareLocation1] = useState<SavedLocation | null>(null);
  const [compareLocation2, setCompareLocation2] = useState<SavedLocation | null>(null);
  const [comparePrayerTimes1, setComparePrayerTimes1] = useState<PrayerTimesResponse | null>(null);
  const [comparePrayerTimes2, setComparePrayerTimes2] = useState<PrayerTimesResponse | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const prayers: Prayer[] = [
    { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', index: 1 },
    { key: 'Sunrise', name: 'Sunrise', arabic: 'الشروق', index: 2 },
    { key: 'Dhuhr', name: 'Dhuhr', arabic: 'الظهر', index: 3 },
    { key: 'Asr', name: 'Asr', arabic: 'العصر', index: 4 },
    { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', index: 5 },
    { key: 'Isha', name: 'Isha', arabic: 'العشاء', index: 6 },
  ];

  // Popular cities for autocomplete - major Muslim and international cities
  const popularCities: { [key: string]: string } = {
    'Mecca': 'Saudi Arabia',
    'Medina': 'Saudi Arabia',
    'New York': 'USA',
    'London': 'United Kingdom',
    'Paris': 'France',
    'Dubai': 'United Arab Emirates',
    'Cairo': 'Egypt',
    'Istanbul': 'Turkey',
    'Jakarta': 'Indonesia',
    'Karachi': 'Pakistan',
    'Dhaka': 'Bangladesh',
    'Toronto': 'Canada',
    'Sydney': 'Australia',
    'Singapore': 'Singapore',
    'Tokyo': 'Japan',
    'Berlin': 'Germany',
    'Madrid': 'Spain',
    'Rome': 'Italy',
    'Moscow': 'Russia',
    'Bangkok': 'Thailand',
    'Mumbai': 'India',
    'Delhi': 'India',
    'Los Angeles': 'USA',
    'Chicago': 'USA',
    'Mexico City': 'Mexico',
    'São Paulo': 'Brazil',
    'Buenos Aires': 'Argentina',
    'Cape Town': 'South Africa',
    'Lagos': 'Nigeria',
    'Riyadh': 'Saudi Arabia',
    'Jeddah': 'Saudi Arabia',
    'Abu Dhabi': 'United Arab Emirates',
    'Doha': 'Qatar',
    'Kuwait City': 'Kuwait',
    'Baghdad': 'Iraq',
    'Damascus': 'Syria',
    'Beirut': 'Lebanon',
    'Amman': 'Jordan',
    'Jerusalem': 'Palestine',
    'Tehran': 'Iran',
    'Casablanca': 'Morocco',
    'Algiers': 'Algeria',
  };

  // Initialize reminders and audio settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Request notification permission on load
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch((err) => console.log('Notification permission request:', err));
      }
      
      const savedReminders = localStorage.getItem('prayerReminders');
      const savedAudioSettings = localStorage.getItem('audioSettings');
      const savedSpecialOccasionSettings = localStorage.getItem('specialOccasionSettings');
      const savedIslamicLoriEnabled = localStorage.getItem('islamicLoriEnabled');
      
      if (savedReminders) {
        try {
          setReminders(JSON.parse(savedReminders));
        } catch (e) {
          console.error('Failed to load reminders:', e);
          initializeDefaultReminders();
        }
      } else {
        initializeDefaultReminders();
      }
      
      if (savedAudioSettings) {
        try {
          setAudioSettings(JSON.parse(savedAudioSettings));
        } catch (e) {
          console.error('Failed to load audio settings:', e);
        }
      }

      if (savedSpecialOccasionSettings) {
        try {
          setSpecialOccasionSettings(JSON.parse(savedSpecialOccasionSettings));
        } catch (e) {
          console.error('Failed to load special occasion settings:', e);
        }
      }

      if (savedIslamicLoriEnabled) {
        try {
          setIslamicLoriEnabled(JSON.parse(savedIslamicLoriEnabled));
        } catch (e) {
          console.error('Failed to load Islamic Lori setting:', e);
        }
      }

      // Load custom alarms
      const savedAlarms = localStorage.getItem('customAlarms');
      if (savedAlarms) {
        try {
          setCustomAlarms(JSON.parse(savedAlarms));
        } catch (e) {
          console.error('Failed to load custom alarms:', e);
        }
      }

      // Load saved locations
      const savedLocationsData = localStorage.getItem('savedLocations');
      if (savedLocationsData) {
        try {
          setSavedLocations(JSON.parse(savedLocationsData));
        } catch (e) {
          console.error('Failed to load saved locations:', e);
        }
      }

      // Load search history
      const savedHistory = localStorage.getItem('locationSearchHistory');
      if (savedHistory) {
        try {
          setSearchHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Failed to load search history:', e);
        }
      }

      // Load location statistics
      const savedStats = localStorage.getItem('locationStatistics');
      if (savedStats) {
        try {
          setLocationStats(JSON.parse(savedStats));
        } catch (e) {
          console.error('Failed to load location statistics:', e);
        }
      }
    }
  }, []);

  const initializeDefaultReminders = () => {
    const defaultReminders: Reminder[] = [
      { id: 'fajr', prayerKey: 'Fajr', minutesBefore: 10, enabled: true },
      { id: 'dhuhr', prayerKey: 'Dhuhr', minutesBefore: 5, enabled: true },
      { id: 'asr', prayerKey: 'Asr', minutesBefore: 5, enabled: true },
      { id: 'maghrib', prayerKey: 'Maghrib', minutesBefore: 2, enabled: true },
      { id: 'isha', prayerKey: 'Isha', minutesBefore: 5, enabled: true },
    ];
    setReminders(defaultReminders);
    localStorage.setItem('prayerReminders', JSON.stringify(defaultReminders));
  };

  // Save reminders to localStorage
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem('prayerReminders', JSON.stringify(reminders));
    }
  }, [reminders]);

  // Save audio settings to localStorage
  useEffect(() => {
    localStorage.setItem('audioSettings', JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Save special occasion settings to localStorage
  useEffect(() => {
    localStorage.setItem('specialOccasionSettings', JSON.stringify(specialOccasionSettings));
  }, [specialOccasionSettings]);

  // Save Islamic Lori setting to localStorage
  useEffect(() => {
    localStorage.setItem('islamicLoriEnabled', JSON.stringify(islamicLoriEnabled));
  }, [islamicLoriEnabled]);

  // Save custom alarms to localStorage
  useEffect(() => {
    if (customAlarms.length > 0) {
      localStorage.setItem('customAlarms', JSON.stringify(customAlarms));
    }
  }, [customAlarms]);

  // Save saved locations to localStorage
  useEffect(() => {
    if (savedLocations.length > 0) {
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    }
  }, [savedLocations]);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('locationSearchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  // Save location statistics to localStorage
  useEffect(() => {
    localStorage.setItem('locationStatistics', JSON.stringify(locationStats));
  }, [locationStats]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clear triggered reminders at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      setTriggeredReminders(new Set());
      // Re-run the check after midnight
      setCurrentTime(new Date());
    }, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, []);

  // Calculate next prayer
  useEffect(() => {
    if (!prayerTimes?.data?.timings) return;

    const now = currentTime;
    const today = new Date().toISOString().split('T')[0];
    let nextPrayerFound: { prayer: Prayer; time: Date } | null = null;

    for (const prayer of prayers) {
      if (prayer.key === 'Sunrise') continue;
      
      const timing = prayerTimes.data.timings[prayer.key];
      if (!timing) continue;
      
      const [hours, minutes] = timing.split(':');
      const prayerTime = new Date(`${today}T${hours}:${minutes}:00`);
      
      if (prayerTime > now) {
        nextPrayerFound = { prayer, time: prayerTime };
        break;
      }
    }

    if (!nextPrayerFound && prayerTimes.data.timings.Fajr) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      const [hours, minutes] = prayerTimes.data.timings.Fajr.split(':');
      const fajrTime = new Date(`${tomorrowDate}T${hours}:${minutes}:00`);
      nextPrayerFound = { prayer: prayers[0], time: fajrTime };
    }

    setNextPrayer(nextPrayerFound);
  }, [prayerTimes, currentTime, prayers]);

  // Check and trigger reminders
  useEffect(() => {
    if (!prayerTimes?.data?.timings) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Iterate through all prayers for today
    prayers.forEach((prayer) => {
      if (prayer.key === 'Sunrise') return;
      
      const timing = prayerTimes.data.timings[prayer.key];
      if (!timing) return;
      
      const [hours, minutes] = timing.split(':');
      const prayerDate = new Date(`${today}T${hours}:${minutes}:00`);
      const prayerTime = prayerDate.getTime();
      
      // Check each reminder for this prayer
      reminders.forEach((reminder) => {
        if (!reminder.enabled || reminder.prayerKey !== prayer.key) return;

        const reminderTime = prayerTime - (reminder.minutesBefore * 60 * 1000);
        const reminderId = `${reminder.id}-${new Date().toISOString().split('T')[0]}`;
        const timeToReminder = reminderTime - now.getTime();

        // Log reminder status for debugging
        if (timeToReminder > -120000 && timeToReminder < 10000) {
          console.log(`🔔 ${prayer.name} reminder: ${Math.round(timeToReminder / 1000)}s away (triggered: ${triggeredReminders.has(reminderId)})`);
        }

        // Trigger reminder notification (within 2 second window)
        if (now.getTime() >= reminderTime && now.getTime() < reminderTime + 2000 && !triggeredReminders.has(reminderId)) {
          setTriggeredReminders((prev) => new Set(prev).add(reminderId));
          console.log(`✅ Triggering reminder for ${prayer.name}`);

          // Play Azan audio when reminder is triggered (if audio enabled)
          if (audioSettings.enabled) {
            console.log(`🎵 Playing Azan audio for ${prayer.name} reminder`);
            playAzan(prayer);
          }

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            const timeLeft = reminder.minutesBefore > 0 ? `in ${reminder.minutesBefore} minute(s)` : 'now';
            new Notification(`🕌 ${prayer.name} Prayer Reminder`, {
              body: `Time to prepare for ${prayer.name} prayer - ${timeLeft}`,
              tag: `prayer-reminder-${reminderId}`,
              requireInteraction: true,
              icon: '🕌',
              badge: '/favicon.ico',
            });
          }
        }
      });
    });

    // Play Azan at prayer time
    if (audioSettings.playAzanAtPrayerTime && audioSettings.enabled) {
      prayers.forEach((prayer) => {
        if (prayer.key === 'Sunrise') return;
        
        const timing = prayerTimes.data.timings[prayer.key];
        if (!timing) return;
        
        const [hours, minutes] = timing.split(':');
        const prayerDate = new Date(`${today}T${hours}:${minutes}:00`);
        const prayerTime = prayerDate.getTime();
        const prayerTimeId = `azan-${prayer.key}-${today}`;
        
        if (now.getTime() >= prayerTime && now.getTime() < prayerTime + 2000 && !triggeredReminders.has(prayerTimeId)) {
          setTriggeredReminders((prev) => new Set(prev).add(prayerTimeId));
          console.log(`🎵 Playing Azan for ${prayer.name}`);
          playAzan(prayer);
        }
      });
    }

    // Check custom alarms
    customAlarms.forEach((alarm) => {
      if (!alarm.enabled) return;

      const [alarmHours, alarmMinutes] = alarm.time.split(':');
      const alarmDate = new Date(`${today}T${alarmHours}:${alarmMinutes}:00`);
      const alarmTime = alarmDate.getTime();
      const alarmId = `custom-alarm-${alarm.id}-${today}`;
      const timeToAlarm = alarmTime - now.getTime();

      // Log alarm status
      if (timeToAlarm > -120000 && timeToAlarm < 10000) {
        console.log(`⏰ ${alarm.name}: ${Math.round(timeToAlarm / 1000)}s away (triggered: ${triggeredAlarms.has(alarmId)})`);
      }

      // Trigger custom alarm
      if (now.getTime() >= alarmTime && now.getTime() < alarmTime + 2000 && !triggeredAlarms.has(alarmId)) {
        setTriggeredAlarms((prev) => new Set(prev).add(alarmId));
        console.log(`⏰ Triggering custom alarm: ${alarm.name}`);

        // Play audio for custom alarm
        if (audioSettings.enabled) {
          const volume = alarm.volume ? alarm.volume / 100 : audioSettings.volume;
          playCustomAlarmAudio(alarm.audioFile, volume);
        }

        // Show browser notification
        if (alarm.notificationEnabled !== false && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          const alarmTypeLabel = {
            sunnah: '2 Rakah Sunnah',
            nafl: 'Nafl Prayer',
            tahajjud: 'Tahajjud Prayer',
            custom: 'Custom Prayer'
          }[alarm.alarmType];

          new Notification(`⏰ ${alarm.name}`, {
            body: `Time for ${alarmTypeLabel} - ${alarm.basePrayer}`,
            tag: `custom-alarm-${alarmId}`,
            requireInteraction: true,
            icon: '⏰',
            badge: '/favicon.ico',
          });
        }

        // Update last triggered time
        setCustomAlarms((prev) =>
          prev.map((a) => (a.id === alarm.id ? { ...a, lastTriggered: now.getTime() } : a))
        );
      }
    });
  }, [currentTime, reminders, audioSettings, triggeredReminders, prayerTimes, prayers, customAlarms, triggeredAlarms]);

  const getCountdownText = (nextPrayerTime: Date): string => {
    const now = currentTime;
    const diff = nextPrayerTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `in ${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `in ${minutes}m ${seconds}s`;
    } else {
      return `in ${seconds}s`;
    }
  };

  const playAzan = useCallback((prayer: Prayer) => {
    try {
      if (!audioRef.current) {
        console.error('❌ Audio ref not available');
        return;
      }

      const azanUrl = getAzanUrl(prayer);
      console.log(`🎵 Playing Azan for ${prayer.name}`);
      console.log(`📍 URL: ${azanUrl}`);

      // Stop any current playback
      audioRef.current.pause();
      
      // Set volume
      audioRef.current.volume = Math.max(0, Math.min(1, audioSettings.volume));
      console.log(`🔊 Volume set to: ${Math.round(audioRef.current.volume * 100)}%`);

      // Set source and play - simple and direct
      audioRef.current.src = azanUrl;
      
      // Add error handler
      const onError = () => {
        const error = audioRef.current?.error;
        console.error('❌ Error loading audio:', error?.message || 'Unknown error');
      };

      const onPlay = () => {
        console.log('▶️ Audio started playing');
      };

      const onEnded = () => {
        console.log('⏹️ Audio finished');
      };

      // Remove old listeners
      audioRef.current.removeEventListener('error', onError);
      audioRef.current.removeEventListener('play', onPlay);
      audioRef.current.removeEventListener('ended', onEnded);

      // Add listeners
      audioRef.current.addEventListener('error', onError);
      audioRef.current.addEventListener('play', onPlay);
      audioRef.current.addEventListener('ended', onEnded);

      // Play the audio
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Audio playing successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to play:', error.message);
          });
      }
    } catch (error: any) {
      console.error('❌ Exception in playAzan:', error.message);
    }
  }, [audioSettings.volume]);

  const getAzanUrl = (prayer: Prayer): string => {
    // Real Azan audio files from local public folder
    // Fajr has separate verse, others share same Azan
    const azanUrls: { [key: string]: string } = {
      Fajr: '/prayer time audio/fajr azan.mp3',      // Separate Fajr Azan
      Dhuhr: '/prayer time audio/all prayer time azan.mp3',  // Shared Azan
      Asr: '/prayer time audio/all prayer time azan.mp3',    // Shared Azan
      Maghrib: '/prayer time audio/all prayer time azan.mp3', // Shared Azan
      Isha: '/prayer time audio/all prayer time azan.mp3',   // Shared Azan
    };
    
    return azanUrls[prayer.key] || azanUrls.Fajr;
  };

  const playCustomAlarmAudio = useCallback((audioFile: 'fajr' | 'general' | 'custom', volume?: number) => {
    try {
      if (!audioRef.current) {
        console.error('❌ Audio ref not available');
        return;
      }

      let audioUrl = '/prayer time audio/all prayer time azan.mp3';
      
      if (audioFile === 'fajr') {
        audioUrl = '/prayer time audio/fajr azan.mp3';
      }

      console.log(`⏰ Playing alarm audio: ${audioUrl}`);

      // Stop any current playback
      audioRef.current.pause();
      
      // Set volume
      const finalVolume = volume !== undefined ? volume : audioSettings.volume;
      audioRef.current.volume = Math.max(0, Math.min(1, finalVolume));
      console.log(`🔊 Alarm volume set to: ${Math.round(audioRef.current.volume * 100)}%`);

      // Set source
      audioRef.current.src = audioUrl;
      
      // Add error handler
      const onError = () => {
        const error = audioRef.current?.error;
        console.error('❌ Error loading alarm audio:', error?.message || 'Unknown error');
      };

      const onPlay = () => {
        console.log('▶️ Alarm audio started playing');
      };

      const onEnded = () => {
        console.log('⏹️ Alarm audio finished');
      };

      // Remove old listeners
      audioRef.current.removeEventListener('error', onError);
      audioRef.current.removeEventListener('play', onPlay);
      audioRef.current.removeEventListener('ended', onEnded);

      // Add listeners
      audioRef.current.addEventListener('error', onError);
      audioRef.current.addEventListener('play', onPlay);
      audioRef.current.addEventListener('ended', onEnded);

      // Play the audio
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Alarm audio playing successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to play alarm audio:', error.message);
          });
      }
    } catch (error: any) {
      console.error('❌ Exception in playCustomAlarmAudio:', error.message);
    }
  }, [audioSettings.volume]);

  const getTakbeerUrl = (type: 'eid' | 'eid-ul-adha' | 'hajj' | 'zil-hajj'): string => {
    // Takbeer audio files for different occasions
    const takbeerUrls: { [key: string]: string } = {
      'eid': '/prayer time audio/eid takbeer.mp3',
      'eid-ul-adha': '/prayer time audio/eid ul-adha takbeer.mp3',
      'hajj': '/prayer time audio/hajj takbeer.mp3',
      'zil-hajj': '/prayer time audio/Zil hajj takbeer.mp3',
    };
    
    return takbeerUrls[type] || takbeerUrls['eid'];
  };

  const getIslamicLoriUrl = (): string => {
    // Islamic Lori audio
    return '/prayer time audio/islamic lori.mp3';
  };

  // Islamic calendar date detection functions
  const getIslamicDate = (): { month: number; day: number } | null => {
    // Simple Gregorian to Hijri conversion
    // This is a basic approximation - for production, use a proper library
    const today = new Date();
    const jd = Math.floor(today.getTime() / 86400000) + 2440587.5;
    const L = jd - 1948439.5;
    const N = Math.floor(L / 10631.0);
    const J = L % 10631.0;
    const J2 = Math.floor(J / 5106.0);
    
    let hijriMonth = Math.floor((J % 5106.0) / 325.96) + 1;
    let hijriDay = Math.floor(((J % 5106.0) % 325.96) / 10.58) + 1;
    
    if (hijriMonth > 12) hijriMonth = 12;
    if (hijriDay > 30) hijriDay = 30;
    
    return { month: hijriMonth, day: hijriDay };
  };

  const isEidDate = (): boolean => {
    // Eid ul-Fitr: 1st Shawwal (month 10, day 1)
    const islamicDate = getIslamicDate();
    if (!islamicDate) return false;
    return islamicDate.month === 10 && islamicDate.day === 1;
  };

  const isEidUlAdhaDate = (): boolean => {
    // Eid ul-Adha: 10th Dhu al-Hijjah (month 12, day 10)
    const islamicDate = getIslamicDate();
    if (!islamicDate) return false;
    return islamicDate.month === 12 && islamicDate.day === 10;
  };

  const isHajjSeason = (): boolean => {
    // Hajj season: Dhu al-Hijjah (month 12)
    const islamicDate = getIslamicDate();
    if (!islamicDate) return false;
    return islamicDate.month === 12;
  };

  const isZilHajjMonth = (): boolean => {
    // Zil Hajj: Dhu al-Hijjah (month 12)
    const islamicDate = getIslamicDate();
    if (!islamicDate) return false;
    return islamicDate.month === 12;
  };

  const playIslamicLori = useCallback(() => {
    try {
      if (!audioRef.current) {
        console.error('❌ Audio ref not available');
        return;
      }

      const url = getIslamicLoriUrl();
      console.log(`🎼 Playing Islamic Lori: ${url}`);

      // Stop any current playback
      audioRef.current.pause();
      
      // Set volume
      audioRef.current.volume = Math.max(0, Math.min(1, audioSettings.volume));

      // Set source and play
      audioRef.current.src = url;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Islamic Lori playing successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to play Islamic Lori:', error.message);
          });
      }
    } catch (error: any) {
      console.error('❌ Exception in playIslamicLori:', error.message);
    }
  }, [audioSettings.volume]);

  const playTakbeer = useCallback((type: 'eid' | 'eid-ul-adha' | 'hajj' | 'zil-hajj') => {
    try {
      if (!audioRef.current) {
        console.error('❌ Audio ref not available');
        return;
      }

      const url = getTakbeerUrl(type);
      console.log(`📢 Playing Takbeer (${type}): ${url}`);

      // Stop any current playback
      audioRef.current.pause();
      
      // Set volume
      audioRef.current.volume = Math.max(0, Math.min(1, audioSettings.volume));

      // Set source and play
      audioRef.current.src = url;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`✅ Takbeer (${type}) playing successfully`);
          })
          .catch((error) => {
            console.error(`❌ Failed to play Takbeer (${type}):`, error.message);
          });
      }
    } catch (error: any) {
      console.error('❌ Exception in playTakbeer:', error.message);
    }
  }, [audioSettings.volume]);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        return true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    }
    return false;
  }, []);

  const toggleReminder = useCallback((reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const updateReminderMinutes = useCallback((reminderId: string, minutes: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, minutesBefore: Math.max(1, Math.min(60, minutes)) } : r))
    );
  }, []);

  const toggleAudio = useCallback(async () => {
    // Always request permission when toggling audio ON
    if (!audioSettings.enabled) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.warn('⚠️ Notification permission denied. Reminders may not work.');
        return;
      }
      console.log('✅ Notification permission granted');
    }
    setAudioSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, [audioSettings.enabled, requestNotificationPermission]);

  // Custom Alarm Functions
  const createCustomAlarm = useCallback(() => {
    if (!newAlarmTime || !newAlarmName) {
      alert('⏰ Please fill in alarm name and time');
      return;
    }

    const newAlarm: CustomAlarm = {
      id: Date.now().toString(),
      name: newAlarmName,
      alarmType: newAlarmType,
      basePrayer: newAlarmBasePrayer,
      time: newAlarmTime,
      enabled: true,
      audioFile: newAlarmType === 'sunnah' && newAlarmBasePrayer === 'Fajr' ? 'fajr' : 'general',
      volume: audioSettings.volume * 100,
      notificationEnabled: true,
      createdAt: Date.now(),
    };

    setCustomAlarms((prev) => [...prev, newAlarm]);
    console.log(`✅ Custom alarm created: ${newAlarmName}`);
    
    // Reset form
    setNewAlarmTime('');
    setNewAlarmName('');
    setNewAlarmType('sunnah');
    setNewAlarmBasePrayer('Fajr');
  }, [newAlarmTime, newAlarmName, newAlarmType, newAlarmBasePrayer, audioSettings.volume]);

  const deleteCustomAlarm = useCallback((alarmId: string) => {
    setCustomAlarms((prev) => prev.filter((a) => a.id !== alarmId));
    console.log(`🗑️ Custom alarm deleted: ${alarmId}`);
  }, []);

  const toggleCustomAlarm = useCallback((alarmId: string) => {
    setCustomAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  const updateCustomAlarmTime = useCallback((alarmId: string, time: string) => {
    setCustomAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, time } : a))
    );
  }, []);

  const updateCustomAlarmVolume = useCallback((alarmId: string, volume: number) => {
    setCustomAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, volume } : a))
    );
  }, []);

  const testCustomAlarm = useCallback((alarm: CustomAlarm) => {
    console.log(`⏰ Testing custom alarm: ${alarm.name}`);
    if (audioSettings.enabled) {
      const volume = alarm.volume ? alarm.volume / 100 : audioSettings.volume;
      playCustomAlarmAudio(alarm.audioFile, volume);
    }
  }, [audioSettings.enabled, playCustomAlarmAudio, audioSettings.volume]);

  const testAudio = useCallback(() => {
    console.log('🧪 ========== TESTING AUDIO ==========');
    console.log('📢 Current volume:', Math.round(audioSettings.volume * 100) + '%');
    const fajrPrayer: Prayer = { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', index: 1 };
    playAzan(fajrPrayer);
    console.log('🧪 ========== TEST INITIATED ==========');
  }, [playAzan, audioSettings.volume]);

  const fetchPrayerTimesByLocation = useCallback(async (city: string, country: string) => {
    if (!city.trim() || !country.trim()) {
      setLocationSearchError('❌ Please enter both city and country');
      return;
    }

    setLocationSearchLoading(true);
    setLocationSearchError(null);

    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateString = `${day}-${month}-${year}`;

      // Use the EXACT same API endpoint and parameters as the page.tsx for consistency
      const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${encodeURIComponent(city.trim())}&country=${encodeURIComponent(country.trim())}&method=4&school=0`;
      
      console.log(`🌍 Fetching REAL prayer times for ${city}, ${country}`);
      console.log(`🔗 API URL: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Learn-Quran-App/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: PrayerTimesResponse = await response.json();

      if (data.code !== 200) {
        console.error('❌ API Response Error:', data);
        throw new Error(data.status || 'Failed to fetch prayer times for this location');
      }

      if (!data.data || !data.data.timings) {
        console.error('❌ Invalid prayer times data:', data);
        throw new Error('Invalid prayer times data received from API');
      }

      // Successfully fetched - update prayer times
      console.log('✅ Valid prayer times data received:', data.data.timings);
      setPrayerTimes(data);
      setLastSearchedLocation({ city: city.trim(), country: country.trim() });

      // Update location display with full details
      if (data.data.meta) {
        const { latitude, longitude, timezone, method } = data.data.meta;
        setLocation(`${city}, ${country} (${latitude.toFixed(4)}, ${longitude.toFixed(4)}, ${timezone})`);
        console.log(`📍 Location: ${city}, ${country}`);
        console.log(`🕋 Method: ${method.name}`);
        console.log(`🌍 Timezone: ${timezone}`);
        console.log(`📊 Prayer Timings:`, data.data.timings);
      } else {
        setLocation(`${city}, ${country}`);
      }

      // Update URL with new location
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('city', city.trim());
      newUrl.searchParams.set('country', country.trim());
      newUrl.searchParams.delete('lat');
      newUrl.searchParams.delete('lon');
      window.history.replaceState({}, '', newUrl.toString());

      // Track search history
      setSearchHistory((prev) => {
        const searchKey = `${city.trim()},${country.trim()}`;
        const existingSearch = prev.find((h) => h.city === city.trim() && h.country === country.trim());
        
        if (existingSearch) {
          // Update existing search
          return prev.map((h) =>
            h.city === city.trim() && h.country === country.trim()
              ? {
                  ...h,
                  searchCount: h.searchCount + 1,
                  lastSearched: Date.now(),
                }
              : h
          );
        } else {
          // Add new search
          return [
            {
              id: `history-${Date.now()}`,
              city: city.trim(),
              country: country.trim(),
              searchedAt: Date.now(),
              searchCount: 1,
              lastSearched: Date.now(),
            },
            ...prev,
          ].slice(0, 20); // Keep only last 20 searches
        }
      });

      // Update statistics
      setLocationStats((prev) => ({
        ...prev,
        totalSearches: prev.totalSearches + 1,
        savedLocationCount: savedLocations.length,
        favoriteCount: savedLocations.filter((loc) => loc.isFavorite).length,
      }));

      console.log(`✅ Prayer times successfully loaded for ${city}, ${country}`);
      setError(null);
    } catch (err: any) {
      console.error('❌ Location search error:', err);
      const errorMsg = err.message || 'Unknown error';
      setLocationSearchError(`❌ Failed to fetch prayer times: ${errorMsg}`);
      setError(`Unable to fetch prayer times: ${errorMsg}`);
    } finally {
      setLocationSearchLoading(false);
    }
  }, [savedLocations]);

  const saveCurrentLocation = useCallback(() => {
    if (!saveLocationName.trim()) {
      setLocationSearchError('❌ Please enter a name for this location');
      return;
    }

    if (!lastSearchedLocation) {
      setLocationSearchError('❌ No location to save. Please search for a location first.');
      return;
    }

    const newLocation: SavedLocation = {
      id: `location-${Date.now()}`,
      name: saveLocationName.trim(),
      city: lastSearchedLocation.city,
      country: lastSearchedLocation.country,
      latitude: prayerTimes?.data?.meta?.latitude,
      longitude: prayerTimes?.data?.meta?.longitude,
      timezone: prayerTimes?.data?.meta?.timezone,
      createdAt: Date.now(),
      isFavorite: false,
    };

    setSavedLocations((prev) => [...prev, newLocation]);
    console.log(`💾 Location saved: ${saveLocationName}`);
    setSaveLocationName('');
    setShowSaveLocationForm(false);
    setLocationSearchError(null);
  }, [saveLocationName, lastSearchedLocation, prayerTimes]);

  const deleteSavedLocation = useCallback((locationId: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== locationId));
    console.log(`🗑️ Saved location deleted: ${locationId}`);
  }, []);

  const toggleFavoriteLocation = useCallback((locationId: string) => {
    setSavedLocations((prev) =>
      prev.map((loc) => (loc.id === locationId ? { ...loc, isFavorite: !loc.isFavorite } : loc))
    );
  }, []);

  const loadSavedLocation = useCallback((savedLocation: SavedLocation) => {
    console.log(`📍 Loading saved location: ${savedLocation.name}`);
    setSearchCity(savedLocation.city);
    setSearchCountry(savedLocation.country);
    fetchPrayerTimesByLocation(savedLocation.city, savedLocation.country);
  }, [fetchPrayerTimesByLocation]);

  // Handle city input with autocomplete suggestions
  const handleCityInput = useCallback((value: string) => {
    setSearchCity(value);
    if (value.trim().length > 0) {
      const suggestions = Object.keys(popularCities).filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(suggestions);
      setShowCitySuggestions(suggestions.length > 0);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  }, []);

  // Handle selecting suggestion
  const selectCitySuggestion = useCallback((city: string) => {
    setSearchCity(city);
    setSearchCountry(popularCities[city]);
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  }, []);

  // Get sorted locations based on current sort
  const getSortedLocations = useCallback(() => {
    let sorted = [...savedLocations];
    switch (sortLocationBy) {
      case 'favorite':
        sorted.sort((a, b) => {
          if (a.isFavorite === b.isFavorite) {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          }
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        });
        break;
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'timezone':
        sorted.sort((a, b) => (a.timezone || '').localeCompare(b.timezone || ''));
        break;
    }

    // Apply timezone filter
    if (filterByTimezone !== 'all') {
      sorted = sorted.filter((loc) => loc.timezone === filterByTimezone);
    }

    return sorted;
  }, [savedLocations, sortLocationBy, filterByTimezone]);

  // Get unique timezones for filter dropdown
  const getUniqueTimezones = useCallback(() => {
    const timezones = new Set(savedLocations.map((loc) => loc.timezone).filter(Boolean));
    return Array.from(timezones).sort();
  }, [savedLocations]);

  // Export locations as JSON
  const exportLocations = useCallback(() => {
    const dataToExport = {
      locations: savedLocations,
      searchHistory: searchHistory,
      statistics: locationStats,
      exportedAt: new Date().toISOString(),
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prayer-locations-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('📥 Locations exported successfully');
  }, [savedLocations, searchHistory, locationStats]);

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('📍 Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = position.coords;
      
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('lat', latitude.toFixed(6));
      newUrl.searchParams.set('lon', longitude.toFixed(6));
      newUrl.searchParams.delete('city');
      newUrl.searchParams.delete('country');
      window.history.replaceState({}, '', newUrl.toString());

      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateString = `${day}-${month}-${year}`;
      
      const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${dateString}?latitude=${latitude.toFixed(6)}&longitude=${longitude.toFixed(6)}&method=4`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: PrayerTimesResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch prayer times');
      }
      
      setPrayerTimes(data);
      
      if (data.data.meta) {
        const { timezone } = data.data.meta;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)} (${timezone})`);
      }
    } catch (err: any) {
      console.error('Geolocation error:', err);
      if (err.code === 1) {
        setError('📍 Location access denied. Please enable location permissions.');
      } else if (err.code === 3) {
        setError('📍 Location request timed out. Please try again.');
      } else if (err.code === 2) {
        setError('📍 Location information unavailable.');
      } else {
        setError(`Unable to get location: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <>
        <div className={styles.errorMessage} role="alert">
          <strong>⚠️ Unable to load prayer times</strong>
          <br />
          <p style={{ margin: '0.5rem 0 0' }}>{error}</p>
        </div>
        <div className={styles.controls}>
          <button
            className={styles.geolocateButton}
            onClick={handleGeolocation}
            disabled={loading}
            aria-label="Get prayer times using your current location"
          >
            {loading ? (
              <>
                <span className={styles.loadingSpinner} style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }} />
                Getting Location...
              </>
            ) : (
              '📍 Use My Location'
            )}
          </button>
        </div>
      </>
    );
  }

  if (!prayerTimes) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading prayer times...</p>
      </div>
    );
  }

  return (
    <>
      <audio 
        ref={audioRef} 
        style={{ display: 'none' }}
        preload="auto"
        controlsList="nodownload"
      />

      {!initialCoords.lat && !initialCoords.lon && (
        <div className={styles.infoMessage}>
          <p>📍 <strong>Showing prayer times for:</strong> {location}</p>
          <p style={{ marginTop: '0.5rem', marginBottom: '0' }}>Enable location for accurate times.</p>
        </div>
      )}

      {(initialCoords.lat || initialCoords.lon) && (
        <div className={styles.locationMessage}>
          <p>📍 <strong>Your location:</strong> {location}</p>
        </div>
      )}

      {nextPrayer && (
        <div className={styles.currentPrayerIndicator}>
          🕌 Next: <strong>{nextPrayer.prayer.name}</strong> • {getCountdownText(nextPrayer.time)}
        </div>
      )}

      <div className={styles.prayerGrid}>
        {prayers.map((prayer) => {
          const prayerTime = prayerTimes.data.timings[prayer.key];
          const isActive = nextPrayer?.prayer.key === prayer.key;
          
          if (!prayerTime) return null;
          
          return (
            <div
              key={prayer.key}
              className={`${styles.prayerCard} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <div className={styles.prayerInfo}>
                <div className={styles.prayerBadge}>
                  {prayer.index}
                </div>
                <div className={styles.prayerNames}>
                  <span className={styles.prayerName}>{prayer.name}</span>
                  <span className={styles.prayerNameArabic}>{prayer.arabic}</span>
                </div>
              </div>
              <div className={styles.prayerTimeContainer}>
                <div className={styles.prayerTime}>
                  {prayerTime}
                </div>
                {isActive && nextPrayer && (
                  <div className={styles.countdown}>
                    {getCountdownText(nextPrayer.time)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.geolocateButton}
          onClick={handleGeolocation}
          disabled={loading}
          aria-label="Get prayer times using your current location"
        >
          {loading ? '📍 Getting Location...' : '📍 Use My Current Location'}
        </button>
        <button
          className={`${styles.reminderButton} ${audioSettings.enabled ? styles.reminderActive : ''}`}
          onClick={toggleAudio}
          title={audioSettings.enabled ? 'Azan audio enabled' : 'Enable Azan audio'}
          aria-label="Toggle Azan audio notifications"
        >
          {audioSettings.enabled ? '🔊 Azan ON' : '🔇 Azan OFF'}
        </button>
        <button
          className={`${styles.reminderButton}`}
          onClick={testAudio}
          title="Test audio playback"
          aria-label="Test audio playback"
        >
          🧪 Test Audio
        </button>
        <button
          className={`${styles.reminderButton}`}
          onClick={() => setShowSpecialFeatures(!showSpecialFeatures)}
          title="Special features (Eid, Hajj, Islamic Lori)"
          aria-label="Toggle special features"
        >
          ✨ Special Features
        </button>
        <button
          className={`${styles.reminderButton} ${expandedReminders ? styles.reminderActive : ''}`}
          onClick={() => setExpandedReminders(!expandedReminders)}
          title="Manage reminders"
          aria-label="Toggle reminder settings"
        >
          🔔 Reminders
        </button>
        <button
          className={`${styles.reminderButton} ${showCustomAlarmPanel ? styles.reminderActive : ''}`}
          onClick={() => setShowCustomAlarmPanel(!showCustomAlarmPanel)}
          title="Create custom prayer alarms"
          aria-label="Toggle custom alarm settings"
        >
          ⏰ Custom Alarms ({customAlarms.length})
        </button>
        <button
          className={`${styles.reminderButton} ${showLocationPanel ? styles.reminderActive : ''}`}
          onClick={() => setShowLocationPanel(!showLocationPanel)}
          title="Search prayer times by custom location"
          aria-label="Toggle custom location search"
        >
          🌍 Custom Location
        </button>
      </div>

      {expandedReminders && (
        <div className={styles.reminderPanel}>
          <h3 className={styles.reminderPanelTitle}>Prayer Reminders Settings</h3>
          
          <div className={styles.audioSettingsGroup}>
            <label className={styles.settingLabel}>
              <span>🔊 Azan Volume: {Math.round(audioSettings.volume * 100)}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(audioSettings.volume * 100)}
                onChange={(e) =>
                  setAudioSettings((prev) => ({ ...prev, volume: parseInt(e.target.value) / 100 }))
                }
                className={styles.volumeSlider}
                aria-label="Azan volume control"
              />
            </label>
            
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={audioSettings.playAzanAtPrayerTime}
                onChange={(e) =>
                  setAudioSettings((prev) => ({ ...prev, playAzanAtPrayerTime: e.target.checked }))
                }
              />
              <span>Play Azan at prayer time</span>
            </label>
          </div>

          <div className={styles.remindersGroup}>
            {reminders.map((reminder) => (
              <div key={reminder.id} className={styles.reminderItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => toggleReminder(reminder.id)}
                  />
                  <span>{reminder.prayerKey}</span>
                </label>
                <div className={styles.reminderTimeInput}>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={reminder.minutesBefore}
                    onChange={(e) => updateReminderMinutes(reminder.id, parseInt(e.target.value) || 1)}
                    className={styles.minuteInput}
                    disabled={!reminder.enabled}
                    aria-label={`Minutes before ${reminder.prayerKey}`}
                  />
                  <span>min before</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSpecialFeatures && (
        <div className={styles.reminderPanel}>
          <h3 className={styles.reminderPanelTitle}>✨ Special Islamic Features</h3>
          
          <div className={styles.remindersGroup}>
            {/* Islamic Lori Player */}
            <div className={styles.reminderItem} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.checkboxLabel} style={{ marginBottom: '0' }}>
                  <input
                    type="checkbox"
                    checked={islamicLoriEnabled}
                    onChange={(e) => setIslamicLoriEnabled(e.target.checked)}
                  />
                  <span>🎼 Islamic Lori</span>
                </label>
                <button
                  className={styles.reminderButton}
                  onClick={playIslamicLori}
                  title="Play Islamic Lori music"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  ▶️ Play
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                Islamic devotional music
              </p>
            </div>

            {/* Eid Takbeer */}
            <div className={styles.reminderItem} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.checkboxLabel} style={{ marginBottom: '0' }}>
                  <input
                    type="checkbox"
                    checked={specialOccasionSettings.eidEnabled}
                    onChange={(e) =>
                      setSpecialOccasionSettings((prev) => ({
                        ...prev,
                        eidEnabled: e.target.checked,
                      }))
                    }
                  />
                  <span>🕌 Eid Takbeer</span>
                </label>
                <button
                  className={styles.reminderButton}
                  onClick={() => playTakbeer('eid')}
                  title="Play Eid Takbeer"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  ▶️ Play
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                Takbeer for Eid ul-Fitr {isEidDate() ? '✅ TODAY!' : ''}
              </p>
            </div>

            {/* Eid ul-Adha Takbeer */}
            <div className={styles.reminderItem} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.checkboxLabel} style={{ marginBottom: '0' }}>
                  <input
                    type="checkbox"
                    checked={specialOccasionSettings.eidUlAdhaEnabled}
                    onChange={(e) =>
                      setSpecialOccasionSettings((prev) => ({
                        ...prev,
                        eidUlAdhaEnabled: e.target.checked,
                      }))
                    }
                  />
                  <span>🐑 Eid ul-Adha Takbeer</span>
                </label>
                <button
                  className={styles.reminderButton}
                  onClick={() => playTakbeer('eid-ul-adha')}
                  title="Play Eid ul-Adha Takbeer"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  ▶️ Play
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                Takbeer for Eid ul-Adha {isEidUlAdhaDate() ? '✅ TODAY!' : ''}
              </p>
            </div>

            {/* Hajj Takbeer */}
            <div className={styles.reminderItem} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.checkboxLabel} style={{ marginBottom: '0' }}>
                  <input
                    type="checkbox"
                    checked={specialOccasionSettings.hajjEnabled}
                    onChange={(e) =>
                      setSpecialOccasionSettings((prev) => ({
                        ...prev,
                        hajjEnabled: e.target.checked,
                      }))
                    }
                  />
                  <span>🕌 Hajj Takbeer</span>
                </label>
                <button
                  className={styles.reminderButton}
                  onClick={() => playTakbeer('hajj')}
                  title="Play Hajj Takbeer"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  ▶️ Play
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                Takbeer during Hajj season {isHajjSeason() ? '✅ SEASON ACTIVE!' : ''}
              </p>
            </div>

            {/* Zil Hajj Takbeer */}
            <div className={styles.reminderItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.checkboxLabel} style={{ marginBottom: '0' }}>
                  <input
                    type="checkbox"
                    checked={specialOccasionSettings.zilHajjEnabled}
                    onChange={(e) =>
                      setSpecialOccasionSettings((prev) => ({
                        ...prev,
                        zilHajjEnabled: e.target.checked,
                      }))
                    }
                  />
                  <span>📅 Zil Hajj Takbeer</span>
                </label>
                <button
                  className={styles.reminderButton}
                  onClick={() => playTakbeer('zil-hajj')}
                  title="Play Zil Hajj Takbeer"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  ▶️ Play
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                Takbeer for Zil Hajj month {isZilHajjMonth() ? '✅ MONTH ACTIVE!' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {showCustomAlarmPanel && (
        <div className={styles.reminderPanel}>
          <h3 className={styles.reminderPanelTitle}>⏰ Create Custom Prayer Alarm</h3>
          
          <div className={styles.audioSettingsGroup}>
            <div style={{ marginBottom: '1rem' }}>
              <label className={styles.settingLabel}>
                <span>Alarm Name (e.g., "Fajr 2 Rakah Sunnah")</span>
                <input
                  type="text"
                  value={newAlarmName}
                  onChange={(e) => setNewAlarmName(e.target.value)}
                  placeholder="Enter alarm name"
                  className={styles.minuteInput}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className={styles.settingLabel}>
                <span>Prayer Type</span>
                <select
                  value={newAlarmType}
                  onChange={(e) => setNewAlarmType(e.target.value as 'sunnah' | 'nafl' | 'tahajjud' | 'custom')}
                  className={styles.minuteInput}
                  style={{ width: '100%', marginTop: '0.5rem', cursor: 'pointer' }}
                >
                  <option value="sunnah">2 Rakah Sunnah</option>
                  <option value="nafl">Nafl Prayer</option>
                  <option value="tahajjud">Tahajjud Prayer</option>
                  <option value="custom">Custom Prayer</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className={styles.settingLabel}>
                <span>Base Prayer</span>
                <select
                  value={newAlarmBasePrayer}
                  onChange={(e) => setNewAlarmBasePrayer(e.target.value)}
                  className={styles.minuteInput}
                  style={{ width: '100%', marginTop: '0.5rem', cursor: 'pointer' }}
                >
                  <option value="Fajr">Fajr</option>
                  <option value="Dhuhr">Dhuhr</option>
                  <option value="Asr">Asr</option>
                  <option value="Maghrib">Maghrib</option>
                  <option value="Isha">Isha</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className={styles.settingLabel}>
                <span>Alarm Time (HH:mm)</span>
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className={styles.minuteInput}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </label>
            </div>

            <button
              className={styles.geolocateButton}
              onClick={createCustomAlarm}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              ✅ Create Alarm
            </button>
          </div>

          {customAlarms.length > 0 && (
            <div className={styles.remindersGroup} style={{ marginTop: '2rem' }}>
              <h4 style={{ color: '#3c4043', marginBottom: '1rem', fontSize: '1.1rem' }}>
                🎯 Your Custom Alarms ({customAlarms.length})
              </h4>
              {customAlarms.map((alarm) => (
                <div key={alarm.id} className={styles.reminderItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <label className={styles.checkboxLabel} style={{ marginBottom: '0' }}>
                      <input
                        type="checkbox"
                        checked={alarm.enabled}
                        onChange={() => toggleCustomAlarm(alarm.id)}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1976d2' }}>{alarm.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#80868b', marginTop: '0.25rem' }}>
                          {alarm.time} • {alarm.alarmType === 'sunnah' ? '2 Rakah Sunnah' : alarm.alarmType === 'nafl' ? 'Nafl' : alarm.alarmType === 'tahajjud' ? 'Tahajjud' : 'Custom'}
                        </div>
                      </div>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={styles.reminderButton}
                        onClick={() => testCustomAlarm(alarm)}
                        title="Test this alarm"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        ▶️ Test
                      </button>
                      <button
                        className={styles.reminderButton}
                        onClick={() => deleteCustomAlarm(alarm.id)}
                        title="Delete this alarm"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #ea4335 0%, #c5221f 100%)' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className={styles.reminderTimeInput} style={{ marginTop: '0.75rem' }}>
                    <input
                      type="time"
                      value={alarm.time}
                      onChange={(e) => updateCustomAlarmTime(alarm.id, e.target.value)}
                      className={styles.minuteInput}
                      disabled={!alarm.enabled}
                    />
                    <span>Edit Time</span>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <label className={styles.settingLabel} style={{ marginBottom: '0' }}>
                      <span>Volume: {alarm.volume}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={alarm.volume || 70}
                        onChange={(e) => updateCustomAlarmVolume(alarm.id, parseInt(e.target.value))}
                        className={styles.volumeSlider}
                        disabled={!alarm.enabled}
                      />
                    </label>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <small style={{ color: '#80868b' }}>
                      Last triggered: {alarm.lastTriggered ? new Date(alarm.lastTriggered).toLocaleString() : 'Never'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showLocationPanel && (
        <div className={styles.reminderPanel} style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', borderLeft: '4px solid #4caf50' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className={styles.reminderPanelTitle} style={{ color: '#2e7d32', margin: 0 }}>🌍 Advanced Location Search</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={styles.reminderButton}
                onClick={() => setShowLocationStats(!showLocationStats)}
                title="View location statistics"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #2196F3 0%, #1565c0 100%)' }}
              >
                📊 Stats
              </button>
              <button
                className={styles.reminderButton}
                onClick={exportLocations}
                title="Export saved locations"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)' }}
              >
                📥 Export
              </button>
            </div>
          </div>

          {showLocationStats && locationStats && (
            <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '2px solid #2196F3', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#1565c0', fontSize: '0.95rem' }}>📈 Location Statistics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>{locationStats.totalSearches}</div>
                  <div style={{ fontSize: '0.8rem', color: '#558b2f' }}>Total Searches</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c2185b' }}>{locationStats.savedLocationCount}</div>
                  <div style={{ fontSize: '0.8rem', color: '#558b2f' }}>Saved Locations</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'linear-gradient(135deg, #fff3e0 0%, #f3e5f5 100%)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f57c00' }}>{locationStats.favoriteCount}</div>
                  <div style={{ fontSize: '0.8rem', color: '#558b2f' }}>Favorites</div>
                </div>
              </div>
            </div>
          )}

          {locationSearchError && (
            <div style={{ padding: '0.75rem', backgroundColor: '#ffebee', border: '1px solid #ef5350', borderRadius: '8px', color: '#c62828', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {locationSearchError}
            </div>
          )}

          <div className={styles.locationSearchForm}>
            <div className={styles.locationInputGroup}>
              <input
                type="text"
                placeholder="Enter city name (e.g., New York)"
                value={searchCity}
                onChange={(e) => handleCityInput(e.target.value)}
                className={styles.minuteInput}
                disabled={locationSearchLoading}
                autoComplete="off"
              />
              <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>City</span>
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #81c784', borderRadius: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', marginTop: '4px' }}>
                  {citySuggestions.map((city) => (
                    <div
                      key={city}
                      onClick={() => selectCitySuggestion(city)}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background 0.2s',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f8e9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      📍 {city}, {popularCities[city]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.locationInputGroup}>
              <input
                type="text"
                placeholder="Enter country (e.g., USA)"
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className={styles.minuteInput}
                disabled={locationSearchLoading}
              />
              <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Country</span>
            </div>

            <button
              className={styles.geolocateButton}
              onClick={() => fetchPrayerTimesByLocation(searchCity, searchCountry)}
              disabled={locationSearchLoading}
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              {locationSearchLoading ? (
                <>
                  <span className={styles.loadingSpinner} style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }} />
                  Searching...
                </>
              ) : (
                '🔍 Search Prayer Times'
              )}
            </button>
          </div>

          {searchHistory.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(33, 150, 243, 0.08)', borderRadius: '8px', borderLeft: '3px solid #2196F3' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#1565c0' }}>🕐 Recent Searches</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {searchHistory.slice(0, 5).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => {
                      setSearchCity(search.city);
                      setSearchCountry(search.country);
                      fetchPrayerTimesByLocation(search.city, search.country);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: 'white',
                      border: '1px solid #2196F3',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: '#1565c0',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e3f2fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    {search.city} ({search.searchCount}x)
                  </button>
                ))}
              </div>
            </div>
          )}

          {lastSearchedLocation && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px', borderLeft: '3px solid #4caf50' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#2e7d32' }}>
                <strong>✅ Last Searched:</strong> {lastSearchedLocation.city}, {lastSearchedLocation.country}
              </p>
              <button
                className={styles.geolocateButton}
                onClick={() => setShowSaveLocationForm(!showSaveLocationForm)}
                style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
              >
                {showSaveLocationForm ? '❌ Cancel' : '💾 Save This Location'}
              </button>

              {showSaveLocationForm && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #81c784' }}>
                  <input
                    type="text"
                    placeholder="Give this location a name (e.g., My Home, Office)"
                    value={saveLocationName}
                    onChange={(e) => setSaveLocationName(e.target.value)}
                    className={styles.minuteInput}
                    style={{ marginBottom: '0.75rem', width: '100%', boxSizing: 'border-box' }}
                  />
                  <button
                    className={styles.geolocateButton}
                    onClick={saveCurrentLocation}
                    style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem', background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' }}
                  >
                    ✅ Save Location
                  </button>
                </div>
              )}
            </div>
          )}

          {savedLocations.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
                  📌 Saved Locations ({getSortedLocations().length})
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={sortLocationBy}
                    onChange={(e) => setSortLocationBy(e.target.value as any)}
                    style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #4caf50' }}
                  >
                    <option value="favorite">⭐ Favorites</option>
                    <option value="recent">🕐 Recent</option>
                    <option value="name">A-Z Name</option>
                    <option value="timezone">🌐 Timezone</option>
                  </select>
                  {getUniqueTimezones().length > 0 && (
                    <select
                      value={filterByTimezone}
                      onChange={(e) => setFilterByTimezone(e.target.value)}
                      style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #4caf50' }}
                    >
                      <option value="all">All Timezones</option>
                      {getUniqueTimezones().map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {getSortedLocations().map((savedLocation) => (
                  <div
                    key={savedLocation.id}
                    style={{
                      padding: '0.75rem',
                      background: 'white',
                      borderRadius: '8px',
                      border: savedLocation.isFavorite ? '2px solid #ffd54f' : '1px solid #c8e6c9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500', color: '#1b5e20' }}>
                        {savedLocation.isFavorite && '⭐ '}
                        {savedLocation.name}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#558b2f' }}>
                        {savedLocation.city}, {savedLocation.country}
                      </p>
                      {savedLocation.timezone && (
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#7cb342' }}>
                          🌐 {savedLocation.timezone}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.75rem' }}>
                      <button
                        className={styles.reminderButton}
                        onClick={() => loadSavedLocation(savedLocation)}
                        title="Load this location"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' }}
                      >
                        📍 Load
                      </button>
                      <button
                        className={styles.reminderButton}
                        onClick={() => toggleFavoriteLocation(savedLocation.id)}
                        title={savedLocation.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #ffd54f 0%, #fbc02d 100%)' }}
                      >
                        {savedLocation.isFavorite ? '⭐' : '☆'}
                      </button>
                      <button
                        className={styles.reminderButton}
                        onClick={() => deleteSavedLocation(savedLocation.id)}
                        title="Delete this location"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #ea4335 0%, #c5221f 100%)' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {savedLocations.length === 0 && !lastSearchedLocation && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', textAlign: 'center', color: '#558b2f', backgroundColor: 'rgba(139, 195, 74, 0.1)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                🔍 Search for a location to get started! Your saved locations will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {prayerTimes.data.meta && (
        <div className={styles.methodInfo}>
          <p className={styles.methodText}>
            🕋 <strong>Method:</strong> {prayerTimes.data.meta.method?.name || 'Umm Al-Qura'}
          </p>
          {prayerTimes.data.meta.timezone && (
            <p className={styles.methodText}>
              ⏰ <strong>Timezone:</strong> {prayerTimes.data.meta.timezone}
            </p>
          )}
        </div>
      )}
    </>
  );
}
