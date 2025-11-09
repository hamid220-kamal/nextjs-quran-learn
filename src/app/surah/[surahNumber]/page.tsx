import { Metadata } from 'next';
import SurahViewer from './SurahViewer';
import Navbar from '../../../components/Navbar/Navbar';
import { fetchSurah } from '../../../utils/quranApi';
import './SurahViewer.css';
import './AudioTranslationControls.css';
import { toNumber } from '../../../types/app';

type SurahParams = {
  surahNumber: string;
}

interface PageProps {
  params: SurahParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const surahNumber = toNumber(params.surahNumber);
  
  try {
    const surah = await fetchSurah(surahNumber);
    
    return {
      title: `${surah.englishName} (${surah.name}) - Quran`,
      description: `Read Surah ${surah.englishName} - ${surah.englishNameTranslation}. ${surah.numberOfAyahs} verses, revealed in ${surah.revelationType}.`,
      keywords: `quran, surah ${surah.englishName.toLowerCase()}, ${surah.englishNameTranslation.toLowerCase()}, ${surah.revelationType.toLowerCase()}, ayah, verse`,
    };
  } catch (error) {
    return {
      title: 'Surah - Quran',
      description: 'Read the Holy Quran with translations and interpretations.',
    };
  }
}

export default function SurahPage({ params }: PageProps) {
  const surahNumber = toNumber(params.surahNumber);
  
  return (
    <div className="surah-page-container">
      <Navbar />
      <main>
        <SurahViewer surahNumber={surahNumber} />
      </main>
    </div>
  );
}