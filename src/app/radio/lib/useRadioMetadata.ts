import { useEffect, useState } from 'react';
import { fetchChapters, Chapter } from './api/chapters';
import { fetchReciters, Reciter } from './api';

export function useRadioMetadata() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);

  useEffect(() => {
    fetchChapters().then(setChapters);
    fetchReciters().then(setReciters);
  }, []);

  return { chapters, reciters };
}
