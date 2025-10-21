  // Handle playing a specific verse
  const playVerse = async (verseKey: string, isAutoPlay = false) => {
    // Clear any previous error messages
    setErrorMessage(null);
    
    // Parse verse key (format: "1:1" for Surah 1, Ayah 1)
    const [surahNumber, ayahNumber] = verseKey.split(':').map(Number);
    
    try {
      const audioPlayer = verseAudioPlayerRef.current;
      
      // If this verse is already playing, stop it
      if (playingVerse === verseKey) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current.src = '';
          audioElementRef.current = null;
        } else {
          audioPlayer.stop();
        }
        setPlayingVerse(null);
        // If auto-play is active, stop it too
        if (autoPlaySurah !== null) {
          stopAutoPlay();
        }
        return;
      }
      
      // If any other verse is playing, stop it first
      if (playingVerse !== null) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current.src = '';
          audioElementRef.current = null;
        } else {
          audioPlayer.stop();
        }
        setPlayingVerse(null);
      }
      
      // Set loading state
      setLoadingVerse(verseKey);
      
      // Special handling for Al-Fatiha
      if (surahNumber === 1) {
        try {
          // Try to play using the simple player
          const audioElement = await playAlFatihaAyah(ayahNumber);
          
          // Store the audio element reference
          audioElementRef.current = audioElement;
          
          // Set up event listeners
          audioElement.onended = () => {
            setPlayingVerse(null);
            audioElementRef.current = null;
            
            // If auto-play is active, increment the index for the next verse
            if (autoPlaySurah !== null) {
              setCurrentAutoPlayIndex(prev => prev + 1);
            }
          };
          
          audioElement.onpause = () => {
            setPlayingVerse(null);
          };
          
          audioElement.onerror = () => {
            console.error('Error playing Al-Fatiha verse', ayahNumber);
            setPlayingVerse(null);
            setLoadingVerse(null);
            setErrorMessage(`Could not play verse ${surahNumber}:${ayahNumber}. Please try again.`);
            audioElementRef.current = null;
          };
          
          // Update state
          setPlayingVerse(verseKey);
          setLoadingVerse(null);
        } catch (error) {
          console.error(`Error playing Al-Fatiha verse ${ayahNumber}:`, error);
          setErrorMessage(`Could not play verse ${surahNumber}:${ayahNumber}. Please try again.`);
          setLoadingVerse(null);
        }
        return; // Exit after handling Al-Fatiha
      }
      
      // Handle problematic verses with our specialized handler
      if (isProblematicVerse(verseKey)) {
        // Use our helper function for problematic verses
        const success = await playProblematicVerseWithUi(verseKey, isAutoPlay);
        if (success) {
          return; // Exit early if successful
        }
        // Otherwise continue with standard approach
      }
      
      try {
        // Standard verse playback
        console.log(`Attempting to play ${verseKey} via standard method`);
        await audioPlayer.playAyah(surahNumber, ayahNumber);
        
        // Update playing state
        console.log(`Successfully played ${verseKey} via standard method`);
        setPlayingVerse(verseKey);
        setLoadingVerse(null);
        
        // If auto-play is active, listen for end event
        if (isAutoPlay) {
          audioPlayer.onEnd(() => {
            setPlayingVerse(null);
            // Move to next verse in auto-play queue
            setCurrentAutoPlayIndex(prev => prev + 1);
          });
        }
      } catch (standardError) {
        console.error(`Error playing verse ${verseKey} via standard method:`, standardError);
        
        // Try problematic verses again with our specialized handler
        if (isProblematicVerse(verseKey)) {
          setErrorMessage(`Trying alternative sources for verse ${verseKey}...`);
          const success = await playProblematicVerseWithUi(verseKey, isAutoPlay);
          if (success) {
            return; // Exit if successful
          }
        }
        
        // Try the alternative direct API approach for problematic verses
        try {
          setErrorMessage(`Trying alternative source for verse ${verseKey}...`);
          
          // Use the direct API to get the audio URL
          const fallbackUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/audio/ar.alafasy`;
          const response = await fetch(fallbackUrl);
          const data = await response.json();
          
          if (data.code === 200 && data.data && data.data.audio) {
            // Create a new audio element
            const audioElement = new Audio(data.data.audio);
            
            // Set up event listeners
            audioElement.onended = () => {
              setPlayingVerse(null);
              audioElementRef.current = null;
              
              // If auto-play is active, increment the index for the next verse
              if (autoPlaySurah !== null) {
                setCurrentAutoPlayIndex(prev => prev + 1);
              }
            };
            
            audioElement.onpause = () => {
              setPlayingVerse(null);
            };
            
            audioElement.onerror = () => {
              setPlayingVerse(null);
              setLoadingVerse(null);
              setErrorMessage(`Could not play verse ${verseKey}. Please try again.`);
              audioElementRef.current = null;
            };
            
            // Play the audio
            await audioElement.play();
            
            // Store the audio element reference
            audioElementRef.current = audioElement;
            
            // Update state
            setPlayingVerse(verseKey);
            setLoadingVerse(null);
            setErrorMessage(null);
            
            return; // Successfully played using alternative approach
          }
        } catch (fallbackError) {
          console.error(`Fallback also failed for verse ${verseKey}:`, fallbackError);
        }
        
        // Handle retry logic if direct API approach also failed
        if (retryCount < 2) {
          setRetryCount(prevCount => prevCount + 1);
          setErrorMessage(`Trying another source for verse ${verseKey}... (Attempt ${retryCount + 1}/3)`);
          
          // Try again after a short delay
          setTimeout(() => playVerse(verseKey), 1500);
        } else {
          // Reset retry count and show final error
          setRetryCount(0);
          
          // If this was auto-play, continue to next verse
          if (isAutoPlay && autoPlaySurah !== null) {
            setErrorMessage(`Skipping verse ${verseKey} (unavailable)`);
            setTimeout(() => {
              setCurrentAutoPlayIndex(prev => prev + 1);
            }, 2000);
          } else {
            setErrorMessage(`Could not play verse ${verseKey}. Please try another verse.`);
          }
          
          setLoadingVerse(null);
        }
      }
    } catch (error) {
      console.error(`Unexpected error playing verse ${verseKey}:`, error);
      setErrorMessage(`Could not play verse ${verseKey}. Please try again later.`);
      setLoadingVerse(null);
    }
  };