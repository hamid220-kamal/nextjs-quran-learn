'use client';

import { useState, useEffect, useRef } from 'react';

interface VolumeControlProps {
    volume: number;
    onChange: (volume: number) => void;
    className?: string;
}

export default function VolumeControl({ volume, onChange, className = '' }: VolumeControlProps) {
    const [showSlider, setShowSlider] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(volume);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
                setShowSlider(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMuteToggle = () => {
        if (isMuted) {
            onChange(previousVolume);
            setIsMuted(false);
        } else {
            setPreviousVolume(volume);
            onChange(0);
            setIsMuted(true);
        }
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            );
        } else if (volume < 0.5) {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            );
        } else {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            );
        }
    };

    return (
        <div ref={sliderRef} className={`relative ${className}`}>
            <button
                onClick={handleMuteToggle}
                onMouseEnter={() => setShowSlider(true)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {getVolumeIcon()}
                </svg>
            </button>

            {/* Volume Slider */}
            {showSlider && (
                <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-slideUp"
                    onMouseEnter={() => setShowSlider(true)}
                    onMouseLeave={() => setShowSlider(false)}
                >
                    <div className="flex flex-col items-center gap-3">
                        {/* Volume Percentage */}
                        <div className="text-xs font-bold text-gray-900">
                            {Math.round(volume * 100)}%
                        </div>

                        {/* Vertical Slider */}
                        <div className="relative h-32 w-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-full transition-all duration-150"
                                style={{ height: `${volume * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume * 100}
                                onChange={(e) => {
                                    const newVolume = parseInt(e.target.value) / 100;
                                    onChange(newVolume);
                                    if (newVolume > 0) setIsMuted(false);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: 'center',
                                    width: '128px',
                                    height: '8px',
                                    left: '-60px',
                                    top: '60px',
                                }}
                            />
                        </div>

                        {/* Volume Visualizer Bars */}
                        <div className="flex items-end gap-1 h-8">
                            {[0.2, 0.4, 0.6, 0.8, 1].map((threshold, index) => (
                                <div
                                    key={index}
                                    className={`w-1 rounded-full transition-all duration-300 ${volume >= threshold
                                            ? 'bg-gradient-to-t from-purple-600 to-pink-600'
                                            : 'bg-gray-200'
                                        }`}
                                    style={{ height: `${(index + 1) * 4 + 8}px` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
