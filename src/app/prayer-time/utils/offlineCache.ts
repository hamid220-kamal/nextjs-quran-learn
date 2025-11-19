/**
 * Offline Caching & Service Worker Integration
 * Implements localStorage caching, IndexedDB for large data, and service worker management
 */

import type {
  PrayerTimesResponse,
  SavedLocation,
  OfflineData,
  CacheConfig,
} from '../types';

// ==================== INDEXEDDB CACHE ====================

const DB_NAME = 'LearnQuranPrayerTimes';
const DB_VERSION = 1;
const STORES = {
  prayerTimes: 'prayerTimes',
  locations: 'locations',
  settings: 'settings',
  customAdhans: 'customAdhans',
  cache: 'cache',
};

/**
 * Initialize IndexedDB database
 */
export const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Prayer times cache store
      if (!db.objectStoreNames.contains(STORES.prayerTimes)) {
        const store = db.createObjectStore(STORES.prayerTimes, { keyPath: 'id' });
        store.createIndex('location', 'location', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
      }

      // Locations store
      if (!db.objectStoreNames.contains(STORES.locations)) {
        db.createObjectStore(STORES.locations, { keyPath: 'id' });
      }

      // Settings store
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'userId' });
      }

      // Custom Adhans store
      if (!db.objectStoreNames.contains(STORES.customAdhans)) {
        db.createObjectStore(STORES.customAdhans, { keyPath: 'id' });
      }

      // Generic cache store
      if (!db.objectStoreNames.contains(STORES.cache)) {
        const store = db.createObjectStore(STORES.cache, { keyPath: 'key' });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
    };
  });
};

/**
 * Cache prayer times to IndexedDB
 */
export const cachePrayerTimes = async (
  locationId: string,
  date: string,
  data: PrayerTimesResponse,
  expirationDays: number = 30
): Promise<void> => {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([STORES.prayerTimes], 'readwrite');
    const store = transaction.objectStore(STORES.prayerTimes);

    const expiresAt = Date.now() + expirationDays * 24 * 60 * 60 * 1000;
    const cacheEntry = {
      id: `${locationId}-${date}`,
      location: locationId,
      date,
      data,
      cachedAt: Date.now(),
      expiresAt,
    };

    store.put(cacheEntry);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('Failed to cache prayer times:', error);
  }
};

/**
 * Retrieve cached prayer times from IndexedDB
 */
export const getCachedPrayerTimes = async (
  locationId: string,
  date: string
): Promise<PrayerTimesResponse | null> => {
  if (!isIndexedDBAvailable()) return null;

  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([STORES.prayerTimes], 'readonly');
    const store = transaction.objectStore(STORES.prayerTimes);

    return new Promise((resolve, reject) => {
      const request = store.get(`${locationId}-${date}`);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiresAt > Date.now()) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to retrieve cached prayer times:', error);
    return null;
  }
};

/**
 * Cache multiple months of prayer times
 */
export const precachePrayerTimes = async (
  locationId: string,
  prayerTimes: { [key: string]: PrayerTimesResponse },
  expirationDays: number = 30
): Promise<void> => {
  const promises = Object.entries(prayerTimes).map(([date, data]) =>
    cachePrayerTimes(locationId, date, data, expirationDays)
  );

  await Promise.all(promises);
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = async (): Promise<void> => {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([STORES.prayerTimes, STORES.cache], 'readwrite');

    // Clear expired prayer times
    const prayerTimesStore = transaction.objectStore(STORES.prayerTimes);
    const expiresAtIndex = prayerTimesStore.index('expiresAt');

    const range = IDBKeyRange.upperBound(Date.now());
    expiresAtIndex.openCursor(range).onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Clear expired generic cache
    const cacheStore = transaction.objectStore(STORES.cache);
    const cacheIndex = cacheStore.index('expiresAt');

    cacheIndex.openCursor(range).onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('Failed to clear expired cache:', error);
  }
};

/**
 * Get cache size information
 */
export const getCacheInfo = async (): Promise<{ size: number; itemCount: number }> => {
  if (!isIndexedDBAvailable()) return { size: 0, itemCount: 0 };

  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([STORES.prayerTimes, STORES.cache], 'readonly');

    let itemCount = 0;
    let size = 0;

    return new Promise((resolve, reject) => {
      const prayerTimesStore = transaction.objectStore(STORES.prayerTimes);
      prayerTimesStore.openCursor().onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          itemCount++;
          size += JSON.stringify(cursor.value).length;
          cursor.continue();
        } else {
          const cacheStore = transaction.objectStore(STORES.cache);
          cacheStore.openCursor().onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              itemCount++;
              size += JSON.stringify(cursor.value).length;
              cursor.continue();
            } else {
              resolve({ size, itemCount });
            }
          };
        }
      };

      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('Failed to get cache info:', error);
    return { size: 0, itemCount: 0 };
  }
};

// ==================== LOCALSTORAGE FALLBACK ====================

/**
 * Store data in localStorage with expiration
 */
export const setLocalStorageWithExpiry = (
  key: string,
  value: any,
  expirationDays: number = 30
): void => {
  try {
    const expiresAt = Date.now() + expirationDays * 24 * 60 * 60 * 1000;
    const item = {
      value,
      expiresAt,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

/**
 * Retrieve data from localStorage with expiration check
 */
export const getLocalStorageWithExpiry = (key: string): any | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch (error) {
    console.warn('Failed to retrieve from localStorage:', error);
    return null;
  }
};

/**
 * Create offline data snapshot
 */
export const createOfflineDataSnapshot = async (
  prayerTimes: { [key: string]: PrayerTimesResponse },
  locations: SavedLocation[],
  settings: any
): Promise<OfflineData> => {
  return {
    prayerTimes,
    locations,
    settings,
    lastUpdated: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
};

/**
 * Export offline data for backup
 */
export const exportOfflineData = (data: OfflineData): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prayer-times-backup-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import offline data from backup
 */
export const importOfflineData = (
  file: File
): Promise<OfflineData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data as OfflineData);
      } catch (error) {
        reject(new Error('Invalid backup file format'));
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

// ==================== SERVICE WORKER MANAGEMENT ====================

/**
 * Register service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/prayer-time/',
    });

    console.log('Service Worker registered:', registration);

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          console.log('New service worker activated');
        }
      });
    });

    return registration;
  } catch (error) {
    console.warn('Service Worker registration failed:', error);
    return null;
  }
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  } catch (error) {
    console.warn('Failed to unregister service worker:', error);
  }
};

/**
 * Check if app is online
 */
export const isAppOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for online/offline events
 */
export const setupOnlineOfflineListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// ==================== TRAVEL MODE ====================

/**
 * Prepare offline data for travel
 */
export const prepareTravelModeData = async (
  destinationLocation: SavedLocation,
  departureDate: string,
  returnDate: string,
  prayerTimesAPI: (location: SavedLocation, date: string) => Promise<PrayerTimesResponse>
): Promise<OfflineData | null> => {
  try {
    const prayerTimes: { [key: string]: PrayerTimesResponse } = {};

    // Fetch prayer times for entire travel period
    const startDate = new Date(departureDate);
    const endDate = new Date(returnDate);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0];
      try {
        const prayerData = await prayerTimesAPI(destinationLocation, dateStr);
        prayerTimes[dateStr] = prayerData;
      } catch (error) {
        console.warn(`Failed to fetch prayer times for ${dateStr}:`, error);
      }
    }

    const snapshot = await createOfflineDataSnapshot(
      prayerTimes,
      [destinationLocation],
      {}
    );

    return snapshot;
  } catch (error) {
    console.error('Failed to prepare travel mode data:', error);
    return null;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if IndexedDB is available
 */
const isIndexedDBAvailable = (): boolean => {
  try {
    return !!window.indexedDB;
  } catch (error) {
    return false;
  }
};

/**
 * Calculate optimal cache size based on device
 */
export const getOptimalCacheSize = (): number => {
  // Use device storage info if available (requires permissions)
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return 100 * 1024 * 1024; // 100MB max
  }

  // Fallback based on device type
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android')) {
    return 50 * 1024 * 1024; // 50MB for mobile
  }

  return 100 * 1024 * 1024; // 100MB for desktop
};

/**
 * Monitor storage quota
 */
export const monitorStorageQuota = async (): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> => {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return { usage: 0, quota: 0, percentage: 0 };
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
    };
  } catch (error) {
    console.warn('Failed to estimate storage:', error);
    return { usage: 0, quota: 0, percentage: 0 };
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = async (): Promise<void> => {
  // Clear IndexedDB
  if (isIndexedDBAvailable()) {
    try {
      const db = await initIndexedDB();
      for (const storeName of Object.values(STORES)) {
        const transaction = db.transaction([storeName], 'readwrite');
        transaction.objectStore(storeName).clear();
      }
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }

  // Clear localStorage
  const keysToRemove = [
    'savedLocations',
    'locationSearchHistory',
    'locationStatistics',
    'prayerReminders',
    'audioSettings',
    'customAlarms',
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));

  console.log('All caches cleared');
};
