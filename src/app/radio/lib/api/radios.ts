export interface RadioStation {
    id: number;
    name: string;
    url: string;
    recent_date: string;
}

export async function fetchRadioStations(): Promise<RadioStation[]> {
    try {
        const response = await fetch('https://mp3quran.net/api/v3/radios?language=eng');
        if (!response.ok) {
            throw new Error('Failed to fetch radio stations');
        }
        const data = await response.json();
        return data.radios || [];
    } catch (error) {
        console.error('Error fetching radio stations:', error);
        return [];
    }
}
