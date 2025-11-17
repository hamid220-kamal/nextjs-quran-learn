'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerTimesResponse, Prayer, Coordinates, Reminder, AudioSettings } from './types';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const prayers: Prayer[] = [
    { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', index: 1 },
    { key: 'Sunrise', name: 'Sunrise', arabic: 'الشروق', index: 2 },
    { key: 'Dhuhr', name: 'Dhuhr', arabic: 'الظهر', index: 3 },
    { key: 'Asr', name: 'Asr', arabic: 'العصر', index: 4 },
    { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', index: 5 },
    { key: 'Isha', name: 'Isha', arabic: 'العشاء', index: 6 },
  ];

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
  }, [currentTime, reminders, audioSettings, triggeredReminders, prayerTimes, prayers]);

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

  const testAudio = useCallback(() => {
    console.log('🧪 ========== TESTING AUDIO ==========');
    console.log('📢 Current volume:', Math.round(audioSettings.volume * 100) + '%');
    const fajrPrayer: Prayer = { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', index: 1 };
    playAzan(fajrPrayer);
    console.log('🧪 ========== TEST INITIATED ==========');
  }, [playAzan, audioSettings.volume]);

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
