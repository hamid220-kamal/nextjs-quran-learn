'use client';

import { useState, useEffect } from 'react';
import './AudioErrorToast.css';

interface AudioErrorToastProps {
  message: string | null;
  onClose: () => void;
  autoHideMs?: number;
}

export default function AudioErrorToast({ 
  message, 
  onClose,
  autoHideMs = 5000 
}: AudioErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show/hide the toast when message changes
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Auto-hide after specified time
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade animation before dismiss
      }, autoHideMs);
      
      return () => clearTimeout(timer);
    }
  }, [message, autoHideMs, onClose]);
  
  if (!message) return null;
  
  return (
    <div className={`audio-error-toast ${isVisible ? 'visible' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">⚠️</div>
        <div className="toast-message">{message}</div>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade animation
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}