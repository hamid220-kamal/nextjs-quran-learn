'use client';

import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
    onPlayPause?: () => void;
    onNextTrack?: () => void;
    onPrevTrack?: () => void;
    onVolumeUp?: () => void;
    onVolumeDown?: () => void;
    onMute?: () => void;
    onShowQueue?: () => void;
    enabled?: boolean;
}

export default function KeyboardShortcuts({
    onPlayPause,
    onNextTrack,
    onPrevTrack,
    onVolumeUp,
    onVolumeDown,
    onMute,
    onShowQueue,
    enabled = true,
}: KeyboardShortcutsProps) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in input fields
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    onPlayPause?.();
                    break;
                case 'ArrowRight':
                case 'KeyN':
                    if (e.ctrlKey || e.metaKey) break;
                    e.preventDefault();
                    onNextTrack?.();
                    break;
                case 'ArrowLeft':
                case 'KeyP':
                    if (e.ctrlKey || e.metaKey) break;
                    e.preventDefault();
                    onPrevTrack?.();
                    break;
                case 'ArrowUp':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        onVolumeUp?.();
                    }
                    break;
                case 'ArrowDown':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        onVolumeDown?.();
                    }
                    break;
                case 'KeyM':
                    if (e.ctrlKey || e.metaKey) break;
                    e.preventDefault();
                    onMute?.();
                    break;
                case 'KeyQ':
                    if (e.ctrlKey || e.metaKey) break;
                    e.preventDefault();
                    onShowQueue?.();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onPlayPause, onNextTrack, onPrevTrack, onVolumeUp, onVolumeDown, onMute, onShowQueue]);

    return null;
}

// Helper hook for easy keyboard shortcut setup
export function useKeyboardShortcuts(handlers: KeyboardShortcutsProps) {
    return <KeyboardShortcuts {...handlers} />;
}
