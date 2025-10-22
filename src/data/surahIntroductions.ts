interface SurahMeta {
  number: number;
  verses: number;
  type: string;
}

interface ContentSection {
  title: string;
  content: string[];
}

export interface SurahIntroduction {
  number: number;
  name: string;
  englishName: string;
  revelationType: string;
  numberOfAyahs: number;
  meta: SurahMeta;
  overview: string;
  historicalContext: ContentSection;
  significance: ContentSection;
  virtues: string[];
  context?: string;
}

const surahIntroductions: Record<number, SurahIntroduction> = {
  1: {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatiha",
    revelationType: "Makki and Madani",
    numberOfAyahs: 7,
    meta: {
      number: 1,
      verses: 7,
      type: "Makki and Madani"
    },
    overview: "There are seven verses in this Surah (chapter) and it is said that this Surah is both makki and madani i.e. it was revealed in both Makkah and Madinah. This Surah holds a unique position in the Quran as it is recited in every prayer.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "In the commentary of Majma'ul Bayan, it is narrated that the Holy Prophet ﷺ emphasized the special status of this Surah.",
        "One of the companions of the Holy Prophet ﷺ narrates that he once recited this Surah in the Prophet's presence, leading to a profound statement about its uniqueness."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "This Surah serves as the perfect opening to the Quran, encompassing the core message of the entire scripture.",
        "It is unique in that no similar revelation exists in previous divine books - neither in the Taurat (Torah), Injeel (Bible), nor Zabur (Psalms)."
      ]
    },
    virtues: [
      "The Holy Prophet ﷺ once asked Jabir ibn Abdallah Ansari, 'Should I teach you a Surah that has no other comparison to it in the whole Qur'an?'",
      "The Prophet ﷺ said, 'It (Surah al-Fatihah) is a cure for every ailment except death.'",
      "Imam Ja'far as-Sadiq (a) emphasized its healing properties, stating that if someone cannot be cured by Al-Fatiha, there is no cure for them.",
      "Reciting this Surah earns the reward equivalent to reciting two-thirds of the entire Quran.",
      "Its recitation brings rewards equal to giving charity to all believing men and women in the world."
    ],
    context: "This Surah is considered the gateway to the Quran and is recited in every prayer."
  }
};

export const getSurahIntroduction = (number: number): SurahIntroduction | undefined => {
  return surahIntroductions[number];
};

export default surahIntroductions;