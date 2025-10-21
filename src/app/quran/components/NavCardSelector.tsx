'use client';

import { useState } from 'react';

interface NavCardSelectorProps {
  options: {
    id: string;
    label: string;
    icon?: string;
  }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function NavCardSelector({
  options,
  activeId,
  onChange,
  className = ''
}: NavCardSelectorProps) {
  // Track hover state for animation effect
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={`nav-card-selector ${className}`}>
      {options.map(option => (
        <button
          key={option.id}
          className={`nav-card-option ${activeId === option.id ? 'active' : ''} ${hoveredId === option.id ? 'hovered' : ''}`}
          onClick={() => onChange(option.id)}
          onMouseEnter={() => setHoveredId(option.id)}
          onMouseLeave={() => setHoveredId(null)}
          aria-label={`View ${option.label}`}
          aria-pressed={activeId === option.id}
        >
          {option.icon && <span className="option-icon">{option.icon}</span>}
          <span className="option-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}