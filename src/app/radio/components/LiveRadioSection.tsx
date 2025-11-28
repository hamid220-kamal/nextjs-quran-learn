'use client';

import React, { useState } from 'react';

interface LiveRadioSectionProps {
    onStartRadio: (mode: string) => void;
}

export default function LiveRadioSection({ onStartRadio }: LiveRadioSectionProps) {
    const [activeMood, setActiveMood] = useState('calm');

    const moods = [
        { id: 'calm', label: 'Calm & Serene', icon: '🌙' },
        { id: 'energetic', label: 'Spiritual Energy', icon: '⚡' },
        { id: 'focus', label: 'Deep Focus', icon: '📖' },
    ];

    return (
        <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-lg space-y-4 text-center md:text-left flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        LIVE RADIO 24/7
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Experience the Quran Live
                    </h2>

                    <p className="text-sm text-gray-600">
                        Tune in to a continuous stream of beautiful recitations tailored to your mood.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {moods.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => setActiveMood(mood.id)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${activeMood === mood.id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <span className="text-base">{mood.icon}</span>
                                {mood.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <button
                        onClick={() => onStartRadio(activeMood)}
                        className="group flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:scale-105"
                    >
                        <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                    <p className="text-center text-xs font-medium text-gray-600">
                        Start Listening
                    </p>
                </div>
            </div>
        </div>
    );
}
