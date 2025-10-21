'use client'

import { useState } from 'react'

interface NavCardProps {
  type: string
  number: number | string
  label: string
  onClick: () => void
}

export default function NavCard({ type, number, onClick, label }: NavCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`nav-card ${type} ${isHovered ? 'hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="nav-card-glow"></div>
      <div className="nav-card-content">
        <div className="nav-number">{number}</div>
        <div className="nav-label">{label}</div>
      </div>
      <div className="nav-card-hover-effect"></div>
    </div>
  )
}