import Link from 'next/link';

interface HomePageCardProps {
  pageNumber: number;
  surahStart: string;
  surahEnd: string;
  ayahRange: string;
}

const getPageName = (num: number): string => {
  // Convert number to Arabic numerals
  const arabicNumber = num.toString().split('').map(digit => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return arabicDigits[parseInt(digit)];
  }).join('');
  
  return `صفحة ${arabicNumber}`;
};

export default function HomePageCard({ 
  pageNumber, 
  surahStart, 
  surahEnd, 
  ayahRange 
}: HomePageCardProps) {
  return (
    <Link href={`/page/${pageNumber}`} className="page-card">
      <div className="left-content">
        <div className="page-number">{pageNumber}</div>
        <div className="name-container">
          <div className="page-name-en">Page {pageNumber}</div>
          <div className="page-description">
            {surahStart}
            {surahEnd !== surahStart && (
              <span> to {surahEnd}</span>
            )}
          </div>
        </div>
      </div>
      <div className="right-content">
        <div className="page-name-ar" dir="rtl">{getPageName(pageNumber)}</div>
        <div className="ayah-range" dir="rtl">{ayahRange}</div>
      </div>
    </Link>
  );
}