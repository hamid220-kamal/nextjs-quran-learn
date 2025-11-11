'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';
import { fetchCategories, fetchDuasByCategory } from './api';
import { Category, Dua } from './types';
import LanguageSelector from './components/LanguageSelector';
import CategoryCard from './components/CategoryCard';
import DuaCard from './components/DuaCard';

function DuaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [categories, setCategories] = useState<Category[]>([
    // Default categories in case API fails
    {
      id: 'morning-evening',
      slug: 'morning-evening',
      title: 'Morning & Evening',
      description: 'Duas for morning and evening',
      totalDuas: 20
    },
    {
      id: 'quran',
      slug: 'quran',
      title: 'Quranic Duas',
      description: 'Supplications from the Holy Quran',
      totalDuas: 40
    },
    {
      id: 'daily',
      slug: 'daily',
      title: 'Daily Duas',
      description: 'Duas for daily activities',
      totalDuas: 30
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams ? searchParams.get('category') : null
  );
  const [duas, setDuas] = useState<Dua[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        const data = await fetchCategories(selectedLanguage);
        // Validate that data is an array and has items
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setError(null);
        } else {
          console.warn('Invalid category data received:', data);
          // Keep using default categories
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories. Please try again later.');
        // Keep using default categories
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, [selectedLanguage]);

  // Load duas when category is selected
  useEffect(() => {
    async function loadDuas() {
      if (!selectedCategory) {
        setDuas([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchDuasByCategory(selectedCategory, selectedLanguage);
        setDuas(data);
        setError(null);
      } catch (err) {
        setError('Failed to load duas. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    loadDuas();
  }, [selectedCategory, selectedLanguage]);

  // Update URL when category changes
  useEffect(() => {
    const newUrl = selectedCategory 
      ? `/dua?category=${selectedCategory}` 
      : '/dua';
    router.push(newUrl);
  }, [selectedCategory, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              Duas & Supplications
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Collection of authentic duas from the Quran and Sunnah with translations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory ? 'Duas' : 'Categories'}
          </h2>
          
          <div className="flex items-center gap-4">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Categories
              </button>
            )}
            
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
              <i className="fas fa-exclamation-circle text-red-400 mt-0.5 mr-3"></i>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-lg p-6 h-48"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Categories Grid */}
            {!selectedCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={category.slug === selectedCategory}
                    onClick={() => setSelectedCategory(category.slug)}
                  />
                ))}
              </motion.div>
            )}

            {/* Duas Grid */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {duas.map((dua) => (
                  <DuaCard
                    key={dua.id}
                    dua={dua}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function DuaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>}>
      <DuaPageContent />
    </Suspense>
  );
}