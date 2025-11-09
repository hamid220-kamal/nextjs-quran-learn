'use client';

import { Dua } from '../types';
import { motion } from 'framer-motion';

interface DuaCardProps {
  dua: Dua;
  onClick?: () => void;
}

export default function DuaCard({ dua, onClick }: DuaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Arabic Text */}
        <div 
          className="text-2xl mb-4 text-right font-arabic leading-loose" 
          dir="rtl"
        >
          {dua.arabic}
        </div>
        
        {/* Transliteration */}
        <div className="mb-4">
          <h4 className="text-xs uppercase text-gray-500 mb-1">
            Transliteration
          </h4>
          <p className="text-gray-700 text-sm italic">
            {dua.transliteration}
          </p>
        </div>
        
        {/* Translation */}
        <div className="mb-4">
          <h4 className="text-xs uppercase text-gray-500 mb-1">
            Translation
          </h4>
          <p className="text-gray-900">
            {dua.translation}
          </p>
        </div>
        
        {/* Source & Reference */}
        {(dua.source || dua.reference) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {dua.source && (
                <div className="flex items-center">
                  <i className="fas fa-book mr-2 text-gray-400"></i>
                  <span>{dua.source}</span>
                </div>
              )}
              {dua.reference && (
                <div className="flex items-center">
                  <i className="fas fa-link mr-2 text-gray-400"></i>
                  <span>{dua.reference}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Audio Player */}
        {dua.audio && (
          <div className="mt-4">
            <audio
              controls
              className="w-full"
              src={dua.audio}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </motion.div>
  );
}