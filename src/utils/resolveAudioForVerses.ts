// resolveAudioForVerses.ts
// Fetch and attach audio for every verse in a Ruku, robust concurrency, caching, retries, and debug output.
// Usage example:
// const updated = await resolveAudioForVerses(verses, { audioEdition: 'ar.alafasy', concurrencyLimit: 6, retries: 2, backoffBaseMs: 300, cache: true, onProgress: (i, total, status) => console.log(i, total, status) });
// updated[i].audioUrl -> ready to use in <audio src=...>

const audioCache = new Map(); // In-memory cache for audio URLs
const CACHE_VERSION = 'v1';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCachedAudio(key) {
  if (audioCache.has(key)) return audioCache.get(key);
  if (typeof sessionStorage !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const { version, audioUrl, meta } = JSON.parse(raw);
        if (version === CACHE_VERSION) return { audioUrl, meta };
      }
    } catch {}
  }
  return null;
}

function setCachedAudio(key, audioUrl, meta) {
  audioCache.set(key, { audioUrl, meta });
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(key, JSON.stringify({ version: CACHE_VERSION, audioUrl, meta }));
    } catch {}
  }
}

async function fetchAudioForAyah(verse, options) {
  const { audioEdition = 'ar.alafasy', retries = 2, backoffBaseMs = 300, signal, debug } = options || {};
  const url = `https://api.alquran.cloud/v1/ayah/${verse.id}/${audioEdition}`;
  let attempt = 0;
  let lastError: string | undefined = undefined;
  let statusCode: number | undefined = undefined;
  let audioUrl = null;
  let meta = { audioEdition, audioStatus: 'missing', retries: 0 };
  while (attempt <= retries) {
    if (debug) console.debug(`[Audio] Fetching`, url, `Attempt ${attempt + 1}`);
    try {
      const res = await fetch(url, { signal });
      statusCode = res.status;
      if (statusCode === 429) {
        let retryAfter = parseInt(res.headers.get('Retry-After') || '2', 10);
        if (retryAfter > 10) retryAfter = 10;
        await sleep(retryAfter * 1000);
        attempt++;
        continue;
      }
      if (typeof statusCode === 'number' && statusCode >= 500) {
        await sleep(backoffBaseMs * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4));
        attempt++;
        continue;
      }
      if (typeof statusCode === 'number' && statusCode >= 400 && statusCode !== 429) {
        meta.audioStatus = 'failed';
        lastError = `HTTP ${statusCode}`;
        break;
      }
      const json = await res.json();
      if (json?.status === 'OK' && json?.data) {
        audioUrl = json.data.audio || null;
        // Fallback keys
        if (!audioUrl && Array.isArray(json.data.audioSecondary) && json.data.audioSecondary[0]) audioUrl = json.data.audioSecondary[0];
        if (!audioUrl && json.data.recitation?.audio) audioUrl = json.data.recitation.audio;
        if (!audioUrl && json.data.audioUrl) audioUrl = json.data.audioUrl;
        // Validate audioUrl
        if (audioUrl && !/^https?:\/\//.test(audioUrl)) audioUrl = null;
        meta.audioStatus = audioUrl ? 'ok' : 'missing';
        break;
      } else {
        meta.audioStatus = 'missing';
        lastError = 'API responded but no audio';
        if (debug) console.debug('[Audio] API responded but no audio', json.data);
        break;
      }
    } catch (err) {
      lastError = err?.message || err;
      if (signal?.aborted) {
        meta.audioStatus = 'failed';
        break;
      }
      await sleep(backoffBaseMs * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4));
      attempt++;
    }
  }
  meta.retries = attempt;
  if (meta.audioStatus !== 'ok') {
    console.warn('Audio fetch failed', { verseId: verse.id, statusCode, url, errMessage: lastError });
  }
  return { audioUrl, meta };
}

async function promisePool(tasks, limit) {
  const results: any[] = [];
  let i = 0;
  let active: Promise<void>[] = [];
  function runTask(idx: number): Promise<void> {
    return tasks[idx]().then((res: any) => {
      results[idx] = res;
    });
  }
  while (i < tasks.length) {
    while (active.length < limit && i < tasks.length) {
      active.push(runTask(i));
      i++;
    }
    await Promise.race(active);
    // Remove finished promises
    active = active.filter((p, idx) => typeof results[idx] === 'undefined');
  }
  await Promise.all(active);
  return results;
}

export async function resolveAudioForVerses(verses, options = {}) {
  // Validate input
  if (!Array.isArray(verses) || !verses.length) return verses;
  const {
    audioEdition = 'ar.alafasy',
    concurrencyLimit = 6,
    retries = 2,
    backoffBaseMs = 300,
    cache = true,
    cacheKey = 'ruku_audio',
    dryRun = false,
    signal,
    onProgress,
    debug,
    onComplete,
    throwOnAbort
  } = options as {
    audioEdition?: string;
    concurrencyLimit?: number;
    retries?: number;
    backoffBaseMs?: number;
    cache?: boolean;
    cacheKey?: string;
    dryRun?: boolean;
    signal?: AbortSignal;
    onProgress?: (idx: number, total: number, status: string) => void;
    debug?: boolean;
    onComplete?: (verses: any[]) => void;
    throwOnAbort?: boolean;
  };
  // Validate verse ids
  for (const v of verses) {
    if (typeof v.id !== 'number') throw new Error('verse.id missing — need global ayah number');
  }
  // Dry run mode
  if (dryRun) {
    verses.forEach((v, idx) => {
      v.audioUrl = null;
      v.meta = { audioEdition, audioStatus: 'missing', retries: 0 };
      if (onProgress) onProgress(idx, verses.length, 'missing');
    });
    if (onComplete) onComplete(verses);
    return verses;
  }
  // Prepare tasks
  const tasks = verses.map((verse, idx) => async () => {
    const cacheId = `${cacheKey}:${audioEdition}:${verse.id}`;
    if (cache) {
      const cached = getCachedAudio(cacheId);
      if (cached && cached.audioUrl) {
        verse.audioUrl = cached.audioUrl;
        verse.meta = cached.meta;
        if (onProgress) onProgress(idx, verses.length, 'ok');
        return { audioUrl: cached.audioUrl, meta: cached.meta };
      }
    }
    // Fetch audio
    if (onProgress) onProgress(idx, verses.length, 'resolving');
    const { audioUrl, meta } = await fetchAudioForAyah(verse, { audioEdition, retries, backoffBaseMs, signal, debug });
    verse.audioUrl = audioUrl;
    verse.meta = meta;
    if (cache && audioUrl) setCachedAudio(cacheId, audioUrl, meta);
    if (onProgress) onProgress(idx, verses.length, meta.audioStatus);
    return { audioUrl, meta };
  });
  // Run with concurrency
  let results: any[] = [];
  try {
    results = await promisePool(tasks, concurrencyLimit);
  } catch (err) {
    if (signal?.aborted) {
      verses.forEach((v, idx) => {
        v.audioUrl = null;
        v.meta = { audioEdition, audioStatus: 'failed', retries: 0 };
        if (onProgress) onProgress(idx, verses.length, 'failed');
      });
      if (throwOnAbort) throw new Error('Audio fetch aborted');
    }
  }
  // Top-level warning if many missing
  const missingCount = verses.filter(v => v.meta && v.meta.audioStatus !== 'ok').length;
  if (missingCount > Math.max(3, verses.length / 2)) {
    console.warn(`Many ayahs missing audio for edition ${audioEdition}`);
  }
  if (onComplete) onComplete(verses);
  return verses;
}
