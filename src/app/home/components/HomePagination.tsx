import React from 'react';
import './HomePagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemType: 'surah' | 'juz' | 'manzil' | 'hizb' | 'page' | 'ruku';
}

const HomePagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="pagination-wrapper">
      <div className="pagination-container">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
          aria-label="Previous page"
        >
          ‹ Previous
        </button>
        
        <div className="pagination-page-info">
          Page <span className="pagination-current">{currentPage}</span> of <span className="pagination-total">{totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default HomePagination;
