import Link from 'next/link';

interface HomeJuzCardProps {
  juzNumber: number;
  surahStart: string;
  surahEnd: string;
}

export default function HomeJuzCard({ juzNumber, surahStart, surahEnd }: HomeJuzCardProps) {
  // Convert juzNumber to Arabic numerals
  const toArabicNumber = (num: number) => {
    const arabicNumbers = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
  };

  return (
    <Link href={`/juz/${juzNumber}`} className="juz-card">
      <div className="left-content">
        <div className="juz-number">{juzNumber}</div>
        <div className="name-container">
          <div className="juz-name-en">Juz {juzNumber}</div>
          <div className="juz-range">
            {surahStart}
            {surahEnd !== surahStart && (
              <span> to {surahEnd}</span>
            )}
          </div>
        </div>
      </div>
      <div className="right-content">
        <div className="juz-name-ar" dir="rtl">الجزء {toArabicNumber(juzNumber)}</div>
        <div className="verse-count">30 pages</div>
      </div>
    </Link>
  );
}