'use client'

import React, { useEffect, useState } from 'react'

interface PageUnresponsiveHandlerProps {
  timeout?: number;
  children: React.ReactNode;
}

/**
 * PageUnresponsiveHandler component - modified to not show unresponsive dialog
 * Only shows initial loading indicator and then renders children
 */
export default function PageUnresponsiveHandler({
  timeout = 5000,
  children
}: PageUnresponsiveHandlerProps) {
  // Always set to true to prevent dialog from showing
  const [isPageResponsive, setIsPageResponsive] = useState(true);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);

  // Setup only loading indicator, no unresponsive detection
  useEffect(() => {
    // Start with a brief loading indicator
    const initialLoadingTimeout = setTimeout(() => {
      setShowLoadingIndicator(false);
    }, 800);

    // Cleanup function
    return () => {
      clearTimeout(initialLoadingTimeout);
    };
  }, []);

  // Empty functions as we no longer show the dialog
  const handleWait = () => {
    // No-op as we don't show the dialog anymore
  };

  // Function to handle exiting the page
  const handleExit = () => {
    window.history.back();
  };

  return (
    <>
      {/* Loading indicator for initial load */}
      {showLoadingIndicator && (
        <div className="quran-loading">
          <div className="quran-loading-animation"></div>
          <p>Loading Quran page...</p>
        </div>
      )}

      {/* Main content */}
      {children}
    </>
  );
}