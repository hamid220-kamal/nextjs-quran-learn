'use client';

import React, { useState, useEffect } from 'react';

interface ThemeToggleProps {
    defaultTheme?: 'light' | 'dark' | 'system';
    onChange?: (theme: 'light' | 'dark') => void;
}

export default function ThemeToggle({ defaultTheme = 'system', onChange }: ThemeToggleProps) {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('radio-theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme(defaultTheme);
        }
    }, []);

    const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
        const root = document.documentElement;
        let actualTheme: 'light' | 'dark' = selectedTheme === 'system' 
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : selectedTheme;

        if (actualTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        onChange?.(actualTheme);
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        localStorage.setItem('radio-theme', newTheme);
        applyTheme(newTheme);
    };

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
                onClick={() => handleThemeChange('light')}
                className={`p-2 rounded-md transition-all flex items-center justify-center ${
                    theme === 'light'
                        ? 'bg-white text-yellow-500 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-label="Light mode"
                title="Light mode"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zM12 19a7 7 0 100-14 7 7 0 000 14zm0-2a5 5 0 100-10 5 5 0 000 10zm9-1a1 1 0 01-1-1 1 1 0 011-1h2a1 1 0 011 1 1 1 0 01-1 1h-2zM4 12a1 1 0 01-1 1H1a1 1 0 01-1-1 1 1 0 011-1h2a1 1 0 011 1zm14.5-7a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414a1 1 0 010 1.414zM7.914 18.086a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414a1 1 0 010 1.414z" />
                </svg>
            </button>

            <button
                onClick={() => handleThemeChange('system')}
                className={`p-2 rounded-md transition-all flex items-center justify-center ${
                    theme === 'system'
                        ? 'bg-white text-gray-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-label="System theme"
                title="System theme"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 2a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V5a3 3 0 00-3-3H5zm14 2a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h14zm-4 14v2H9v-2h6z" />
                </svg>
            </button>

            <button
                onClick={() => handleThemeChange('dark')}
                className={`p-2 rounded-md transition-all flex items-center justify-center ${
                    theme === 'dark'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-label="Dark mode"
                title="Dark mode"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </button>
        </div>
    );
}
