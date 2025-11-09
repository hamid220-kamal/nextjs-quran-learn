// List of CORS proxies in order of preference with health checks
interface ProxyConfig {
  url: string;
  isHealthy: boolean;
  lastChecked: number;
  consecutiveFailures: number;
  transformUrl: (url: string) => string;
}

const CORS_PROXIES: ProxyConfig[] = [
  { 
    url: 'https://api.allorigins.win/raw?url=', 
    isHealthy: true, 
    lastChecked: 0, 
    consecutiveFailures: 0,
    transformUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  },
  { 
    url: 'https://corsproxy.io/?', 
    isHealthy: true, 
    lastChecked: 0, 
    consecutiveFailures: 0,
    transformUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
  },
  { 
    url: 'https://proxy.cors.sh/', 
    isHealthy: true, 
    lastChecked: 0, 
    consecutiveFailures: 0,
    transformUrl: (url: string) => {
      const proxyUrl = new URL('https://proxy.cors.sh/');
      proxyUrl.pathname = new URL(url).pathname;
      return proxyUrl.toString();
    }
  }
];

let currentProxyIndex = 0;

// Check proxy health every 5 minutes
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000;

const ALLOWED_DOMAINS = [
  'cdn.islamic.network',
  'verses.quran.com',
  'audio.qurancdn.com',
  'download.quranicaudio.com',
  'everyayah.com',
  'audio.mp3quran.net'
];

async function checkProxyHealth(proxy: ProxyConfig): Promise<boolean> {
  try {
    const testUrl = 'https://cdn.islamic.network/info.txt';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${proxy.url}${encodeURIComponent(testUrl)}`, {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

async function updateProxyHealth(): Promise<void> {
  for (const proxy of CORS_PROXIES) {
    if (Date.now() - proxy.lastChecked > HEALTH_CHECK_INTERVAL) {
      proxy.isHealthy = await checkProxyHealth(proxy);
      proxy.lastChecked = Date.now();
      if (!proxy.isHealthy) {
        proxy.consecutiveFailures++;
      } else {
        proxy.consecutiveFailures = 0;
      }
    }
  }
}

export async function addCorsProxy(url: string): Promise<string> {
  if (!url) return url;
  
  // Check if URL is from allowed domains
  if (ALLOWED_DOMAINS.some(domain => url.includes(domain))) {
    await updateProxyHealth();
    
    // Try each proxy in sequence until we find one that works
    for (const proxy of CORS_PROXIES) {
      if (proxy.isHealthy || proxy.consecutiveFailures < 3) {
        try {
          const proxyUrl = proxy.transformUrl(url);
          
          // Test the proxy URL with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const testResponse = await fetch(proxyUrl, {
            method: 'HEAD',
            mode: 'cors',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (testResponse.ok || testResponse.status === 206) {
            console.log(`Using proxy: ${proxy.url}`);
            return proxyUrl;
          }
        } catch (error) {
          console.warn(`Proxy ${proxy.url} failed:`, error);
          proxy.consecutiveFailures++;
          proxy.isHealthy = false;
          continue;
        }
      }
    }
    
    // If all proxies failed, try the one with least failures as last resort
    const leastFailures = CORS_PROXIES.reduce((min, p) => 
      p.consecutiveFailures < min.consecutiveFailures ? p : min, CORS_PROXIES[0]);
    
    console.log(`All proxies failed, using least failed proxy: ${leastFailures.url}`);
    return leastFailures.transformUrl(url);
  }
  
  return url;
}

// Function to try the next proxy if the current one fails
export function switchToNextProxy(): boolean {
  const startIndex = currentProxyIndex;
  do {
    currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
    if (CORS_PROXIES[currentProxyIndex].isHealthy) {
      console.log(`Switched to CORS proxy: ${CORS_PROXIES[currentProxyIndex].url}`);
      return true;
    }
  } while (currentProxyIndex !== startIndex);
  
  // If no healthy proxies found, try the one with least failures
  const leastFailures = CORS_PROXIES.reduce((min, p, index) => 
    p.consecutiveFailures < min.proxy.consecutiveFailures ? { proxy: p, index } : min,
    { proxy: CORS_PROXIES[0], index: 0 }
  );
  
  currentProxyIndex = leastFailures.index;
  console.log(`No healthy proxies found. Using least failed proxy: ${CORS_PROXIES[currentProxyIndex].url}`);
  return false;
}

export function removeCorsProxy(url: string): string {
  if (!url) return url;
  
  // Check if URL starts with any of our proxies
  for (const proxy of CORS_PROXIES) {
    if (url.startsWith(proxy.url)) {
      return decodeURIComponent(url.replace(proxy.url, ''));
    }
  }
  return url;
}

export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => parsed.hostname === domain);
  } catch {
    return false;
  }
}