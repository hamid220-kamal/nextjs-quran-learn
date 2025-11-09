import Link from 'next/link';

interface HomeHizbCardProps {
  hizbNumber: number;
  surahStart: string;
  surahEnd: string;
  ayahRange: string;
}

const getHizbName = (num: number): string => {
  const arabicNumerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠',
    '١١', '١٢', '١٣', '١٤', '١٥', '١٦', '١٧', '١٨', '١٩', '٢٠',
    '٢١', '٢٢', '٢٣', '٢٤', '٢٥', '٢٦', '٢٧', '٢٨', '٢٩', '٣٠',
    '٣١', '٣٢', '٣٣', '٣٤', '٣٥', '٣٦', '٣٧', '٣٨', '٣٩', '٤٠',
    '٤١', '٤٢', '٤٣', '٤٤', '٤٥', '٤٦', '٤٧', '٤٨', '٤٩', '٥٠',
    '٥١', '٥٢', '٥٣', '٥٤', '٥٥', '٥٦', '٥٧', '٥٨', '٥٩', '٦٠'];
  return `الحزب ${arabicNumerals[num - 1]}`;
};

const getSurahArabicName = (surahName: string): string => {
  const surahNames: { [key: string]: string } = {
    'Al-Fatihah': 'الفاتحة',
    'Al-Baqarah': 'البقرة',
    'Al-Imran': 'آل عمران',
    'An-Nisa': 'النساء',
    'Al-Maidah': 'المائدة',
    // Add more surah names as needed
  };
  return surahNames[surahName] || surahName;
};

export default function HomeHizbCard({ 
  hizbNumber, 
  surahStart, 
  surahEnd, 
  ayahRange 
}: HomeHizbCardProps) {
  return (
    <Link href={`/hizb/${hizbNumber}`} className="hizb-card">
      <div className="left-content">
        <div className="hizb-number">{hizbNumber}</div>
        <div className="name-container">
          <div className="hizb-name-en">Hizb {hizbNumber}</div>
          <div className="hizb-range">
            From {surahStart}
            {surahEnd !== surahStart && (
              <span> to {surahEnd}</span>
            )}
          </div>
        </div>
      </div>
      <div className="right-content">
        <div className="hizb-name-ar" dir="rtl">{getHizbName(hizbNumber)}</div>
        <div className="hizb-range-ar" dir="rtl">
          {surahStart && getSurahArabicName(surahStart)}
          {surahEnd !== surahStart && (
            <span> الى {getSurahArabicName(surahEnd)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}