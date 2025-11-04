// AudioView.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type ReciterWithMetadata, type VerseWithTranslation } from '../../utils/quranApi';
import './AudioView.css';

interface AudioViewProps {
  surahNumber: number;
  surahName: string;
  backgroundImage: string;
  onClose: () => void;
}

interface ReciterDisplay extends ReciterWithMetadata {
  id: string;
  duration?: number;
  country?: string;
  style?: string;
}

type VerseDisplay = VerseWithTranslation;

export default function AudioView({ surahNumber, surahName, backgroundImage, onClose }: AudioViewProps) {
  const [reciters, setReciters] = useState<ReciterDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<ReciterDisplay | null>(null);
  const [currentVerse, setCurrentVerse] = useState<VerseDisplay | null>(null);
  const [verses, setVerses] = useState<VerseDisplay[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showReciterPanel, setShowReciterPanel] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const playRequestRef = React.useRef<AbortController | null>(null);

  // Define loadReciters function that can be called from multiple places
  const loadReciters = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch reciters data from multiple endpoints
      const endpoints = [
        'https://api.alquran.cloud/v1/edition/format/audio',
        'https://api.quran.com/api/v4/resources/recitations',
        'https://mp3quran.net/api/v3/reciters'
      ];

      let recitersData = null;
      let errorMessage = '';

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          
          // Handle different API response formats
          recitersData = data.data || data.recitations || data.reciters;
          if (recitersData && Array.isArray(recitersData)) break;
        } catch (err) {
          errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.warn(`Failed to fetch from ${endpoint}:`, err);
          continue;
        }
      }

      if (!recitersData || !Array.isArray(recitersData)) {
        throw new Error('Could not fetch reciters from any endpoint');
      }

      // Process reciters data
      const processedReciters = recitersData.map((reciter: any) => ({
        identifier: reciter.identifier || reciter.id?.toString() || '',
        name: reciter.name || '',
        englishName: reciter.english_name || reciter.englishName || reciter.name || '',
        format: 'audio',
        language: reciter.language_name?.toLowerCase() || reciter.language || 'ar',
        type: reciter.style || reciter.type || 'versebyverse',
        id: reciter.identifier || reciter.id?.toString() || '',
        country: (() => {
          const match = (reciter.english_name || reciter.englishName || '').match(/\((.*?)\)/);
          return match ? match[1] : '';
        })(),
        style: reciter.style || reciter.type || 'Verse by Verse'
      })).filter(r => r.identifier && r.name); // Filter out invalid entries

      // Sort reciters
      const sortedReciters = processedReciters.sort((a: ReciterDisplay, b: ReciterDisplay) => {
        if (a.language !== b.language) {
          // Arabic first, then alphabetically
          return a.language === 'ar' ? -1 : b.language === 'ar' ? 1 : 
                 a.language.localeCompare(b.language);
        }
        return a.englishName.localeCompare(b.englishName);
      });

      // Set available languages
      const languages = [...new Set(sortedReciters.map(r => r.language))];
      setAvailableLanguages(languages);

      // Update state
      setReciters(sortedReciters);
      setError(null);
    } catch (err) {
      console.error('Error loading reciters:', err);
      setError(
        'Unable to load reciters. ' + 
        ((err as Error).message?.includes('endpoint') 
          ? 'The server is currently unavailable. Please try again in a few moments.' 
          : 'Please check your internet connection and try again.')
      );
      setReciters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load reciters on mount
  useEffect(() => {
    loadReciters();
  }, [loadReciters]);

  // Your existing handlers...

  const filteredReciters = reciters.filter(reciter => {
    const matchesSearch = reciter.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reciter.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || reciter.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  // ... Rest of your component code