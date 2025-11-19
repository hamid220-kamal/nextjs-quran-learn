'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerTimesResponse, Prayer } from './types';

// Import utilities
import {
  calculateQiblaDirection,
  gregorianToHijri,
} from './utils/prayerCalculations';

// Import prayer tracking utilities
import {
  markPrayerCompleted,
  markPrayerMissed,
  undoPrayerStatus,
  getTodayPrayerRecord,
  getTodayDate,
  getComprehensiveStats,
  formatStreakDisplay,
  getCompletionRate,
  getWeeklySummary,
} from './utils/prayerTracking';

// Import IndexedDB utilities for audio persistence
import {
  saveAudioFile,
  getAudioFileURL,
  getAllAudioMetadata,
  deleteAudioFile,
  initializeIndexedDB,
} from './utils/indexedDB';

// Import localStorage utilities
import {
  loadAlarms,
  saveAlarms,
  addAlarm as storageAddAlarm,
  updateAlarm as storageUpdateAlarm,
  deleteAlarm as storageDeleteAlarm,
  toggleAlarm as storageToggleAlarm,
  loadReminderSettings,
  saveReminderSettings,
  loadThemePreference,
  saveThemePreference,
  loadPrayerStats,
  savePrayerStats,
  loadNotificationHistory,
  addNotification as storageAddNotification,
  loadFavoriteLocations,
  saveFavoriteLocations,
  validateAlarm,
  validateReminderMinutes,
  initializeStorage,
  STORAGE_KEYS,
} from './utils/localStorage';

interface PrayerTimePageProps {
  initialPrayerTimes: PrayerTimesResponse | null;
  initialError: string | null;
  initialCoords: { lat?: string; lon?: string; city?: string; country?: string };
  initialLocation?: string;
}

interface Reminder {
  prayer: string;
  minutesBefore: number;
}

interface CustomAlarm {
  id: string;
  name: string;
  hour: number;
  minute: number;
  enabled: boolean;
  sound: 'adhan' | 'bell' | 'fajr-azan' | 'all-azan' | 'eid-takbeer' | 'eid-adha' | 'hajj-takbeer' | 'islamic-lori' | 'zil-hajj' | 'custom';
  customAudioUrl?: string;
  createdAt: number;
  updatedAt: number;
}

interface QiblaInfo {
  azimuth: number;
  description: string;
  magneticDeclination: number;
  trueNorth: number;
}

export default function PrayerTimePageFunctional({
  initialPrayerTimes,
  initialError,
  initialCoords,
  initialLocation = 'Mecca, Saudi Arabia',
}: PrayerTimePageProps) {
  // ========== CORE STATE ==========
  const [prayerTimes, setPrayerTimes] = useState(initialPrayerTimes);
  const [error, setError] = useState(initialError);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date; minutesLeft: number } | null>(null);
  const [location, setLocation] = useState(initialLocation);

  // ========== REMINDERS & ALARMS ==========
  const [reminders, setReminders] = useState<Map<string, number>>(new Map([
    ['Fajr', 10],
    ['Sunrise', 0],
    ['Dhuhr', 5],
    ['Asr', 5],
    ['Maghrib', 2],
    ['Isha', 5],
  ]));

  const [customAlarms, setCustomAlarms] = useState<CustomAlarm[]>([]);
  const [newAlarmName, setNewAlarmName] = useState('');
  const [newAlarmTime, setNewAlarmTime] = useState('00:00');
  const [newAlarmSound, setNewAlarmSound] = useState<'adhan' | 'bell' | 'fajr-azan' | 'all-azan' | 'eid-takbeer' | 'eid-adha' | 'hajj-takbeer' | 'islamic-lori' | 'zil-hajj' | 'custom'>('fajr-azan');
  const [lastTriggeredAlarm, setLastTriggeredAlarm] = useState<{ name: string; time: string } | null>(null);
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const [snoozeMinutes, setSnoozeMinutes] = useState(5);
  const [snoozedUntilTimestamp, setSnoozedUntilTimestamp] = useState<number | null>(null); // Tracks when snooze ends (ms)

  // Available audio files from public folder
  const audioFiles = [
    { id: 'fajr-azan', name: '🕌 Fajr Azan (Call to Prayer)', path: '/prayer time audio/fajr azan.mp3' },
    { id: 'all-azan', name: '📢 All Prayer Times Azan', path: '/prayer time audio/all prayer time azan.mp3' },
    { id: 'eid-takbeer', name: '🎉 Eid Takbeer', path: '/prayer time audio/eid takbeer.mp3' },
    { id: 'eid-adha', name: '🐑 Eid ul-Adha Takbeer', path: '/prayer time audio/eid ul-adha takbeer.mp3' },
    { id: 'hajj-takbeer', name: '🕌 Hajj Takbeer', path: '/prayer time audio/hajj takbeer.mp3' },
    { id: 'islamic-lori', name: '🎵 Islamic Lori (Lullaby)', path: '/prayer time audio/islamic lori.mp3' },
    { id: 'zil-hajj', name: '🌙 Zil Hajj Takbeer', path: '/prayer time audio/Zil hajj takbeer.mp3' },
  ];

  const [uploadedAudio, setUploadedAudio] = useState<{ id: string; name: string; url: string }[]>([]);
  const [customAudioFile, setCustomAudioFile] = useState<File | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);

  // ========== AUDIO & NOTIFICATIONS ==========
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // ========== QIBLA & HIJRI ==========
  const [qiblaInfo, setQiblaInfo] = useState<QiblaInfo | null>(null);
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [prayerStats, setPrayerStats] = useState({
    today: 0,
    streak: 0,
    thisMonth: 0,
    total: 0,
  });

  const [todayPrayerRecord, setTodayPrayerRecord] = useState(getTodayPrayerRecord());
  const [comprehensiveStats, setComprehensiveStats] = useState(getComprehensiveStats());
  const [weeklyData, setWeeklyData] = useState(getWeeklySummary());
  const [showPrayerTracking, setShowPrayerTracking] = useState(false);

  // ========== UI STATE ==========
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOnline, setIsOnline] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQibla, setShowQibla] = useState(false);

  // ========== REFS ==========
  const audioRef = useRef<HTMLAudioElement>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const activeAudioInstancesRef = useRef<HTMLAudioElement[]>([]);
  const snoozedAlarmIdRef = useRef<string | null>(null); // Track which alarm is snoozed

  // ========== INITIALIZATION & TIME UPDATE ==========
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ========== LOAD DATA FROM LOCALSTORAGE & INDEXEDDB ON MOUNT ==========
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on SSR
    
    console.log('📦 Loading data from localStorage and IndexedDB...');
    initializeStorage();
    initializeIndexedDB().catch(err => console.error('IndexedDB init error:', err));
    
    // Load custom alarms
    const savedAlarms = loadAlarms();
    if (savedAlarms.length > 0) {
      setCustomAlarms(savedAlarms);
      console.log(`✅ Loaded ${savedAlarms.length} custom alarms`);
    }
    
    // Load reminder settings
    const savedReminders = loadReminderSettings();
    setReminders(new Map(Object.entries(savedReminders)));
    
    // Load theme preference
    const savedTheme = loadThemePreference();
    setTheme(savedTheme);
    
    // Load prayer stats
    const savedStats = loadPrayerStats();
    setPrayerStats(savedStats);
    
    // Load uploaded audio files from IndexedDB
    loadStoredAudioFiles();
    
    // Initialize online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Back online!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      console.log('📴 Went offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Only run on mount

  // ========== CALCULATE NEXT PRAYER ==========
  useEffect(() => {
    if (!prayerTimes?.data?.timings) return;

    const timings = prayerTimes.data.timings;
    const today = currentTime;
    const prayerList = [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Sunrise', time: timings.Sunrise },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Maghrib },
      { name: 'Isha', time: timings.Isha },
    ];

    for (const prayer of prayerList) {
      const [hour, minute] = prayer.time.split(':').map(Number);
      const prayerDate = new Date(today);
      prayerDate.setHours(hour, minute, 0, 0);

      if (prayerDate > today) {
        const minutesLeft = Math.ceil((prayerDate.getTime() - today.getTime()) / (1000 * 60));
        setNextPrayer({ name: prayer.name, time: prayerDate, minutesLeft });
        return;
      }
    }

    // If no prayer found today, set to Fajr tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hour, minute] = prayerList[0].time.split(':').map(Number);
    tomorrow.setHours(hour, minute, 0, 0);
    const minutesLeft = Math.ceil((tomorrow.getTime() - today.getTime()) / (1000 * 60));
    setNextPrayer({ name: 'Fajr (Tomorrow)', time: tomorrow, minutesLeft });
  }, [prayerTimes, currentTime]);

  // ========== CALCULATE QIBLA DIRECTION ==========
  useEffect(() => {
    if (!initialCoords.lat || !initialCoords.lon) return;

    const lat = parseFloat(initialCoords.lat);
    const lon = parseFloat(initialCoords.lon);

    try {
      const qibla = calculateQiblaDirection(lat, lon);
      setQiblaInfo({
        azimuth: qibla.azimuth,
        description: qibla.description,
        magneticDeclination: qibla.magneticDeclination || 0,
        trueNorth: qibla.trueNorth || 0,
      });
    } catch (err) {
      console.error('Error calculating Qibla:', err);
    }
  }, [initialCoords]);

  // ========== CALCULATE HIJRI DATE ==========
  useEffect(() => {
    if (!prayerTimes?.data?.date) return;

    const date = prayerTimes.data.date;
    if (date.hijri) {
      setHijriDate(date.hijri);
    }
  }, [prayerTimes]);

  // ========== HANDLE REMINDERS & ALARMS ==========
  useEffect(() => {
    const checkAlerts = () => {
      const now = currentTime;
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

      // Debug logging every 30 seconds
      if (currentSeconds === 0 || currentSeconds === 30) {
        console.log(`⏰ Checking alarms at ${currentTimeStr}:${currentSeconds.toString().padStart(2, '0')}`);
        if (customAlarms.length > 0) {
          console.log(`📋 Active alarms:`, customAlarms.map(a => ({
            name: a.name,
            time: `${a.hour.toString().padStart(2, '0')}:${a.minute.toString().padStart(2, '0')}`,
            enabled: a.enabled,
            triggered: triggeredAlarmsRef.current.has(`alarm-${a.id}`),
          })));
        }
      }

      // Check custom alarms
      if (customAlarms.length > 0) {
        for (const alarm of customAlarms) {
          if (!alarm.enabled) continue;

          const alarmTimeStr = `${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}`;
          const alarmId = `alarm-${alarm.id}`;
          
          // Check if THIS specific alarm is currently snoozed
          const now = currentTime.getTime();
          const isSnoozed = snoozedAlarmIdRef.current === alarm.id && snoozedUntilTimestamp && now < snoozedUntilTimestamp;
          
          if (isSnoozed) {
            console.log(`⏳ Alarm ${alarm.name} is snoozed until ${new Date(snoozedUntilTimestamp).toLocaleTimeString()}`);
            continue; // Alarm is snoozed, skip triggering
          }
          
          // Check if snooze just ended for this alarm - trigger it immediately
          if (snoozedAlarmIdRef.current === alarm.id && snoozedUntilTimestamp && now >= snoozedUntilTimestamp) {
            console.log(`🔔 *** SNOOZED ALARM RE-TRIGGERED *** ${alarm.name}`);
            triggeredAlarmsRef.current.add(alarmId);
            setLastTriggeredAlarm({ name: alarm.name, time: alarmTimeStr });
            setActiveAlarmId(alarm.id);
            setSnoozedUntilTimestamp(null); // Clear snooze
            snoozedAlarmIdRef.current = null;
            
            // Play audio
            playAudio(alarm.sound, alarm.name);
            const t1 = setTimeout(() => playAudio(alarm.sound, alarm.name), 2000);
            audioTimeoutsRef.current.push(t1);
            const t2 = setTimeout(() => playAudio(alarm.sound, alarm.name), 4000);
            audioTimeoutsRef.current.push(t2);
            
            sendNotification('⏰ Alarm Triggered!', `${alarm.name}`, true);
            console.warn(`🔊 ALARM SOUND PLAYING: ${alarm.name} (${alarm.sound})`);
            continue;
          }
          
          // Check if alarm hasn't been triggered yet
          if (triggeredAlarmsRef.current.has(alarmId)) {
            continue; // Already triggered
          }

          // Trigger if current time matches alarm time
          // Allow 60-second window to catch the alarm even if check is delayed
          const alarmHour = alarm.hour;
          const alarmMinute = alarm.minute;
          
          const isTimeMatch = 
            (currentHours === alarmHour && currentMinutes === alarmMinute) ||
            // Also check if we're within 60 seconds after the alarm time
            (currentHours === alarmHour && currentMinutes === alarmMinute + 1 && currentSeconds < 60);

          if (isTimeMatch) {
            console.log(`🔔 *** ALARM TRIGGERED *** ${alarm.name} at ${alarmTimeStr}`);
            triggeredAlarmsRef.current.add(alarmId);
            setLastTriggeredAlarm({ name: alarm.name, time: alarmTimeStr });
            setActiveAlarmId(alarm.id);
            setSnoozedUntilTimestamp(null); // Clear snooze when alarm triggers
            snoozedAlarmIdRef.current = null; // Clear snoozed alarm ref
            
            // Play audio multiple times for better reliability
            playAudio(alarm.sound, alarm.name);
            const t1 = setTimeout(() => playAudio(alarm.sound, alarm.name), 2000);
            audioTimeoutsRef.current.push(t1);
            const t2 = setTimeout(() => playAudio(alarm.sound, alarm.name), 4000);
            audioTimeoutsRef.current.push(t2);
            
            // Send notification with retry
            sendNotification('⏰ Alarm Triggered!', `${alarm.name} at ${alarmTimeStr}`, true);
            
            // Show visual alert in console
            console.warn(`🔊 ALARM SOUND PLAYING: ${alarm.name} (${alarm.sound})`);
          }
        }
      }

      // Check prayer reminders
      if (prayerTimes?.data?.timings && remindersEnabled && audioEnabled) {
        const timings = prayerTimes.data.timings;
        const remindersArray = Array.from(reminders.entries());

        for (const [prayer, minutesBefore] of remindersArray) {
          const timeStr = timings[prayer as keyof typeof timings];
          if (!timeStr) continue;

          const [hour, minute] = timeStr.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hour, minute, 0, 0);

          // Calculate reminder time
          const reminderTime = new Date(prayerTime.getTime() - minutesBefore * 60000);
          const reminderHour = reminderTime.getHours();
          const reminderMinute = reminderTime.getMinutes();
          const reminderTimeStr = `${reminderHour.toString().padStart(2, '0')}:${reminderMinute.toString().padStart(2, '0')}`;
          const reminderId = `reminder-${prayer}-${minutesBefore}`;

          // Check if reminder should trigger
          // Use hour and minute comparison (more reliable than exact timestamp)
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const isReminderTime = currentHour === reminderHour && currentMinute === reminderMinute;
          
          if (isReminderTime && !triggeredAlarmsRef.current.has(reminderId)) {
            console.log(`✅ ✅ ✅ REMINDER TRIGGERED: ${prayer} Prayer at ${reminderTimeStr} (${minutesBefore} min before) ✅ ✅ ✅`);
            console.log(`🎯 Current time: ${currentTimeStr}, Reminder time: ${reminderTimeStr}`);
            triggeredAlarmsRef.current.add(reminderId);
            
            // Play alarm sound for reminder
            console.log(`🔊 Playing alarm sound: bell`);
            playAudio('bell', prayer);
            
            // Send push notification with alarm action
            const notificationBody = minutesBefore === 0 
              ? `Time for ${prayer} Prayer - 🕌` 
              : `${prayer} Prayer in ${minutesBefore} minute${minutesBefore !== 1 ? 's' : ''} ⏰`;
            
            console.log(`📢 📢 Calling sendNotification: "${prayer} Reminder" - "${notificationBody}"`);
            sendNotification(`🕌 ${prayer} Reminder`, notificationBody, true);
            
            // Log for debugging
            console.log(`📢 Notification sent: "${prayer} Reminder" - "${notificationBody}"`);
            
            // Additional alert for mobile
            if ('vibrate' in navigator) {
              try {
                // Vibrate pattern: 200ms vibrate, 100ms pause, 200ms vibrate
                console.log('📳 Vibrating device...');
                navigator.vibrate([200, 100, 200]);
              } catch (e) {
                console.log('⚠️ Vibration not supported');
              }
            }
          } else if (isReminderTime && triggeredAlarmsRef.current.has(reminderId)) {
            // Log that reminder already triggered (for debugging)
            console.log(`⏭️ Reminder already triggered for ${prayer} Prayer at ${reminderTimeStr}`);
          }
        }
      }
    };

    checkAlerts();
  }, [currentTime, reminders, customAlarms, audioEnabled, remindersEnabled, prayerTimes, snoozedUntilTimestamp]);

  // ========== RESET TRIGGERED ALARMS AT MIDNIGHT ==========
  useEffect(() => {
    const now = currentTime;
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      triggeredAlarmsRef.current.clear();
      audioTimeoutsRef.current.forEach(t => clearTimeout(t));
      audioTimeoutsRef.current = [];
      // Clear all audio instances
      activeAudioInstancesRef.current.forEach(audio => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {}
      });
      activeAudioInstancesRef.current = [];
      setSnoozedUntilTimestamp(null); // Clear snooze at midnight
      snoozedAlarmIdRef.current = null; // Clear snoozed alarm ref
    }
  }, [currentTime]);

  // ========== STOP & CONTROL ALARM ==========
  const stopAlarm = () => {
    console.log('🛑 Stopping all alarms...');
    
    // Stop all active audio instances
    activeAudioInstancesRef.current.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.error('Error stopping audio:', e);
      }
    });
    activeAudioInstancesRef.current = [];
    
    // Stop main audio ref
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    // Clear all audio timeouts
    audioTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    audioTimeoutsRef.current = [];
    
    // Clear UI state
    setIsPlaying(false);
    setActiveAlarmId(null);
    setLastTriggeredAlarm(null);
    
    console.log('✅ All alarms stopped');
  };

  const snoozeAlarm = (minutes: number) => {
    if (!activeAlarmId) {
      console.log('⚠️ No active alarm to snooze');
      return;
    }
    
    console.log(`😴 Snoozing alarm for ${minutes} minutes...`);
    
    // Stop current alarm
    stopAlarm();
    
    // Calculate snooze time
    const snoozeTime = minutes * 60 * 1000; // Convert to milliseconds
    const now = new Date();
    const snoozeUntilTimestamp = now.getTime() + snoozeTime;
    const snoozeUntil = new Date(snoozeUntilTimestamp);
    const snoozeHour = snoozeUntil.getHours();
    const snoozeMinute = snoozeUntil.getMinutes();
    const snoozeTimeStr = `${snoozeHour.toString().padStart(2, '0')}:${snoozeMinute.toString().padStart(2, '0')}`;
    
    // Mark this specific alarm as snoozed
    snoozedAlarmIdRef.current = activeAlarmId;
    setSnoozedUntilTimestamp(snoozeUntilTimestamp);
    
    console.log(`⏰ Alarm will ring again at ${snoozeTimeStr}`);
    
    // DON'T clear from triggered set - we'll check snooze status instead
    
    // Send notification
    sendNotification(
      '😴 Snoozed',
      `Alarm will ring again at ${snoozeTimeStr}`,
      false
    );
  };
  const playAudio = (soundType: string, label: string) => {
    try {
      console.log(`🎵 Playing ${soundType} for ${label}`);
      
      let audioUrl = '';
      
      // Check if it's a custom uploaded audio file
      const customAudio = uploadedAudio.find(a => a.id === soundType);
      if (customAudio && customAudio.url) {
        audioUrl = customAudio.url;
      } else if (soundType === 'fajr-azan') {
        audioUrl = '/prayer time audio/fajr azan.mp3';
      } else if (soundType === 'all-azan') {
        audioUrl = '/prayer time audio/all prayer time azan.mp3';
      } else if (soundType === 'eid-takbeer') {
        audioUrl = '/prayer time audio/eid takbeer.mp3';
      } else if (soundType === 'eid-adha') {
        audioUrl = '/prayer time audio/eid ul-adha takbeer.mp3';
      } else if (soundType === 'hajj-takbeer') {
        audioUrl = '/prayer time audio/hajj takbeer.mp3';
      } else if (soundType === 'islamic-lori') {
        audioUrl = '/prayer time audio/islamic lori.mp3';
      } else if (soundType === 'zil-hajj') {
        audioUrl = '/prayer time audio/Zil hajj takbeer.mp3';
      } else if (soundType === 'bell') {
        // Generate LOUD bell sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const now = audioContext.currentTime;
          
          // Create multiple oscillators for louder bell effect
          const frequencies = [800, 1200, 600, 900];
          for (let i = 0; i < frequencies.length; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequencies[i];
            oscillator.type = 'sine';

            // LOUDER VOLUME: 0.5 increased to 0.9 per oscillator
            gainNode.gain.setValueAtTime(0.9, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            oscillator.start(now);
            oscillator.stop(now + 0.8);
          }

          console.log('🔔 LOUD Bell sound generated');
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), 900);
          return;
        } catch (err) {
          console.error('❌ Bell sound error:', err);
          return;
        }
      } else if (soundType === 'custom' && customAudioFile) {
        // Use uploaded custom audio
        const reader = new FileReader();
        reader.onload = (e) => {
          const customAudioElement = new Audio(e.target?.result as string);
          customAudioElement.volume = Math.min(1, volume / 100);
          customAudioElement.play().catch(err => console.error('❌ Custom audio play error:', err));
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), 5000);
        };
        reader.readAsDataURL(customAudioFile);
        return;
      }
      
      // Play the audio file
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = Math.min(1, volume / 100);
        currentAudioRef.current = audio; // Store reference for stopping
        activeAudioInstancesRef.current.push(audio); // Track all instances
        
        audio.oncanplay = () => {
          console.log(`✅ Audio ready: ${soundType}`);
        };
        
        audio.onerror = (err) => {
          console.error(`❌ Error loading audio ${soundType}:`, err);
          console.log('Trying alternative audio...');
          // Fallback to bell if audio fails
          playAudio('bell', label);
        };
        
        audio.play().catch(err => {
          console.error(`❌ ${soundType} play error:`, err);
          playAudio('bell', label);
        });
        
        setIsPlaying(true);
        setTimeout(() => {
          if (currentAudioRef.current === audio) {
            setIsPlaying(false);
          }
        }, 5000);
      }
    } catch (err) {
      console.error('❌ Audio play error:', err);
    }
  };

  const testAudio = () => {
    playAudio(newAlarmSound, 'Test Audio');
  };

  // ========== NOTIFICATION ==========
  const sendNotification = (title: string, body: string, isAlarm = false) => {
    try {
      console.log(`📢 [NOTIFICATION REQUEST] "${title}" - "${body}"`);
      
      // Play loud alarm sound for notification
      const playNotificationSound = () => {
        try {
          console.log('🔊 Playing notification sound...');
          // Use the loudest alarm sound available
          const alarmAudio = new Audio('/prayer time audio/all prayer time azan.mp3');
          alarmAudio.volume = 1.0; // Maximum volume
          alarmAudio.play().catch(err => {
            console.warn('⚠️ Azan sound failed, trying bell sound:', err);
            // Fallback to synthetic loud bell
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const now = audioContext.currentTime;
            
            // Create multiple oscillators for a louder bell sound
            for (let i = 0; i < 3; i++) {
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.value = 800 + (i * 400);
              oscillator.type = 'sine';
              
              gainNode.gain.setValueAtTime(0.9, now + (i * 0.2));
              gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.2) + 1.0);
              
              oscillator.start(now + (i * 0.2));
              oscillator.stop(now + (i * 0.2) + 1.0);
            }
          });
        } catch (soundError) {
          console.warn('⚠️ Sound play error:', soundError);
        }
      };

      // Check if Notification API is available
      if (!('Notification' in window)) {
        console.warn('⚠️ Notification API not supported in this browser');
        playNotificationSound();
        alert(`${title}\n\n${body}`);
        return;
      }

      console.log(`📍 Notification permission status: ${Notification.permission}`);

      // Case 1: Permission already granted - SHOW NOTIFICATION IMMEDIATELY
      if (Notification.permission === 'granted') {
        console.log('✅ Permission granted - showing notification...');
        try {
          const options: NotificationOptions = {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `notif-${Date.now()}-${Math.random()}`, // Unique tag to prevent deduplication
            requireInteraction: true, // Keep notification visible
            dir: 'ltr',
            silent: false, // Enable system notification sound
            data: {
              timestamp: new Date().toISOString(),
              type: isAlarm ? 'alarm' : 'reminder',
            },
          };

          // Show notification via Notification API
          const notification = new Notification(title, options);
          console.log('✅ Notification object created');
          
          // Play loud notification sound
          playNotificationSound();
          
          // Add click handler to focus app
          notification.addEventListener('click', () => {
            console.log(`👆 Notification clicked: ${title}`);
            window.focus();
            notification.close();
          });
          
          // Add error handler
          notification.addEventListener('error', (err) => {
            console.error('❌ Notification error event:', err);
          });
          
          // Add close handler
          notification.addEventListener('close', () => {
            console.log(`❌ Notification closed: ${title}`);
          });
          
          // Add show handler
          notification.addEventListener('show', () => {
            console.log(`📺 Notification shown on screen: ${title}`);
          });
          
          console.log(`✅ ✅ ✅ NOTIFICATION SUCCESSFULLY SHOWN: "${title}" ✅ ✅ ✅`);
        } catch (notificationError) {
          console.error('❌ Error creating notification:', notificationError);
          // Fallback: play sound and alert
          playNotificationSound();
          alert(`${title}\n\n${body}`);
        }
      } 
      // Case 2: Permission not yet determined - REQUEST PERMISSION
      else if (Notification.permission === 'default') {
        console.log('⚠️ Permission not determined - requesting from user...');
        Notification.requestPermission().then(permission => {
          console.log(`📍 Permission request result: ${permission}`);
          setNotificationPermission(permission);
          
          if (permission === 'granted') {
            console.log('✅ Permission granted after request - showing notification...');
            try {
              const options: NotificationOptions = {
                body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `notif-${Date.now()}-${Math.random()}`,
                requireInteraction: true,
                dir: 'ltr',
                silent: false,
                data: {
                  timestamp: new Date().toISOString(),
                  type: isAlarm ? 'alarm' : 'reminder',
                },
              };
              
              const notification = new Notification(title, options);
              console.log('✅ Notification object created after permission request');
              playNotificationSound();
              
              notification.addEventListener('click', () => {
                console.log(`👆 Notification clicked: ${title}`);
                window.focus();
                notification.close();
              });
              
              notification.addEventListener('error', (err) => {
                console.error('❌ Notification error:', err);
              });
              
              console.log(`✅ ✅ ✅ NOTIFICATION SHOWN AFTER PERMISSION: "${title}" ✅ ✅ ✅`);
            } catch (err) {
              console.error('❌ Error showing notification after permission:', err);
              playNotificationSound();
              alert(`${title}\n\n${body}`);
            }
          } else {
            console.warn('❌ Notification permission denied by user');
            playNotificationSound();
            alert(`${title}\n\n${body}`);
          }
        }).catch(err => {
          console.error('❌ Error requesting notification permission:', err);
        });
      } 
      // Case 3: Permission explicitly denied
      else if (Notification.permission === 'denied') {
        console.warn('❌ Notifications are blocked by user - using alert and sound instead');
        playNotificationSound();
        alert(`${title}\n\n${body}`);
      }

    } catch (err) {
      console.error('❌ ❌ ❌ CRITICAL ERROR IN sendNotification:', err);
      // Last resort: play sound and alert
      try {
        const audio = new Audio('/prayer time audio/all prayer time azan.mp3');
        audio.volume = 1.0;
        audio.play().catch(() => {});
      } catch (e) {
        console.error('❌ Error playing fallback sound:', e);
      }
    }
  };

  // ========== REQUEST NOTIFICATION PERMISSION ==========
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // Register service worker for better notification support
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ Service Worker registered for notifications');
          })
          .catch(error => {
            console.log('Service Worker registration failed (this is optional):', error);
          });
      }
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
          console.log(`🔔 Notification permission: ${permission}`);
        });
      }
    }
  }, []);

  // ========== ALARM MANAGEMENT ==========
  const addAlarm = () => {
    if (!newAlarmName.trim() || !newAlarmTime) return;

    const [hour, minute] = newAlarmTime.split(':').map(Number);
    const newAlarm: CustomAlarm = {
      id: `alarm-${Date.now()}`,
      name: newAlarmName,
      hour,
      minute,
      enabled: true,
      sound: newAlarmSound,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Validate alarm before saving
    const validation = validateAlarm(newAlarm);
    if (!validation.valid) {
      sendNotification('❌ Invalid Alarm', validation.errors[0]);
      return;
    }

    // Update state
    const updatedAlarms = [...customAlarms, newAlarm];
    setCustomAlarms(updatedAlarms);
    
    // Auto-save to localStorage
    saveAlarms(updatedAlarms);
    
    // Reset form
    setNewAlarmName('');
    setNewAlarmTime('00:00');
    
    // Show success notification
    sendNotification('✅ Alarm Created', `${newAlarmName} at ${newAlarmTime}`);
    console.log(`✅ Alarm saved: ${newAlarmName}`);
  };

  const deleteAlarm = (id: string) => {
    const alarm = customAlarms.find(a => a.id === id);
    const updatedAlarms = customAlarms.filter(alarm => alarm.id !== id);
    
    // Update state
    setCustomAlarms(updatedAlarms);
    
    // Auto-save to localStorage
    saveAlarms(updatedAlarms);
    
    // Clean up refs
    triggeredAlarmsRef.current.delete(`alarm-${id}`);
    
    // Show notification
    sendNotification('🗑️ Alarm Deleted', alarm?.name || 'Unknown');
    console.log(`✅ Alarm deleted: ${alarm?.name}`);
  };

  const toggleAlarm = (id: string) => {
    const updatedAlarms = customAlarms.map(alarm => {
      if (alarm.id === id) {
        return { 
          ...alarm, 
          enabled: !alarm.enabled,
          updatedAt: Date.now(),
          createdAt: alarm.createdAt || Date.now(),
        };
      }
      return {
        ...alarm,
        createdAt: alarm.createdAt || Date.now(),
      };
    });
    
    // Update state
    setCustomAlarms(updatedAlarms);
    
    // Auto-save to localStorage
    saveAlarms(updatedAlarms);
    
    // Show notification
    const alarm = updatedAlarms.find(a => a.id === id);
    const status = alarm?.enabled ? '🔔 Enabled' : '🔕 Disabled';
    sendNotification(status, alarm?.name || 'Unknown');
    console.log(`✅ Alarm toggled: ${alarm?.name} - ${status}`);
  };

  const testAlarm = (id: string) => {
    const alarm = customAlarms.find(a => a.id === id);
    if (alarm) {
      playAudio(alarm.sound, alarm.name);
      sendNotification('⏰ Test Alarm', alarm.name);
    }
  };

  // ========== REMINDER MANAGEMENT ==========
  const updateReminder = (prayer: string, minutes: number) => {
    const newReminders = new Map(reminders);
    newReminders.set(prayer, Math.max(0, minutes));
    setReminders(newReminders);
    
    // Auto-save to localStorage
    const remindersObj = Object.fromEntries(newReminders);
    saveReminderSettings(remindersObj);
    
    console.log(`✅ Reminder updated: ${prayer} - ${minutes} min`);
  };

  // ========== LOAD STORED AUDIO FILES FROM INDEXEDDB ==========
  const loadStoredAudioFiles = async () => {
    try {
      setLoadingAudio(true);
      const metadata = await getAllAudioMetadata();
      
      if (metadata && metadata.length > 0) {
        const audioList = await Promise.all(
          metadata.map(async (meta) => {
            try {
              const url = await getAudioFileURL(meta.id);
              return { id: meta.id, name: meta.name, url };
            } catch (err) {
              console.error(`Failed to get URL for ${meta.name}:`, err);
              return null;
            }
          })
        );
        
        const validAudio = audioList.filter(a => a !== null) as { id: string; name: string; url: string }[];
        setUploadedAudio(validAudio);
        console.log(`✅ Loaded ${validAudio.length} audio files from IndexedDB`);
      }
    } catch (error) {
      console.error('Error loading audio files:', error);
    } finally {
      setLoadingAudio(false);
    }
  };

  // ========== HANDLE AUDIO FILE UPLOAD TO INDEXEDDB ==========
  const handleAudioUpload = async (file: File) => {
    try {
      setAudioUploadError(null);
      setLoadingAudio(true);
      
      console.log(`📁 Upload attempt: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)}KB)`);
      
      // Save to IndexedDB - returns AudioMetadata with id
      const metadata = await saveAudioFile(file);
      
      if (metadata && metadata.id) {
        // Get URL for the stored file
        const url = await getAudioFileURL(metadata.id);
        
        if (url) {
          // Update UI with new file
          setUploadedAudio(prev => [...prev, { id: metadata.id, name: metadata.name, url }]);
          setCustomAudioFile(file);
          
          sendNotification('✅ MP3 Uploaded', `${metadata.name} saved successfully (${(metadata.size / 1024).toFixed(2)}KB)`);
          console.log(`✅ Audio file uploaded: ${metadata.name} (ID: ${metadata.id})`);
        } else {
          throw new Error('Could not retrieve uploaded file URL');
        }
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to upload MP3 file';
      setAudioUploadError(errMsg);
      sendNotification('❌ Upload Failed', errMsg);
      console.error('❌ Error uploading audio:', error);
    } finally {
      setLoadingAudio(false);
    }
  };

  // ========== DELETE AUDIO FILE FROM INDEXEDDB ==========
  const handleDeleteAudio = async (id: string, name: string) => {
    try {
      await deleteAudioFile(id);
      setUploadedAudio(prev => prev.filter(a => a.id !== id));
      sendNotification('✅ Audio Deleted', `${name} has been removed`);
      console.log(`✅ Audio deleted: ${name}`);
    } catch (error) {
      sendNotification('❌ Delete Failed', 'Could not delete audio file');
      console.error('Error deleting audio:', error);
    }
  };

  // ========== PRAYER TRACKING MANAGEMENT ==========
  const handleMarkPrayerCompleted = (prayer: string) => {
    markPrayerCompleted(prayer);
    const updated = getTodayPrayerRecord();
    setTodayPrayerRecord(updated);
    const stats = getComprehensiveStats();
    setComprehensiveStats(stats);
    const stats2 = loadPrayerStats();
    setPrayerStats(stats2);
    setWeeklyData(getWeeklySummary());
    sendNotification('✅ Prayer Completed', `${prayer} marked as completed`);
    console.log(`✅ Prayer marked: ${prayer}`);
  };

  const handleMarkPrayerMissed = (prayer: string) => {
    markPrayerMissed(prayer);
    const updated = getTodayPrayerRecord();
    setTodayPrayerRecord(updated);
    const stats = getComprehensiveStats();
    setComprehensiveStats(stats);
    const stats2 = loadPrayerStats();
    setPrayerStats(stats2);
    setWeeklyData(getWeeklySummary());
    sendNotification('⏭️ Prayer Marked Missed', `${prayer} marked as missed`);
    console.log(`⏭️ Prayer missed: ${prayer}`);
  };

  const handleUndoPrayer = (prayer: string) => {
    undoPrayerStatus(prayer);
    const updated = getTodayPrayerRecord();
    setTodayPrayerRecord(updated);
    const stats = getComprehensiveStats();
    setComprehensiveStats(stats);
    const stats2 = loadPrayerStats();
    setPrayerStats(stats2);
    setWeeklyData(getWeeklySummary());
    sendNotification('↩️ Prayer Status Undone', `${prayer} reset to pending`);
    console.log(`↩️ Prayer undone: ${prayer}`);
  };

  // ========== RENDERING ==========
  if (error) {
    return (
      <div style={{ padding: '2rem', background: '#f44336', color: 'white', borderRadius: '8px' }}>
        <h2>⚠️ Error Loading Prayer Times</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!prayerTimes?.data?.timings) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.1rem' }}>
        Loading prayer times...
      </div>
    );
  }

  const timings = prayerTimes.data.timings;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      background: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
      color: theme === 'light' ? '#000' : '#fff',
      borderRadius: '12px',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
      {/* HEADER */}
      <header style={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>🕌 Prayer Times</h1>
        <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>📍 {location}</p>
        {hijriDate && (
          <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
            📅 {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} AH
          </p>
        )}
        
        {/* Last Triggered Alarm Display */}
        {lastTriggeredAlarm && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(255, 152, 0, 0.3)',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '2px solid #ff9800',
            animation: 'pulse 1s infinite',
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.75rem' }}>
              🔔 ALARM ACTIVE: {lastTriggeredAlarm.name}
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Triggered at {lastTriggeredAlarm.time}
            </div>
            
            {/* Alarm Control Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={stopAlarm}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                }}
              >
                ⏹️ Stop Alarm
              </button>
              
              {/* Snooze Options */}
              <button
                onClick={() => snoozeAlarm(5)}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                }}
              >
                😴 Snooze 5 min
              </button>
              
              <button
                onClick={() => snoozeAlarm(10)}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                }}
              >
                😴 Snooze 10 min
              </button>

              <button
                onClick={() => snoozeAlarm(15)}
                style={{
                  background: '#9c27b0',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                }}
              >
                😴 Snooze 15 min
              </button>
            </div>
          </div>
        )}

        {nextPrayer && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>⏱️ Next Prayer</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {nextPrayer.name} in {nextPrayer.minutesLeft} minutes
            </div>
          </div>
        )}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem' }}>
            {isOnline ? '✅ Online' : '❌ Offline'}
          </span>
          <button
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              saveThemePreference(newTheme);
              console.log(`✅ Theme changed to ${newTheme}`);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'} Theme
          </button>
        </div>
      </header>

      {/* PRAYER TIMES CARDS */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>⏰ Prayer Times Today</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, idx) => {
            const time = timings[prayer as keyof typeof timings];
            const isNext = nextPrayer?.name === prayer;
            return (
              <div
                key={prayer}
                style={{
                  padding: '1.5rem',
                  background: isNext
                    ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
                    : theme === 'light'
                      ? '#fff'
                      : '#2a2a2a',
                  color: isNext ? 'white' : theme === 'light' ? '#000' : '#fff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: isNext ? '2px solid #2e7d32' : `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
                  boxShadow: isNext ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none',
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {idx + 1}. {prayer}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {time}
                </div>
                {isNext && (
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
                    ✨ Next Prayer
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* REMINDERS SECTION */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>🔔 Prayer Reminders</h2>
        
        {/* Reminders Controls */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Enable/Disable Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontWeight: 'bold' }}>
                {remindersEnabled ? '✅ Reminders Enabled' : '❌ Reminders Disabled'}
              </span>
            </label>
            
            {/* Notification Permission Status */}
            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              background: notificationPermission === 'granted' 
                ? '#4caf50' 
                : notificationPermission === 'denied'
                ? '#f44336'
                : '#ff9800',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 'bold',
            }}>
              {notificationPermission === 'granted' && '✅ Notifications Enabled'}
              {notificationPermission === 'denied' && '❌ Notifications Blocked'}
              {notificationPermission === 'default' && '⚠️ Notifications Need Permission'}
            </div>
          </div>
          
          {/* Request Permission Button */}
          {notificationPermission !== 'granted' && (
            <button
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission().then(permission => {
                    setNotificationPermission(permission);
                    if (permission === 'granted') {
                      sendNotification('✅ Notifications Enabled', 'You will now receive prayer reminders');
                    }
                  });
                }
              }}
              style={{
                background: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
              }}
            >
              🔔 Enable Notifications
            </button>
          )}
          
          {/* Test Notification Button */}
          {notificationPermission === 'granted' && (
            <>
              <button
                onClick={() => {
                  console.log('🧪 TEST NOTIFICATION BUTTON CLICKED');
                  sendNotification('🧪 Test Notification', 'This is a test prayer reminder notification');
                }}
                style={{
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                }}
              >
                🧪 Test Notification
              </button>
              
              {/* Direct notification test button - bypasses sendNotification function */}
              <button
                onClick={() => {
                  console.log('🚀 DIRECT NOTIFICATION TEST - No sendNotification function');
                  try {
                    const directNotif = new Notification('🚀 DIRECT TEST', {
                      body: 'This is a DIRECT notification test - bypassing sendNotification',
                      icon: '/favicon.ico',
                      badge: '/favicon.ico',
                      requireInteraction: true,
                      tag: `direct-test-${Date.now()}`,
                    });
                    
                    directNotif.addEventListener('show', () => {
                      console.log('✅ DIRECT NOTIFICATION SHOWED ON SCREEN!');
                    });
                    
                    directNotif.addEventListener('click', () => {
                      console.log('👆 DIRECT NOTIFICATION CLICKED');
                      directNotif.close();
                    });
                    
                    console.log('✅ Direct notification object created');
                    
                    // Play sound
                    const audio = new Audio('/prayer time audio/all prayer time azan.mp3');
                    audio.volume = 1.0;
                    audio.play();
                  } catch (err) {
                    console.error('❌ Direct notification error:', err);
                    alert(`Direct test failed: ${err.message}`);
                  }
                }}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  marginLeft: '0.5rem',
                }}
              >
                🚀 Direct Test
              </button>
            </>
          )}
        </div>
        
        {/* Reminder Settings */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
        }}>
          {Array.from(reminders.entries()).map(([prayer, minutes]) => (
            <div key={prayer} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1rem',
              borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>{prayer}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => updateReminder(prayer, parseInt(e.target.value) || 0)}
                  disabled={!remindersEnabled}
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: `1px solid ${theme === 'light' ? '#ccc' : '#666'}`,
                    background: theme === 'light' ? '#fff' : '#1a1a1a',
                    color: theme === 'light' ? '#000' : '#fff',
                    opacity: remindersEnabled ? 1 : 0.6,
                    cursor: remindersEnabled ? 'text' : 'not-allowed',
                  }}
                />
                <span style={{ fontSize: '0.9rem', color: '#666', minWidth: '120px' }}>minutes before</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOM ALARMS SECTION */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>⏰ Custom Alarms ({customAlarms.length})</h2>
        
        {/* Reset Button */}
        <button
          onClick={() => {
            triggeredAlarmsRef.current.clear();
            setLastTriggeredAlarm(null);
            console.log('✅ Reset all triggered alarms - you can now test the same alarm again');
          }}
          style={{
            background: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          🔄 Reset Alarms (for testing same alarm again)
        </button>
        
        {/* Add New Alarm */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>➕ Add New Alarm</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}>
            <input
              type="text"
              placeholder="Alarm name (e.g., Tahajjud)"
              value={newAlarmName}
              onChange={(e) => setNewAlarmName(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: `1px solid ${theme === 'light' ? '#ccc' : '#666'}`,
                background: theme === 'light' ? '#fff' : '#1a1a1a',
                color: theme === 'light' ? '#000' : '#fff',
              }}
            />
            <input
              type="time"
              value={newAlarmTime}
              onChange={(e) => setNewAlarmTime(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: `1px solid ${theme === 'light' ? '#ccc' : '#666'}`,
                background: theme === 'light' ? '#fff' : '#1a1a1a',
                color: theme === 'light' ? '#000' : '#fff',
              }}
            />
            <select
              value={newAlarmSound}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'upload-custom') {
                  // Trigger file input
                  const fileInput = document.getElementById('alarm-audio-upload') as HTMLInputElement;
                  fileInput?.click();
                } else {
                  setNewAlarmSound(value as any);
                }
              }}
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: `1px solid ${theme === 'light' ? '#ccc' : '#666'}`,
                background: theme === 'light' ? '#fff' : '#1a1a1a',
                color: theme === 'light' ? '#000' : '#fff',
              }}
            >
              <option value="fajr-azan">🕌 Fajr Azan</option>
              <option value="all-azan">📢 All Prayer Times Azan</option>
              <option value="eid-takbeer">🎉 Eid Takbeer</option>
              <option value="eid-adha">🐑 Eid ul-Adha Takbeer</option>
              <option value="hajj-takbeer">🕌 Hajj Takbeer</option>
              <option value="islamic-lori">🎵 Islamic Lori</option>
              <option value="zil-hajj">🌙 Zil Hajj Takbeer</option>
              <option value="bell">🔔 Bell (Synthetic)</option>
              {uploadedAudio.length > 0 && (
                <optgroup label="📤 Custom Audio Files">
                  {uploadedAudio.map((audio) => (
                    <option key={audio.id} value={audio.id}>
                      📤 {audio.name}
                    </option>
                  ))}
                </optgroup>
              )}
              <option value="upload-custom" style={{ fontWeight: 'bold' }}>
                ➕ Upload New MP3...
              </option>
            </select>
            {/* Hidden file input - triggered from dropdown */}
            <input
              id="alarm-audio-upload"
              type="file"
              accept=".mp3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log(`📁 File selected: ${file.name}`);
                  handleAudioUpload(file);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              disabled={loadingAudio}
              style={{ display: 'none' }}
            />
            <button
              onClick={addAlarm}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ✅ Add Alarm
            </button>
          </div>
          {audioUploadError && (
            <div style={{ 
              background: '#f44336', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginTop: '0.75rem',
              fontSize: '0.9rem',
              border: '2px solid #d32f2f'
            }}>
              ❌ {audioUploadError}
            </div>
          )}
          {loadingAudio && (
            <div style={{ 
              background: '#2196f3', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginTop: '0.75rem',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}>
              ⏳ Uploading MP3 file...
            </div>
          )}
        </div>

        {/* List Alarms */}
        {customAlarms.length > 0 ? (
          <div style={{
            background: theme === 'light' ? '#fff' : '#2a2a2a',
            padding: '1.5rem',
            borderRadius: '8px',
            border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
          }}>
            {customAlarms.map((alarm) => (
              <div
                key={alarm.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto auto auto',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{alarm.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {alarm.hour.toString().padStart(2, '0')}:{alarm.minute.toString().padStart(2, '0')}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  {alarm.sound === 'fajr-azan' && '🕌 Fajr Azan'}
                  {alarm.sound === 'all-azan' && '📢 All Azan'}
                  {alarm.sound === 'eid-takbeer' && '🎉 Eid Takbeer'}
                  {alarm.sound === 'eid-adha' && '🐑 Eid Adha'}
                  {alarm.sound === 'hajj-takbeer' && '🕌 Hajj Takbeer'}
                  {alarm.sound === 'islamic-lori' && '🎵 Islamic Lori'}
                  {alarm.sound === 'zil-hajj' && '🌙 Zil Hajj'}
                  {alarm.sound === 'bell' && '🔔 Bell'}
                  {alarm.sound === 'custom' && '📤 Custom'}
                  {uploadedAudio.find(a => a.id === alarm.sound) && (
                    <>📤 {uploadedAudio.find(a => a.id === alarm.sound)?.name}</>
                  )}
                </div>
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  style={{
                    background: alarm.enabled ? '#4caf50' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {alarm.enabled ? '✅ On' : '❌ Off'}
                </button>
                <button
                  onClick={() => testAlarm(alarm.id)}
                  style={{
                    background: '#ff9800',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  🧪 Test
                </button>
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: theme === 'light' ? '#f5f5f5' : '#333',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#666',
          }}>
            No custom alarms yet. Add one to get started!
          </div>
        )}
      </section>

      {/* QIBLA SECTION */}
      {qiblaInfo && (
        <section style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowQibla(!showQibla)}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            {showQibla ? '✕' : '📍'} Qibla Direction
          </button>

          {showQibla && (
            <div style={{
              background: theme === 'light' ? '#fff' : '#2a2a2a',
              padding: '1.5rem',
              borderRadius: '8px',
              border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 Qibla Azimuth</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {qiblaInfo.azimuth.toFixed(1)}°
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{qiblaInfo.description}</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>🧭 Magnetic Declination</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {qiblaInfo.magneticDeclination.toFixed(1)}°
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>True North Offset</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>🧭 True North Direction</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {qiblaInfo.trueNorth.toFixed(1)}°
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Magnetic Adjusted</div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* PRAYER STATISTICS & TRACKING */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>📊 Prayer Tracking</h2>
          <button
            onClick={() => setShowPrayerTracking(!showPrayerTracking)}
            style={{
              padding: '0.5rem 1rem',
              background: showPrayerTracking ? '#2196f3' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}>
            {showPrayerTracking ? '▼ Hide Details' : '▶ Show Details'}
          </button>
        </div>

        {/* Today's Prayer Tracking */}
        {showPrayerTracking && (
          <div style={{
            background: theme === 'light' ? '#f9f9f9' : '#333',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Today's Prayers - {getTodayDate()}</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
                const status = todayPrayerRecord[prayer as keyof typeof todayPrayerRecord] || 'pending';
                const getStatusColor = (s: string) => {
                  switch (s) {
                    case 'completed': return '#4caf50';
                    case 'missed': return '#f44336';
                    case 'pending': return '#ff9800';
                    default: return '#666';
                  }
                };
                const getStatusEmoji = (s: string) => {
                  switch (s) {
                    case 'completed': return '✅';
                    case 'missed': return '⏭️';
                    case 'pending': return '⏳';
                    default: return '❓';
                  }
                };

                return (
                  <div
                    key={prayer}
                    style={{
                      background: getStatusColor(status),
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {getStatusEmoji(status)} {prayer}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.8rem', opacity: 0.9 }}>
                      {status === 'completed'
                        ? 'Completed'
                        : status === 'missed'
                          ? 'Missed'
                          : 'Pending'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      {status !== 'completed' && (
                        <button
                          onClick={() => handleMarkPrayerCompleted(prayer)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                          }}>
                          ✅ Mark Done
                        </button>
                      )}
                      {status !== 'missed' && (
                        <button
                          onClick={() => handleMarkPrayerMissed(prayer)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                          }}>
                          ⏭️ Mark Missed
                        </button>
                      )}
                      {status !== 'pending' && (
                        <button
                          onClick={() => handleUndoPrayer(prayer)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.5)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}>
                          ↩️ Undo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Statistics Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setShowPrayerTracking(!showPrayerTracking)}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Today</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{prayerStats.today}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Prayers Completed</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>🔥 Current Streak</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{prayerStats.streak}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Days Completed</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>This Month</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{prayerStats.thisMonth}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Prayers Completed</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>All Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{prayerStats.total}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Prayers Completed</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '1.5rem',
        background: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#666',
      }}>
        <p style={{ margin: '0.5rem 0' }}>
          🕋 Calculation Method: {prayerTimes.data.meta?.method?.name || 'Umm Al-Qura (Method 4)'}
        </p>
        {prayerTimes.data.meta?.timezone && (
          <p style={{ margin: '0.5rem 0' }}>⏰ Timezone: {prayerTimes.data.meta.timezone}</p>
        )}
        <p style={{ margin: '0.5rem 0', fontSize: '0.85rem' }}>
          Last updated: {currentTime.toLocaleTimeString()}
        </p>
      </footer>
    </div>
  );
}

