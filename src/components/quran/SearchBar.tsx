'use client'

import { useState } from 'react'

interface SearchBarProps {
  placeholder: string
  onSearch: (value: string) => void
  type?: string
  min?: number
  max?: number
  errorMessage?: string
}

export default function SearchBar({ 
  placeholder, 
  onSearch, 
  type = 'text', 
  min, 
  max,
  errorMessage 
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (type === 'number') {
      const num = parseInt(newValue)
      if (newValue && (isNaN(num) || (min !== undefined && num < min) || (max !== undefined && num > max))) {
        setError(errorMessage || `Please enter a number between ${min} and ${max}`)
        return
      }
    }

    setError('')
    onSearch(newValue)
  }

  const hasValue = value.trim().length > 0

  return (
    <div className={`search-bar-container ${isFocused ? 'focused' : ''}`}>
      <div className="search-bar-wrapper">
        <input
          id={`searchbar-${Math.random().toString(36).slice(2,8)}`}
          type={type}
          className="search-bar-input"
          aria-label={placeholder}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <label className={`floating-label ${isFocused || hasValue ? 'floating' : ''}`}>{placeholder}</label>
        <div className="search-underline"></div>
      </div>
      {error && <div className="search-bar-error">{error}</div>}
    </div>
  )
}