'use client';

import React, { useState } from 'react';

interface LiveRadioSectionProps {
    onStartRadio: (mode: string) => void;
}

export default function LiveRadioSection({ onStartRadio }: LiveRadioSectionProps) {
    const [activeMood, setActiveMood] = useState('calm');

    const moods = [
        { id: 'calm', label: 'Calm & Serene', icon: '🌙', color: 'bg-indigo-500' },
        { id: 'energetic', label: 'Spiritual Energy', icon: '⚡', color: 'bg-emerald-500' },
        { id: 'focus', label: 'Deep Focus', icon: '📖', color: 'bg-teal-500' },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-lg space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        LIVE RADIO
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Experience the Quran Live
                    </h2>
                    <p className="text-slate-300">
                        Tune in to a continuous, curated stream of recitations tailored to your current state of mind.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                        {moods.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => setActiveMood(mood.id)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeMood === mood.id
                                        ? `${mood.color} text-white shadow-lg scale-105`
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                <span>{mood.icon}</span>
                                {mood.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <button
                        onClick={() => onStartRadio(activeMood)}
                        className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl transition-transform hover:scale-110 active:scale-95"
                    >
                        <div className="absolute inset-0 -z-10 rounded-full bg-white opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                        <svg className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                    <p className="mt-4 text-center text-sm font-medium text-slate-400">Start Listening</p>
                </div>
            </div>
        </div>
    );
}
