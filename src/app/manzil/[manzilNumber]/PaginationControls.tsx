'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  offset: number;
  limit: number;
  totalVerses: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  offset,
  limit,
  totalVerses,
  onPageChange
}: PaginationControlsProps) {
  return (
    <div className="juz-pagination">
      <div className="pagination-info">
        <div>Showing verses {offset + 1} - {Math.min(offset + limit, totalVerses)} of {totalVerses}</div>
        <span className="page-counter">Page {currentPage}/{totalPages}</span>
      </div>
      <div className="pagination-controls">
        <button 
          onClick={() => {
            onPageChange(currentPage - 1);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous Page
        </button>
        <span className="page-indicator">Page {currentPage}/{totalPages}</span>
        <button 
          onClick={() => {
            onPageChange(currentPage + 1);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}