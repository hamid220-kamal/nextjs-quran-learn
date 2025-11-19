'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PrayerTimesResponse, Prayer } from './types';

// Import utilities
import {
  calculateQiblaDirection,
  gregorianToHijri,
} from './utils/prayerCalculations';

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

  const [uploadedAudio, setUploadedAudio] = useState<{ name: string; url: string }[]>([]);
  const [customAudioFile, setCustomAudioFile] = useState<File | null>(null);

  // ========== AUDIO & NOTIFICATIONS ==========
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);

  // ========== QIBLA & HIJRI ==========
  const [qiblaInfo, setQiblaInfo] = useState<QiblaInfo | null>(null);
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [prayerStats, setPrayerStats] = useState({
    today: 0,
    streak: 0,
    thisMonth: 0,
    total: 0,
  });

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

  // ========== INITIALIZATION & TIME UPDATE ==========
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      if (prayerTimes?.data?.timings && audioEnabled) {
        const timings = prayerTimes.data.timings;
        const remindersArray = Array.from(reminders.entries());

        for (const [prayer, minutesBefore] of remindersArray) {
          const timeStr = timings[prayer as keyof typeof timings];
          if (!timeStr) continue;

          const [hour, minute] = timeStr.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hour, minute, 0, 0);

          const reminderTime = new Date(prayerTime.getTime() - minutesBefore * 60000);
          const reminderTimeStr = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;
          const reminderId = `reminder-${prayer}`;

          // Check if reminder should trigger
          if (
            currentTimeStr === reminderTimeStr &&
            !triggeredAlarmsRef.current.has(reminderId)
          ) {
            console.log(`🔔 REMINDER TRIGGERED: ${prayer} Prayer (${minutesBefore} min before)`);
            triggeredAlarmsRef.current.add(reminderId);
            playAudio('bell', prayer);
            sendNotification(`🕌 ${prayer} Prayer Reminder`, `Prayer in ${minutesBefore} minutes`, true);
          }
        }
      }
    };

    checkAlerts();
  }, [currentTime, reminders, customAlarms, audioEnabled, prayerTimes]);

  // ========== RESET TRIGGERED ALARMS AT MIDNIGHT ==========
  useEffect(() => {
    const now = currentTime;
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      triggeredAlarmsRef.current.clear();
      audioTimeoutsRef.current.forEach(t => clearTimeout(t));
      audioTimeoutsRef.current = [];
    }
  }, [currentTime]);

  // ========== STOP & CONTROL ALARM ==========
  const stopAlarm = () => {
    console.log('🛑 Stopping all alarms...');
    
    // Stop all audio
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
    const snoozeUntil = new Date(now.getTime() + snoozeTime);
    const snoozeHour = snoozeUntil.getHours();
    const snoozeMinute = snoozeUntil.getMinutes();
    
    console.log(`⏰ Alarm will ring again at ${snoozeHour.toString().padStart(2, '0')}:${snoozeMinute.toString().padStart(2, '0')}`);
    
    // Remove from triggered set so it can trigger again at snooze time
    const alarmIdKey = `alarm-${activeAlarmId}`;
    triggeredAlarmsRef.current.delete(alarmIdKey);
    
    // Send notification
    sendNotification(
      '😴 Snoozed',
      `Alarm will ring again at ${snoozeHour.toString().padStart(2, '0')}:${snoozeMinute.toString().padStart(2, '0')}`,
      false
    );
  };
  const playAudio = (soundType: string, label: string) => {
    try {
      console.log(`🎵 Playing ${soundType} for ${label}`);
      
      let audioUrl = '';
      
      // Determine audio URL based on sound type
      if (soundType === 'fajr-azan') {
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
        // Generate bell sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const now = audioContext.currentTime;
          
          const oscillator1 = audioContext.createOscillator();
          const oscillator2 = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator1.connect(gainNode);
          oscillator2.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator1.frequency.value = 800;
          oscillator2.frequency.value = 1200;
          oscillator1.type = 'sine';
          oscillator2.type = 'sine';

          gainNode.gain.setValueAtTime(0.5, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

          oscillator1.start(now);
          oscillator2.start(now);
          oscillator1.stop(now + 0.8);
          oscillator2.stop(now + 0.8);

          console.log('🔔 Bell sound generated');
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
          const customAudio = new Audio(e.target?.result as string);
          customAudio.volume = Math.min(1, volume / 100);
          customAudio.play().catch(err => console.error('❌ Custom audio play error:', err));
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
      // Browser notification
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          const options: NotificationOptions = {
            body,
            icon: '/favicon.ico',
            tag: isAlarm ? 'alarm-notification' : 'reminder-notification',
            requireInteraction: isAlarm, // Keep alarm notifications visible
            badge: '/favicon.ico',
          };
          new Notification(title, options);
        } else if (Notification.permission !== 'denied') {
          // Request permission if not denied
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(title, {
                body,
                icon: '/favicon.ico',
                tag: isAlarm ? 'alarm-notification' : 'reminder-notification',
                requireInteraction: isAlarm,
              });
            }
          });
        }
      }

      // Console alert for debugging
      console.log(`📢 NOTIFICATION: ${title} - ${body}`);
    } catch (err) {
      console.error('Notification error:', err);
    }
  };

  // ========== REQUEST NOTIFICATION PERMISSION ==========
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
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
    };

    setCustomAlarms([...customAlarms, newAlarm]);
    setNewAlarmName('');
    setNewAlarmTime('00:00');
  };

  const deleteAlarm = (id: string) => {
    setCustomAlarms(customAlarms.filter(alarm => alarm.id !== id));
    triggeredAlarmsRef.current.delete(`alarm-${id}`);
  };

  const toggleAlarm = (id: string) => {
    setCustomAlarms(customAlarms.map(alarm =>
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
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
  };

  // ========== ONLINE/OFFLINE ==========
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
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
              <input
                type="number"
                value={minutes}
                onChange={(e) => updateReminder(prayer, parseInt(e.target.value) || 0)}
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: `1px solid ${theme === 'light' ? '#ccc' : '#666'}`,
                  background: theme === 'light' ? '#fff' : '#1a1a1a',
                  color: theme === 'light' ? '#000' : '#fff',
                }}
              />
              <span style={{ fontSize: '0.9rem', color: '#666' }}>minutes before</span>
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
              onChange={(e) => setNewAlarmSound(e.target.value as any)}
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
            </select>
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

      {/* AUDIO CONTROLS */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>🔊 Audio Settings & Library</h2>
        
        {/* Audio Enable */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
          marginBottom: '1rem',
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Enable Audio Notifications</span>
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Volume: {volume}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Available Audio Files */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
          marginBottom: '1rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📚 Available Audio Files</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {audioFiles.map(audio => (
              <button
                key={audio.id}
                onClick={() => {
                  const newAudio = new Audio(audio.path);
                  newAudio.volume = volume / 100;
                  newAudio.play().catch(err => console.error('Play error:', err));
                  setIsPlaying(true);
                  setTimeout(() => setIsPlaying(false), 5000);
                  console.log(`▶️ Playing: ${audio.name}`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.target as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                {audio.name}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Audio */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
          marginBottom: '1rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📤 Upload Custom MP3 Audio</h3>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCustomAudioFile(file);
                  const url = URL.createObjectURL(file);
                  setUploadedAudio([...uploadedAudio, { name: file.name, url }]);
                  console.log(`✅ Uploaded: ${file.name}`);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: `2px dashed ${theme === 'light' ? '#ccc' : '#666'}`,
                background: theme === 'light' ? '#f9f9f9' : '#1a1a1a',
                width: '100%',
                cursor: 'pointer',
              }}
            />
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
            💡 Upload your own MP3 files and use them as alarm sounds
          </p>
          
          {/* Show uploaded files */}
          {uploadedAudio.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}` }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Your Uploaded Files:</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                {uploadedAudio.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const customAudio = new Audio(file.url);
                      customAudio.volume = volume / 100;
                      customAudio.play().catch(err => console.error('Play error:', err));
                      setIsPlaying(true);
                      setTimeout(() => setIsPlaying(false), 5000);
                      console.log(`▶️ Playing: ${file.name}`);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    }}
                  >
                    🎵 {file.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Test Audio */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <button
            onClick={testAudio}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🧪 Test Current Sound
          </button>
          {isPlaying && <span style={{ color: '#ff9800', fontWeight: 'bold' }}>🎵 Playing...</span>}
          {isPlaying && (
            <button
              onClick={stopAlarm}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ⏹️ Stop
            </button>
          )}
        </div>

        {/* Custom Snooze Settings */}
        <div style={{
          background: theme === 'light' ? '#fff' : '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
          marginTop: '1rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>😴 Snooze Settings</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Default Snooze Duration: {snoozeMinutes} minutes
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={snoozeMinutes}
              onChange={(e) => setSnoozeMinutes(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
            💡 When alarm triggers, use the snooze buttons to postpone for 5, 10, or 15 minutes. You can customize the default here.
          </p>
        </div>

        <audio ref={audioRef} />
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

      {/* PRAYER STATISTICS */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>📊 Prayer Statistics</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
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
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Streak</div>
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
