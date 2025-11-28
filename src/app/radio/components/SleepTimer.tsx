'use client';

import { useState, useEffect, useCallback } from 'react';

const PRESET_TIMES = [
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '45 min', minutes: 45 },
    { label: '1 hour', minutes: 60 },
    { label: '2 hours', minutes: 120 },
];

interface SleepTimerProps {
    onTimeout?: () => void;
}

export default function SleepTimer({ onTimeout }: SleepTimerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number>(0);

    const startTimer = useCallback((minutes: number) => {
        const end = Date.now() + minutes * 60 * 1000;
        setEndTime(end);
        setIsOpen(false);
    }, []);

    const stopTimer = useCallback(() => {
        setEndTime(null);
        setRemaining(0);
    }, []);

    useEffect(() => {
        if (!endTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                stopTimer();
                onTimeout?.();
            } else {
                setRemaining(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime, stopTimer, onTimeout]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${endTime
                        ? 'bg-purple-500/20 text-purple-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                aria-label="Sleep timer"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Active Timer Display */}
            {endTime && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    {formatTime(remaining)}
                </div>
            )}

            {/* Timer Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 space-y-3 z-50 animate-slideDown">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-gray-900">Sleep Timer</h3>
                            {endTime && (
                                <button
                                    onClick={stopTimer}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        {endTime ? (
                            <div className="text-center py-4">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {formatTime(remaining)}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Time remaining</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {PRESET_TIMES.map(({ label, minutes }) => (
                                    <button
                                        key={minutes}
                                        onClick={() => startTimer(minutes)}
                                        className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-900 font-medium text-sm transition-all duration-300 hover:scale-105"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
