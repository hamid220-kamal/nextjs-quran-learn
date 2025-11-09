'use client';

import { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-6 transition-all ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-white border border-gray-200 hover:border-blue-300'
      }`}
    >
      {category.icon && (
        <div className="mb-4">
          <i className={`fas ${category.icon} text-2xl text-blue-500`}></i>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {category.title}
      </h3>
      
      {category.description && (
        <p className="text-sm text-gray-600 mb-3">
          {category.description}
        </p>
      )}
      
      {category.totalDuas && (
        <div className="text-sm text-blue-600 font-medium">
          {category.totalDuas} Duas
        </div>
      )}
    </motion.div>
  );
}