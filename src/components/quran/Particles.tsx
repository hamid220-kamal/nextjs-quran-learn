'use client'

import { useEffect, useState } from 'react'

export default function Particles() {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    const symbols = ['۞', '٭', '✦', '•', '۩']
    const count = 10
    const list = []
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 10
      const left = Math.random() * 100
      const top = Math.random() * 100
      const tx = (Math.random() - 0.5) * 300
      const ty = (Math.random() - 0.5) * 300
      const duration = 20 + Math.random() * 20
      const delay = Math.random() * 5
      const opacity = 0.08 + Math.random() * 0.22
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      list.push({ size, left, top, tx, ty, duration, delay, opacity, symbol })
    }
    setParticles(list)
  }, [])

  return (
    <div className="quran-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="quran-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${p.size * 0.8}px`,
            color: Math.floor(i) % 2 === 0 ? 'var(--primary-green-light)' : 'var(--primary-blue-light)',
            '--tx': `${p.tx}px` as any,
            '--ty': `${p.ty}px` as any,
          } as React.CSSProperties}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  )
}
