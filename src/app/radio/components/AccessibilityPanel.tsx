'use client';

import React, { useState } from 'react';

interface AccessibilitySettings {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
    screenReaderMode: boolean;
}

interface AccessibilityPanelProps {
    settings: AccessibilitySettings;
    onSettingsChange?: (settings: AccessibilitySettings) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AccessibilityPanel({
    settings,
    onSettingsChange,
    isOpen = false,
    onClose,
}: AccessibilityPanelProps) {
    const [localSettings, setLocalSettings] = useState<AccessibilitySettings>(settings);

    const handleChange = (newSettings: AccessibilitySettings) => {
        setLocalSettings(newSettings);
        onSettingsChange?.(newSettings);

        // Apply settings
        const root = document.documentElement;

        // Font size
        switch (newSettings.fontSize) {
            case 'large':
                root.style.fontSize = '18px';
                break;
            case 'small':
                root.style.fontSize = '14px';
                break;
            default:
                root.style.fontSize = '16px';
        }

        // High contrast
        if (newSettings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Reduce motion
        if (newSettings.reduceMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }

        // Screen reader mode
        if (newSettings.screenReaderMode) {
            root.setAttribute('role', 'application');
            root.setAttribute('aria-label', 'Radio application');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Accessibility</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close accessibility panel"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Font Size */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900">
                            Text Size
                        </label>
                        <div className="flex gap-2">
                            {(['small', 'medium', 'large'] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() =>
                                        handleChange({
                                            ...localSettings,
                                            fontSize: size,
                                        })
                                    }
                                    className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                                        localSettings.fontSize === size
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {size === 'small' && 'A'}
                                    {size === 'medium' && 'A'}
                                    {size === 'large' && 'A'}
                                    <span className="ml-1">
                                        {size === 'small' && '(14px)'}
                                        {size === 'medium' && '(16px)'}
                                        {size === 'large' && '(18px)'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="high-contrast" className="text-sm font-semibold text-gray-900">
                            High Contrast
                        </label>
                        <button
                            id="high-contrast"
                            onClick={() =>
                                handleChange({
                                    ...localSettings,
                                    highContrast: !localSettings.highContrast,
                                })
                            }
                            className={`relative w-12 h-7 rounded-full transition-colors ${
                                localSettings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            role="switch"
                            aria-checked={localSettings.highContrast}
                        >
                            <div
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                    localSettings.highContrast ? 'translate-x-5' : ''
                                }`}
                            />
                        </button>
                    </div>

                    {/* Reduce Motion */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="reduce-motion" className="text-sm font-semibold text-gray-900">
                            Reduce Motion
                        </label>
                        <button
                            id="reduce-motion"
                            onClick={() =>
                                handleChange({
                                    ...localSettings,
                                    reduceMotion: !localSettings.reduceMotion,
                                })
                            }
                            className={`relative w-12 h-7 rounded-full transition-colors ${
                                localSettings.reduceMotion ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            role="switch"
                            aria-checked={localSettings.reduceMotion}
                        >
                            <div
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                    localSettings.reduceMotion ? 'translate-x-5' : ''
                                }`}
                            />
                        </button>
                    </div>

                    {/* Screen Reader Mode */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="screen-reader" className="text-sm font-semibold text-gray-900">
                            Screen Reader Optimization
                        </label>
                        <button
                            id="screen-reader"
                            onClick={() =>
                                handleChange({
                                    ...localSettings,
                                    screenReaderMode: !localSettings.screenReaderMode,
                                })
                            }
                            className={`relative w-12 h-7 rounded-full transition-colors ${
                                localSettings.screenReaderMode ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            role="switch"
                            aria-checked={localSettings.screenReaderMode}
                        >
                            <div
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                    localSettings.screenReaderMode ? 'translate-x-5' : ''
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border-t border-blue-100 p-4 text-xs text-blue-900 rounded-b-2xl">
                    💡 Settings are saved automatically and applied to your device.
                </div>
            </div>
        </div>
    );
}
