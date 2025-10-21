/**
 * Problematic Verse Integration for JuzViewer
 * 
 * This module provides helper functions to integrate with the problematicVerseHandler
 * for the JuzViewer component.
 */

import { 
  playProblematicVerse, 
  isProblematicVerse,
  playVerse395,
  playVerse397 
} from '../../../utils/problematicVerseHandler';

/**
 * Helper function to play problematic verses with UI state updates
 * Import and use this function in your JuzViewer component
 */
export const playProblematicVerseWithUi = async (
  verseKey: string, 
  isAutoPlay: boolean,
  audioElementRef: React.MutableRefObject<HTMLAudioElement | null>,
  setPlayingVerse: (verse: string | null) => void,
  setLoadingVerse: (verse: string | null) => void,
  setErrorMessage: (message: string | null) => void,
  setCurrentAutoPlayIndex?: (updater: (prev: number) => number) => void,
  autoPlaySurah?: number | null
): Promise<boolean> => {
  try {
    console.log(`Using specialized handler for problematic verse ${verseKey}`);
    
    // Use specific handlers for certain verses
    let audio: HTMLAudioElement;
    
    if (verseKey === '3:95') {
      console.log('Using dedicated handler for verse 3:95');
      audio = await playVerse395();
    } else if (verseKey === '3:97') {
      console.log('Using dedicated handler for verse 3:97');
      audio = await playVerse397();
    } else {
      // Use the general handler for other problematic verses
      audio = await playProblematicVerse(verseKey);
    }
    
    // Set up event listeners
    audio.onended = () => {
      setPlayingVerse(null);
      audioElementRef.current = null;
      
      if (isAutoPlay && autoPlaySurah !== null && setCurrentAutoPlayIndex) {
        setCurrentAutoPlayIndex(prev => prev + 1);
      }
    };
    
    audio.onpause = () => {
      setPlayingVerse(null);
    };
    
    audio.onerror = () => {
      setPlayingVerse(null);
      setLoadingVerse(null);
      setErrorMessage(`Could not play verse ${verseKey}. Please try again.`);
      audioElementRef.current = null;
    };
    
    // If we get here, playback was successful
    audioElementRef.current = audio;
    setPlayingVerse(verseKey);
    setLoadingVerse(null);
    setErrorMessage(null);
    return true; // Success
  } catch (error) {
    console.error(`Failed to play problematic verse ${verseKey} with specialized handler:`, error);
    return false; // Failed
  }
};

// Export for use in JuzViewer
export { isProblematicVerse };