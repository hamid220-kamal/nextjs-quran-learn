import { Surah } from '../../../types/quran';
import Link from 'next/link';

interface HomeSurahCardProps {
  surah: Surah;
}

export default function HomeSurahCard({ surah }: HomeSurahCardProps) {
  return (
    <Link href={`/surah/${surah.number}`} className="surah-card">
      <div className="left-content">
        <div className="surah-number">{surah.number}</div>
        <div className="name-container">
          <div className="surah-name-en">{surah.englishName}</div>
          <div className="surah-name-translation">{surah.englishNameTranslation}</div>
        </div>
      </div>
      <div className="right-content">
        <div className="surah-name-ar" dir="rtl">{surah.name}</div>
        <div className="ayah-count">{surah.numberOfAyahs} Ayahs</div>
      </div>
    </Link>
  );
}