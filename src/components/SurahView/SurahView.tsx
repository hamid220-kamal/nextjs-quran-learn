import React, { useState, useEffect } from 'react';
import { getSurahIntroduction } from '../../data/surahIntroductions';
import SurahIntroduction from '../SurahIntroduction/SurahIntroduction';
import AudioView from '../AudioPlayer/AudioView';
import ScrollReadView from '../ScrollReadView/ScrollReadView';
import SlideView from '../SlideView/SlideView';
import ToggleMenu from '../Controls/ToggleMenu';
import './SurahView.css';

interface SurahViewProps {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
  };
  onBack: () => void;
  backgroundImage: string;
}

interface TypeWriterProps {
  arabicText: string;
  englishText: string;
  englishMeaning: string;
}

const TypeWriter = ({ arabicText, englishText, englishMeaning }: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState({ main: arabicText, sub: '' });
  const [currentState, setCurrentState] = useState<'arabic' | 'english' | 'meaning'>('arabic');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const typeText = async () => {
      if (isTyping) return;
      setIsTyping(true);

      // Erase current text
      for (let i = displayText.main.length; i >= 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 80));
        setDisplayText(prev => ({ ...prev, main: prev.main.substring(0, i) }));
      }

      // Wait a bit before typing new text
      await new Promise(resolve => setTimeout(resolve, 300));

      // Determine next state and text
      let nextMain = '';
      let nextSub = '';
      let nextState: 'arabic' | 'english' | 'meaning';

      switch (currentState) {
        case 'arabic':
          nextMain = englishText;
          nextState = 'english';
          break;
        case 'english':
          nextMain = englishMeaning;
          nextState = 'meaning';
          break;
        case 'meaning':
          nextMain = arabicText;
          nextState = 'arabic';
          break;
      }

      // Type new text
      for (let i = 0; i <= nextMain.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 80));
        setDisplayText(prev => ({ ...prev, main: nextMain.substring(0, i) }));
      }

      setCurrentState(nextState);
      setIsTyping(false);
    };

    const intervalId = setInterval(() => {
      typeText();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [arabicText, englishText, englishMeaning, currentState, isTyping]);

  return (
    <div className="typing-container">
      <span className={`main-text ${currentState}-text`}>
        {displayText.main}
      </span>
      {currentState === 'english' && (
        <span className="meaning-hint"></span>
      )}
    </div>
  );
};

export default function SurahView({ surah, onBack, backgroundImage }: SurahViewProps) {
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [showAudioView, setShowAudioView] = useState(false);
  const [showScrollReadView, setShowScrollReadView] = useState(false);
  const [showSlideView, setShowSlideView] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const surahIntro = getSurahIntroduction(surah.number);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.share({
        title: `Surah ${surah.englishName}`,
        text: `Read Surah ${surah.englishName} on QuranicLearn`,
        url: url,
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      // TODO: Add toast notification
      console.log('URL copied to clipboard');
    }
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark clicked');
  };
  return (
    <div 
      className="surah-view" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`
      }}
    >
      <ToggleMenu 
        onFullScreen={handleFullScreen}
        onScrollViewToggle={() => setShowScrollReadView(!showScrollReadView)}
        onBookmarkToggle={handleBookmark}
        onShareClick={handleShare}
        isFullScreen={isFullScreen}
        isScrollView={showScrollReadView}
        currentView={showAudioView ? 'audio' : showScrollReadView ? 'scroll' : showSlideView ? 'slide' : 'surah'}
      />

      {showSlideView ? (
        <SlideView
          surahNumber={surah.number}
          surahName={surah.englishName}
          totalVerses={surah.numberOfAyahs}
          backgroundImageUrl={backgroundImage}
          onBack={() => setShowSlideView(false)}
        />
      ) : showScrollReadView ? (
        <ScrollReadView
          surahNumber={surah.number}
          surahName={surah.englishName}
          totalVerses={surah.numberOfAyahs}
          backgroundImageUrl={backgroundImage}
          onBack={() => setShowScrollReadView(false)}
        />
      ) : (
        <>
          <div className="surah-view-header" style={{ paddingTop: '80px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
            <button onClick={onBack} className="back-button">
              ← Go back
            </button>
            <div className="bookmark-section">
              <button className="bookmark-button">
                <span className="bookmark-icon">🔖</span>
                Bookmarks
              </button>
            </div>
          </div>

      <div className="surah-view-content">
        <div className="quran-icon-circle">
          <span className="quran-icon">📖</span>
        </div>
        <h1 className="surah-title typing-text">
          <TypeWriter 
            arabicText={surah.name}
            englishText={surah.englishName.toUpperCase()}
            englishMeaning={surah.englishNameTranslation}
          />
        </h1>

        <div className="actions-layout">
          <div className="main-actions">
            <button 
              className="feature-button view-button"
              onClick={() => setShowSlideView(true)}
            >
              <span className="action-icon">🖥️</span>
              <span className="action-text">Slide View</span>
            </button>
            
            <button 
              className="feature-button read-button"
              onClick={() => setShowScrollReadView(true)}
            >
              <span className="action-icon">📜</span>
              <span className="action-text">Scroll & Read</span>
            </button>
            
            <button 
              className="feature-button audio-button"
              onClick={() => setShowAudioView(true)}
            >
              <span className="action-icon">🎵</span>
              <span className="action-text">Play with Audio</span>
            </button>

            {showAudioView && (
              <AudioView
                surahNumber={surah.number}
                surahName={surah.name}
                backgroundImage={backgroundImage}
                onClose={() => setShowAudioView(false)}
              />
            )}
          </div>

          <button 
            className="intro-button"
            onClick={() => setShowIntroduction(true)}
          >
            <span className="intro-icon">ℹ️</span>
            INTRODUCTION
          </button>
          
          {surahIntro && (
            <SurahIntroduction
              surahData={surahIntro}
              isOpen={showIntroduction}
              onClose={() => setShowIntroduction(false)}
            />
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}