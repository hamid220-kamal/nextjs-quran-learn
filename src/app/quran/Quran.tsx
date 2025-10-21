// Styles for the Quran page are provided by consolidated stylesheets
import './Quran.css'
import './QuranClientExtras.css'
import QuranClient from './QuranClient'

export const metadata = {
  title: 'Quran - Quran Learn',
  description: 'Read, search, and listen to the Quran. Server-rendered for SEO with client-side progressive enhancement.',
  keywords: ['quran', 'surah', 'ayah', 'tajweed', 'recitation']
}

const API_BASE = 'https://api.alquran.cloud/v1'

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) return null
  const data = await res.json()
  return data?.data ?? null
}

export default async function QuranPage() {
  // Server-side fetch: surah list, meta, sajda
  const [surahList, meta, sajda] = await Promise.all([
    fetchJson('/surah'),
    fetchJson('/meta'),
    fetchJson('/sajda')
  ])

  return (
    <main className="quran-page">
      <div className="quran-background" aria-hidden="true">
        <div className="floating-bg-element element-1"></div>
        <div className="floating-bg-element element-2"></div>
        <div className="floating-bg-element element-3"></div>
        <div className="floating-bg-element element-4"></div>
      </div>

      <div className="quran-content responsive-container">
        {/* Rendered server-side for SEO; interactive UI is enhanced by the client component */}
        <h1 className="sr-only">Quran</h1>
        <QuranClient initialSurahs={surahList || []} meta={meta} sajda={sajda} />
      </div>
    </main>
  )
}
