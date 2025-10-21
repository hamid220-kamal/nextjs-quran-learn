import { Metadata } from 'next'
// Use the loader for dynamic loading with improved performance
import QuranLoader from './QuranLoader'
import Navbar from '../../components/Navbar/Navbar'
import './performance-optimized.css'

export const metadata: Metadata = {
  title: 'The Holy Quran - Read, Listen and Reflect',
  description: 'Complete Quran with all 114 Surahs, 30 Juz, 604 Pages, 7 Manzil, 60 Hizb, and 556 Ruku. Read with translations and listen to beautiful recitations.',
  keywords: [
    'quran', 'holy quran', 'surah', 'ayah', 'juz', 'page', 'manzil', 'hizb', 'ruku',
    'islam', 'muslim', 'recitation', 'translation', 'alquran', 'quran online'
  ],
  openGraph: {
    title: 'The Holy Quran - Read, Listen and Reflect',
    description: 'Complete Quran with all 114 Surahs, 30 Juz, 604 Pages, 7 Manzil, 60 Hizb, and 556 Ruku.',
    type: 'website',
    images: ['/quran-og.jpg'],
    url: '/quran',
  },
  alternates: {
    canonical: '/quran'
  }
}

const API_BASE = 'https://api.alquran.cloud/v1'

async function fetchSurahs(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/surah`, {
      next: { revalidate: 86400 },
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!res.ok) {
      console.error('Failed to fetch surahs:', res.status)
      return []
    }

    const data = await res.json()
    
    if (data.code !== 200) {
      console.error('API error:', data.status)
      return []
    }

  // alquran.cloud returns the list directly in data (array of surahs)
  return data.data || []
  } catch (error) {
    console.error('Error fetching surahs:', error)
    return []
  }
}

export default async function QuranPage() {
  const surahs = await fetchSurahs()

  return (
    <>
      <Navbar />
      <main className="quran-page">
        <div className="quran-background" aria-hidden="true">
          <div className="floating-bg-element element-1"></div>
          <div className="floating-bg-element element-2"></div>
          <div className="floating-bg-element element-3"></div>
          <div className="floating-bg-element element-4"></div>
        </div>

      <div className="quran-content">
        <h1 className="sr-only">The Holy Quran - Complete Digital Quran with All Sections</h1>
        <QuranLoader initialSurahs={surahs} />
      </div>
    </main>
    </>
  )
}