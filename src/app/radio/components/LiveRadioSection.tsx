'use client';

import React, { useState } from 'react';

interface LiveRadioSectionProps {
    onStartRadio: (mode: string) => void;
}

export default function LiveRadioSection({ onStartRadio }: LiveRadioSectionProps) {
    const [activeMood, setActiveMood] = useState('calm');

    const moods = [
        { id: 'calm', label: 'Calm', icon: '🌙', desc: 'Serene recitations' },
        { id: 'energetic', label: 'Spiritual', icon: '✨', desc: 'Uplifting verses' },
        { id: 'focus', label: 'Focus', icon: '📖', desc: 'Deep concentration' },
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl isolate">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-3xl mix-blend-screen animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/90 to-gray-800/80"></div>
            </div>

            <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-white border border-white/10">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        LIVE RADIO 24/7
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                        Experience the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                            Quran Live
                        </span>
                    </h2>

                    <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto md:mx-0">
                        Tune in to a continuous stream of beautiful recitations, curated to elevate your spiritual state.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                        {moods.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => setActiveMood(mood.id)}
                                className={`group relative flex flex-col items-start p-4 rounded-xl transition-all duration-300 border ${activeMood === mood.id
                                        ? 'bg-white/10 border-white/20 shadow-lg scale-105'
                                        : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{mood.icon}</span>
                                    <span className={`font-semibold ${activeMood === mood.id ? 'text-white' : 'text-gray-300'}`}>
                                        {mood.label}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {mood.desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <button
                        onClick={() => onStartRadio(activeMood)}
                        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-gray-900 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                        <svg className="h-10 w-10 ml-1.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                    <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Start Listening
                    </p>
                </div>
            </div>
        </div>
    );
}
