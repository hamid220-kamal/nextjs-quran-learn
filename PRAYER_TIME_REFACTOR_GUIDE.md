# 🛠️ PRAYER TIME COMPONENT REFACTORING GUIDE

## Problem Summary

`PrayerTimePageFunctional.tsx` is **2071 lines** of code with these issues:
- ❌ **All styles are inline** (not maintainable, not responsive)
- ❌ **Component is too large** (impossible to test, hard to debug)
- ❌ **Marked as 'use client'** (reduces SEO value)
- ❌ **No CSS modules** (style conflicts possible)
- ❌ **Hard to maintain** (future developers will struggle)

## Solution: Component Decomposition

### Proposed Structure

```
src/app/prayer-time/
├── page.tsx                          (Main page - 100 lines)
├── PrayerTimePageFunctional.tsx      (Removed - broken into parts below)
├── types.ts                          (Already exists)
├── utils/                            (Already exists)
│   ├── prayerCalculations.ts
│   ├── prayerTracking.ts
│   ├── localStorage.ts
│   └── indexedDB.ts
├── components/
│   ├── PrayerHeader.tsx              (200 lines)
│   ├── PrayerTimes.tsx               (150 lines)
│   ├── Reminders.tsx                 (200 lines)
│   ├── CustomAlarms.tsx              (250 lines)
│   ├── AlarmControl.tsx              (150 lines)
│   ├── Statistics.tsx                (200 lines)
│   ├── QiblaSection.tsx              (100 lines)
│   └── ErrorBoundary.tsx             (50 lines)
├── hooks/
│   ├── usePrayerTimes.ts             (100 lines)
│   ├── useAlarms.ts                  (150 lines)
│   └── useNotifications.ts           (100 lines)
└── styles/
    ├── header.module.css
    ├── cards.module.css
    ├── alarms.module.css
    └── statistics.module.css
```

---

## Implementation Guide

### Step 1: Create Custom Hooks

**File:** `src/app/prayer-time/hooks/usePrayerTimes.ts`

```typescript
import { useState, useEffect } from 'react';
import { PrayerTimesResponse, Prayer } from '../types';

export function usePrayerTimes(initialPrayerTimes: PrayerTimesResponse | null) {
  const [prayerTimes, setPrayerTimes] = useState(initialPrayerTimes);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: Date;
    minutesLeft: number;
  } | null>(null);
  const [hijriDate, setHijriDate] = useState<any>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate next prayer
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

  // Calculate Hijri date
  useEffect(() => {
    if (!prayerTimes?.data?.date) return;

    const date = prayerTimes.data.date;
    if (date.hijri) {
      setHijriDate(date.hijri);
    }
  }, [prayerTimes]);

  return { prayerTimes, currentTime, nextPrayer, hijriDate, setPrayerTimes };
}
```

**File:** `src/app/prayer-time/hooks/useAlarms.ts`

```typescript
import { useState, useEffect, useRef } from 'react';
import {
  loadAlarms,
  saveAlarms,
  validateAlarm,
} from '../utils/localStorage';

interface CustomAlarm {
  id: string;
  name: string;
  hour: number;
  minute: number;
  enabled: boolean;
  sound: string;
  createdAt: number;
  updatedAt: number;
}

export function useAlarms() {
  const [customAlarms, setCustomAlarms] = useState<CustomAlarm[]>([]);
  const [lastTriggeredAlarm, setLastTriggeredAlarm] = useState<{
    name: string;
    time: string;
  } | null>(null);
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const [snoozedUntilTimestamp, setSnoozedUntilTimestamp] = useState<number | null>(null);

  const triggeredAlarmsRef = useRef<Set<string>>(new Set());
  const snoozedAlarmIdRef = useRef<string | null>(null);

  // Load alarms on mount
  useEffect(() => {
    const savedAlarms = loadAlarms();
    if (savedAlarms.length > 0) {
      setCustomAlarms(savedAlarms);
    }
  }, []);

  // Add alarm
  const addAlarm = (name: string, hour: number, minute: number, sound: string) => {
    if (!name.trim()) return false;

    const newAlarm: CustomAlarm = {
      id: `alarm-${Date.now()}`,
      name,
      hour,
      minute,
      enabled: true,
      sound,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const validation = validateAlarm(newAlarm);
    if (!validation.valid) return false;

    const updatedAlarms = [...customAlarms, newAlarm];
    setCustomAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
    return true;
  };

  // Delete alarm
  const deleteAlarm = (id: string) => {
    const updatedAlarms = customAlarms.filter(alarm => alarm.id !== id);
    setCustomAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
    triggeredAlarmsRef.current.delete(`alarm-${id}`);
  };

  // Toggle alarm
  const toggleAlarm = (id: string) => {
    const updatedAlarms = customAlarms.map(alarm => {
      if (alarm.id === id) {
        return { 
          ...alarm, 
          enabled: !alarm.enabled,
          updatedAt: Date.now(),
        };
      }
      return alarm;
    });
    setCustomAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
  };

  // Stop alarm
  const stopAlarm = () => {
    setActiveAlarmId(null);
    setLastTriggeredAlarm(null);
  };

  // Snooze alarm
  const snoozeAlarm = (minutes: number) => {
    const snoozeTime = minutes * 60 * 1000;
    const now = new Date();
    const snoozeUntilTimestamp = now.getTime() + snoozeTime;

    snoozedAlarmIdRef.current = activeAlarmId;
    setSnoozedUntilTimestamp(snoozeUntilTimestamp);

    stopAlarm();
  };

  return {
    customAlarms,
    lastTriggeredAlarm,
    activeAlarmId,
    snoozedUntilTimestamp,
    addAlarm,
    deleteAlarm,
    toggleAlarm,
    stopAlarm,
    snoozeAlarm,
    setLastTriggeredAlarm,
    setActiveAlarmId,
    triggeredAlarmsRef,
    snoozedAlarmIdRef,
  };
}
```

**File:** `src/app/prayer-time/hooks/useNotifications.ts`

```typescript
import { useState, useEffect } from 'react';

export function useNotifications() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);

      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Send notification
  const sendNotification = (title: string, body: string, isAlarm = false) => {
    try {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `notif-${Date.now()}`,
          requireInteraction: isAlarm,
        });

        notification.addEventListener('click', () => {
          window.focus();
          notification.close();
        });
      } else {
        alert(`${title}\n\n${body}`);
      }
    } catch (err) {
      console.error('Notification error:', err);
    }
  };

  return {
    notificationPermission,
    audioEnabled,
    volume,
    isPlaying,
    setAudioEnabled,
    setVolume,
    setIsPlaying,
    sendNotification,
    setNotificationPermission,
  };
}
```

---

### Step 2: Create CSS Modules

**File:** `src/app/prayer-time/styles/header.module.css`

```css
.container {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: clamp(1.5rem, 5vw, 2rem);
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.title {
  margin: 0 0 0.5rem 0;
  font-size: clamp(1.75rem, 5vw, 2rem);
  font-weight: bold;
}

.location {
  margin: 0.5rem 0;
  font-size: clamp(1rem, 2vw, 1.1rem);
}

.hijriDate {
  margin: 0.5rem 0;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  opacity: 0.9;
}

.nextPrayer {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 8px;
}

.nextPrayerLabel {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.nextPrayerTime {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.controls {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.themeButton {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.themeButton:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .container {
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .nextPrayerTime {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1rem;
    border-radius: 8px;
  }

  .title {
    font-size: 1.25rem;
  }

  .controls {
    flex-direction: column;
    gap: 0.5rem;
  }

  .themeButton {
    width: 100%;
  }
}
```

---

### Step 3: Create Smaller Components

**File:** `src/app/prayer-time/components/PrayerHeader.tsx`

```tsx
'use client';

import styles from '../styles/header.module.css';

interface PrayerHeaderProps {
  location: string;
  hijriDate?: {
    day: number;
    month: { ar: string };
    year: number;
  };
  nextPrayer?: {
    name: string;
    minutesLeft: number;
  };
  theme: 'light' | 'dark';
  isOnline: boolean;
  onThemeChange: () => void;
}

export default function PrayerHeader({
  location,
  hijriDate,
  nextPrayer,
  theme,
  isOnline,
  onThemeChange,
}: PrayerHeaderProps) {
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>🕌 Prayer Times</h1>
      <p className={styles.location}>📍 {location}</p>

      {hijriDate && (
        <p className={styles.hijriDate}>
          📅 {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} AH
        </p>
      )}

      {nextPrayer && (
        <div className={styles.nextPrayer}>
          <div className={styles.nextPrayerLabel}>⏱️ Next Prayer</div>
          <div className={styles.nextPrayerTime}>
            {nextPrayer.name} in {nextPrayer.minutesLeft} minutes
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <span>{isOnline ? '✅ Online' : '❌ Offline'}</span>
        <button
          onClick={onThemeChange}
          className={styles.themeButton}
        >
          {theme === 'light' ? '🌙' : '☀️'} Theme
        </button>
      </div>
    </header>
  );
}
```

**File:** `src/app/prayer-time/components/PrayerTimes.tsx`

```tsx
'use client';

interface PrayerTimesProps {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  nextPrayerName?: string;
  theme: 'light' | 'dark';
}

export default function PrayerTimes({ timings, nextPrayerName, theme }: PrayerTimesProps) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>⏰ Prayer Times Today</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, idx) => {
          const time = timings[prayer as keyof typeof timings];
          const isNext = nextPrayerName === prayer;

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
  );
}
```

---

### Step 4: Create Main Page Component

**File:** `src/app/prayer-time/page.tsx`

```tsx
import { Metadata } from 'next';
import PrayerTimePageFunctional from './PrayerTimePageFunctional';
import { getPrayerTimesData } from '../../../utils/prayerAPI';

export const metadata: Metadata = {
  title: 'Prayer Times & Reminders | QuranicLearn',
  description: 'Get accurate prayer times, set custom alarms, track your daily prayers, and find Qibla direction.',
  keywords: 'prayer times, salah times, Islamic alarms, prayer reminders, Qibla',
  openGraph: {
    title: 'Prayer Times & Reminders | QuranicLearn',
    description: 'Accurate prayer times and Islamic reminders',
    url: 'https://quraniclearn.com/prayer-time',
    images: ['/og-prayer-times.png'],
  },
};

export default async function PrayerTimePage() {
  // Fetch data server-side
  const { prayerTimes, error, coords, location } = await getPrayerTimesData();

  return (
    <PrayerTimePageFunctional
      initialPrayerTimes={prayerTimes}
      initialError={error}
      initialCoords={coords}
      initialLocation={location}
    />
  );
}
```

---

## Benefits of This Refactoring

✅ **Maintainability**: Each component has a single responsibility
✅ **Testability**: Smaller components are easier to test
✅ **Responsiveness**: Centralized styling in CSS modules
✅ **Performance**: Lazy loading of components possible
✅ **Type Safety**: Better TypeScript support
✅ **Reusability**: Components can be used elsewhere
✅ **SEO**: Cleaner HTML output, proper semantic structure
✅ **Documentation**: Easier to document and onboard new developers

---

## Migration Timeline

**Week 1**: Create hooks and CSS modules
**Week 2**: Refactor into smaller components
**Week 3**: Test and debug
**Week 4**: Deploy to production

---

## Testing Checklist After Refactoring

- [ ] Prayer times display correctly
- [ ] Alarms trigger at correct times
- [ ] Reminders work as expected
- [ ] Notifications appear on mobile
- [ ] Responsive design works on all devices
- [ ] No console errors
- [ ] Performance is maintained
- [ ] All existing features work

---

**Last Updated**: November 20, 2024
**Priority**: High
**Estimated Effort**: 2-3 weeks
