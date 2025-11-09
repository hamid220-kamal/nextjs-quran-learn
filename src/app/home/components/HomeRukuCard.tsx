import Link from 'next/link';

interface HomeRukuCardProps {
  rukuNumber: number;
  surahStart: string;
  surahEnd: string;
  ayahRange: string;
}

const getRukuName = (num: number): string => {
  // Convert number to Arabic numerals
  const arabicNumber = num.toString().split('').map(digit => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return arabicDigits[parseInt(digit)];
  }).join('');
  
  return `ركوع ${arabicNumber}`;
};

export default function HomeRukuCard({ 
  rukuNumber, 
  surahStart, 
  surahEnd, 
  ayahRange 
}: HomeRukuCardProps) {
  return (
    <Link href={`/quran/ruku/${rukuNumber}`} className="ruku-card">
      <div className="left-content">
        <div className="ruku-number">{rukuNumber}</div>
        <div className="name-container">
          <div className="ruku-name-en">Ruku {rukuNumber}</div>
          <div className="ruku-range">
            {surahStart}
            {surahEnd !== surahStart && (
              <span> to {surahEnd}</span>
            )}
          </div>
        </div>
      </div>
      <div className="right-content">
        <div className="ruku-name-ar" dir="rtl">{getRukuName(rukuNumber)}</div>
        <div className="ruku-ayah-range" dir="rtl">{ayahRange}</div>
      </div>
    </Link>
  );
}