import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Times - Learn Qur\'an App',
  description: 'Accurate prayer times based on your location with live countdown to next prayer. Stay connected with your daily prayers.',
  keywords: 'prayer times, salah, islamic prayer, muslim, quran, location-based',
  authors: [{ name: 'Learn Qur\'an App' }],
  openGraph: {
    title: 'Prayer Times - Learn Qur\'an App',
    description: 'Accurate prayer times based on your location with live countdown to next prayer.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-prayer-times.jpg',
        width: 1200,
        height: 630,
        alt: 'Prayer Times - Learn Qur\'an App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prayer Times - Learn Qur\'an App',
    description: 'Accurate prayer times based on your location with live countdown to next prayer.',
    images: ['/og-prayer-times.jpg'],
  },
  robots: 'index, follow',
  canonical: 'https://learnquran.app/hifz/prayer',
};