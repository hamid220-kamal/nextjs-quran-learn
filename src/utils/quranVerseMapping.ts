'use client';

/**
 * This file provides mappings between surah:ayah format and absolute verse numbers
 * used by different Quran APIs
 */

// The number of verses in each surah of the Quran
export const VERSES_PER_SURAH = [
  7,    // Al-Fatiha (1)
  286,  // Al-Baqarah (2)
  200,  // Al-Imran (3)
  176,  // An-Nisa (4)
  120,  // Al-Ma'idah (5)
  165,  // Al-An'am (6)
  206,  // Al-A'raf (7)
  75,   // Al-Anfal (8)
  129,  // At-Tawbah (9)
  109,  // Yunus (10)
  123,  // Hud (11)
  111,  // Yusuf (12)
  43,   // Ar-Ra'd (13)
  52,   // Ibrahim (14)
  99,   // Al-Hijr (15)
  128,  // An-Nahl (16)
  111,  // Al-Isra' (17)
  110,  // Al-Kahf (18)
  98,   // Maryam (19)
  135,  // Ta-Ha (20)
  112,  // Al-Anbiya' (21)
  78,   // Al-Hajj (22)
  118,  // Al-Mu'minun (23)
  64,   // An-Nur (24)
  77,   // Al-Furqan (25)
  227,  // Ash-Shu'ara' (26)
  93,   // An-Naml (27)
  88,   // Al-Qasas (28)
  69,   // Al-Ankabut (29)
  60,   // Ar-Rum (30)
  34,   // Luqman (31)
  30,   // As-Sajdah (32)
  73,   // Al-Ahzab (33)
  54,   // Saba' (34)
  45,   // Fatir (35)
  83,   // Ya-Sin (36)
  182,  // As-Saffat (37)
  88,   // Sad (38)
  75,   // Az-Zumar (39)
  85,   // Ghafir (40)
  54,   // Fussilat (41)
  53,   // Ash-Shura (42)
  89,   // Az-Zukhruf (43)
  59,   // Ad-Dukhan (44)
  37,   // Al-Jathiyah (45)
  35,   // Al-Ahqaf (46)
  38,   // Muhammad (47)
  29,   // Al-Fath (48)
  18,   // Al-Hujurat (49)
  45,   // Qaf (50)
  60,   // Adh-Dhariyat (51)
  49,   // At-Tur (52)
  62,   // An-Najm (53)
  55,   // Al-Qamar (54)
  78,   // Ar-Rahman (55)
  96,   // Al-Waqi'ah (56)
  29,   // Al-Hadid (57)
  22,   // Al-Mujadilah (58)
  24,   // Al-Hashr (59)
  13,   // Al-Mumtahanah (60)
  14,   // As-Saff (61)
  11,   // Al-Jumu'ah (62)
  11,   // Al-Munafiqun (63)
  18,   // At-Taghabun (64)
  12,   // At-Talaq (65)
  12,   // At-Tahrim (66)
  30,   // Al-Mulk (67)
  52,   // Al-Qalam (68)
  52,   // Al-Haqqah (69)
  44,   // Al-Ma'arij (70)
  28,   // Nuh (71)
  28,   // Al-Jinn (72)
  20,   // Al-Muzzammil (73)
  56,   // Al-Muddaththir (74)
  40,   // Al-Qiyamah (75)
  31,   // Al-Insan (76)
  50,   // Al-Mursalat (77)
  40,   // An-Naba' (78)
  46,   // An-Nazi'at (79)
  42,   // Abasa (80)
  29,   // At-Takwir (81)
  19,   // Al-Infitar (82)
  36,   // Al-Mutaffifin (83)
  25,   // Al-Inshiqaq (84)
  22,   // Al-Buruj (85)
  17,   // At-Tariq (86)
  19,   // Al-A'la (87)
  26,   // Al-Ghashiyah (88)
  30,   // Al-Fajr (89)
  20,   // Al-Balad (90)
  15,   // Ash-Shams (91)
  21,   // Al-Layl (92)
  11,   // Ad-Duha (93)
  8,    // Ash-Sharh (94)
  8,    // At-Tin (95)
  19,   // Al-Alaq (96)
  5,    // Al-Qadr (97)
  8,    // Al-Bayyinah (98)
  8,    // Az-Zalzalah (99)
  11,   // Al-Adiyat (100)
  11,   // Al-Qari'ah (101)
  8,    // At-Takathur (102)
  3,    // Al-Asr (103)
  9,    // Al-Humazah (104)
  5,    // Al-Fil (105)
  4,    // Quraysh (106)
  7,    // Al-Ma'un (107)
  3,    // Al-Kawthar (108)
  6,    // Al-Kafirun (109)
  3,    // An-Nasr (110)
  5,    // Al-Masad (111)
  4,    // Al-Ikhlas (112)
  5,    // Al-Falaq (113)
  6,    // An-Nas (114)
];

/**
 * Calculates the absolute verse number for Islamic Network API
 * @param surah Surah number (1-114)
 * @param ayah Ayah number within the surah
 * @returns The absolute verse number
 */
export function getAbsoluteVerseNumber(surah: number, ayah: number): number {
  // Input validation
  if (surah < 1 || surah > 114) {
    throw new Error(`Invalid surah number: ${surah}`);
  }
  
  if (ayah < 1 || ayah > VERSES_PER_SURAH[surah - 1]) {
    throw new Error(`Invalid ayah number: ${ayah} for surah: ${surah}`);
  }
  
  // Calculate absolute verse number
  let absoluteVerseNumber = ayah;
  
  // Add the number of verses in all previous surahs
  for (let i = 0; i < surah - 1; i++) {
    absoluteVerseNumber += VERSES_PER_SURAH[i];
  }
  
  return absoluteVerseNumber;
}

/**
 * Reverse mapping - gets the surah:ayah format from an absolute verse number
 * @param absoluteVerseNumber The absolute verse number
 * @returns An object with surah and ayah properties
 */
export function getSurahAyahFromAbsolute(absoluteVerseNumber: number): { surah: number, ayah: number } {
  if (absoluteVerseNumber < 1 || absoluteVerseNumber > 6236) {
    throw new Error(`Invalid absolute verse number: ${absoluteVerseNumber}`);
  }
  
  let verseCount = 0;
  let surahIndex = 0;
  
  // Find which surah this verse belongs to
  while (absoluteVerseNumber > verseCount + VERSES_PER_SURAH[surahIndex]) {
    verseCount += VERSES_PER_SURAH[surahIndex];
    surahIndex++;
  }
  
  // Calculate the ayah number within that surah
  const ayah = absoluteVerseNumber - verseCount;
  
  // Return the result (adding 1 to surahIndex since surahs are 1-indexed)
  return {
    surah: surahIndex + 1,
    ayah
  };
}