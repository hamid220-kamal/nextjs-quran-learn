import PrayerTimesClient from './PrayerTimesClient';
import { PrayerTimesResponse } from './types';
import styles from './PrayerTime.css';

async function getPrayerTimes(params: {
  lat?: string;
  lon?: string;
  city?: string;
  country?: string;
}): Promise<PrayerTimesResponse> {
  const { lat, lon, city, country } = params;
  
  try {
    // Build API URL based on available parameters
    let apiUrl = 'https://api.aladhan.com/v1/timings?';
    
    if (lat && lon) {
      apiUrl += `latitude=${lat}&longitude=${lon}`;
    } else {
      const defaultCity = city || 'Mecca';
      const defaultCountry = country || 'Saudi Arabia';
      apiUrl += `city=${encodeURIComponent(defaultCity)}&country=${encodeURIComponent(defaultCountry)}`;
    }
    
    // Add calculation method and other parameters
    apiUrl += '&method=3&school=0&midnightMode=1';
    
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.status || 'Failed to fetch prayer times');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw new Error('Unable to load prayer times. Please check your connection and try again.');
  }
}

interface PrayerTimesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PrayerTimesPage({ searchParams }: PrayerTimesPageProps) {
  const params = await searchParams;
  let prayerTimes: PrayerTimesResponse | null = null;
  let error: string | null = null;

  try {
    prayerTimes = await getPrayerTimes({
      lat: params.lat,
      lon: params.lon,
      city: params.city,
      country: params.country,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Prayer Times</h1>
        <p className={styles.subtitle}>
          Today's prayer schedule based on your location
        </p>
        {prayerTimes?.data?.date?.hijri && (
          <div className={styles.hijriDate}>
            {prayerTimes.data.date.hijri.date} • {prayerTimes.data.date.readable}
          </div>
        )}
      </div>
      
      <PrayerTimesClient 
        initialPrayerTimes={prayerTimes}
        initialError={error}
        initialCoords={{
          lat: params.lat,
          lon: params.lon
        }}
      />
    </div>
  );
}