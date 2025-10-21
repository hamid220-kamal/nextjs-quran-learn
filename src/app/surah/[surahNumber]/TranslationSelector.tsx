'use client';

import { useState } from 'react';
import { EDITIONS } from '../../../utils/quranApi';

interface TranslationSelectorProps {
  onChange: (translationKey: string) => void;
  currentTranslation: string;
}

export default function TranslationSelector({ 
  onChange, 
  currentTranslation = EDITIONS.ENGLISH 
}: TranslationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Available translations
  const translations = [
    { key: EDITIONS.ENGLISH, name: 'English (Sahih International)' },
    { key: EDITIONS.ENGLISH_PICKTHALL, name: 'English (Pickthall)' },
    { key: EDITIONS.FRENCH, name: 'French (Hamidullah)' },
    { key: EDITIONS.SPANISH, name: 'Spanish (Asad)' },
    { key: EDITIONS.GERMAN, name: 'German (Abu Rida)' },
    { key: EDITIONS.URDU, name: 'Urdu (Jalandhry)' }
  ];
  
  // Find the current translation name
  const getCurrentTranslationName = () => {
    const translation = translations.find(t => t.key === currentTranslation);
    return translation ? translation.name : 'Select Translation';
  };
  
  // Handle translation selection
  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
  };
  
  return (
    <div className="translation-selector">
      <button 
        className="translation-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>Translation: {getCurrentTranslationName()}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="translation-dropdown">
          <ul role="listbox">
            {translations.map(translation => (
              <li 
                key={translation.key}
                role="option"
                aria-selected={currentTranslation === translation.key}
                onClick={() => handleSelect(translation.key)}
                className={currentTranslation === translation.key ? 'selected' : ''}
              >
                {translation.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}