'use client';

import { useState, useEffect } from 'react';
import { Language } from '../types';
import { fetchLanguages } from '../api';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

// Default languages in case API fails
const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>(defaultLanguages);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLanguages() {
      try {
        const data = await fetchLanguages();
        // Make sure data is an array and has at least one item
        if (Array.isArray(data) && data.length > 0) {
          setLanguages(data);
        } else {
          console.warn('Invalid language data received:', data);
          // Keep using default languages
        }
      } catch (err) {
        console.error('Error loading languages:', err);
        setError('Failed to load languages');
        // Keep using default languages
      } finally {
        setIsLoading(false);
      }
    }
    loadLanguages();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
      {error && (
        <div className="absolute top-full mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}