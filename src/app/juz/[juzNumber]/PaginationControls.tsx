'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  offset: number;
  limit: number;
  totalAyahs: number;
  setOffset: (offset: number) => void;
  setCurrentPage: (page: number) => void;
}

export default function PaginationControls({ 
  currentPage, 
  totalPages,
  offset, 
  limit, 
  totalAyahs,
  setOffset, 
  setCurrentPage
}: PaginationControlsProps) {
  return (
    <div className="juz-pagination">
      <div className="pagination-info">
        <div>Showing verses {offset + 1} - {Math.min(offset + limit, totalAyahs)} of {totalAyahs}</div>
        <span className="page-counter">Page {currentPage}/{totalPages}</span>
      </div>
      <div className="pagination-controls">
        <button 
          onClick={() => {
            const newOffset = Math.max(0, offset - limit);
            setOffset(newOffset);
            setCurrentPage(Math.floor(newOffset / limit) + 1);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={offset === 0}
          className="pagination-button"
        >
          Previous Page
        </button>
        <span className="page-indicator">Page {currentPage}/{totalPages}</span>
        <button 
          onClick={() => {
            const newOffset = offset + limit;
            if (newOffset < totalAyahs) {
              setOffset(newOffset);
              setCurrentPage(Math.floor(newOffset / limit) + 1);
              // Scroll to top when changing pages
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={offset + limit >= totalAyahs}
          className="pagination-button"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}