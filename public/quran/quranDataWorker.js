// quranDataWorker.js
// This worker processes Quran data off the main thread to prevent UI blocking

self.addEventListener('message', function(e) {
  const { type, data } = e.data;
  
  switch(type) {
    case 'FILTER_SURAHS':
      const { surahs, query } = data;
      const searchQuery = query.toLowerCase();
      
      const filtered = surahs.filter(surah => 
        (surah.englishName?.toLowerCase() || '').includes(searchQuery) ||
        (surah.name?.toLowerCase() || '').includes(searchQuery) ||
        (surah.englishNameTranslation?.toLowerCase() || '').includes(searchQuery) ||
        surah.number.toString().includes(searchQuery)
      );
      
      self.postMessage({ type: 'FILTERED_SURAHS', data: filtered });
      break;
      
    case 'PROCESS_AYAHS':
      const { arabicAyahs, translationAyahs, audioAyahs } = data;
      
      const processedAyahs = arabicAyahs.map((ayah, idx) => {
        const globalAyahNumber = ayah.number || ayah.id || null;
        const translationText = translationAyahs[idx]?.text || '';
        const audioUrlFromEdition = audioAyahs[idx]?.audio || null;
        const fallbackAudio = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
        
        return {
          ...ayah,
          translation: translationText,
          audio: audioUrlFromEdition || fallbackAudio,
          surahNumber: ayah.surah?.number || null
        };
      });
      
      self.postMessage({ type: 'PROCESSED_AYAHS', data: processedAyahs });
      break;
  }
});