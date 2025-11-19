'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerTimesResponse, Prayer } from './types';
import styles from './PrayerTime.module.css';

// Import utilities
import {
  calculateQiblaDirection,
  gregorianToHijri,
  applyHighLatitudeAdjustment,
} from './utils/prayerCalculations';

import {
  initIndexedDB,
  registerServiceWorker,
  cachePrayerTimes,
  setupOnlineOfflineListeners,
} from './utils/offlineCache';

import {
  CloudSyncManager,
  PrayerTracker,
  sendNotification,
} from './utils/syncAndTracking';

import {
  FEATURE_FLAGS,
  HIGH_LATITUDE_THRESHOLD,
  PRAYERS,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_MADHAB,
} from './config';

interface PrayerTimePageProps {
  initialPrayerTimes: PrayerTimesResponse | null;
  initialError: string | null;
  initialCoords: { lat: number; lon: number };
  initialLocation?: string;
}

export default function PrayerTimePageRedesigned({
  initialPrayerTimes,
  initialError,
  initialCoords,
  initialLocation = 'Mecca, Saudi Arabia',
}: PrayerTimePageProps) {
  // ========== CORE STATE ==========
  const [prayerTimes, setPrayerTimes] = useState(initialPrayerTimes);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ prayer: Prayer; time: Date } | null>(null);
  const [location, setLocation] = useState(initialLocation);

  // ========== REMINDERS & ALARMS STATE ==========
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [reminders, setReminders] = useState<Map<string, number>>(new Map([
    ['Fajr', 10],
    ['Dhuhr', 5],
    ['Asr', 5],
    ['Maghrib', 2],
    ['Isha', 5],
  ]));
  const [customAlarms, setCustomAlarms] = useState<Array<{
    id: string;
    name: string;
    time: string;
    enabled: boolean;
    sound: 'adhan' | 'bell' | 'custom';
  }>>([]);

  // ========== NEW FEATURES STATE ==========
  const [qiblaDirection, setQiblaDirection] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [calculationMethod, setCalculationMethod] = useState(DEFAULT_CALCULATION_METHOD);
  const [madhab, setMadhab] = useState(DEFAULT_MADHAB);
  const [highLatitudeMethod, setHighLatitudeMethod] = useState<string>('midnight');
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOnline, setIsOnline] = useState(true);

  // ========== UI STATE ==========
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showQiblaMap, setShowQiblaMap] = useState(false);
  const [showPrayerStats, setShowPrayerStats] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // ========== REFS ==========
  const audioRef = useRef<HTMLAudioElement>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const syncManagerRef = useRef<CloudSyncManager | null>(null);
  const prayerTrackerRef = useRef<PrayerTracker | null>(null);
  const triggeredNotificationsRef = useRef<Set<string>>(new Set());

  // ========== INITIALIZATION ==========
  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize features on mount
  useEffect(() => {
    const initializeFeatures = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Offline mode
        if (FEATURE_FLAGS.enableOfflineMode) {
          await initIndexedDB();
          await registerServiceWorker();
          setOfflineModeEnabled(true);
        }

        // Prayer tracker
        if (FEATURE_FLAGS.enablePrayerTracking) {
          const tracker = new PrayerTracker();
          prayerTrackerRef.current = tracker;
        }

        // Cloud sync
        if (FEATURE_FLAGS.enableCloudSync) {
          const syncManager = new CloudSyncManager('user-default', 'firebase');
          syncManagerRef.current = syncManager;
          syncManager.setAutoSync(true, 300000);
          setCloudSyncEnabled(true);
        }

        // Online/offline listeners
        setupOnlineOfflineListeners(
          () => setIsOnline(true),
          () => setIsOnline(false)
        );

        // Theme
        const savedTheme = localStorage.getItem('prayerPageTheme') as 'light' | 'dark' | null;
        if (savedTheme) {
          setTheme(savedTheme);
          applyTheme(savedTheme);
        } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
          applyTheme('dark');
        }
      } catch (error) {
        console.error('Feature initialization error:', error);
      }
    };

    initializeFeatures();
  }, []);

  // ========== CALCULATE QIBLA AND HIJRI ==========
  useEffect(() => {
    if (!prayerTimes?.data?.meta) return;

    const { latitude, longitude } = prayerTimes.data.meta;

    // Qibla
    if (FEATURE_FLAGS.enableQiblaCompass) {
      try {
        const qibla = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(qibla);
      } catch (error) {
        console.error('Qibla calculation error:', error);
      }
    }

    // Hijri date
    if (FEATURE_FLAGS.enableHijriDate) {
      try {
        const today = new Date();
        const hijri = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
        setHijriDate(hijri);
      } catch (error) {
        console.error('Hijri calculation error:', error);
      }
    }
  }, [prayerTimes?.data?.meta]);

  // ========== CALCULATE NEXT PRAYER ==========
  useEffect(() => {
    if (!prayerTimes?.data?.timings) return;

    const now = currentTime;
    const today = new Date().toISOString().split('T')[0];
    let nextPrayerFound: { prayer: Prayer; time: Date } | null = null;

    const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const key of prayerKeys) {
      const timing = prayerTimes.data.timings[key];
      if (!timing) continue;

      const [hours, minutes] = timing.split(':');
      const prayerTime = new Date(`${today}T${hours}:${minutes}:00`);

      if (prayerTime > now) {
        const prayer = PRAYERS.find(p => p.key === key);
        if (prayer) {
          nextPrayerFound = { prayer, time: prayerTime };
          break;
        }
      }
    }

    // If no prayer found today, use Fajr tomorrow
    if (!nextPrayerFound && prayerTimes.data.timings.Fajr) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      const [hours, minutes] = prayerTimes.data.timings.Fajr.split(':');
      const fajrTime = new Date(`${tomorrowDate}T${hours}:${minutes}:00`);
      const fajr = PRAYERS.find(p => p.key === 'Fajr');
      if (fajr) {
        nextPrayerFound = { prayer: fajr, time: fajrTime };
      }
    }

    setNextPrayer(nextPrayerFound);
  }, [prayerTimes, currentTime]);

  // ========== NOTIFICATION & ALARM SYSTEM ==========
  useEffect(() => {
    if (!prayerTimes?.data?.timings || !audioEnabled) return;

    const now = currentTime;
    const today = now.toISOString().split('T')[0];
    const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // Check reminders
    prayerKeys.forEach(key => {
      const timing = prayerTimes.data.timings[key];
      if (!timing) return;

      const [hours, minutes] = timing.split(':');
      const prayerTime = new Date(`${today}T${hours}:${minutes}:00`);
      const reminderMinutes = reminders.get(key) || 5;
      const reminderTime = new Date(prayerTime.getTime() - reminderMinutes * 60000);

      // Check if reminder should trigger (within 2 second window)
      const notificationId = `reminder-${key}-${today}`;
      if (
        now >= reminderTime &&
        now < new Date(reminderTime.getTime() + 2000) &&
        !triggeredNotificationsRef.current.has(notificationId)
      ) {
        triggeredNotificationsRef.current.add(notificationId);
        triggerReminder(key, reminderMinutes);
      }

      // Check for prayer time itself
      const prayerNotificationId = `prayer-${key}-${today}`;
      if (
        now >= prayerTime &&
        now < new Date(prayerTime.getTime() + 2000) &&
        !triggeredNotificationsRef.current.has(prayerNotificationId)
      ) {
        triggeredNotificationsRef.current.add(prayerNotificationId);
        triggerPrayerNotification(key);
      }
    });

    // Check custom alarms
    customAlarms.forEach(alarm => {
      if (!alarm.enabled) return;

      const [alarmHours, alarmMinutes] = alarm.time.split(':');
      const alarmTime = new Date(`${today}T${alarmHours}:${alarmMinutes}:00`);
      const alarmNotificationId = `alarm-${alarm.id}-${today}`;

      if (
        now >= alarmTime &&
        now < new Date(alarmTime.getTime() + 2000) &&
        !triggeredNotificationsRef.current.has(alarmNotificationId)
      ) {
        triggeredNotificationsRef.current.add(alarmNotificationId);
        triggerCustomAlarm(alarm);
      }
    });

    // Reset notifications at midnight
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      triggeredNotificationsRef.current.clear();
    }
  }, [currentTime, prayerTimes, audioEnabled, reminders, customAlarms]);

  // ========== TRIGGER FUNCTIONS ==========
  const triggerReminder = useCallback((prayer: string, minutesBefore: number) => {
    if (!audioRef.current) return;

    // Play audio
    playAdhan();

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `${prayer} Prayer Reminder`;
      const body = `Prayer in ${minutesBefore} minute${minutesBefore !== 1 ? 's' : ''}`;
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
        tag: `prayer-reminder-${prayer}`,
      });
    }

    // Track prayer
    if (prayerTrackerRef.current) {
      // Log reminder was sent
      console.log(`✅ Reminder sent for ${prayer}`);
    }
  }, []);

  const triggerPrayerNotification = useCallback((prayer: string) => {
    if (!audioRef.current) return;

    // Play adhan
    playAdhan();

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🕌 ${prayer} Prayer Time`, {
        body: 'It is time to pray',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
        tag: `prayer-${prayer}`,
      });
    }
  }, []);

  const triggerCustomAlarm = useCallback((alarm: any) => {
    if (!audioRef.current) return;

    // Play sound based on type
    if (alarm.sound === 'adhan') {
      playAdhan();
    } else if (alarm.sound === 'bell') {
      playBell();
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alarm.name, {
        body: `Alarm at ${alarm.time}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
        tag: `alarm-${alarm.id}`,
      });
    }
  }, []);

  const playAdhan = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.src = '/prayer time audio/fajr azan.mp3';
    audioRef.current.volume = volume;
    audioRef.current.play().catch(error => console.error('Playback error:', error));
  }, [volume]);

  const playBell = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.src = '/prayer time audio/all prayer time azan.mp3';
    audioRef.current.volume = volume;
    audioRef.current.play().catch(error => console.error('Playback error:', error));
  }, [volume]);

  const testAudio = useCallback(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    playAdhan();
  }, [playAdhan]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('prayerPageTheme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const getCountdown = (prayerTime: Date): string => {
    const diff = prayerTime.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Now';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=4`
      );

      if (!response.ok) throw new Error('Failed to fetch prayer times');

      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data);
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  if (error && !prayerTimes) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#d32f2f', marginBottom: '1rem', fontSize: '1.1rem' }}>
          ⚠️ {error}
        </div>
        <button
          onClick={handleGeolocation}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Getting Location...' : '📍 Use My Location'}
        </button>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        preload="auto"
        controlsList="nodownload"
      />

      {/* ========== HEADER ==========*/}
      <header style={{
        background: `linear-gradient(135deg, ${theme === 'light' ? '#1976d2' : '#0d47a1'} 0%, ${theme === 'light' ? '#1565c0' : '#0d3c9e'} 100%)`,
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🕌 Prayer Times</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isOnline ? '#4caf50' : '#ff9800',
              display: 'inline-block',
            }} title={isOnline ? 'Online' : 'Offline'} />
          </div>
        </div>

        {/* Location Info */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>📍 {location}</p>
          {hijriDate && (
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', opacity: 0.9 }}>
              📅 {hijriDate.day}/{hijriDate.month.number}/{hijriDate.year} (Hijri)
            </p>
          )}
        </div>

        {/* Next Prayer Alert */}
        {nextPrayer && (
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ⏱️ Next: {nextPrayer.prayer.name}
            </div>
            <div style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>
              {getCountdown(nextPrayer.time)}
            </div>
          </div>
        )}
      </header>

      {/* ========== PRAYER TIMES GRID ==========*/}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: theme === 'light' ? '#1976d2' : '#64b5f6' }}>
          📿 Prayer Times Today
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {PRAYERS.filter(p => p.key !== 'Sunrise').map(prayer => {
            const prayerTime = prayerTimes.data.timings[prayer.key];
            const isActive = nextPrayer?.prayer.key === prayer.key;

            return (
              <div
                key={prayer.key}
                onClick={() => setSelectedPrayer(selectedPrayer === prayer.key ? null : prayer.key)}
                style={{
                  padding: '1.5rem',
                  background: isActive
                    ? `linear-gradient(135deg, #4caf50 0%, #388e3c 100%)`
                    : theme === 'light'
                    ? '#f5f5f5'
                    : '#263238',
                  border: isActive ? '2px solid #2e7d32' : `1px solid ${theme === 'light' ? '#e0e0e0' : '#455a64'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: isActive ? 'white' : theme === 'light' ? '#000' : '#fff',
                  boxShadow: isActive ? '0 6px 16px rgba(76, 175, 80, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {prayer.arabicIndex}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                  {prayer.name}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {prayerTime}
                </div>
                {isActive && nextPrayer && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
                    in {getCountdown(nextPrayer.time)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== CONTROL PANEL ==========*/}
      <section style={{
        background: theme === 'light' ? '#fff' : '#37474f',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>⚙️ Control Panel</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            style={{
              padding: '1rem',
              background: audioEnabled ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' : '#e0e0e0',
              color: audioEnabled ? 'white' : '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s',
            }}
          >
            {audioEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
          </button>

          {/* Test Audio */}
          <button
            onClick={testAudio}
            style={{
              padding: '1rem',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            🧪 Test Audio
          </button>

          {/* Qibla Map */}
          {FEATURE_FLAGS.enableQiblaCompass && (
            <button
              onClick={() => setShowQiblaMap(!showQiblaMap)}
              style={{
                padding: '1rem',
                background: showQiblaMap ? '#ff9800' : '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {showQiblaMap ? '✕' : '📍'} Qibla Direction
            </button>
          )}

          {/* Prayer Stats */}
          {FEATURE_FLAGS.enablePrayerTracking && (
            <button
              onClick={() => setShowPrayerStats(!showPrayerStats)}
              style={{
                padding: '1rem',
                background: showPrayerStats ? '#9c27b0' : '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {showPrayerStats ? '✕' : '📊'} Prayer Stats
            </button>
          )}

          {/* Advanced Settings */}
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            style={{
              padding: '1rem',
              background: showAdvancedSettings ? '#f57c00' : '#757575',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {showAdvancedSettings ? '✕' : '⚙️'} Advanced
          </button>

          {/* Geolocation */}
          <button
            onClick={handleGeolocation}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#e91e63',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⏳ Detecting...' : '📍 My Location'}
          </button>
        </div>

        {/* Volume Control */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${theme === 'light' ? '#e0e0e0' : '#546e7a'}` }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            🔊 Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </section>

      {/* ========== REMINDER SETTINGS ==========*/}
      <section style={{
        background: theme === 'light' ? '#f5f5f5' : '#455a64',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>🔔 Prayer Reminders</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}>
          {Array.from(reminders.entries()).map(([prayer, minutes]) => (
            <div
              key={prayer}
              style={{
                padding: '1rem',
                background: theme === 'light' ? '#fff' : '#37474f',
                borderRadius: '8px',
                border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#546e7a'}`,
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontWeight: 'bold' }}>{prayer}</span>
              </label>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {minutes} minute{minutes !== 1 ? 's' : ''} before
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={minutes}
                onChange={(e) => {
                  const newReminders = new Map(reminders);
                  newReminders.set(prayer, parseInt(e.target.value));
                  setReminders(newReminders);
                }}
                style={{ width: '100%', marginTop: '0.5rem', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ========== CUSTOM ALARMS ==========*/}
      <section style={{
        background: theme === 'light' ? '#fff' : '#37474f',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#546e7a'}`,
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>⏰ Custom Alarms ({customAlarms.length})</h3>
        
        {/* Add New Alarm */}
        <div style={{
          padding: '1rem',
          background: theme === 'light' ? '#f5f5f5' : '#455a64',
          borderRadius: '8px',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <input
              type="text"
              placeholder="Alarm name"
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `1px solid ${theme === 'light' ? '#ccc' : '#546e7a'}`,
                fontSize: '1rem',
              }}
            />
            <input
              type="time"
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `1px solid ${theme === 'light' ? '#ccc' : '#546e7a'}`,
                fontSize: '1rem',
              }}
            />
            <select
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `1px solid ${theme === 'light' ? '#ccc' : '#546e7a'}`,
                fontSize: '1rem',
              }}
            >
              <option value="adhan">🎵 Adhan</option>
              <option value="bell">🔔 Bell</option>
              <option value="custom">🎵 Custom</option>
            </select>
          </div>
          <button
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            ✅ Add Alarm
          </button>
        </div>

        {/* Alarm List */}
        {customAlarms.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
          }}>
            {customAlarms.map(alarm => (
              <div
                key={alarm.id}
                style={{
                  padding: '1rem',
                  background: alarm.enabled ? '#e8f5e9' : '#f5f5f5',
                  border: `2px solid ${alarm.enabled ? '#4caf50' : '#ccc'}`,
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {alarm.name}
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#666' }}>
                  ⏰ {alarm.time}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: alarm.enabled ? '#4caf50' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    {alarm.enabled ? '✓' : '○'}
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    🧪 Test
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========== ADVANCED SETTINGS ==========*/}
      {showAdvancedSettings && (
        <section style={{
          background: 'linear-gradient(135deg, #ffd54f 0%, #ffb74d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          color: '#333',
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>⚙️ Advanced Settings</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* Calculation Method */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Prayer Calculation Method
              </label>
              <select
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(parseInt(e.target.value) as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '1rem',
                }}
              >
                <option value={4}>Umm Al-Qura (Mecca)</option>
                <option value={2}>ISNA (North America)</option>
                <option value={1}>Karachi</option>
                <option value={3}>Egypt</option>
              </select>
            </div>

            {/* Madhab */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Madhab School
              </label>
              <select
                value={madhab}
                onChange={(e) => setMadhab(parseInt(e.target.value) as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '1rem',
                }}
              >
                <option value={0}>Shafi'i</option>
                <option value={1}>Hanafi</option>
                <option value={2}>Maliki</option>
                <option value={3}>Hanbali</option>
              </select>
            </div>

            {/* High Latitude Method */}
            {Math.abs(initialCoords.lat) > HIGH_LATITUDE_THRESHOLD && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  High Latitude Adjustment
                </label>
                <select
                  value={highLatitudeMethod}
                  onChange={(e) => setHighLatitudeMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '1rem',
                  }}
                >
                  <option value="midnight">Midnight Method</option>
                  <option value="nearest-latitude">Nearest Latitude</option>
                  <option value="angle-based">Angle-Based</option>
                  <option value="fraction-of-night">Fraction of Night</option>
                </select>
              </div>
            )}
          </div>

          {/* Feature Status */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid rgba(0,0,0,0.1)',
          }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>📊 Feature Status</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {Object.entries(FEATURE_FLAGS).map(([key, enabled]) => (
                <div
                  key={key}
                  style={{
                    padding: '0.75rem',
                    background: enabled ? '#c8e6c9' : '#ffccbc',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                >
                  <strong>{key.replace(/enable|([A-Z])/g, '$1').trim()}:</strong> {enabled ? '✅' : '⚠️'}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== QIBLA MAP ==========*/}
      {showQiblaMap && qiblaDirection && (
        <section style={{
          background: theme === 'light' ? '#fff' : '#37474f',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#546e7a'}`,
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>📍 Qibla Direction</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              color: 'white',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Qibla Direction</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                {qiblaDirection.azimuth.toFixed(1)}°
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {qiblaDirection.description}
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
              color: 'white',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Magnetic Declination</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                {qiblaDirection.magneticDeclination?.toFixed(1) || 'N/A'}°
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                True North Offset
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Distance to Kaaba</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                {qiblaDirection.distanceToKaaba?.toFixed(0) || 'Calculating'}
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>kilometers</div>
            </div>
          </div>
        </section>
      )}

      {/* ========== PRAYER STATISTICS ==========*/}
      {showPrayerStats && FEATURE_FLAGS.enablePrayerTracking && (
        <section style={{
          background: theme === 'light' ? '#f5f5f5' : '#455a64',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>📊 Prayer Statistics</h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            Track your daily prayers and view statistics.
          </p>
          <div style={{
            padding: '1rem',
            background: theme === 'light' ? '#fff' : '#37474f',
            borderRadius: '8px',
            border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#546e7a'}`,
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
              Prayer tracking will be enabled soon. Keep praying! 📿
            </p>
          </div>
        </section>
      )}

      {/* ========== METHOD INFO ==========*/}
      {prayerTimes.data.meta && (
        <footer style={{
          padding: '1.5rem',
          background: theme === 'light' ? '#f5f5f5' : '#263238',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: theme === 'light' ? '#666' : '#aaa',
          textAlign: 'center',
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            🕋 Method: {prayerTimes.data.meta.method?.name || 'Umm Al-Qura'}
          </p>
          {prayerTimes.data.meta.timezone && (
            <p style={{ margin: '0.5rem 0' }}>⏰ Timezone: {prayerTimes.data.meta.timezone}</p>
          )}
          {offlineModeEnabled && (
            <p style={{ margin: '0.5rem 0' }}>📴 Offline Mode: Enabled (Data cached)</p>
          )}
          {cloudSyncEnabled && (
            <p style={{ margin: '0.5rem 0' }}>☁️ Cloud Sync: Enabled</p>
          )}
        </footer>
      )}
    </div>
  );
}
