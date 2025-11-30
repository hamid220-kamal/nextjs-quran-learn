'use client';

import React, { useState, useEffect } from 'react';

interface AudioVisualizerProps {
    isPlaying?: boolean;
    barCount?: number;
    className?: string;
    style?: 'bars' | 'waveform' | 'circle';
}

export default function AudioVisualizer({
    isPlaying = false,
    barCount = 8,
    className = '',
    style = 'bars'
}: AudioVisualizerProps) {
    const [animatedHeights, setAnimatedHeights] = useState<number[]>(
        Array(barCount).fill(0.2)
    );

    useEffect(() => {
        if (!isPlaying) {
            setAnimatedHeights(Array(barCount).fill(0.2));
            return;
        }

        const interval = setInterval(() => {
            setAnimatedHeights(Array(barCount).fill(0).map(() => 0.1 + Math.random() * 0.9));
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, barCount]);

    if (style === 'circle') {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <div className="relative w-16 h-16">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="absolute w-1 bg-gradient-to-t from-teal-400 to-purple-500 rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `rotate(${index * 30}deg) translateY(-28px)`,
                                height: isPlaying ? `${4 + Math.random() * 8}px` : '4px',
                                transition: 'height 0.1s ease',
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center gap-1 h-12 ${className}`}>
            {Array.from({ length: barCount }).map((_, index) => (
                <div
                    key={index}
                    className={`w-1 bg-gradient-to-t from-teal-400 to-purple-500 rounded-full transition-all ${isPlaying ? 'duration-100' : 'duration-300'}`}
                    style={{
                        height: isPlaying ? `${animatedHeights[index] * 100}%` : '8px',
                        minHeight: '2px',
                    }}
                />
            ))}
        </div>
    );
}
