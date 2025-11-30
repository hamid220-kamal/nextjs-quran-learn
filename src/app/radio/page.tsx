'use client';

// Exact clone of Quran.com Radio page - EXACT UI MATCH
import React, { useState } from 'react';
import Link from 'next/link';


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

  // Curated Stations Data - matching Quran.com
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

  // Reciter Stations Data - 12 top reciters from Quran.com
  const reciters: Reciter[] = [
    { id: '1', name: 'Ahmed ibn Ali al-Ajmy', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/22/Ahmed-ibn-Ali-al-Ajmy-profile.png', link: '/reciters/19' },
    { id: '2', name: 'Abdullah Ali Jabir', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/23/Abdullah-Ali-Jabir-profile.png', link: '/reciters/158' },
    { id: '3', name: 'Bandar Baleela', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/24/Bandar-Baleela-profile.png', link: '/reciters/160' },
    { id: '4', name: 'Maher al-Muaiqly', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/25/Maher-al-Muaiqly-profile.png', link: '/reciters/159' },
    { id: '5', name: 'AbdulBaset AbdulSamad', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/1/abdelbasset-profile.jpeg', link: '/reciters/2' },
    { id: '6', name: 'Mahmoud Khalil Al-Husary', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/5/mahmoud-khalil-al-hussary-profile.png', link: '/reciters/6' },
    { id: '7', name: 'Mishari Rashid al-Afasy', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/6/mishary-rashid-alafasy-profile.jpeg', link: '/reciters/7' },
    { id: '8', name: 'Abdur-Rahman as-Sudais', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/2/abdul-rahman-al-sudais-profile.jpeg', link: '/reciters/3' },
    { id: '9', name: 'Mohamed Siddiq al-Minshawi', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/7/mohamed-siddiq-el-minshawi-profile.jpeg', link: '/reciters/9' },
    { id: '10', name: 'Abu Bakr al-Shatri', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/3/abu-bakr-al-shatri-pofile.jpeg', link: '/reciters/4' },
    { id: '11', name: 'Saad al-Ghamdi', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/16/saad-al-ghamdi-profile.png', link: '/reciters/13' },
    { id: '12', name: 'Hani ar-Rifai', type: 'Murattal', image: 'https://static.qurancdn.com/images/reciters/4/hani-ar-rifai-profile.jpeg', link: '/reciters/5' },
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
      `}</style>
        {/* Header - Ultra Compact */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2.5 flex items-center justify-between h-12 lg:h-14">
            <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-0.5 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg lg:text-xl font-bold text-gray-900">Quran.com</span>
            </Link>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
            <button className="text-xs lg:text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1">
              Sign in
            </button>
            <button className="p-0.5 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-0.5 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            </div>
          </div>
        </header>

      <main className="max-w-7xl mx-auto">
        {/* Curated Stations Section - Horizontal Scroll */}
        <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-4 lg:py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-3">
            <h2 className="text-base lg:text-xl font-bold text-white">Curated Stations</h2>
          </div>

          {/* Horizontal Scroll - Single Row Layout */}
          <div className="flex gap-3 lg:gap-4 pb-2 overflow-x-auto hide-scrollbar">
            {curatedStations.map((station) => (
              <button
                key={station.id}
                onClick={() => {
                  /* Station selected */
                }}
                className="group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg flex-shrink-0"
              >
                <div className="relative w-48 sm:w-56 lg:w-64 h-32 lg:h-40 bg-gray-200 overflow-hidden rounded-lg">
                  <img
                    src={station.image}
                    alt={station.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    title={station.title}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                    <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Title and Description Below */}
                <div className="bg-gray-50 p-2 lg:p-2.5 rounded-b-lg">
                  <h3 className="font-semibold text-gray-900 text-xs lg:text-sm truncate">{station.title}</h3>
                  <p className="text-xs text-gray-600 truncate">{station.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Reciter Stations Section */}
        <section className="py-4 lg:py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-3 lg:mb-4">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Reciter Stations</h2>
          </div>

          {/* Grid of Reciter Stations - Compact avatars, 3-6 columns responsive */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4">
            {reciters.map((reciter) => (
              <Link
                key={reciter.id}
                href={reciter.link}
                className="group flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
              >
                {/* Responsive Circular Image with Elegant Border */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-1.5 lg:mb-2 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 border-2 lg:border-3 border-white shadow-sm group-hover:shadow-md group-hover:border-teal-400 transition-all duration-200">
                  <img
                    src={reciter.image}
                    alt={reciter.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Name and Type */}
                <h3 className="text-xs font-medium text-gray-900 line-clamp-2 h-6 lg:h-8 flex items-center justify-center text-center leading-tight">
                  {reciter.name}
                </h3>
                <p className="text-xs text-gray-500 text-center">{reciter.type}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Footer Section - 4 Columns */}
        <footer className="bg-white py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-4 lg:mb-6">
            {/* Column 1 - About */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-xs lg:text-sm">Quran.com</h3>
              <p className="text-xs text-gray-600 leading-tight">
                Read, Listen, Search, and Reflect on the Quran
              </p>
            </div>

            {/* Column 2 - Navigate */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-xs lg:text-sm">Navigate</h3>
              <ul className="space-y-0.5 lg:space-y-1 text-xs lg:text-sm">
                <li><Link href="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link></li>
                <li><Link href="/radio" className="text-gray-600 hover:text-teal-600 transition-colors">Quran Radio</Link></li>
                <li><Link href="/reciters" className="text-gray-600 hover:text-teal-600 transition-colors">Reciters</Link></li>
                <li className="hidden lg:block"><Link href="/about-us" className="text-gray-600 hover:text-teal-600 transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Column 3 - Our Projects */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-xs lg:text-sm">Our Projects</h3>
              <ul className="space-y-0.5 lg:space-y-1 text-xs lg:text-sm">
                <li><Link href="https://quran.com" className="text-gray-600 hover:text-teal-600 transition-colors">Quran.com</Link></li>
                <li><Link href="https://play.google.com/store/apps/details?id=com.quran.labs.androidquran" className="text-gray-600 hover:text-teal-600 transition-colors">Android</Link></li>
                <li><Link href="https://apps.apple.com/us/app/quran-by-quran-com" className="text-gray-600 hover:text-teal-600 transition-colors">iOS</Link></li>
                <li className="hidden lg:block"><Link href="https://quranreflect.com" className="text-gray-600 hover:text-teal-600 transition-colors">QuranReflect</Link></li>
              </ul>
            </div>

            {/* Column 4 - Popular Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-xs lg:text-sm">Popular Links</h3>
              <ul className="space-y-0.5 lg:space-y-1 text-xs lg:text-sm">
                <li><Link href="/surahs/36" className="text-gray-600 hover:text-teal-600 transition-colors">Ayatul Kursi</Link></li>
                <li><Link href="/surahs/36" className="text-gray-600 hover:text-teal-600 transition-colors">Yaseen</Link></li>
                <li><Link href="/surahs/67" className="text-gray-600 hover:text-teal-600 transition-colors">Al Mulk</Link></li>
                <li className="hidden lg:block"><Link href="/surahs/55" className="text-gray-600 hover:text-teal-600 transition-colors">Ar-Rahman</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="border-t border-gray-200 pt-4 lg:pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-2 mb-2 lg:mb-3">
              <div className="flex gap-3 lg:gap-4 text-xs">
                <Link href="/sitemap" className="hover:text-gray-900 transition-colors">Sitemap</Link>
                <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              </div>
              <div className="text-xs">© 2025 Quran.com</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
