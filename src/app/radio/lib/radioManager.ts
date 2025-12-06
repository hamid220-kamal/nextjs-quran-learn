/**
 * Radio Module Utilities
 * Handles all radio-specific logic including station management, playback, and state
 */

import {
  fetchReciters,
  fetchChapters,
  fetchStations,
  fetchAudio,
  searchRadio,
  fetchJuzs,
  Reciter,
  Station,
  Chapter,
  Juz,
} from './api';

export class RadioManager {
  private static instance: RadioManager;
  private reciters: Reciter[] = [];
  private chapters: Chapter[] = [];
  private stations: Station[] = [];
  private juzs: Juz[] = [];
  private loaded = false;

  private constructor() {}

  /**
   * Singleton instance getter
   */
  static getInstance(): RadioManager {
    if (!RadioManager.instance) {
      RadioManager.instance = new RadioManager();
    }
    return RadioManager.instance;
  }

  /**
   * Initialize all radio data
   */
  async initialize(): Promise<void> {
    if (this.loaded) return;

    try {
      // Fetch all data in parallel
      const [reciters, chapters, stations, juzs] = await Promise.all([
        fetchReciters(),
        fetchChapters(),
        fetchStations(),
        fetchJuzs(),
      ]);

      this.reciters = reciters;
      this.chapters = chapters;
      this.stations = stations.allStations || [];
      this.juzs = juzs;
      this.loaded = true;

      console.log('Radio Manager initialized successfully');
    } catch (error) {
      console.error('Error initializing Radio Manager:', error);
      this.loaded = false;
    }
  }

  /**
   * Get all reciters
   */
  getReciters(): Reciter[] {
    return this.reciters;
  }

  /**
   * Get reciter by ID
   */
  getReciterById(id: number): Reciter | undefined {
    return this.reciters.find((r) => r.id === id);
  }

  /**
   * Get all chapters/surahs
   */
  getChapters(): Chapter[] {
    return this.chapters;
  }

  /**
   * Get chapter by ID or number
   */
  getChapterById(id: number): Chapter | undefined {
    return this.chapters.find((c) => c.id === id);
  }

  /**
   * Get chapter by name (case-insensitive)
   */
  getChapterByName(name: string): Chapter | undefined {
    const lowerName = name.toLowerCase();
    return this.chapters.find(
      (c) =>
        c.name_simple.toLowerCase().includes(lowerName) ||
        c.name_complex.toLowerCase().includes(lowerName) ||
        c.name_arabic.includes(name)
    );
  }

  /**
   * Get all stations
   */
  getStations(): Station[] {
    return this.stations;
  }

  /**
   * Get featured/curated stations
   */
  getFeaturedStations(): Station[] {
    return this.stations.filter((s) => s.featured);
  }

  /**
   * Get reciter stations
   */
  getReciterStations(): Station[] {
    return this.stations.filter((s) => s.type === 'reciter');
  }

  /**
   * Get all Juzs
   */
  getJuzs(): Juz[] {
    return this.juzs;
  }

  /**
   * Get Juz by number
   */
  getJuzByNumber(juzNumber: number): Juz | undefined {
    return this.juzs.find((j) => j.juz_number === juzNumber);
  }

  /**
   * Get audio for reciter and surah
   */
  async getAudio(
    reciterId: number,
    surahNumber: number,
    verseStart?: number,
    verseEnd?: number
  ): Promise<any> {
    return await fetchAudio(reciterId, surahNumber, verseStart, verseEnd);
  }

  /**
   * Search for surahs and reciters
   */
  async search(query: string, type: 'all' | 'surah' | 'reciter' = 'all'): Promise<any> {
    return await searchRadio(query, type);
  }

  /**
   * Get popular reciters (most common ones)
   */
  getPopularReciters(limit: number = 10): Reciter[] {
    // Return the first 'limit' reciters as popular
    return this.reciters.slice(0, limit);
  }

  /**
   * Get Quran structure for radio (chapters grouped by juz)
   */
  getQuranStructure(): any {
    return {
      chapters: this.chapters,
      juzs: this.juzs,
      totalChapters: this.chapters.length,
      totalJuzs: this.juzs.length,
      totalVerses: this.chapters.reduce((sum, c) => sum + c.verses_count, 0),
    };
  }
}

/**
 * Get singleton instance of RadioManager
 */
export const radioManager = RadioManager.getInstance();

/**
 * Hook-friendly function to fetch radio data
 */
export async function initializeRadio(): Promise<void> {
  const manager = RadioManager.getInstance();
  await manager.initialize();
}

/**
 * Get all radio data
 */
export async function getRadioData(): Promise<any> {
  const manager = RadioManager.getInstance();
  await manager.initialize();

  return {
    reciters: manager.getReciters(),
    chapters: manager.getChapters(),
    stations: manager.getStations(),
    juzs: manager.getJuzs(),
    structure: manager.getQuranStructure(),
  };
}

/**
 * Search helper
 */
export async function searchRadioContent(
  query: string,
  type: 'all' | 'surah' | 'reciter' = 'all'
): Promise<any> {
  const manager = RadioManager.getInstance();
  return await manager.search(query, type);
}
