'use client';

import { useState, useEffect } from 'react';
import { PrayerTimesResponse, Prayer, Coordinates } from './types';
import styles from './PrayerTime.css';

interface PrayerTimesClientProps {
  initialPrayerTimes: PrayerTimesResponse | null;
  initialError: string | null;
  initialCoords: Coordinates;
}

export default function PrayerTimesClient({
  initialPrayerTimes,
  initialError,
  initialCoords,
}: PrayerTimesClientProps) {
  const [prayerTimes, setPrayerTimes] = useState(initialPrayerTimes);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ prayer: Prayer; time: Date } | null>(null);

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
  }, [prayerTimes, currentTime]);

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

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Update URL with new coordinates without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('lat', latitude.toString());
      newUrl.searchParams.set('lon', longitude.toString());
      newUrl.searchParams.delete('city');
      newUrl.searchParams.delete('country');
      window.history.replaceState({}, '', newUrl.toString());

      // Fetch updated prayer times directly from Aladhan API
      const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3&school=0`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prayer times: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch prayer times');
      }
      
      setPrayerTimes(data);
    } catch (err: any) {
      console.error('Geolocation error:', err);
      if (err.code === err.PERMISSION_DENIED) {
        setError('Location access denied. Please enable location permissions in your browser settings.');
      } else if (err.code === err.TIMEOUT) {
        setError('Location request timed out. Please try again.');
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setError('Location information unavailable. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to update prayer times. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <>
        <div className={styles.errorMessage} role="alert">
          <strong>Unable to load prayer times</strong>
          <br />
          {error}
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
                <div className={styles.loadingSpinner} style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }} />
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
          <p>📍 Showing prayer times for default location. Use the button below to get accurate times for your current location.</p>
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
              <div className={styles.loadingSpinner} style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }} />
              Getting Location...
            </>
          ) : (
            '📍 Use My Current Location'
          )}
        </button>
      </div>

      {prayerTimes.data.meta && (
        <div className={styles.methodInfo}>
          <p className={styles.methodText}>
            🕋 Calculation Method: <strong>{prayerTimes.data.meta.method?.name || 'Muslim World League (MWL)'}</strong>
            {prayerTimes.data.meta.latitude && prayerTimes.data.meta.longitude && (
              <> • Location: {prayerTimes.data.meta.latitude.toFixed(2)}, {prayerTimes.data.meta.longitude.toFixed(2)}</>
            )}
          </p>
        </div>
      )}
    </>
  );
}