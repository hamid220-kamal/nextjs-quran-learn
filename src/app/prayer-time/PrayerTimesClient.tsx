'use client';

import { useState, useEffect, useCallback } from 'react';
import { PrayerTimesResponse, Prayer, Coordinates } from './types';
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
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  const prayers: Prayer[] = [
    { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', index: 1 },
    { key: 'Sunrise', name: 'Sunrise', arabic: 'الشروق', index: 2 },
    { key: 'Dhuhr', name: 'Dhuhr', arabic: 'الظهر', index: 3 },
    { key: 'Asr', name: 'Asr', arabic: 'العصر', index: 4 },
    { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', index: 5 },
    { key: 'Isha', name: 'Isha', arabic: 'العشاء', index: 6 },
  ];

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate next prayer and countdown
  useEffect(() => {
    if (!prayerTimes?.data?.timings) return;

    const now = currentTime;
    const today = new Date().toISOString().split('T')[0];
    
    let nextPrayerFound: { prayer: Prayer; time: Date } | null = null;

    for (const prayer of prayers) {
      if (prayer.key === 'Sunrise') continue; // Skip sunrise for prayer calculations
      
      const timing = prayerTimes.data.timings[prayer.key];
      if (!timing) continue;
      
      const [hours, minutes] = timing.split(':');
      const prayerTime = new Date(`${today}T${hours}:${minutes}:00`);
      
      if (prayerTime > now) {
        nextPrayerFound = { prayer, time: prayerTime };
        break;
      }
    }

    // If no prayer found for today, use Fajr of next day
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

  // Check for reminders
  useEffect(() => {
    if (!reminderEnabled || !nextPrayer || !prayerTimes) return;

    const checkReminder = () => {
      const now = currentTime.getTime();
      const prayerTime = nextPrayer.time.getTime();
      const reminderTime = prayerTime - (reminderMinutes * 60 * 1000);

      if (now >= reminderTime && now < reminderTime + 1000) {
        // Show notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(`🕌 ${nextPrayer.prayer.name} Prayer`, {
            body: `${nextPrayer.prayer.name} prayer is coming in ${reminderMinutes} minutes (${nextPrayer.time.toLocaleTimeString()})`,
            tag: 'prayer-reminder',
            requireInteraction: false,
            badge: '/kfgqpc-uthmanic-script-hafs-regular/favicon.ico',
          });
        }
      }
    };

    checkReminder();
  }, [currentTime, nextPrayer, reminderEnabled, reminderMinutes, prayerTimes]);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setReminderEnabled(true);
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setReminderEnabled(true);
        }
      }
    }
  }, []);

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

      const { latitude, longitude, accuracy } = position.coords;
      
      console.log(`Location obtained: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
      
      // Update URL with new coordinates
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('lat', latitude.toFixed(6));
      newUrl.searchParams.set('lon', longitude.toFixed(6));
      newUrl.searchParams.delete('city');
      newUrl.searchParams.delete('country');
      window.history.replaceState({}, '', newUrl.toString());

      // Fetch updated prayer times from Aladhan API
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateString = `${day}-${month}-${year}`;
      
      const apiUrl = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude.toFixed(6)}&longitude=${longitude.toFixed(6)}&method=2&school=0`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: PrayerTimesResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch prayer times');
      }
      
      setPrayerTimes(data);
      
      // Update location display
      if (data.data.meta) {
        const { timezone } = data.data.meta;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)} (${timezone})`);
      }
    } catch (err: any) {
      console.error('Geolocation error:', err);
      if (err.code === 1) { // PERMISSION_DENIED
        setError('📍 Location access denied. Please enable location permissions in your browser settings.');
      } else if (err.code === 3) { // TIMEOUT
        setError('📍 Location request timed out. Please try again.');
      } else if (err.code === 2) { // POSITION_UNAVAILABLE
        setError('📍 Location information is currently unavailable. Please check your connection.');
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
      {!initialCoords.lat && !initialCoords.lon && (
        <div className={styles.infoMessage}>
          <p>📍 <strong>Showing prayer times for:</strong> {location}</p>
          <p style={{ marginTop: '0.5rem', marginBottom: '0' }}>Enable location to get accurate times for your current location.</p>
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
          {loading ? (
            <>
              <span className={styles.loadingSpinner} style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }} />
              Getting Location...
            </>
          ) : (
            '📍 Use My Current Location'
          )}
        </button>
        <button
          className={`${styles.reminderButton} ${reminderEnabled ? styles.reminderActive : ''}`}
          onClick={requestNotificationPermission}
          title={reminderEnabled ? 'Prayer reminders enabled' : 'Enable prayer reminders'}
          aria-label="Enable prayer time reminders"
        >
          {reminderEnabled ? '🔔 Reminders ON' : '🔕 Enable Reminders'}
        </button>
      </div>

      {reminderEnabled && (
        <div className={styles.reminderSettings}>
          <label htmlFor="reminder-minutes">
            Remind me 
            <input
              id="reminder-minutes"
              type="number"
              min="1"
              max="60"
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 15)))}
              className={styles.reminderInput}
              aria-label="Minutes before prayer for notification"
            />
            minutes before prayer
          </label>
        </div>
      )}

      {prayerTimes.data.meta && (
        <div className={styles.methodInfo}>
          <p className={styles.methodText}>
            🕋 <strong>Calculation Method:</strong> {prayerTimes.data.meta.method?.name || 'Muslim World League (MWL)'}
          </p>
          {prayerTimes.data.meta.timezone && (
            <p className={styles.methodText}>
              ⏰ <strong>Timezone:</strong> {prayerTimes.data.meta.timezone}
            </p>
          )}
          {prayerTimes.data.meta.latitude && prayerTimes.data.meta.longitude && (
            <p className={styles.methodText}>
              📍 <strong>Coordinates:</strong> {prayerTimes.data.meta.latitude.toFixed(4)}°, {prayerTimes.data.meta.longitude.toFixed(4)}°
            </p>
          )}
        </div>
      )}
    </>
  );
}