'use client';

import React from 'react';

interface AudioVisualizerProps {
    isPlaying?: boolean;
    barCount?: number;
    className?: string;
}

export default function AudioVisualizer({
    isPlaying = false,
    barCount = 8,
    className = ''
}: AudioVisualizerProps) {
    return (
        <div className={`flex items-center justify-center gap-1 h-12 ${className}`}>
            {Array.from({ length: barCount }).map((_, index) => (
                <div
                    key={index}
                    className={`w-1 bg-gradient-to-t from-teal-400 to-purple-500 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'
                        }`}
                    style={{
                        transition: 'height 0.3s ease',
                    }}
                />
            ))}
        </div>
    );
}
