'use client'

import { useState, memo } from 'react'
// styles migrated into ../../app/quran/Quran.css (consolidated)

interface SurahCardProps {
  surah: {
    number: number
    name: string
    englishName: string
    englishNameTranslation: string
    numberOfAyahs: number
    revelationType: string
  }
  onRead?: () => void
}

// Using React.memo to prevent unnecessary re-renders of cards that haven't changed
const SurahCard = memo(function SurahCard({ surah, onRead }: SurahCardProps) {
  // Simplify by removing state that doesn't affect rendering
  // This avoids unnecessary re-renders when hovering
  return (
    <div
      className="surah-card quran-surah-card"
      // Using CSS :hover instead of React state for better performance
    >
      <div className="surah-card-inner">
        {/* Card Number Badge */}
        <div className="surah-number quran-surah-number">{surah.number}</div>

        {/* Main Content */}
        <div className="surah-card-content">
          <div className="surah-name-ar" dir="rtl">{surah.name}</div>
          <div className="surah-name-en">{surah.englishName}</div>
          <div className="surah-name-translation">{surah.englishNameTranslation}</div>
          
          {/* Meta Info */}
          <div className="surah-card-meta">
            <div className="surah-count">{surah.numberOfAyahs} Verses</div>
            <div className="surah-revelation">
              {surah.revelationType}
            </div>
          </div>
        </div>
      </div>

      {/* READ Button - positioned at bottom center, only if onRead is provided */}
      {onRead && (
        <div className="read-btn-container">
          <button className="read-btn" onClick={onRead}>
            READ
          </button>
        </div>
      )}
    </div>
  )
})

// Enable displayName for better debugging
SurahCard.displayName = 'SurahCard'

export default SurahCard