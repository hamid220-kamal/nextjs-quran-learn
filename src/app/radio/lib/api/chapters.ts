const API_BASE_URL = 'https://api.quran.com/api/v4';

export interface Chapter {
    id: number;
    name_simple: string;
    name_arabic: string;
    verses_count: number;
}

export async function fetchChapters(): Promise<Chapter[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters`);
        if (!response.ok) {
            throw new Error('Failed to fetch chapters');
        }
        const data = await response.json();
        return data.chapters || [];
    } catch (error) {
        console.error('Error fetching chapters:', error);
        // Fallback to basic 114 surahs if API fails
        return Array.from({ length: 114 }, (_, i) => ({
            id: i + 1,
            name_simple: `Surah ${i + 1}`,
            name_arabic: '',
            verses_count: 0
        }));
    }
}
