'use client'

import React, { useState, useEffect } from 'react'

interface LazyDataLoaderProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  initialCount?: number;
  batchSize?: number;
  batchDelay?: number;
  loadTrigger?: 'scroll' | 'time';
  containerClassName?: string;
  loadingComponent?: React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

/**
 * LazyDataLoader component that progressively renders large datasets
 * to prevent UI freezing and page unresponsiveness
 */
export default function LazyDataLoader<T>({
  data,
  renderItem,
  initialCount = 10,
  batchSize = 10,
  batchDelay = 50,
  loadTrigger = 'time',
  containerClassName = '',
  loadingComponent,
  keyExtractor
}: LazyDataLoaderProps<T>) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load more items in batches
  const loadMoreItems = () => {
    if (visibleCount >= data.length) return;
    
    setIsLoading(true);
    
    // Use requestIdleCallback if available, otherwise use setTimeout
    const scheduleNextBatch = window.requestIdleCallback || ((cb) => setTimeout(cb, batchDelay));
    
    scheduleNextBatch(() => {
      setVisibleCount(prev => Math.min(prev + batchSize, data.length));
      setIsLoading(false);
    });
  };

  // Set up scroll-based loading
  useEffect(() => {
    if (loadTrigger !== 'scroll' || visibleCount >= data.length) return;
    
    const handleScroll = () => {
      // Load more when user scrolls near the bottom
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreItems();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, data.length, loadTrigger]);

  // Set up time-based loading
  useEffect(() => {
    if (loadTrigger !== 'time' || visibleCount >= data.length) return;
    
    const intervalId = setInterval(() => {
      loadMoreItems();
    }, batchDelay);
    
    return () => clearInterval(intervalId);
  }, [visibleCount, data.length, loadTrigger]);

  // Get the visible slice of data
  const visibleData = data.slice(0, visibleCount);

  return (
    <>
      <div className={containerClassName}>
        {visibleData.map((item, index) => (
          <React.Fragment key={keyExtractor(item)}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>
      
      {isLoading && loadingComponent}
      
      {visibleCount < data.length && !isLoading && (
        <button 
          onClick={loadMoreItems}
          className="load-more-btn"
        >
          Load More
        </button>
      )}
    </>
  );
}