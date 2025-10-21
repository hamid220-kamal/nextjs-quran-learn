/**
 * Basic async function to fetch Arabic + English + audio for a Ruku.
 * Keeps merged text, attaches audioUrl for each verse, and returns final array.
 * Usage: const verses = await fetchRukuWithAudioBasic(rukuNumber);
 */
export type BasicVerse = {
  number: number;
  surah: number;
  ayah: number;
  arabicText: string;
  englishText: string;
  audioUrl: string | null;
};

export async function fetchRukuWithAudioBasic(rukuNumber: number, audioEdition: string = 'ar.alafasy'): Promise<BasicVerse[]> {
  if (!rukuNumber || rukuNumber < 1 || rukuNumber > 556) throw new Error('Invalid Ruku number');
  // Step 1: Fetch Arabic
  const arabicRes = await fetch(`https://api.alquran.cloud/v1/ruku/${rukuNumber}/quran-uthmani`);
  const arabicJson = await arabicRes.json();
  if (arabicJson.status !== 'OK' || !Array.isArray(arabicJson.data?.ayahs)) throw new Error('Arabic ruku fetch failed');
  // Step 2: Fetch English
  const englishRes = await fetch(`https://api.alquran.cloud/v1/ruku/${rukuNumber}/en.asad`);
  const englishJson = await englishRes.json();
  if (englishJson.status !== 'OK' || !Array.isArray(englishJson.data?.ayahs)) throw new Error('English ruku fetch failed');
  // Step 3: Merge by index
  const minLen = Math.min(arabicJson.data.ayahs.length, englishJson.data.ayahs.length);
  const merged: BasicVerse[] = [];
  for (let i = 0; i < minLen; i++) {
    const ar = arabicJson.data.ayahs[i];
    const en = englishJson.data.ayahs[i];
    merged.push({
      number: ar.number,
      surah: ar.surah.number,
      ayah: ar.numberInSurah,
      arabicText: ar.text,
      englishText: en.text,
      audioUrl: null,
    });
  }
  // Step 4: Fetch audio for each verse
  const audioResults: PromiseSettledResult<string | null>[] = await Promise.allSettled(
    merged.map(async (v) => {
      try {
        const audioRes = await fetch(`https://api.alquran.cloud/v1/ayah/${v.number}/${audioEdition}`);
        const audioJson = await audioRes.json();
        if (audioJson.status === 'OK' && audioJson.data?.audio) {
          return audioJson.data.audio;
        }
      } catch {}
      return null;
    })
  );
  // Step 5: Attach audioUrl
  for (let i = 0; i < merged.length; i++) {
    merged[i].audioUrl = audioResults[i].status === 'fulfilled' ? (audioResults[i] as PromiseFulfilledResult<string | null>).value : null;
  }
  // Step 6: Return final array
  return merged;
}
/**
 * Fetches merged Arabic+English ayahs for a Ruku and resolves audio URLs for each verse.
 * Returns an array of verse objects with audioUrl and meta for UI playback.
 *
 * Usage:
 *   const verses = await fetchRukuWithAudio(1, {
 *     audioEdition: 'ar.alafasy',
 *     concurrencyLimit: 6,
 *     retries: 2,
 *     onProgress: (idx, total, status) => { ... }
 *   });
 *
 * UI can use audioUrl for playback, meta for status, and onProgress for spinners.
 */

type AudioStatus = "ok" | "missing" | "failed";

export type AudioVerse = {
  id: number;
  surah: number;
  ayah: number;
  arabicText: string;
  englishText: string;
  audioUrl: string | null;
  meta: {
    ruku: number;
    surahName: string;
    surahArabicName: string;
    audioEdition: string;
    audioStatus: AudioStatus;
    retries: number;
  };
};

const audioCache: Record<string, { timestamp: number; data: AudioVerse[] }> = {};
const AUDIO_CACHE_TTL = 1000 * 60 * 60; // 1 hour

function isValidAudioUrl(url: any): boolean {
  return typeof url === 'string' && /^https?:\/\/.+\.(mp3|aac|m4a|wav)(\?.*)?$/.test(url);
}

async function resolveAudioForRuku(
  verses: MergedVerse[],
  options: {
    audioEdition: string;
    concurrencyLimit?: number;
    retries?: number;
    dryRun?: boolean;
    signal?: AbortSignal;
    onProgress?: (idx: number, total: number, status: AudioStatus) => void;
  }
): Promise<AudioVerse[]> {
  const {
    audioEdition,
    concurrencyLimit = 6,
    retries = 2,
    dryRun = false,
    signal,
    onProgress,
  } = options;
  if (dryRun) {
    return verses.map((v, idx) => ({
      ...v,
      audioUrl: null,
      meta: {
        ...v.meta,
        audioEdition,
        audioStatus: 'missing',
        retries: 0,
      },
    }));
  }
  // Concurrency pool for audio fetches
  async function pool<T, R>(items: T[], worker: (item: T, idx: number) => Promise<R>, limit: number): Promise<R[]> {
    const results: R[] = [];
    let i = 0;
    const executing: Promise<void>[] = [];
    async function run(item: T, idx: number) {
      results[idx] = await worker(item, idx);
    }
    while (i < items.length) {
      const idx = i;
      const p = run(items[i], idx);
      executing.push(p);
      i++;
      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(0, executing.length - limit + 1);
      }
    }
    await Promise.all(executing);
    return results;
  }
  // Audio fetch with retries/backoff
  async function fetchAudio(ayahId: number, edition: string, signal?: AbortSignal, maxRetries = 2): Promise<{ url: string | null; status: AudioStatus; retries: number }> {
    let tries = 0;
    let lastError: any = null;
    let url = `https://api.alquran.cloud/v1/ayah/${ayahId}/${edition}`;
    while (tries <= maxRetries) {
      try {
        const res = await fetch(url, { signal });
        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") || "2", 10);
          if (retryAfter > 10) return { url: null, status: 'failed', retries: tries };
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          tries++;
          continue;
        }
        if (res.status >= 500) {
          await new Promise((resolve) => setTimeout(resolve, tries === 0 ? 300 : 700 * tries));
          tries++;
          continue;
        }
        if (res.status >= 400) {
          if (res.status === 404) return { url: null, status: 'missing', retries: tries };
          return { url: null, status: 'failed', retries: tries };
        }
        const json = await res.json();
        let audioUrl = null;
        if (json?.data?.audio && isValidAudioUrl(json.data.audio)) audioUrl = json.data.audio;
        else if (json?.data?.audioSecondary && Array.isArray(json.data.audioSecondary) && isValidAudioUrl(json.data.audioSecondary[0])) audioUrl = json.data.audioSecondary[0];
        else if (json?.data?.audioUrl && isValidAudioUrl(json.data.audioUrl)) audioUrl = json.data.audioUrl;
        if (audioUrl) return { url: audioUrl, status: 'ok', retries: tries };
        return { url: null, status: 'missing', retries: tries };
      } catch (err: any) {
        lastError = err;
        if (signal?.aborted) return { url: null, status: 'failed', retries: tries };
        await new Promise((resolve) => setTimeout(resolve, tries === 0 ? 300 : 700 * tries));
        tries++;
      }
    }
    return { url: null, status: 'failed', retries: tries };
  }
  // Main pool for all verses
  const audioResults = await pool(
    verses,
    async (v, idx) => {
      const { url, status, retries: audioRetries } = await fetchAudio(v.id, audioEdition, signal, retries);
      if (onProgress) onProgress(idx, verses.length, status);
      return {
        ...v,
        audioUrl: url,
        meta: {
          ...v.meta,
          audioEdition,
          audioStatus: status,
          retries: audioRetries,
        },
      };
    },
    concurrencyLimit
  );
  return audioResults;
}

export async function fetchRukuWithAudio(
  rukuNumber: number,
  options: {
    audioEdition: string;
    concurrencyLimit?: number;
    retries?: number;
    dryRun?: boolean;
    cache?: boolean;
    signal?: AbortSignal;
    onProgress?: (idx: number, total: number, status: AudioStatus) => void;
  }
): Promise<AudioVerse[]> {
  const {
    audioEdition,
    concurrencyLimit = 6,
    retries = 2,
    dryRun = false,
    cache = true,
    signal,
    onProgress,
  } = options;
  if (!rukuNumber || rukuNumber < 1 || rukuNumber > 556) throw new Error("Invalid Ruku number");
  if (!audioEdition || typeof audioEdition !== 'string') throw new Error("audioEdition required");
  const cacheKey = `ruku:${rukuNumber}:audio:${audioEdition}`;
  if (cache && audioCache[cacheKey] && Date.now() - audioCache[cacheKey].timestamp < AUDIO_CACHE_TTL) {
    const cached = audioCache[cacheKey].data;
    if (onProgress) cached.forEach((v, idx) => onProgress(idx, cached.length, v.meta.audioStatus));
    return cached;
  }
  // Get merged Arabic+English first
  const merged = await fetchRukuWithArabicAndEnglish(rukuNumber, { cache: true });
  // Resolve audio for each verse
  const withAudio = await resolveAudioForRuku(merged, {
    audioEdition,
    concurrencyLimit,
    retries,
    dryRun,
    signal,
    onProgress,
  });
  if (cache) audioCache[cacheKey] = { timestamp: Date.now(), data: withAudio };
  return withAudio;
}
// --- Arabic + English merged fetch for Ruku ---
export type MergedVerse = {
  id: number;
  surah: number;
  ayah: number;
  arabicText: string;
  englishText: string;
  meta: {
    ruku: number;
    surahName: string;
    surahArabicName: string;
    fetchStatus: "ok" | "partial" | "failed";
  };
};

const mergedCache: Record<string, { timestamp: number; data: MergedVerse[] }> = {};
const MERGED_CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function fetchRukuWithArabicAndEnglish(
  rukuNumber: number,
  options?: {
    signal?: AbortSignal;
    cache?: boolean;
    debug?: boolean;
  }
): Promise<MergedVerse[]> {
  if (!rukuNumber || rukuNumber < 1 || rukuNumber > 556) {
    throw new Error("Invalid Ruku number");
  }
  const cacheKey = `ruku:${rukuNumber}:merged`;
  const useCache = options?.cache !== false;
  if (useCache && mergedCache[cacheKey] && Date.now() - mergedCache[cacheKey].timestamp < MERGED_CACHE_TTL) {
    if (options?.debug) console.log("[fetchRukuWithArabicAndEnglish] Cache hit", cacheKey);
    return mergedCache[cacheKey].data;
  }
  const urls = [
    `https://api.alquran.cloud/v1/ruku/${rukuNumber}/en.asad`,
    `https://api.alquran.cloud/v1/ruku/${rukuNumber}/quran-uthmani`,
  ];
  let responses: Response[] = [];
  let retry429 = false;
  try {
    responses = await Promise.all(urls.map((url) => fetch(url, { signal: options?.signal })));
  } catch (err: any) {
    if (options?.debug) console.error("[fetchRukuWithArabicAndEnglish] Network error", err);
    throw new Error(`Failed to fetch Arabic or English data for Ruku ${rukuNumber}`);
  }
  // Handle 429 rate limit (retry once after 2s)
  if (responses.some((res) => res.status === 429)) {
    if (options?.debug) console.warn("[fetchRukuWithArabicAndEnglish] Rate limited, retrying...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      responses = await Promise.all(urls.map((url) => fetch(url, { signal: options?.signal })));
      retry429 = true;
    } catch (err: any) {
      throw new Error(`Failed to fetch after rate limit for Ruku ${rukuNumber}`);
    }
  }
  let englishJson: any = null;
  let arabicJson: any = null;
  try {
    englishJson = await responses[0].json();
    arabicJson = await responses[1].json();
  } catch (err: any) {
    throw new Error("Failed to parse JSON for Arabic or English data");
  }
  const statusOk =
    englishJson?.status === "OK" &&
    arabicJson?.status === "OK" &&
    Array.isArray(englishJson?.data?.ayahs) &&
    Array.isArray(arabicJson?.data?.ayahs);
  if (!statusOk) {
    if (options?.debug) console.error("[fetchRukuWithArabicAndEnglish] Invalid API response", englishJson, arabicJson);
    throw new Error(`Failed to fetch Arabic or English data for Ruku ${rukuNumber}`);
  }
  const englishAyahs = englishJson.data.ayahs;
  const arabicAyahs = arabicJson.data.ayahs;
  const minLen = Math.min(englishAyahs.length, arabicAyahs.length);
  if (minLen === 0) return [];
  const merged: MergedVerse[] = englishAyahs.slice(0, minLen).map((engAyah: any, i: number) => {
    const arAyah = arabicAyahs[i];
    return {
      id: engAyah.number,
      surah: engAyah.surah.number,
      ayah: engAyah.numberInSurah,
      arabicText: arAyah.text,
      englishText: engAyah.text,
      meta: {
        ruku: rukuNumber,
        surahName: arAyah.surah.englishName,
        surahArabicName: arAyah.surah.name,
        fetchStatus: retry429 ? "partial" : "ok",
      },
    };
  });
  if (useCache) mergedCache[cacheKey] = { timestamp: Date.now(), data: merged };
  if (options?.debug) console.log("[fetchRukuWithArabicAndEnglish] Merged result", merged);
  return merged;
}
// src/utils/fetchRukuEnglishWithAudio.ts
/**
 * Fetches English translation and audio URLs for all ayahs in a given ruku.
 * - Translation: https://api.alquran.cloud/v1/ruku/{rukuNumber}/en.asad
 * - Audio: https://api.alquran.cloud/v1/ayah/{ayahNumberGlobal}/{audioEdition}
 *
 * @param rukuNumber - The ruku number to fetch.
 * @param options - Configuration options:
 *   - audioEdition: string (e.g., "ar.alafasy")
 *   - concurrencyLimit: number (default: 6)
 *   - signal: AbortSignal (optional)
 *   - dryRun: boolean (if true, skips audio fetch)
 *   - verbose: boolean (if true, logs debug info)
 *   - cache: boolean (default: true, in-memory; sessionStorage if enabled)
 *   - cacheSessionStorage: boolean (default: false)
 *   - onProgress: (ayahIndex, total, status) => void (optional)
 *   - onError: (err) => void (optional)
 * @returns Promise<Verse[]>
 */
type VerseMeta = {
  audioEdition: string;
  fetchStatus: "ok" | "failed" | "missing";
  retries: number;
};
export type Verse = {
  id: number; // global ayah id
  surah: number;
  ayah: number; // ayah number in surah
  englishText: string;
  audioUrl: string | null;
  meta: VerseMeta;
};
type Options = {
  audioEdition: string;
  concurrencyLimit?: number;
  signal?: AbortSignal;
  dryRun?: boolean;
  verbose?: boolean;
  cache?: boolean;
  cacheSessionStorage?: boolean;
  onProgress?: (ayahIndex: number, total: number, status: VerseMeta["fetchStatus"]) => void;
  onError?: (err: any) => void;
};
const DEFAULT_CONCURRENCY = 6;
const DEFAULT_CACHE_TTL = 1000 * 60 * 60; // 1 hour
const memoryCache: Record<string, { timestamp: number; data: Verse[] }> = {};
function getCacheKey(rukuNumber: number, audioEdition: string) {
  return `ruku:${rukuNumber}:audio:${audioEdition}`;
}
function setCache(key: string, data: Verse[], useSession: boolean) {
  memoryCache[key] = { timestamp: Date.now(), data };
  if (useSession) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {}
  }
}
function getCache(key: string, useSession: boolean): Verse[] | null {
  if (memoryCache[key] && Date.now() - memoryCache[key].timestamp < DEFAULT_CACHE_TTL) {
    return memoryCache[key].data;
  }
  if (useSession) {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const { timestamp, data } = JSON.parse(raw);
        if (Date.now() - timestamp < DEFAULT_CACHE_TTL) return data;
      }
    } catch {}
  }
  return null;
}
async function pool<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  const executing: Promise<void>[] = [];
  async function run(item: T, idx: number) {
    results[idx] = await worker(item, idx);
  }
  while (i < items.length) {
    const idx = i;
    const p = run(items[i], idx);
    executing.push(p);
    i++;
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(0, executing.length - limit + 1);
    }
  }
  await Promise.all(executing);
  return results;
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function fetchRukuEnglishWithAudio(
  rukuNumber: number,
  options: Options
): Promise<Verse[]> {
  const {
    audioEdition,
    concurrencyLimit = DEFAULT_CONCURRENCY,
    signal,
    dryRun = false,
    verbose = false,
    cache = true,
    cacheSessionStorage = false,
    onProgress,
    onError,
  } = options;
  const cacheKey = getCacheKey(rukuNumber, audioEdition);
  if (cache) {
    const cached = getCache(cacheKey, cacheSessionStorage);
    if (cached) {
      if (verbose) console.log("[fetchRukuEnglishWithAudio] Cache hit", cacheKey);
      return cached;
    }
  }
  let translationRes: Response;
  try {
    translationRes = await fetch(
      `https://api.alquran.cloud/v1/ruku/${rukuNumber}/en.asad`,
      { signal }
    );
  } catch (err) {
    if (onError) onError(err);
    throw new Error(`Failed to fetch ruku translation: ${err}`);
  }
  let translationJson: any;
  try {
    translationJson = await translationRes.json();
  } catch (err) {
    if (onError) onError(err);
    throw new Error("Invalid JSON from ruku translation API");
  }
  if (
    translationJson.status !== "OK" ||
    !translationJson.data ||
    !Array.isArray(translationJson.data.ayahs)
  ) {
    if (onError) onError(translationJson);
    throw new Error("Unexpected ruku translation API response shape");
  }
  const ayahs = translationJson.data.ayahs;
  if (!ayahs.length) {
    throw new Error("No ayahs found for this ruku");
  }
  async function fetchAudio(ayah: any, idx: number): Promise<string | null> {
    if (dryRun) return null;
    let retries = 0;
    let lastError: any = null;
    let url = `https://api.alquran.cloud/v1/ayah/${ayah.number}/${audioEdition}`;
    while (retries <= 2) {
      try {
        if (verbose) console.log(`[Audio] Fetching ${url} (try ${retries + 1})`);
        const res = await fetch(url, { signal });
        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") || "1", 10);
          if (retryAfter > 15) {
            throw new Error(`Rate limited for ${retryAfter}s`);
          }
          await sleep(retryAfter * 1000);
          retries++;
          continue;
        }
        if (res.status >= 500) {
          await sleep(retries === 0 ? 300 : 800);
          retries++;
          continue;
        }
        if (res.status >= 400) {
          if (res.status === 404) return null;
          throw new Error(`Audio fetch failed: ${res.status}`);
        }
        const json = await res.json();
        if (json.status !== "OK" || !json.data) {
          throw new Error("Unexpected audio API response");
        }
        if (json.data.audio) return json.data.audio;
        if (json.data.audioSecondary && Array.isArray(json.data.audioSecondary) && json.data.audioSecondary[0]) {
          return json.data.audioSecondary[0];
        }
        return null;
      } catch (err: any) {
        lastError = err;
        if (verbose) console.error(`[Audio] Error for ayah ${ayah.number}:`, err);
        if (onError) onError(err);
        if (signal?.aborted) throw new Error("Aborted");
        retries++;
        await sleep(retries === 1 ? 300 : 800);
      }
    }
    return null;
  }
  const verses: Verse[] = await pool(
    ayahs,
    async (ayah: any, idx: number) => {
      let audioUrl: string | null = null;
      let fetchStatus: VerseMeta["fetchStatus"] = "ok";
      let retries = 0;
      try {
        audioUrl = await fetchAudio(ayah, idx);
        fetchStatus = audioUrl ? "ok" : "missing";
      } catch (err: any) {
        fetchStatus = "failed";
        audioUrl = null;
        if (onError) onError(err);
      }
      if (onProgress) onProgress(idx + 1, ayahs.length, fetchStatus);
      return {
        id: ayah.number,
        surah: ayah.surah.number,
        ayah: ayah.numberInSurah,
        englishText: ayah.text,
        audioUrl,
        meta: {
          audioEdition,
          fetchStatus,
          retries,
        },
      };
    },
    concurrencyLimit
  );
  if (cache) setCache(cacheKey, verses, cacheSessionStorage);
  return verses;
}
