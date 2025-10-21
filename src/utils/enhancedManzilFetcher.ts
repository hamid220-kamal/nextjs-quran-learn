/**
 * Enhanced Manzil Audio Fetcher
 * Fetches all ayahs in a Manzil and generates audio URLs for each ayah
 */

import { getAudioUrls } from './audio';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

export async function getManzilAyahs(manzilNumber: number) {
  // Fetch Manzil data from AlQuran.cloud API
  const response = await fetch(`${API_BASE_URL}/manzil/${manzilNumber}`);
  const data = await response.json();
  if (data.code !== 200 || !data.data || !data.data.ayahs) {
    throw new Error('Failed to fetch Manzil ayahs');
  }
  return data.data.ayahs;
}

/**
 * Get audio URLs for all ayahs in a Manzil
 * @param manzilNumber The Manzil number (1-7)
 * @param reciter Optional reciter string (not used for now, uses getAudioUrls logic)
 * @returns Array of arrays of audio URLs for each ayah
 */
export async function getManzilAudioUrls(manzilNumber: number, reciter?: string): Promise<string[][]> {
  const ayahs = await getManzilAyahs(manzilNumber);
  // For each ayah, generate audio URLs using getAudioUrls
  return ayahs.map(ayah => {
    // ayah.absoluteNumber, ayah.surah.number, ayah.numberInSurah
    return getAudioUrls(ayah.absoluteNumber, ayah.surah.number, ayah.numberInSurah);
  });
}
