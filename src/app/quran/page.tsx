import Footer from '../../components/Footer';
import { Metadata } from 'next';
import QuranBrowser from './QuranBrowser';
import Navbar from '../../components/Navbar/Navbar';
import './Quran.css';
import './QuranBrowser.css';
import { fetchQuranStructure } from '../../utils/quranApi';

export const metadata: Metadata = {
  title: 'Quran - Read, Learn and Understand',
  description: 'Read the Holy Quran with translations, listen to recitations, and explore interpretations for a deeper understanding of the sacred text.',
  keywords: 'quran, holy quran, quran online, read quran, quran recitation, quran translation',
  openGraph: {
    title: 'Quran - Read, Learn and Understand',
    description: 'Read the Holy Quran with translations, listen to recitations, and explore interpretations.',
    images: [{ url: '/images/quran-og.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function QuranPage() {
  let initialData;
  try {
    // Server-side fetch of initial Quran structure data
    initialData = await fetchQuranStructure();
  } catch (error) {
    console.error('Error fetching initial data:', error);
    initialData = {
      surahs: [],
      totalSurahs: 114,
      totalJuz: 30,
      totalManzil: 7,
      totalHizb: 60,
      totalPages: 604,
      totalRuku: 556
    };
  }
  
  return (
    <div className="quran-page-container">
      <Navbar />
      <QuranBrowser initialData={initialData} />
      <Footer />
    </div>
  );
}
