'use client';

import { useState } from 'react';

export type SortOption = 'name' | 'recent' | 'popular' | 'rating' | 'trending';
export type FilterType = 'all' | 'live' | 'recorded';
export type LanguageFilter = 'all' | 'arabic' | 'english';

interface SearchFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    filterType: FilterType;
    onFilterChange: (filter: FilterType) => void;
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    availableTags: string[];
    language?: LanguageFilter;
    onLanguageChange?: (language: LanguageFilter) => void;
}

export default function SearchFilters({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    filterType,
    onFilterChange,
    selectedTags,
    onTagsChange,
    availableTags,
    language = 'all',
    onLanguageChange,
}: SearchFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar & Toggle */}
            <div className="flex gap-3">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Search stations, reciters, or tags..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all border shadow-sm flex items-center gap-2 ${showFilters
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filters
                    {(selectedTags.length > 0 || filterType !== 'all' || sortBy !== 'name') && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type Filter */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</h3>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'live', 'recorded'] as FilterType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => onFilterChange(type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</h3>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    { value: 'name', label: 'Name' },
                                    { value: 'recent', label: 'Newest' },
                                    { value: 'popular', label: 'Popular' },
                                    { value: 'rating', label: 'Rating' },
                                    { value: 'trending', label: 'Trending' },
                                ] as const).map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => onSortChange(value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === value
                                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</h3>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    { value: 'all', label: 'All Languages' },
                                    { value: 'arabic', label: 'Arabic' },
                                    { value: 'english', label: 'English' },
                                ] as const).map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => onLanguageChange?.(value as LanguageFilter)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${language === value
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quality/Speed Filter */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Format</h3>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    { value: 'audio', label: '🎵 Audio' },
                                    { value: 'video', label: '📹 Video' },
                                    { value: 'podcast', label: '🎙️ Podcast' },
                                ] as const).map(({ value, label }) => (
                                    <button
                                        key={value}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-50 text-gray-600 hover:bg-gray-100`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tags Filter */}
                    {availableTags.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${selectedTags.includes(tag)
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Clear Filters */}
                    {(selectedTags.length > 0 || filterType !== 'all' || sortBy !== 'name' || language !== 'all') && (
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => {
                                    onTagsChange([]);
                                    onFilterChange('all');
                                    onSortChange('name');
                                    onLanguageChange?.('all');
                                }}
                                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
