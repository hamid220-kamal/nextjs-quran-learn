// Audio recitation sources with fallbacks
const AUDIO_SOURCES = {
  primary: {
    reciter: 'ar.alafasy',
    baseUrl: 'https://cdn.islamic.network/quran/audio',
    qualities: ['128'] // Available qualities: 128kbps
  },
  fallback: {
    reciter: 'ar.alafasy',
    baseUrl: 'https://verse.mp3quran.net/arabic',
    qualities: ['128', '64', '32'] // Available qualities
  }
}

// Get all possible audio URLs for a verse
/**
 * Get all possible audio URLs for a verse
 * @param {number} absoluteAyahNumber - Absolute ayah number (for Islamic.network/alquran.cloud)
 * @param {number} [surah] - Surah number (for mp3quran)
 * @param {number} [ayah] - Ayah number in surah (for mp3quran)
 */
export function getAudioUrls(absoluteAyahNumber: number, surah?: number, ayah?: number): string[] {
  const urls: string[] = [];

  // Islamic.network CDN (absolute ayah)
  urls.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${absoluteAyahNumber}.mp3`);

  // alquran.cloud CDN (absolute ayah)
  urls.push(`https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${absoluteAyahNumber}`);

  // mp3quran.net (surah/ayah)
  if (surah && ayah) {
    ['128', '64', '32'].forEach(quality => {
      urls.push(`https://verse.mp3quran.net/arabic/ar.alafasy/${quality}/${surah}/${ayah}.mp3`);
      urls.push(`https://server8.mp3quran.net/afs/${surah}/${ayah}.mp3`);
      urls.push(`https://server7.mp3quran.net/shur/${surah}/${ayah}.mp3`);
    });
    // EveryAyah CDN (surah/ayah padded)
    const paddedSurah = surah.toString().padStart(3, '0');
    const paddedAyah = ayah.toString().padStart(3, '0');
    urls.push(`https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_64kbps/${paddedSurah}${paddedAyah}.mp3`);
    // QuranCentral
    urls.push(`https://audio1.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-${paddedSurah}-${paddedAyah}.mp3`);
  }

  return urls;
}

// Validate audio URL
export async function validateAudioUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && response.headers.get('content-type')?.startsWith('audio/')
  } catch {
    return false
  }
}

// Get first working audio URL from the list
export async function getWorkingAudioUrl(absoluteAyahNumber: number, surah?: number, ayah?: number): Promise<string | null> {
  const urls = getAudioUrls(absoluteAyahNumber, surah, ayah);
  let lastError = '';
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok && response.headers.get('content-type')?.startsWith('audio/')) {
        // Log CORS header for debugging
        const corsHeader = response.headers.get('Access-Control-Allow-Origin') || response.headers.get('access-control-allow-origin');
        if (typeof window !== 'undefined') {
          console.log(`[Audio Debug] URL OK: ${url}, CORS: ${corsHeader}`);
        }
        // Always return the first accessible audio URL, proxy will handle CORS
        return url;
      } else {
        lastError += `URL failed (${response.status}): ${url}\n`;
      }
    } catch (err) {
      lastError += `Fetch error: ${url} - ${err}\n`;
    }
  }
  if (typeof window !== 'undefined') {
    console.warn('All audio sources failed for ayah', { absoluteAyahNumber, surah, ayah, lastError });
  }
  return null;
}