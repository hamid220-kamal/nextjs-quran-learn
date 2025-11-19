import PrayerTimePageFunctional from './PrayerTimePageFunctional';
import { PrayerTimesResponse } from './types';

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1/timings';
const CALCULATION_METHOD = '4'; // Umm Al-Qura
const SCHOOL = '0'; // Shafi'i school

async function getPrayerTimes(params: {
  lat?: string;
  lon?: string;
  city?: string;
  country?: string;
  date?: string;
}): Promise<PrayerTimesResponse> {
  const { lat, lon, city, country, date } = params;
  
  try {
    // Get today's date in DD-MM-YYYY format for API
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateString = `${day}-${month}-${year}`;
    
    let apiUrl: string;
    
    if (lat && lon) {
      // Use coordinates endpoint
      apiUrl = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lon}&method=${CALCULATION_METHOD}`;
    } else {
      // Use city-based endpoint
      const cityName = city || 'Mecca';
      const countryName = country || 'Saudi Arabia';
      apiUrl = `https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}&method=${CALCULATION_METHOD}`;
    }
    
    console.log('Fetching prayer times from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Learn-Quran-App/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data: PrayerTimesResponse = await response.json();
    
    if (data.code !== 200) {
      console.error('API returned error code:', data.code, data.status);
      throw new Error(data.status || 'Failed to fetch prayer times from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    if (error instanceof Error) {
      throw new Error(`Unable to load prayer times: ${error.message}`);
    }
    throw new Error('Unable to load prayer times. Please check your connection and try again.');
  }
}

interface PrayerTimesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PrayerTimesPage({ searchParams }: PrayerTimesPageProps) {
  const params = await searchParams;
  
  // Extract string values safely
  const getParamValue = (value: string | string[] | undefined): string | undefined => {
    return typeof value === 'string' ? value : undefined;
  };
  
  let prayerTimes: PrayerTimesResponse | null = null;
  let error: string | null = null;
  let location: string = 'Mecca, Saudi Arabia';

  try {
    const lat = getParamValue(params.lat);
    const lon = getParamValue(params.lon);
    const city = getParamValue(params.city);
    const country = getParamValue(params.country);
    
    prayerTimes = await getPrayerTimes({
      lat,
      lon,
      city,
      country,
    });
    
    // Set location for display
    if (lat && lon) {
      location = `${lat}, ${lon}`;
    } else if (city && country) {
      location = `${city}, ${country}`;
    } else if (prayerTimes?.data?.meta) {
      const { latitude, longitude, timezone } = prayerTimes.data.meta;
      location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (${timezone})`;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Prayer times page error:', error);
  }

  return (
    <PrayerTimePageFunctional 
      initialPrayerTimes={prayerTimes}
      initialError={error}
      initialCoords={{
        lat: getParamValue(params.lat),
        lon: getParamValue(params.lon),
        city: getParamValue(params.city),
        country: getParamValue(params.country),
      }}
      initialLocation={location}
    />
  );
}