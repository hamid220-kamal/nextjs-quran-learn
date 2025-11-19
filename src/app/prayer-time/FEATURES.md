# Learn Quran - Prayer Times App: Complete Feature Documentation

## Table of Contents

1. [Calculation Methods & Madhab Settings](#calculation-methods--madhab-settings)
2. [High-Latitude Adjustments](#high-latitude-adjustments)
3. [Monthly Timetable](#monthly-timetable)
4. [Hijri Date & Lunar Calendar](#hijri-date--lunar-calendar)
5. [Qibla Compass & Map](#qibla-compass--map)
6. [Notifications & Custom Adhan](#notifications--custom-adhan)
7. [Widgets (Android/iOS)](#widgetsandroidiós)
8. [Offline Caching & Travel Mode](#offline-caching--travel-mode)
9. [User Settings Sync](#user-settings-sync)
10. [Prayer Tracking System](#prayer-tracking-system)
11. [Fiqh Notes & Islamic References](#fiqh-notes--islamic-references)
12. [UI Design & Accessibility](#ui-design--accessibility)
13. [Automated Tests](#automated-tests)

---

## 1. Calculation Methods & Madhab Settings

### Overview
The app supports multiple Islamic prayer time calculation methods and schools of Islamic jurisprudence (madhab).

### Supported Calculation Methods

| Method ID | Name | Region | Fajr Angle | Isha Angle | Best For |
|-----------|------|--------|-----------|-----------|----------|
| 1 | Ummah Al-Qura | Saudi Arabia | 18.5° | 90 min | Mecca/Saudi Arabia |
| 2 | ISNA | North America | 15° | 15° | USA/Canada |
| 3 | MWL | Europe, Far East | 18° | 17° | Europe/Asia |
| 4 | Umm Al-Qura | Saudi Arabia (Default) | 18.5° | 90 min | Standard |
| 5 | Egyptian Survey | Africa/Middle East | 19.5° | 17.5° | Africa/Egypt |
| 7 | Al Kareem University | Kuwait | 18° | 17.5° | Kuwait/Gulf |
| 8 | DIYANET | Turkey | 18° | 17° | Turkey |
| 9 | JAKIM | Malaysia | 20° | 18° | Malaysia/SE Asia |
| 10 | Singapore | Singapore | 20° | 18° | Singapore |
| 11 | MUIS | Singapore | 20° | 18° | Singapore |
| 12 | ISRA | Malaysia | 20° | 18° | Malaysia |
| 13 | MOON SIGHT | CUSTOM | 18° | 17° | Custom/Research |
| 14 | UCT | South Africa | 18° | 17° | South Africa |

### Madhab (School of Islamic Law)

| School | Name (Arabic) | Asr Calculation | Best For |
|--------|---------------|-----------------|----------|
| 0 | Shafi'i (الشافعي) | Shadow = 1x object height | Most Sunni majority |
| 1 | Hanafi (الحنفي) | Shadow = 2x object height | Hanafi followers |
| 2 | Maliki (المالكي) | Shadow = 1x object height | Maliki followers |
| 3 | Hanbali (الحنبلي) | Shadow = 1x object height | Hanbali followers |

### Implementation

```typescript
// Select calculation method
const methodId: CalculationMethod = 4; // Umm Al-Qura

// Select madhab
const madhab: MadhabSchool = 0; // Shafi'i

// API call includes both parameters
const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=${country}&method=${methodId}&school=${madhab}`;
```

### UI Controls
- Dropdown to select calculation method with regional recommendations
- Dropdown to select madhab with descriptive text
- Option to save selected method as default
- Comparison view showing differences between methods

---

## 2. High-Latitude Adjustments

### Overview
In polar regions (>48.5° latitude), the sun may not set properly during summer, creating ambiguity for Fajr and Isha times.

### Supported Methods

#### 1. **Midnight Method**
- Fajr: midway between midnight and sunrise
- Isha: midway between sunset and midnight
- Best for: Extreme latitudes with midnight sun
- Formula: 
  - Fajr = Sunrise / 2
  - Isha = (Sunset + 1440) / 2

#### 2. **Nearest Latitude Method**
- Uses prayer times from nearest latitude (48.5°) where sun sets normally
- Applies proportional adjustment based on latitude difference
- Best for: Moderate high latitudes (48.5° - 60°)

#### 3. **Angle-Based Method**
- Reduces sun angle slightly for high latitudes
- Uses consistent angle for both Fajr and Isha
- Formula: Adjustment = Normal_time - (Normal_offset * 0.97)

#### 4. **Fraction of Night Method**
- Divides the night into equal fractions
- Fajr = 1/6 of night before sunrise
- Isha = 1/6 of night after sunset
- Best for: Very high latitudes (60°+)

### Implementation

```typescript
// Apply high-latitude adjustment
const adjustedTimings = applyHighLatitudeAdjustment(
  timings,           // Original prayer times
  latitude,          // User latitude
  'midnight'         // Adjustment method
);
```

### Configuration in Settings
```typescript
highLatitudeMethod: 'midnight' | 'nearest-latitude' | 'angle-based' | 'fraction-of-night'
```

---

## 3. Monthly Timetable

### Overview
Displays prayer times for an entire month in a table format with export capabilities.

### Features
- Calendar view showing all prayer times for a month
- Click on any day to see detailed information
- Color-coded prayer times
- Hijri and Gregorian dates side-by-side
- Export to PDF/CSV
- Print-friendly layout
- Search/filter by date or prayer

### Data Structure

```typescript
interface MonthlyTimetable {
  month: number;
  year: number;
  hijriMonth?: string;
  hijriYear?: number;
  location: SavedLocation;
  method: CalculationMethodConfig;
  madhab: MadhabConfig;
  timings: DailyPrayerTiming[];  // One per day
  generatedAt: number;
}

interface DailyPrayerTiming {
  date: string;                    // YYYY-MM-DD
  hijriDate?: string;              // Islamic calendar date
  gregorianDate?: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak?: string;                  // Ramadan start time
  midnight?: string;
}
```

### Usage

```typescript
// Generate monthly timetable
async function generateMonthlyTimetable(
  location: SavedLocation,
  month: number,
  year: number
): Promise<MonthlyTimetable> {
  // Fetch prayer times for all 30/31 days of month
  const timings: DailyPrayerTiming[] = [];
  
  for (let day = 1; day <= getDaysInMonth(month, year); day++) {
    const date = new Date(year, month - 1, day);
    const prayerData = await fetchPrayerTimes(location, date);
    
    timings.push({
      date: formatDate(date),
      hijriDate: convertToHijri(date),
      fajr: prayerData.timings.Fajr,
      sunrise: prayerData.timings.Sunrise,
      // ... etc
    });
  }
  
  return {
    month,
    year,
    location,
    method: CALCULATION_METHODS[4],
    madhab: MADHAB_SCHOOLS[0],
    timings,
    generatedAt: Date.now(),
  };
}
```

### Export Options
1. **PDF Export**
   - Professional formatting
   - Includes location, method, and month info
   - Preserves colors and layout

2. **CSV Export**
   - Compatible with Excel/Sheets
   - One row per day
   - All prayer times included

3. **Print**
   - Optimized for A4/Letter paper
   - Multi-page for long months

---

## 4. Hijri Date & Lunar Calendar

### Overview
Tracks Islamic calendar dates with manual correction capability for lunar observations.

### Features
- Automatic Hijri date conversion
- Manual correction for lunar observations
- Islamic event detection (Ramadan, Hajj, Eid)
- Lunar age and visibility tracking
- Event notifications

### Data Structure

```typescript
interface HijriDateWithCorrection {
  calculated: HijriDate;    // Computed Hijri date
  observed: HijriDate;      // User-corrected date
  isManuallySet: boolean;
  lunarObservation?: {
    moonAge: number;        // Days since new moon
    visibility: 'visible' | 'invisible' | 'uncertain';
    observedBy: string[];   // Observers' names/locations
    observationDate: string;
  };
  correctionNotes?: string;
}
```

### Islamic Events

```typescript
interface LunarCalendarEvent {
  id: string;
  name: string;              // e.g., "Laylat al-Qadr"
  arabicName: string;
  hijriDate: HijriDate;      // When it occurs in Hijri
  description: string;
  prayerModification?: {
    fajrTime?: string;       // Modified times if applicable
    dhuhrTime?: string;
  };
  icon: string;              // Emoji or icon code
}
```

### Major Islamic Events

| Event | Hijri Date | Duration | Prayer Changes |
|-------|-----------|----------|-----------------|
| Ramadan | 1-29 Ramadan | ~30 days | Taraweeh, Iftar times |
| Laylat al-Qadr | 27 Ramadan | 1 night | Special emphasis |
| Eid al-Fitr | 1 Shawwal | 1-3 days | Special prayer |
| Arafah Day | 9 Dhu al-Hijjah | 1 day | Special prayers |
| Eid al-Adha | 10 Dhu al-Hijjah | 1-4 days | Special prayer |
| Hajj | 8-13 Dhu al-Hijjah | 6 days | Ihram restrictions |

### Manual Correction

```typescript
// User observes new moon, set to correct Hijri date
const correction: HijriDateWithCorrection = {
  calculated: gregorianToHijri(2024, 3, 12),  // Auto-calculated
  observed: {
    date: "1-Ramadan-1445",
    day: "1",
    month: { number: 9, en: "Ramadan", ar: "رمضان" },
    year: "1445",
    designation: { abbreviated: "AH", expanded: "Anno Hegirae" }
  },
  isManuallySet: true,
  lunarObservation: {
    moonAge: 1,
    visibility: "visible",
    observedBy: ["Cairo Observatory", "Saudi Arabia"],
    observationDate: "2024-03-12"
  },
  correctionNotes: "Crescent sighted at sunset on 2024-03-12"
};
```

---

## 5. Qibla Compass & Map

### Overview
Interactive compass showing Qibla direction with optional map visualization.

### Features
- Real-time compass orientation using device gyroscope/magnetometer
- Qibla direction visualization
- Distance to Kaaba
- Interactive map showing direction
- Magnetic declination adjustment
- Accuracy indicator

### Qibla Calculation

```typescript
function calculateQiblaDirection(
  userLat: number,
  userLon: number
): QiblaDirection {
  const kabaLat = 21.4225;
  const kabaLon = 39.8262;
  
  // Haversine formula to calculate bearing
  const latRad1 = (userLat * Math.PI) / 180;
  const latRad2 = (kabaLat * Math.PI) / 180;
  const lonDelta = ((kabaLon - userLon) * Math.PI) / 180;
  
  const y = Math.sin(lonDelta) * Math.cos(latRad2);
  const x = Math.cos(latRad1) * Math.sin(latRad2) - 
            Math.sin(latRad1) * Math.cos(latRad2) * Math.cos(lonDelta);
  
  let azimuth = (Math.atan2(y, x) * 180) / Math.PI;
  azimuth = (azimuth + 360) % 360;
  
  const magneticDeclination = getMagneticDeclination(userLat, userLon);
  const trueNorth = (azimuth - magneticDeclination + 360) % 360;
  
  return {
    azimuth,
    magneticDeclination,
    trueNorth,
    description: getQiblaDescription(azimuth),
    isAccurate: true
  };
}
```

### Map Integration

```typescript
interface MapLocation {
  latitude: number;           // User location
  longitude: number;
  kabaLatitude: number;       // 21.4225
  kabaLongitude: number;      // 39.8262
  distance: number;           // km to Kaaba
  bearing: number;            // Qibla azimuth
  zoom: number;               // Map zoom level
}
```

### Compass Visualization
- Needle points to Qibla direction
- Outer ring shows magnetic north
- Degree markings
- Distance and direction text
- Location coordinates display

### Map Features (with Leaflet/Mapbox)
- Shows user and Kaaba locations
- Great circle arc from user to Kaaba
- Distance calculation
- Zoom appropriate to distance

---

## 6. Notifications & Custom Adhan

### Overview
Comprehensive notification system with custom Adhan audio support.

### Notification Settings

```typescript
interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  light: boolean;
  priority: 'low' | 'default' | 'high' | 'max';
  silentHours?: {
    enabled: boolean;
    startTime: string;        // HH:mm
    endTime: string;
  };
}
```

### Firebase Cloud Messaging (FCM)

```typescript
interface FCMConfig {
  enabled: boolean;
  fcmToken?: string;
  topics: string[];           // 'prayer-notifications', 'reminders'
  deliveryTime?: string;      // HH:mm for batch delivery
}

// Initialize FCM
await initFCM({
  enabled: true,
  topics: ['prayer-notifications', 'ramadan-updates'],
  deliveryTime: '04:00'       // Pre-dawn notification batch
});
```

### Custom Adhan Audio

```typescript
interface CustomAdhan {
  id: string;
  name: string;               // e.g., "Sheikh Sudais"
  prayer: string;             // Which prayer
  audioUrl: string;           // Local file or remote URL
  duration: number;           // seconds
  fileSize: number;           // bytes
  uploadedAt: number;
  isDefault: boolean;
  metadata?: {
    reciterName?: string;
    language?: string;
    quality?: 'low' | 'medium' | 'high';
  };
}

// Upload custom adhan
async function uploadCustomAdhan(
  file: File,
  prayer: string,
  reciterName: string
): Promise<CustomAdhan> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prayer', prayer);
  formData.append('reciterName', reciterName);
  
  const response = await fetch('/api/adhans/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}
```

### Audio Asset Management

```typescript
interface AudioAsset {
  id: string;
  type: 'adhan' | 'takbeer' | 'lori' | 'custom';
  prayer?: string;
  occasion?: string;
  localPath: string;          // IndexedDB or local file
  remoteUrl?: string;         // CDN URL for download
  cached: boolean;
  cacheSize: number;
  lastCached?: number;
}

// Preload audio assets
async function precacheAudioAssets() {
  const assets: AudioAsset[] = [
    {
      id: 'adhan-fajr',
      type: 'adhan',
      prayer: 'Fajr',
      localPath: '/audio/fajr-adhan.mp3',
      remoteUrl: 'https://cdn.example.com/audio/fajr-adhan.mp3',
      cached: true,
      cacheSize: 2500000,
      lastCached: Date.now()
    },
    // ... more assets
  ];
  
  for (const asset of assets) {
    await cacheAudioAsset(asset);
  }
}
```

### Notification Types
1. **Prayer Time Notifications**
   - Scheduled for exact prayer time
   - Custom Adhan audio plays
   - Smart notification at location

2. **Reminder Notifications**
   - 5-30 minutes before prayer
   - Silent vibration option
   - "Prepare for prayer" message

3. **Hijri Event Notifications**
   - Ramadan start/end
   - Eid celebrations
   - Islamic occasions

---

## 7. Widgets (Android/iOS)

### Overview
Home screen widgets showing real-time prayer information.

### Widget Types

```typescript
interface WidgetConfig {
  id: string;
  type: 'small' | 'medium' | 'large';
  platform: 'android' | 'ios';
  displayNextPrayer: boolean;
  displayCountdown: boolean;
  displayTemperature: boolean;
  displayLocation: boolean;
  refreshInterval: number;    // milliseconds
  updateFrequency: 'realtime' | 'hourly' | 'every-15min';
}
```

### Widget Data

```typescript
interface WidgetData {
  nextPrayer: {
    name: string;             // e.g., "Dhuhr"
    arabicName: string;       // e.g., "الظهر"
    time: string;             // HH:mm
    countdownText: string;    // "2h 30m 45s"
  };
  location: string;           // "London, UK"
  date: string;               // "March 12, 2024"
  hijriDate: string;          // "9 Ramadan 1445"
  temperature?: number;       // Celsius
  updateTime: number;         // Timestamp
}
```

### Android Widget Implementation

```kotlin
// Android widget with automatic updates
class PrayerTimeWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            val views = RemoteViews(context.packageName, R.layout.widget_prayer_time)
            
            val nextPrayer = getNextPrayer()
            views.setTextViewText(R.id.prayerName, nextPrayer.name)
            views.setTextViewText(R.id.prayerTime, nextPrayer.time)
            views.setTextViewText(R.id.countdown, nextPrayer.countdownText)
            
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
```

### iOS Widget Implementation

```swift
// iOS widget using WidgetKit
struct PrayerTimeWidget: Widget {
    let kind: String = "PrayerTimeWidget"
    
    var body: some WidgetConfiguration {
        AppIntentConfiguration(
            kind: kind,
            intent: SelectLocationIntent.self,
            provider: PrayerTimeProvider()
        ) { entry in
            PrayerTimeWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
```

### Widget Features
1. **Small Widget**
   - Next prayer name and time
   - Countdown timer
   - Tap to open app

2. **Medium Widget**
   - Next 3 prayers
   - Location and date
   - Prayer progress bar

3. **Large Widget**
   - All daily prayers
   - Hijri date
   - Next 7 days preview
   - Location and method info

---

## 8. Offline Caching & Travel Mode

### Overview
Comprehensive offline support with IndexedDB caching and travel-specific features.

### Cache Configuration

```typescript
interface CacheConfig {
  enabled: boolean;
  maxSize: number;            // MB
  expirationDays: number;     // How long to keep data
  autoSync: boolean;
  lastSyncTime?: number;
}
```

### IndexedDB Stores

```typescript
const STORES = {
  prayerTimes: 'prayerTimes',     // Cache API results
  locations: 'locations',          // Saved locations
  settings: 'settings',            // User preferences
  customAdhans: 'customAdhans',    // User-uploaded audio
  cache: 'cache'                   // Generic cache
};

// Initialize database
const db = await initIndexedDB();
// Automatically creates object stores and indexes
```

### Cache Strategy

```typescript
// Network-first strategy
async function fetchWithCache(
  url: string,
  options: { cache: 'network-first' | 'cache-first' }
) {
  if (options.cache === 'network-first') {
    try {
      const response = await fetch(url);
      if (response.ok) {
        // Save to cache
        await saveToCache(url, response);
        return response;
      }
    } catch (error) {
      // Network failed, try cache
    }
    return getFromCache(url);
  }
  // ... similar for cache-first
}
```

### Precaching Prayer Times

```typescript
// Download 90 days of prayer times before travel
async function prepareTravelModeData(
  location: SavedLocation,
  departureDate: string,
  returnDate: string
): Promise<OfflineData> {
  const prayerTimes: { [key: string]: PrayerTimesResponse } = {};
  
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    try {
      prayerTimes[dateStr] = await fetchPrayerTimes(location, date);
    } catch (error) {
      console.warn(`Failed to fetch for ${dateStr}`);
    }
  }
  
  return createOfflineDataSnapshot(prayerTimes, [location], {});
}
```

### Travel Mode

```typescript
interface TravelMode {
  enabled: boolean;
  destinationLocation: SavedLocation;
  departureDate: string;
  returnDate: string;
  timezone: string;
  useDestinationMethod: boolean;    // Switch to destination's method
  notifications: boolean;
  offlineMode: boolean;             // Force offline operation
  cachedDays: number;               // How many days are cached
}

// Enable travel mode
async function enableTravelMode(
  destination: SavedLocation,
  dates: { from: string; to: string }
) {
  const offlineData = await prepareTravelModeData(
    destination,
    dates.from,
    dates.to
  );
  
  // Store in IndexedDB
  await saveTravelModeData(offlineData);
  
  // Switch to destination timezone
  updateTimezone(destination.timezone);
  
  // Switch calculation method if needed
  if (travelMode.useDestinationMethod) {
    updateCalculationMethod(destination.preferredMethod);
  }
}
```

### Service Worker Integration

```typescript
// Register service worker
await registerServiceWorker();

// Service worker caches network requests
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then(
//       (response) => response || fetch(event.request)
//     )
//   );
// });
```

### Storage Quota Management

```typescript
const quotaInfo = await monitorStorageQuota();
console.log(`Using ${quotaInfo.percentage.toFixed(1)}% of storage`);

if (quotaInfo.percentage > 90) {
  // Clear old cache entries
  await clearExpiredCache();
}
```

---

## 9. User Settings Sync

### Overview
Cloud synchronization of user preferences across devices.

### Cloud Sync Manager

```typescript
class CloudSyncManager {
  async syncSettings(settings: UserSettings): Promise<boolean> {
    // Upload to cloud
    const response = await fetch('/api/sync/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        settings,
        timestamp: Date.now(),
        deviceId: getDeviceId()
      })
    });
    
    return response.ok;
  }
  
  async pullSettings(): Promise<UserSettings | null> {
    // Download from cloud
    const response = await fetch('/api/sync/settings', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return response.ok ? response.json() : null;
  }
  
  async syncPrayerHistory(history: PrayerRecord[]): Promise<boolean> {
    // Upload prayer tracking data
    return this.uploadPayload({
      userId,
      prayerHistory: history,
      timestamp: Date.now(),
      deviceId: getDeviceId()
    });
  }
}
```

### Sync Conflict Resolution

```typescript
function resolveConflict(
  local: UserSettings,
  remote: UserSettings
): UserSettings {
  // Strategy: Use remote if newer
  if (remote.updatedAt > local.updatedAt) {
    return remote;
  }
  
  // Merge strategies for specific fields
  return {
    ...local,
    locations: mergeLocations(local.locations, remote.locations),
    customAdhans: mergeAdhans(local.customAdhans, remote.customAdhans),
    prayerHistory: mergePrayerHistory(local, remote),
    updatedAt: Date.now()
  };
}
```

### Sync Queue

```typescript
// If offline or sync fails, queue for later
const syncQueue: CloudSyncPayload[] = [];

// Process queue when online
setupOnlineOfflineListeners(
  async () => {
    // Online
    while (syncQueue.length > 0) {
      const payload = syncQueue.shift();
      await syncManager.uploadPayload(payload);
    }
  },
  () => {
    // Offline
    console.log('Sync paused - will resume when online');
  }
);
```

### Auto-Sync Configuration

```typescript
interface UserSettings {
  syncSettings: {
    enabled: boolean;
    cloudProvider?: 'firebase' | 'supabase' | 'custom';
    lastSyncTime?: number;
    autoSync: boolean;
    syncInterval: number;   // milliseconds (default 5 minutes)
  };
}

// Auto-sync every 5 minutes
const unsubscribe = syncManager.setAutoSync(true, 300000);
```

---

## 10. Prayer Tracking System

### Overview
Comprehensive prayer performance tracking with statistics and history.

### Prayer Record

```typescript
type PrayerStatus = 'performed' | 'missed' | 'qada' | 'qasr' | 'not-applicable';

interface PrayerRecord {
  id: string;
  prayer: string;             // "Fajr", "Dhuhr", etc.
  date: string;               // YYYY-MM-DD
  hijriDate: string;
  status: PrayerStatus;
  actualTime?: string;        // When it was performed
  location?: SavedLocation;
  notes?: string;
  withJamaah: boolean;        // Congregation?
  sujoodDuration?: number;    // seconds
  recordedAt: number;
}
```

### Prayer Tracker Class

```typescript
class PrayerTracker {
  // Record a prayer
  recordPrayer(
    prayer: string,
    date: string,
    status: 'performed' | 'missed' | 'qada',
    actualTime?: string,
    withJamaah = false
  ): PrayerRecord {
    const record = {
      id: `${prayer}-${date}-${Date.now()}`,
      prayer,
      date,
      hijriDate: this.getHijriDate(date),
      status,
      actualTime,
      withJamaah,
      recordedAt: Date.now()
    };
    
    this.records.push(record);
    this.saveRecords();
    return record;
  }
  
  // Get prayer history
  getHistory(): PrayerHistory {
    return {
      totalPerformed: this.calculateTotal('performed'),
      totalMissed: this.calculateTotal('missed'),
      totalQada: this.calculateTotal('qada'),
      currentStreak: this.calculateCurrentStreak(),
      longestStreak: this.calculateLongestStreak(),
      avgConsistency: this.calculateConsistency(),
      byMonth: this.groupByMonth(),
      recentRecords: this.getRecentRecords(30)
    };
  }
  
  // Get statistics for specific prayer
  getStatistics(prayer: string) {
    const records = this.records.filter(r => r.prayer === prayer);
    
    return {
      performed: records.filter(r => r.status === 'performed').length,
      missed: records.filter(r => r.status === 'missed').length,
      qada: records.filter(r => r.status === 'qada').length,
      withJamaah: records.filter(r => r.withJamaah).length,
      rate: (performed / total) * 100
    };
  }
  
  // Get trend data for charts
  getTrendData(days: number = 30): number[] {
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = this.getDateNDaysAgo(i);
      const performed = this.countPerformedOnDate(date);
      trend.push(performed);
    }
    return trend;
  }
  
  // Export as CSV
  exportAsCSV(): void {
    const csv = this.records.map(r =>
      `${r.prayer},${r.date},${r.status},${r.actualTime || ''},${r.notes || ''}`
    ).join('\n');
    
    downloadFile(csv, `prayer-records-${Date.now()}.csv`);
  }
}
```

### Prayer History Visualization

```typescript
interface PrayerHistory {
  totalPerformed: number;
  totalMissed: number;
  totalQada: number;
  currentStreak: number;        // Consecutive prayers
  longestStreak: number;
  avgConsistency: number;       // Percentage
  byMonth: { [month: string]: PrayerRecord[] };
  recentRecords: PrayerRecord[];
}
```

### Dashboard Metrics
1. **Performance Rate** - % of prayers performed
2. **Current Streak** - Consecutive prayers on time
3. **Longest Streak** - Personal best
4. **Consistency Trend** - Last 30 days chart
5. **Jamaah Attendance** - Congregation count
6. **Qada Management** - Missed prayers to make up

---

## 11. Fiqh Notes & Islamic References

### Overview
Integrated Islamic jurisprudence guidance with hadith references.

### Fiqh Notes

```typescript
interface FiqhNote {
  id: string;
  title: string;
  arabicTitle: string;
  category: 'salah' | 'wudu' | 'ihram' | 'sunnahs' | 'makruhs' | 'conditions' | 'pillars' | 'obligatory';
  madhab: MadhabSchool[];       // Which schools follow this
  content: string;               // Full explanation
  arabicContent?: string;
  hadithReference?: {
    collection: string;          // "Sahih Bukhari"
    hadithNumber: string;
    gradeOfAuthenticity: string; // "Sahih", "Hasan", etc.
  };
  scholarNotes?: string;
  relevantPrayers?: string[];   // Which prayers
  createdAt: number;
  source?: string;
}

// Example Fiqh Notes
const fiqhNotes: FiqhNote[] = [
  {
    id: 'fiqh-001',
    title: 'Conditions of Wudu',
    arabicTitle: 'شروط الوضوء',
    category: 'wudu',
    madhab: [0, 1, 2, 3],       // All schools
    content: 'The conditions of Wudu are... (1) Water that is pure, (2) Intention...',
    hadithReference: {
      collection: 'Sahih Bukhari',
      hadithNumber: '4',
      gradeOfAuthenticity: 'Sahih'
    },
    relevantPrayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  },
  // ... more notes
];
```

### Islamic References

```typescript
interface IslamicReference {
  id: string;
  type: 'hadith' | 'quran-verse' | 'fatwa' | 'book-reference';
  title: string;
  arabicTitle: string;
  source: string;               // "Sahih Bukhari 4", "Quran 2:43"
  text: string;
  arabicText?: string;
  relevance: string[];          // Tags/categories
  scholar?: string;
  explanation?: string;
  links?: string[];
}
```

### Jurisprudence Guide

```typescript
interface JurisprudenceGuide {
  prayer: string;               // Which prayer (Fajr, Dhuhr)
  madhab: MadhabSchool;        // For specific school
  conditions: string[];         // Conditions for validity
  obligatoryActs: string[];    // Pillars/Rukn
  sunnahActs: string[];        // Recommended
  makruhActs: string[];        // Disliked but valid
  invalidators: string[];      // Nullifiers of prayer
  notes: FiqhNote[];
  references: IslamicReference[];
}
```

### Implementation

```typescript
// Display Fiqh note for a prayer
function displayFiqhNote(prayer: string, aspect: 'conditions' | 'sunnahs') {
  const guide = jurisprudenceGuides[prayer];
  
  if (aspect === 'conditions') {
    return guide.conditions.map(cond => (
      <FiqhNoteCard
        title={cond.title}
        content={cond.explanation}
        hadith={cond.hadithReference}
      />
    ));
  }
}

// Show relevant hadith
function showHadithReference(noteId: string) {
  const note = fiqhNotes.find(n => n.id === noteId);
  return (
    <HadithViewer
      collection={note.hadithReference.collection}
      number={note.hadithReference.hadithNumber}
      grade={note.hadithReference.gradeOfAuthenticity}
    />
  );
}
```

---

## 12. UI Design & Accessibility

### Overview
Professional UI with comprehensive accessibility (WCAG 2.1 AA compliance).

### Themes

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  customColors?: {
    [key: string]: string;
  };
}
```

### Accessibility Features

```typescript
interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  reduceMotion: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  keyboardNavigation: boolean;
  focusIndicator: boolean;
  textToSpeech: boolean;
}
```

### WCAG 2.1 Compliance

#### 1. **Perceivable**
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- No information by color alone
- Text resizable up to 200%
- Alternative text for images

#### 2. **Operable**
- Keyboard navigation (Tab, Enter, Arrow keys)
- Focus indicator visible
- No keyboard traps
- Skip navigation links
- Touch targets ≥ 48x48 pixels

#### 3. **Understandable**
- Clear language (no jargon)
- Consistent navigation
- Clear labels for forms
- Error messages and suggestions

#### 4. **Robust**
- Valid HTML
- Proper ARIA labels
- Works with assistive technology
- Compatible with browsers and devices

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #4caf50;
  --color-text-primary: #212121;
  --color-background: #ffffff;
  
  /* Typography */
  --font-size-md: 1rem;
  --font-weight-normal: 400;
  
  /* Spacing */
  --spacing-md: 1rem;
  
  /* Transitions */
  --transition-base: 250ms ease-in-out;
}

/* Dark theme */
[data-theme='dark'] {
  --color-background: #121212;
  --color-text-primary: #ffffff;
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semantic HTML

```html
<main>
  <header>
    <h1>Prayer Times</h1>
  </header>
  
  <article aria-label="Prayer time cards">
    <div role="article" aria-current="time">
      <h2>Fajr Prayer</h2>
      <time datetime="06:45:00">6:45 AM</time>
    </div>
  </article>
  
  <footer>
    <p>Prayer times for <span lang="ar">مكة</span> (Mecca)</p>
  </footer>
</main>
```

---

## 13. Automated Tests

### Test Structure

```typescript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/app/prayer-time/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Unit Tests

```typescript
describe('Prayer Time Calculations', () => {
  test('Calculate Qibla direction', () => {
    const qibla = calculateQiblaDirection(40.7128, -74.006);
    
    expect(qibla.azimuth).toBeGreaterThanOrEqual(0);
    expect(qibla.azimuth).toBeLessThanOrEqual(360);
  });
  
  test('Hijri date conversion', () => {
    const hijri = gregorianToHijri(2024, 1, 1);
    
    expect(hijri.month.number).toBeGreaterThanOrEqual(1);
    expect(hijri.month.number).toBeLessThanOrEqual(12);
  });
});
```

### Integration Tests

```typescript
describe('Prayer Tracking Integration', () => {
  test('Record and retrieve prayer', async () => {
    const tracker = new PrayerTracker();
    
    tracker.recordPrayer('Fajr', '2024-03-12', 'performed', '05:45');
    
    const history = tracker.getHistory();
    expect(history.totalPerformed).toBe(1);
  });
});
```

### E2E Tests (Cypress)

```typescript
describe('Prayer Times App', () => {
  beforeEach(() => {
    cy.visit('/prayer-time');
  });
  
  it('Should display prayer times', () => {
    cy.get('[data-testid="fajr-time"]').should('be.visible');
    cy.get('[data-testid="dhuhr-time"]').should('be.visible');
  });
  
  it('Should search for custom location', () => {
    cy.get('[data-testid="city-input"]').type('London');
    cy.get('[data-testid="country-input"]').type('United Kingdom');
    cy.get('[data-testid="search-button"]').click();
    
    cy.get('[data-testid="prayer-times"]').should('be.visible');
  });
  
  it('Should enable travel mode', () => {
    cy.get('[data-testid="travel-mode-button"]').click();
    cy.get('[data-testid="travel-modal"]').should('be.visible');
  });
});
```

### Accessibility Tests

```typescript
import { axe } from 'jest-axe';

test('Should have no accessibility violations', async () => {
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});
```

### Performance Tests

```typescript
describe('Performance', () => {
  test('Load time < 2 seconds', () => {
    const start = performance.now();
    // Load app
    const end = performance.now();
    
    expect(end - start).toBeLessThan(2000);
  });
  
  test('Prayer calculation < 100ms', () => {
    const start = performance.now();
    const timings = calculatePrayerTimesOffline(
      new Date(),
      40.7128,
      -74.006,
      'UTC-5'
    );
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });
});
```

---

## Configuration & Setup

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_ALADHAN_API_URL=https://api.aladhan.com/v1
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_MAPBOX_TOKEN=xxx
API_ENDPOINT=http://localhost:3000/api
FIREBASE_ADMIN_SDK=xxx
```

### Package Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "leaflet": "^1.9.4",
    "firebase": "^10.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "jest-axe": "^8.0.0",
    "cypress": "^13.0.0",
    "vitest": "^0.34.0"
  }
}
```

---

## Deployment

### Production Checklist
- [ ] All tests passing (100% for critical paths)
- [ ] Performance budgets met
- [ ] Accessibility audit passed (axe)
- [ ] Security audit passed
- [ ] GDPR/privacy compliance
- [ ] Service worker production-ready
- [ ] Database backups configured
- [ ] CDN configured for static assets
- [ ] Error monitoring set up (Sentry)
- [ ] Analytics configured

### Monitoring
- Prayer times calculation accuracy
- App load performance
- User engagement metrics
- Prayer recording completion rate
- Widget usage statistics
- Offline mode usage
- Sync success rate

---

## Future Enhancements

1. **AI-Powered Insights**
   - Prayer habit analysis
   - Personalized recommendations
   - Predictive prayer timing

2. **Community Features**
   - Prayer groups/Jamaah finder
   - Mosque directory with ratings
   - Community prayer tracking

3. **Advanced Analytics**
   - Prayer consistency trends
   - Comparison with community
   - Health integration (step count during prayer)

4. **Multi-Platform**
   - React Native mobile app
   - Flutter version for iOS
   - Desktop electron app

5. **AR/VR Features**
   - Augmented reality Qibla compass
   - Virtual prayer space
   - 3D Kaaba visualization

---

End of Documentation
