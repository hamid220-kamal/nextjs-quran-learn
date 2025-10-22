export interface SurahIntroduction {
  number: number;
  name: string;
  englishName: string;
  revelationType: string;
  numberOfAyahs: number;
  introduction: string[];
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
    introduction: [
      "There are seven verses in this Surah (chapter) and it is said that this Surah is both makki and madani i.e. it was revealed in both Makkah and Madinah.",
      "In the commentary of Majma'ul Bayan it is narrated that the Holy Prophet (s) said that whoever recites this Surah, he will get the reward for reciting two thirds (2/3) of the whole Qur'an, and will get the reward equivalent to what would be gained by giving charity to all the believing men and women in the world.",
      "One of the companions of the Holy Prophet (s) narrates that he once recited this Surah in the presence of the Holy Prophet (s) and the Prophet said, 'By Him in whose hand is my soul, a similar revelation to this has not been included in the Taurat (Torah), Injeel (Bible), Zabur (Psalms) or even the Qur'an itself.'"
    ],
    virtues: [
      "The Holy Prophet (s) once asked Jabir ibn Abdallah Ansari, \"Should I teach you a Surah that has no other comparison to it in the whole Qur'an?\"",
      "The Prophet (s) said, \"It (Surah al-Fatihah) is a cure for every ailment except death.\"",
      "Imam Ja'far as-Sadiq (a) has said that whoever cannot be cured by Surah al-Fatihah, then there is no cure for that person."
    ],
    context: "This Surah is considered the gateway to the Quran and is recited in every prayer."
  },
  2: {
    number: 2,
    name: "البقرة",
    englishName: "Al-Baqarah",
    revelationType: "Madani",
    numberOfAyahs: 286,
    introduction: [
      "Al-Baqarah is the longest Surah of the Quran, containing 286 verses. It was revealed in Madinah and derives its name from the story of the Cow mentioned in verses 67-73.",
      "This Surah was revealed over approximately nine years and covers various aspects of Islamic law, faith, and history. It begins with a description of the characteristics of the believers and disbelievers.",
      "The Surah contains the famous Ayat al-Kursi (verse 255), which is considered one of the greatest verses of the Quran, speaking about Allah's attributes and His throne."
    ],
    virtues: [
      "The Prophet (s) said: 'Learn Surah Al-Baqarah, for its learning is a blessing and its abandonment is a cause of grief.'",
      "The last two verses of Al-Baqarah were given to the Prophet from a treasure under the Throne of Allah.",
      "Houses in which Al-Baqarah is recited are not approached by Satan."
    ],
    context: "This Surah was revealed after the migration to Madinah and establishes many Islamic laws and principles."
  },
  96: {
    number: 96,
    name: "العلق",
    englishName: "Al-Alaq",
    revelationType: "Makki",
    numberOfAyahs: 19,
    introduction: [
      "Surah Al-Alaq holds a special place in Islamic history as it contains the first verses of the Quran to be revealed to Prophet Muhammad (s) in the Cave of Hira.",
      "The Surah begins with the divine command 'Read!' (Iqra), marking the beginning of the Prophet's mission and emphasizing the importance of knowledge and learning in Islam.",
      "It was revealed when the Prophet (s) was in spiritual retreat in the Cave of Hira, where Angel Jibreel (Gabriel) appeared to him with the divine message."
    ],
    virtues: [
      "These are the first verses ever revealed of the Quran, marking the beginning of Prophet Muhammad's (s) prophethood.",
      "The Surah emphasizes the importance of knowledge and learning in Islam.",
      "It teaches about human creation and warns against arrogance and transgression."
    ],
    context: "This Surah was revealed in Makkah during the early days of Islam, initiating the prophetic mission."
  },
  97: {
    number: 97,
    name: "القدر",
    englishName: "Al-Qadr",
    revelationType: "Makki",
    numberOfAyahs: 5,
    introduction: [
      "Surah Al-Qadr speaks about the Night of Power (Laylat al-Qadr), a night better than a thousand months, in which the Quran was first revealed.",
      "This blessed night occurs in the last ten days of Ramadan, and is specifically believed to be on one of the odd-numbered nights.",
      "The Surah describes how angels and the Spirit (Ruh) descend on this night by their Lord's permission with all decrees."
    ],
    virtues: [
      "Whoever prays on Laylat al-Qadr with faith and seeking reward, their past sins will be forgiven.",
      "The night described in this Surah is better than a thousand months of worship.",
      "It is recommended to seek this night in the last ten days of Ramadan, particularly on the odd nights."
    ],
    context: "This Surah was revealed to explain the significance of the night in which the Quran began to be revealed."
  },
  98: {
    number: 98,
    name: "البينة",
    englishName: "Al-Bayyina",
    revelationType: "Madani",
    numberOfAyahs: 8,
    introduction: [
      "Surah Al-Bayyina discusses the clear evidence (Al-Bayyina) brought by Prophet Muhammad (s) to the People of the Book and the polytheists.",
      "It explains how the coming of the Prophet (s) was a decisive moment, requiring people to follow the clear proof that had come to them.",
      "The Surah emphasizes the importance of sincere worship and following the straight religion."
    ],
    virtues: [
      "The Prophet (s) said to Ubayy ibn Ka'b: 'Allah has commanded me to recite to you Surah Al-Bayyina.'",
      "It clarifies the true nature of religion and worship.",
      "Those who believe and do good deeds are described as the best of creatures."
    ],
    context: "This Surah addresses the reaction of different groups to the Prophet's message and the clear evidence he brought."
  },
  99: {
    number: 99,
    name: "الزلزلة",
    englishName: "Az-Zalzala",
    revelationType: "Madani",
    numberOfAyahs: 8,
    introduction: [
      "Surah Az-Zalzala describes the Day of Judgment, beginning with the final earthquake that will shake the earth violently.",
      "It vividly portrays how the earth will expel its burdens and people will come forth to witness their deeds.",
      "The Surah emphasizes the absolute justice of that Day, where even the smallest good or evil deed will be accounted for."
    ],
    virtues: [
      "The Prophet (s) said that reciting this Surah is equivalent to reciting half the Quran.",
      "It serves as a powerful reminder of the Day of Judgment and accountability.",
      "It teaches that every action, no matter how small, has consequences."
    ],
    context: "This Surah was revealed to describe the events of the Day of Judgment and emphasize the importance of accountability."
  }
  // Add more surahs as needed
};

export const getSurahIntroduction = (number: number): SurahIntroduction | undefined => {
  return surahIntroductions[number];
};

export default surahIntroductions;