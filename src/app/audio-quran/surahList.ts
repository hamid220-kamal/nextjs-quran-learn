// List of Surah names in English
// Surah metadata for card content and fallback
export type SurahMeta = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  ayahs?: number;
};

export const surahList: SurahMeta[] = [
  { number: 1, name: "Al-Fatihah", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", ayahs: 7 },
  { number: 2, name: "Al-Baqarah", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", ayahs: 286 },
  { number: 3, name: "Al-'Imran", englishName: "Al-'Imran", englishNameTranslation: "Family of Imran", ayahs: 200 },
  { number: 4, name: "An-Nisa'", englishName: "An-Nisa'", englishNameTranslation: "The Women", ayahs: 176 },
  { number: 5, name: "Al-Ma'idah", englishName: "Al-Ma'idah", englishNameTranslation: "The Table", ayahs: 120 },
  { number: 6, name: "Al-An'am", englishName: "Al-An'am", englishNameTranslation: "The Cattle", ayahs: 165 },
  { number: 7, name: "Al-A'raf", englishName: "Al-A'raf", englishNameTranslation: "The Heights", ayahs: 206 },
  { number: 8, name: "Al-Anfal", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", ayahs: 75 },
  { number: 9, name: "At-Tawbah", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", ayahs: 129 },
  { number: 10, name: "Yunus", englishName: "Yunus", englishNameTranslation: "Jonah", ayahs: 109 },
  { number: 11, name: "Hud", englishName: "Hud", englishNameTranslation: "Hud", ayahs: 123 },
  { number: 12, name: "Yusuf", englishName: "Yusuf", englishNameTranslation: "Joseph", ayahs: 111 },
  // ...existing surah objects...
  { number: 13, name: "Ar-Ra'd", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", ayahs: 43 },
  { number: 14, name: "Ibrahim", englishName: "Ibrahim", englishNameTranslation: "Abraham", ayahs: 52 },
  { number: 15, name: "Al-Hijr", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", ayahs: 99 },
  { number: 16, name: "An-Nahl", englishName: "An-Nahl", englishNameTranslation: "The Bee", ayahs: 128 },
  { number: 17, name: "Al-Isra'", englishName: "Al-Isra'", englishNameTranslation: "The Night Journey", ayahs: 111 },
  { number: 18, name: "Al-Kahf", englishName: "Al-Kahf", englishNameTranslation: "The Cave", ayahs: 110 },
  { number: 19, name: "Maryam", englishName: "Maryam", englishNameTranslation: "Mary", ayahs: 98 },
  { number: 20, name: "Ta-Ha", englishName: "Ta-Ha", englishNameTranslation: "Ta-Ha", ayahs: 135 },
  { number: 21, name: "Al-Anbiya", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", ayahs: 112 },
  { number: 22, name: "Al-Hajj", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", ayahs: 78 },
  { number: 23, name: "Al-Mu'minun", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", ayahs: 118 },
  { number: 24, name: "An-Nur", englishName: "An-Nur", englishNameTranslation: "The Light", ayahs: 64 },
  { number: 25, name: "Al-Furqan", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", ayahs: 77 },
  { number: 26, name: "Ash-Shu'ara'", englishName: "Ash-Shu'ara'", englishNameTranslation: "The Poets", ayahs: 227 },
  { number: 27, name: "An-Naml", englishName: "An-Naml", englishNameTranslation: "The Ant", ayahs: 93 },
  { number: 28, name: "Al-Qasas", englishName: "Al-Qasas", englishNameTranslation: "The Stories", ayahs: 88 },
  { number: 29, name: "Al-Ankabut", englishName: "Al-Ankabut", englishNameTranslation: "The Spider", ayahs: 69 },
  { number: 30, name: "Ar-Rum", englishName: "Ar-Rum", englishNameTranslation: "The Romans", ayahs: 60 },
  { number: 31, name: "Luqman", englishName: "Luqman", englishNameTranslation: "Luqman", ayahs: 34 },
  { number: 32, name: "As-Sajda", englishName: "As-Sajda", englishNameTranslation: "The Prostration", ayahs: 30 },
  { number: 33, name: "Al-Ahzab", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", ayahs: 73 },
  { number: 34, name: "Saba'", englishName: "Saba'", englishNameTranslation: "Sheba", ayahs: 54 },
  { number: 35, name: "Fatir", englishName: "Fatir", englishNameTranslation: "The Originator", ayahs: 45 },
  { number: 36, name: "Ya-Sin", englishName: "Ya-Sin", englishNameTranslation: "Ya-Sin", ayahs: 83 },
  { number: 37, name: "As-Saffat", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", ayahs: 182 },
  { number: 38, name: "Sad", englishName: "Sad", englishNameTranslation: "Sad", ayahs: 88 },
  { number: 39, name: "Az-Zumar", englishName: "Az-Zumar", englishNameTranslation: "The Troops", ayahs: 75 },
  { number: 40, name: "Ghafir", englishName: "Ghafir", englishNameTranslation: "The Forgiver", ayahs: 85 },
  { number: 41, name: "Fussilat", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", ayahs: 54 },
  { number: 42, name: "Ash-Shura", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", ayahs: 53 },
  { number: 43, name: "Az-Zukhruf", englishName: "Az-Zukhruf", englishNameTranslation: "The Gold Adornments", ayahs: 89 },
  { number: 44, name: "Ad-Dukhan", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", ayahs: 59 },
  { number: 45, name: "Al-Jathiyah", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", ayahs: 37 },
  { number: 46, name: "Al-Ahqaf", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", ayahs: 35 },
  { number: 47, name: "Muhammad", englishName: "Muhammad", englishNameTranslation: "Muhammad", ayahs: 38 },
  { number: 48, name: "Al-Fath", englishName: "Al-Fath", englishNameTranslation: "The Victory", ayahs: 29 },
  { number: 49, name: "Al-Hujurat", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", ayahs: 18 },
  { number: 50, name: "Qaf", englishName: "Qaf", englishNameTranslation: "Qaf", ayahs: 45 },
  { number: 51, name: "Adh-Dhariyat", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", ayahs: 60 },
  { number: 52, name: "At-Tur", englishName: "At-Tur", englishNameTranslation: "The Mount", ayahs: 49 },
  { number: 53, name: "An-Najm", englishName: "An-Najm", englishNameTranslation: "The Star", ayahs: 62 },
  { number: 54, name: "Al-Qamar", englishName: "Al-Qamar", englishNameTranslation: "The Moon", ayahs: 55 },
  { number: 55, name: "Ar-Rahman", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", ayahs: 78 },
  { number: 56, name: "Al-Waqi'a", englishName: "Al-Waqi'a", englishNameTranslation: "The Inevitable", ayahs: 96 },
  { number: 57, name: "Al-Hadid", englishName: "Al-Hadid", englishNameTranslation: "The Iron", ayahs: 29 },
  { number: 58, name: "Al-Mujadila", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", ayahs: 22 },
  { number: 59, name: "Al-Hashr", englishName: "Al-Hashr", englishNameTranslation: "The Exile", ayahs: 24 },
  { number: 60, name: "Al-Mumtahina", englishName: "Al-Mumtahina", englishNameTranslation: "She that is to be examined", ayahs: 13 },
  { number: 61, name: "As-Saff", englishName: "As-Saff", englishNameTranslation: "The Ranks", ayahs: 14 },
  { number: 62, name: "Al-Jumu'a", englishName: "Al-Jumu'a", englishNameTranslation: "The Congregation", ayahs: 11 },
  { number: 63, name: "Al-Munafiqun", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", ayahs: 11 },
  { number: 64, name: "At-Taghabun", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", ayahs: 18 },
  { number: 65, name: "At-Talaq", englishName: "At-Talaq", englishNameTranslation: "The Divorce", ayahs: 12 },
  { number: 66, name: "At-Tahrim", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", ayahs: 12 },
  { number: 67, name: "Al-Mulk", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", ayahs: 30 },
  { number: 68, name: "Al-Qalam", englishName: "Al-Qalam", englishNameTranslation: "The Pen", ayahs: 52 },
  { number: 69, name: "Al-Haqqah", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", ayahs: 52 },
  { number: 70, name: "Al-Ma'arij", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", ayahs: 44 },
  { number: 71, name: "Nuh", englishName: "Nuh", englishNameTranslation: "Noah", ayahs: 28 },
  { number: 72, name: "Al-Jinn", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", ayahs: 28 },
  { number: 73, name: "Al-Muzzammil", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", ayahs: 20 },
  { number: 74, name: "Al-Muddathir", englishName: "Al-Muddathir", englishNameTranslation: "The Cloaked One", ayahs: 56 },
  { number: 75, name: "Al-Qiyamah", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", ayahs: 40 },
  { number: 76, name: "Al-Insan", englishName: "Al-Insan", englishNameTranslation: "Man", ayahs: 31 },
  { number: 77, name: "Al-Mursalat", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", ayahs: 50 },
  { number: 78, name: "An-Naba'", englishName: "An-Naba'", englishNameTranslation: "The Tidings", ayahs: 40 },
  { number: 79, name: "An-Nazi'at", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", ayahs: 46 },
  { number: 80, name: "'Abasa", englishName: "'Abasa", englishNameTranslation: "He frowned", ayahs: 42 },
  { number: 81, name: "At-Takwir", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", ayahs: 29 },
  { number: 82, name: "Al-Infitar", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", ayahs: 19 },
  { number: 83, name: "Al-Mutaffifin", englishName: "Al-Mutaffifin", englishNameTranslation: "Defrauding", ayahs: 36 },
  { number: 84, name: "Al-Inshiqaq", englishName: "Al-Inshiqaq", englishNameTranslation: "The Splitting Open", ayahs: 25 },
  { number: 85, name: "Al-Buruj", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", ayahs: 22 },
  { number: 86, name: "At-Tariq", englishName: "At-Tariq", englishNameTranslation: "The Morning Star", ayahs: 17 },
  { number: 87, name: "Al-A'la", englishName: "Al-A'la", englishNameTranslation: "The Most High", ayahs: 19 },
  { number: 88, name: "Al-Ghashiyah", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", ayahs: 26 },
  { number: 89, name: "Al-Fajr", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", ayahs: 30 },
  { number: 90, name: "Al-Balad", englishName: "Al-Balad", englishNameTranslation: "The City", ayahs: 20 },
  { number: 91, name: "Ash-Shams", englishName: "Ash-Shams", englishNameTranslation: "The Sun", ayahs: 15 },
  { number: 92, name: "Al-Lail", englishName: "Al-Lail", englishNameTranslation: "The Night", ayahs: 21 },
  { number: 93, name: "Ad-Duha", englishName: "Ad-Duha", englishNameTranslation: "The Morning Hours", ayahs: 11 },
  { number: 94, name: "Ash-Sharh", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", ayahs: 8 },
  { number: 95, name: "At-Tin", englishName: "At-Tin", englishNameTranslation: "The Fig", ayahs: 8 },
  { number: 96, name: "Al-'Alaq", englishName: "Al-'Alaq", englishNameTranslation: "The Clot", ayahs: 19 },
  { number: 97, name: "Al-Qadr", englishName: "Al-Qadr", englishNameTranslation: "The Power", ayahs: 5 },
  { number: 98, name: "Al-Bayyina", englishName: "Al-Bayyina", englishNameTranslation: "The Clear Proof", ayahs: 8 },
  { number: 99, name: "Az-Zalzalah", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", ayahs: 8 },
  { number: 100, name: "Al-Adiyat", englishName: "Al-Adiyat", englishNameTranslation: "The Courser", ayahs: 11 },
  { number: 101, name: "Al-Qari'a", englishName: "Al-Qari'a", englishNameTranslation: "The Calamity", ayahs: 11 },
  { number: 102, name: "At-Takathur", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in world increase", ayahs: 8 },
  { number: 103, name: "Al-Asr", englishName: "Al-Asr", englishNameTranslation: "The Declining Day", ayahs: 3 },
  { number: 104, name: "Al-Humazah", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", ayahs: 9 },
  { number: 105, name: "Al-Fil", englishName: "Al-Fil", englishNameTranslation: "The Elephant", ayahs: 5 },
  { number: 106, name: "Quraysh", englishName: "Quraysh", englishNameTranslation: "Quraysh", ayahs: 4 },
  { number: 107, name: "Al-Ma'un", englishName: "Al-Ma'un", englishNameTranslation: "Almsgiving", ayahs: 7 },
  { number: 108, name: "Al-Kawthar", englishName: "Al-Kawthar", englishNameTranslation: "Abundance", ayahs: 3 },
  { number: 109, name: "Al-Kafirun", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", ayahs: 6 },
  { number: 110, name: "An-Nasr", englishName: "An-Nasr", englishNameTranslation: "Divine Support", ayahs: 3 },
  { number: 111, name: "Al-Masad", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", ayahs: 5 },
  { number: 112, name: "Al-Ikhlas", englishName: "Al-Ikhlas", englishNameTranslation: "Sincerity", ayahs: 4 },
  { number: 113, name: "Al-Falaq", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", ayahs: 5 },
  { number: 114, name: "An-Nas", englishName: "An-Nas", englishNameTranslation: "Mankind", ayahs: 6 },
];

// Helper: fetch surah list from API (fallback if needed)
export async function fetchSurahList(): Promise<SurahMeta[]> {
  try {
    // Prefer local surahList for speed/SEO
    if (surahList && surahList.length === 114) return surahList;
    // Fallback: fetch from Al-Quran Cloud
    const resp = await fetch('https://api.alquran.cloud/v1/surah');
    const json = await resp.json();
    if (!json.data) throw new Error('No surah data');
    return json.data.map((s: any) => ({
      number: s.number,
      englishName: s.englishName,
      englishNameTranslation: s.englishNameTranslation,
      ayahs: s.numberOfAyahs,
    }));
  } catch (e) {
    // @ts-ignore
    console.error('Failed to fetch surah list', e);
    return surahList;
  }
}
