'use client';

import React, { useState } from 'react';

interface QueueItem {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
}

interface QueueManagerProps {
    queue: QueueItem[];
    currentIndex: number;
    onReorder?: (items: QueueItem[]) => void;
    onRemove?: (id: string) => void;
    onClear?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function QueueManager({
    queue,
    currentIndex,
    onReorder,
    onRemove,
    onClear,
    isOpen = true,
    onClose,
}: QueueManagerProps) {
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedItem === null || draggedItem === targetIndex) {
            setDraggedItem(null);
            return;
        }

        const newQueue = [...queue];
        const [draggedItemContent] = newQueue.splice(draggedItem, 1);
        newQueue.splice(targetIndex, 0, draggedItemContent);

        onReorder?.(newQueue);
        setDraggedItem(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Queue</h2>
                    <p className="text-xs text-gray-500">{queue.length} tracks</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close queue"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Queue Items */}
            <div className="flex-1 overflow-y-auto">
                {queue.length > 0 ? (
                    <div className="space-y-2 p-3">
                        {queue.map((item, index) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-move transition-all ${
                                    index === currentIndex
                                        ? 'bg-blue-50 border-2 border-blue-300 shadow-sm'
                                        : draggedItem === index
                                        ? 'bg-gray-100 opacity-50'
                                        : 'bg-white border border-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                {/* Drag Handle */}
                                <div className="text-gray-400 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5h2v14H8V5zm6 0h2v14h-2V5z" />
                                    </svg>
                                </div>

                                {/* Index */}
                                <div className="font-bold text-gray-400 w-6 text-center text-sm flex-shrink-0">
                                    {index + 1}
                                </div>

                                {/* Image */}
                                <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            🎵
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                        {item.title}
                                    </p>
                                    {item.subtitle && (
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {item.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => onRemove?.(item.id)}
                                    className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition-colors flex-shrink-0"
                                    aria-label={`Remove ${item.title}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                        <div className="text-4xl mb-3">🎵</div>
                        <p className="font-medium">Queue is empty</p>
                        <p className="text-sm text-gray-400 mt-1">Add stations to get started</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {queue.length > 0 && (
                <div className="border-t border-gray-200 p-4 flex gap-2">
                    <button
                        onClick={onClear}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors"
                    >
                        Clear Queue
                    </button>
                </div>
            )}
        </div>
    );
}
