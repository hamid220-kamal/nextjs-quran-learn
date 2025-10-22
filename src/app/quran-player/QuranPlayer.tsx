'use client';

import { useState } from 'react';
import './QuranPlayer.css';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  verses: number;
}

const mockSurahs: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', verses: 7 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', verses: 286 },
  // We'll fetch the complete list from API later
];

const mockReciters = [
  { id: 1, name: 'Abdul Basit Abdul Samad' },
  { id: 2, name: 'Mishary Rashid Alafasy' },
  { id: 3, name: 'Saud Al-Shuraim' },
];

export default function QuranPlayer() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReciter, setSelectedReciter] = useState(1);

  const filteredSurahs = mockSurahs.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  return (
    <div className="quran-player-container">
      <aside className="sidebar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search surah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ul className="surah-list">
          {filteredSurahs.map((surah) => (
            <li
              key={surah.number}
              className={`surah-item ${selectedSurah === surah.number ? 'active' : ''}`}
              onClick={() => setSelectedSurah(surah.number)}
            >
              <div className="surah-number">{surah.number}</div>
              <div className="surah-info">
                <div className="surah-name">{surah.name}</div>
                <div className="surah-meta">
                  {surah.englishName} • {surah.verses} verses
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      
      <main className="main-content">
        <div className="player-header">
          <h1>
            {selectedSurah 
              ? mockSurahs.find(s => s.number === selectedSurah)?.name 
              : 'Select a Surah'}
          </h1>
          <select
            className="reciter-select"
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(Number(e.target.value))}
          >
            {mockReciters.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.name}
              </option>
            ))}
          </select>
        </div>
        {/* Audio player and verse list will be added here */}
      </main>
    </div>
  );
}