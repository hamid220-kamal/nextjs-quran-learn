import VersesList from '../../../components/VersesList/VersesList';
import '../../../components/VersesList/verse-highlights.css';

interface SurahSectionProps {
  surah: any;
  verses: any[];
  isAutoPlaying: boolean;
  currentVerseIndex: number | null;
  playVerseByIndex: (index: number) => void;
}

export default function SurahSection({
  surah,
  verses,
  isAutoPlaying,
  currentVerseIndex,
  playVerseByIndex
}: SurahSectionProps) {
  return (
    <div key={`surah-${surah.number}`} className="surah-section">
      <div className="surah-header light-header">
        <h2>
          <span className="surah-number">{surah.number}</span>
          {surah.englishName}
          <span className="surah-arabic-name">{surah.name}</span>
        </h2>
        <div className="surah-info">
          <span>{surah.englishNameTranslation}</span>
          <span>{surah.revelationType}</span>
          <span>{verses.length} verses</span>
        </div>
      </div>
      <VersesList
        verses={verses.map((v: any) => ({
          number: v.number,
          numberInSurah: v.numberInSurah,
          text: v.text,
          translation: v.translations?.[0]?.text,
          audioUrl: v.audioUrl
        }))}
        isAutoPlaying={isAutoPlaying}
        currentVerseIndex={currentVerseIndex}
        playVerseByIndex={playVerseByIndex}
        ariaLabelPrefix={`Surah ${surah.number}`}
      />
    </div>
  );
}