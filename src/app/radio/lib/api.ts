

const API_BASE_URL = 'https://api.quran.com/api/v4';

export interface Reciter {
    id: number;
    name: string;
    arabic_name?: string;
    style?: string;
    relative_path?: string;
}

export async function fetchReciters(): Promise<Reciter[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/resources/recitations?language=en`);
        if (!response.ok) {
            throw new Error('Failed to fetch reciters');
        }
        const data = await response.json();
        return data.recitations || [];
    } catch (error) {
        console.error('Error fetching reciters:', error);
        return [];
    }
}

export function mapReciterToStation(reciter: Reciter): any {
    return {
        id: reciter.id.toString(),
        title: reciter.name,
        subtitle: reciter.style || 'Murattal',
        tags: [reciter.style || 'Murattal'],
        imageUrl: `https://static.quran.com/images/reciters/${reciter.id}/200.jpg`,
        reciters: [reciter.id.toString()],
        surahs: 'all'
    };
}
