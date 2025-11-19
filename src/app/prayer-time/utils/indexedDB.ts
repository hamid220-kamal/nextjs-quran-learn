/**
 * ===== PRAYER TIME APP - INDEXEDDB UTILITIES =====
 * Handles large binary data storage (audio files) with metadata
 * Features: File upload, validation, retrieval, deletion, quota management
 */

export interface StoredAudio {
  id: string;
  name: string;
  file: Blob;
  size: number;
  mimeType: string;
  duration?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AudioMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  duration?: number;
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = 'PrayerTimeApp';
const STORE_NAME = 'audio_files';
const DB_VERSION = 1;

// ========== DATABASE INITIALIZATION ==========

/**
 * Initialize IndexedDB and create object stores
 */
export function initializeIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ IndexedDB initialization failed');
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('✅ IndexedDB initialized');
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('✅ Created audio_files object store');
      }
    };
  });
}

/**
 * Get IndexedDB instance
 */
async function getDB(): Promise<IDBDatabase> {
  try {
    return await initializeIndexedDB();
  } catch (error) {
    console.error('❌ Failed to get IndexedDB:', error);
    throw error;
  }
}

// ========== AUDIO FILE OPERATIONS ==========

/**
 * Save audio file to IndexedDB
 */
export async function saveAudioFile(
  file: File,
  customName?: string
): Promise<AudioMetadata> {
  try {
    // Validate file
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const db = await getDB();

    // Get file duration (if audio)
    let duration: number | undefined;
    try {
      duration = await getAudioDuration(file);
    } catch (e) {
      console.warn('Could not get audio duration:', e);
    }

    const audioRecord: StoredAudio = {
      id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: customName || file.name,
      file,
      size: file.size,
      mimeType: file.type,
      duration,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Use transaction with proper promise handling
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(audioRecord);

      request.onsuccess = () => {
        console.log(`✅ Audio saved: ${audioRecord.name}`);
        resolve({
          id: audioRecord.id,
          name: audioRecord.name,
          size: audioRecord.size,
          mimeType: audioRecord.mimeType,
          duration,
          createdAt: audioRecord.createdAt,
          updatedAt: audioRecord.updatedAt,
        });
      };

      request.onerror = () => {
        reject(new Error(`Failed to save audio: ${request.error?.message || 'Unknown error'}`));
      };

      transaction.onerror = () => {
        reject(new Error(`Transaction error: ${transaction.error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error('❌ Error saving audio file:', error);
    throw error;
  }
}

/**
 * Get audio file from IndexedDB
 */
export async function getAudioFile(id: string): Promise<File | null> {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          const audio = request.result as StoredAudio;
          const file = new File([audio.file], audio.name, { type: audio.mimeType });
          resolve(file);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('❌ Error getting audio file:', error);
    return null;
  }
}

/**
 * Get audio file as URL (for playback)
 */
export async function getAudioFileURL(id: string): Promise<string | null> {
  try {
    const file = await getAudioFile(id);
    if (!file) return null;
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('❌ Error creating audio URL:', error);
    return null;
  }
}

/**
 * Get all audio files metadata
 */
export async function getAllAudioMetadata(): Promise<AudioMetadata[]> {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const audios = request.result as StoredAudio[];
        const metadata: AudioMetadata[] = audios.map(audio => ({
          id: audio.id,
          name: audio.name,
          size: audio.size,
          mimeType: audio.mimeType,
          duration: audio.duration,
          createdAt: audio.createdAt,
          updatedAt: audio.updatedAt,
        }));
        resolve(metadata);
      };

      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('❌ Error getting audio metadata:', error);
    return [];
  }
}

/**
 * Delete audio file from IndexedDB
 */
export async function deleteAudioFile(id: string): Promise<boolean> {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`✅ Audio deleted: ${id}`);
        resolve(true);
      };

      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('❌ Error deleting audio file:', error);
    return false;
  }
}

/**
 * Clear all audio files (for cleanup/reset)
 */
export async function clearAllAudio(): Promise<boolean> {
  try {
    const db = await getDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        console.log('✅ All audio files cleared');
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ Error clearing audio files:', error);
    return false;
  }
}

/**
 * Get total size of stored audio files
 */
export async function getAudioStorageSize(): Promise<number> {
  try {
    const metadata = await getAllAudioMetadata();
    return metadata.reduce((total, audio) => total + audio.size, 0);
  } catch (error) {
    console.error('❌ Error calculating storage size:', error);
    return 0;
  }
}

// ========== VALIDATION & UTILITIES ==========

/**
 * Validate audio file - ONLY MP3 ALLOWED
 */
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3'];
  const ALLOWED_EXTENSIONS = ['.mp3'];

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `❌ Only MP3 files are allowed. File "${file.name}" is not an MP3 file.`,
    };
  }

  // Check MIME type
  if (!ALLOWED_TYPES.includes(file.type) && file.type !== '') {
    return {
      valid: false,
      error: `❌ File type must be MP3. Got: ${file.type || 'unknown'} (${file.name})`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `❌ MP3 file too large. Maximum size is 50MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: `❌ MP3 file is empty. Please select a valid MP3 file.`,
    };
  }

  return { valid: true };
}

/**
 * Get audio duration from File object
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load audio'));
    });

    audio.src = url;
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format duration in seconds to HH:MM:SS
 */
export function formatDuration(seconds: number | undefined): string {
  if (!seconds || isNaN(seconds)) return 'Unknown';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert Audio Blob to Data URL (for legacy browsers without IndexedDB)
 */
export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert Data URL to Blob
 */
export function dataURLToBlob(dataURL: string): Blob {
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(data);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

// ========== STORAGE QUOTA ==========

/**
 * Get IndexedDB storage quota and usage
 */
export async function getStorageQuota(): Promise<{
  quota: number;
  usage: number;
  available: number;
  percent: number;
}> {
  try {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { quota: 0, usage: 0, available: 0, percent: 0 };
    }

    const estimate = await navigator.storage.estimate();
    const quota = estimate.quota || 0;
    const usage = estimate.usage || 0;
    const available = quota - usage;
    const percent = quota > 0 ? (usage / quota) * 100 : 0;

    console.log(`📊 Storage - Usage: ${formatFileSize(usage)} / ${formatFileSize(quota)} (${percent.toFixed(2)}%)`);

    return { quota, usage, available, percent };
  } catch (error) {
    console.error('❌ Error getting storage quota:', error);
    return { quota: 0, usage: 0, available: 0, percent: 0 };
  }
}

/**
 * Request persistent storage permission
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage || !navigator.storage.persist) {
      return false;
    }

    const isPersisted = await navigator.storage.persist();
    console.log(isPersisted ? '✅ Storage is persistent' : '⚠️ Storage is not persistent');
    return isPersisted;
  } catch (error) {
    console.error('❌ Error requesting persistent storage:', error);
    return false;
  }
}
