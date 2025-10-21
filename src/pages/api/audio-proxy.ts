import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import http from 'http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  // Only allow audio files from whitelisted domains
  const allowedDomains = [
    'cdn.alquran.cloud',
    'cdn.islamic.network',
    'verse.mp3quran.net',
    'server8.mp3quran.net',
    'server7.mp3quran.net',
    'everyayah.com',
    'qurancentral.com',
  ];
  try {
    const parsedUrl = new URL(url);
    if (!allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain))) {
      res.status(403).json({ error: 'Domain not allowed' });
      return;
    }
    // Special handling for everyayah.com: bypass proxy, redirect directly
    if (parsedUrl.hostname.endsWith('everyayah.com')) {
      res.redirect(302, url);
      return;
    }
    // Proxy the request for other domains
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    protocol.get(url, (audioRes) => {
      if (audioRes.statusCode !== 200) {
        res.status(audioRes.statusCode || 404).end();
        return;
      }
      res.setHeader('Content-Type', audioRes.headers['content-type'] || 'audio/mpeg');
      audioRes.pipe(res);
    }).on('error', (err) => {
      res.status(500).json({ error: 'Audio proxy error', details: err.message });
    });
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid url', details: err.message });
  }

  try {
    const response = await fetch(url as string);
    if (!response.ok) {
      res.status(response.status).json({ error: `Failed to fetch audio: ${response.statusText}` });
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.status(200);
    // Stream the response using Web Streams API
    const reader = response.body?.getReader();
    if (reader) {
      const stream = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
        }
      });
      const nodeStream = require('stream').Readable.from(stream);
      nodeStream.pipe(res);
    } else {
      res.status(500).json({ error: 'No response body to stream' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: String(error) });
  }
}
