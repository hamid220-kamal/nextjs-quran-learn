'use client';

// Exact Quran.com Radio page - PIXEL PERFECT MATCH
import React, { useState } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

interface Station {
  id: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
}

interface Reciter {
  id: string;
  name: string;
  type: string;
  image: string;
  link: string;
}

// Main Page Component
export default function RadioPageQuranClone() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Curated Stations Data - matching Quran.com EXACTLY
  const curatedStations: Station[] = [
    {
      id: '1',
      title: 'Popular Recitations',
      description: 'Daily curated feed of recitations',
      image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F1.jpeg&w=1080&q=75',
      featured: true,
    },
    {
      id: '2',
      title: 'Yaseen, Al-Waqiah, Al-Mulk',
      description: 'The Surahs from a curation of reciters',
      image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F2.jpg&w=1080&q=75',
      featured: true,
    },
    {
      id: '3',
      title: 'Surah Al-Kahf',
      description: 'Listen to Surah Alkahf on repeat',
      image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F3.jpeg&w=1080&q=75',
      featured: true,
    },
    {
      id: '4',
      title: 'Juz Amma',
      description: 'Listen to the final Juz of the Quran',
      image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F4.jpeg&w=1080&q=75',
      featured: true,
    },
  ];

  // Reciter Stations Data - 14 top reciters from Quran.com (exact match)
  const reciters: Reciter[] = [
    { id: '1', name: 'Ahmed ibn Ali al-Ajmy', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/22/Ahmed-ibn-Ali-al-Ajmy-profile.png', link: '/reciters/19' },
    { id: '2', name: 'Abdullah Ali Jabir', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/23/Abdullah-Ali-Jabir-profile.png', link: '/reciters/158' },
    { id: '3', name: 'Bandar Baleela', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/24/Bandar-Baleela-profile.png', link: '/reciters/160' },
    { id: '4', name: 'Maher al-Muaiqly', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/25/Maher-al-Muaiqly-profile.png', link: '/reciters/159' },
    { id: '5', name: 'AbdulBaset AbdulSamad', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/1/abdelbasset-profile.jpeg', link: '/reciters/2' },
    { id: '5b', name: 'AbdulBaset AbdulSamad', type: 'Mujawwad', image: 'https://static.qurancdn.com/images/reciters/1/abdelbasset-profile.jpeg', link: '/reciters/2' },
    { id: '6', name: 'Mahmoud Khalil Al-Husary', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/5/mahmoud-khalil-al-hussary-profile.png', link: '/reciters/6' },
    { id: '7', name: 'Mishari Rashid al-Afasy', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/6/mishary-rashid-alafasy-profile.jpeg', link: '/reciters/7' },
    { id: '8', name: 'Abdur-Rahman as-Sudais', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/2/abdul-rahman-al-sudais-profile.jpeg', link: '/reciters/3' },
    { id: '9', name: 'Mohamed Siddiq al-Minshawi', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/7/mohamed-siddiq-el-minshawi-profile.jpeg', link: '/reciters/9' },
    { id: '10', name: 'Abu Bakr al-Shatri', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/3/abu-bakr-al-shatri-pofile.jpeg', link: '/reciters/4' },
    { id: '11', name: 'Saad al-Ghamdi', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/16/saad-al-ghamdi-profile.png', link: '/reciters/13' },
    { id: '12', name: 'Hani ar-Rifai', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/4/hani-ar-rifai-profile.jpeg', link: '/reciters/5' },
    { id: '13', name: 'Khalifah al-Tunaiji', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/8/khalifah-al-tunaiji-profile.jpeg', link: '/reciters/8' },
    { id: '14', name: 'Yasser Ad Dossary', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/14/yasser-ad-dossary-profile.jpeg', link: '/reciters/14' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style suppressHydrationWarning>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Exact Quran.com styling */
        .quran-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-logo {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          text-decoration: none;
          cursor: pointer;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-btn {
          padding: 6px 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #2563eb;
          transition: color 0.2s;
        }
        .header-btn:hover {
          color: #1d4ed8;
        }
        .icon-btn {
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          transition: background-color 0.2s;
          border-radius: 4px;
        }
        .icon-btn:hover {
          background-color: #f3f4f6;
        }
      `}</style>
        {/* Header - EXACT QURAN.COM MATCH */}
        <header className="quran-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => setMenuOpen(!menuOpen)} className="icon-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="header-logo">
                Quran.com
              </Link>
            </div>
            
            <div className="header-right">
              <button className="header-btn">Sign in</button>
              <button className="icon-btn">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button className="icon-btn">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

      <main>
        {/* Curated Stations Section - EXACT QURAN.COM */}
        <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-6 px-6">
          <div className="max-w-full">
            <h2 className="text-white font-bold mb-4 px-4 sm:px-6 lg:px-8" style={{ fontSize: '18px' }}>Curated Stations</h2>

            {/* Horizontal Scroll - Card Grid */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-2">
              {curatedStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    /* Station selected */
                  }}
                  className="group cursor-pointer flex-shrink-0 transition-all duration-300"
                  style={{ width: '280px' }}
                >
                  {/* Card Container */}
                  <div className="flex flex-col overflow-hidden rounded-lg bg-white hover:shadow-lg transition-shadow">
                    {/* Image Container - 280x160px */}
                    <div className="relative overflow-hidden bg-gray-300 rounded-t-lg" style={{ width: '280px', height: '160px' }}>
                      <img
                        src={station.image}
                        alt={station.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        title={station.title}
                        style={{ width: '280px', height: '160px' }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                        <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Title and Description */}
                    <div className="bg-white p-3" style={{ width: '280px' }}>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{station.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-1 flex items-center">
                        {station.description}
                        <svg className="w-4 h-4 ml-auto text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Reciter Stations Section - EXACT QURAN.COM GRID */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reciter Stations</h2>

            {/* Grid of Reciter Stations - Exact responsive grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {reciters.map((reciter) => (
                <Link
                  key={reciter.id}
                  href={reciter.link}
                  className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:opacity-80"
                >
                  {/* Square Image Card */}
                  <div className="relative w-full aspect-square mb-2 rounded-md overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <img
                      src={reciter.image}
                      alt={reciter.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Name and Type */}
                  <h3 className="text-xs font-medium text-gray-900 line-clamp-2 text-center">
                    {reciter.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{reciter.type}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Footer Section - EXACT QURAN.COM */}
        <footer className="bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Column 1 - About */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Quran.com</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Read, Listen, Search, and Reflect on the Quran
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Quran.com is a trusted platform used by millions worldwide to read, search, listen to, and reflect on the Quran. It provides translations, recitations, word-by-word translation, and tools for deeper study, making the Quran accessible to everyone.
                </p>
              </div>

              {/* Column 2 - Navigate */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Navigate</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
                  <li><Link href="/radio" className="text-blue-600 hover:underline">Quran Radio</Link></li>
                  <li><Link href="/reciters" className="text-blue-600 hover:underline">Reciters</Link></li>
                  <li><Link href="/about-us" className="text-blue-600 hover:underline">About Us</Link></li>
                  <li><Link href="/developers" className="text-blue-600 hover:underline">Developers</Link></li>
                </ul>
              </div>

              {/* Column 3 - Our Projects */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Our Projects</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="https://quran.com" className="text-blue-600 hover:underline" target="_blank">Quran.com</Link></li>
                  <li><Link href="https://quranandroid.com" className="text-blue-600 hover:underline" target="_blank">Quran For Android</Link></li>
                  <li><Link href="https://quranios.com" className="text-blue-600 hover:underline" target="_blank">Quran iOS</Link></li>
                  <li><Link href="https://quranreflect.com" className="text-blue-600 hover:underline" target="_blank">QuranReflect</Link></li>
                </ul>
              </div>

              {/* Column 4 - Popular Links */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Popular Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/surahs/1" className="text-blue-600 hover:underline">Ayatul Kursi</Link></li>
                  <li><Link href="/surahs/36" className="text-blue-600 hover:underline">Yaseen</Link></li>
                  <li><Link href="/surahs/55" className="text-blue-600 hover:underline">Ar-Rahman</Link></li>
                  <li><Link href="/surahs/67" className="text-blue-600 hover:underline">Al Mulk</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-4">
                <div className="flex gap-6 text-sm">
                  <Link href="/sitemap" className="text-blue-600 hover:underline">Sitemap</Link>
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy</Link>
                  <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>
                </div>
                <div className="text-sm text-gray-600">© 2025 Quran.com. All Rights Reserved.</div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
