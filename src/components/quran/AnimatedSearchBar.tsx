'use client'

import React, { useState, useId, useEffect, useRef } from 'react'

interface AnimatedSearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  id?: string
  className?: string
  suggestions?: string[]
  onSelect?: (v: string) => void
}

export default function AnimatedSearchBar({ value, onChange, placeholder = 'Search...', id, className, suggestions = [], onSelect }: AnimatedSearchBarProps) {
  const generatedId = useId()
  const inputId = id || `animated-search-${generatedId}`
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const q = value.toLowerCase()
      const list = suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8)
      // avoid unnecessary state updates
      const same = filtered.length === list.length && filtered.every((v, i) => v === list[i])
      if (!same) {
        setFiltered(list)
        setOpen(list.length > 0)
        setActiveIndex(-1)
      } else {
        // ensure open state matches availability
        if (open !== (list.length > 0)) setOpen(list.length > 0)
      }
    } else {
      // only update if something is already set to avoid re-renders
      if (filtered.length !== 0 || open !== false || activeIndex !== -1) {
        setFiltered([])
        setOpen(false)
        setActiveIndex(-1)
      }
    }
  }, [value, suggestions])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const sel = activeIndex >= 0 ? filtered[activeIndex] : filtered[0]
      if (sel) {
        onChange(sel)
        onSelect && onSelect(sel)
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className={`quran-search-box animated-search ${className || ''}`}>
      <div className="search-input-wrap">
        <input
          id={inputId}
          className={`quran-search-input`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setFocused(true); if (filtered.length) setOpen(true) }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label={placeholder}
          autoComplete="off"
        />
        <label htmlFor={inputId} className={`floating-label ${focused || value ? 'floating' : ''}`}>{placeholder}</label>
        <div className={`search-underline ${focused ? 'active' : ''}`} aria-hidden="true"></div>
        {value && (
          <button
            className={`quran-search-clear animated-clear ${value ? 'visible' : ''}`}
            aria-label="Clear search"
            onClick={() => { onChange(''); setOpen(false); }}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && filtered.length > 0 && (
        <ul className="search-suggestions" role="listbox" aria-label="Search suggestions">
          {filtered.map((s, idx) => (
            <li
              key={s + idx}
              role="option"
              aria-selected={activeIndex === idx}
              className={`search-suggestion-item ${activeIndex === idx ? 'active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); onChange(s); onSelect && onSelect(s); setOpen(false) }}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
