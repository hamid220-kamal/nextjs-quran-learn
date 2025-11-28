'use client';

import { useState } from 'react';

export type SortOption = 'name' | 'recent' | 'popular';
export type FilterType = 'all' | 'live' | 'recorded';

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
}: SearchFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
                <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-2 hover:border-gray-300 transition-colors">
                    <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search reciters, stations..."
                        className="flex-1 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm py-2"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${showFilters
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            {showFilters ? 'Hide' : 'Filters'}
                        </div>
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5 animate-slideDown">
                    {/* Type Filter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Station Type</h3>
                        <div className="flex gap-2">
                            {(['all', 'live', 'recorded'] as FilterType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => onFilterChange(type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
                        <div className="flex gap-2">
                            {([
                                { value: 'name', label: 'Name' },
                                { value: 'recent', label: 'Recently Added' },
                                { value: 'popular', label: 'Popular' },
                            ] as const).map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => onSortChange(value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === value
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags Filter */}
                    {availableTags.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTags.includes(tag)
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Clear Filters */}
                    {(selectedTags.length > 0 || filterType !== 'all' || sortBy !== 'name') && (
                        <button
                            onClick={() => {
                                onTagsChange([]);
                                onFilterChange('all');
                                onSortChange('name');
                            }}
                            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
