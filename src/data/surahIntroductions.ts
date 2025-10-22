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
  },
  2: {
    number: 2,
    name: "البقرة",
    englishName: "Al-Baqarah",
    revelationType: "Madani",
    numberOfAyahs: 286,
    meta: {
      number: 2,
      verses: 286,
      type: "Madani"
    },
    overview: "Al-Baqarah is the longest surah of the Quran, containing comprehensive guidance on various aspects of individual and collective life. It was revealed over approximately nine years after the migration to Madinah.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "This Surah was revealed in Madinah during the early years of establishing the Islamic society.",
        "It addresses the Children of Israel extensively, as they were a significant community in Madinah at the time of revelation.",
        "The name 'Al-Baqarah' (The Cow) comes from the story of Moses and the Israelites mentioned in verses 67-73."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the famous Ayat al-Kursi (verse 255), which is considered one of the greatest verses of the Quran.",
        "Establishes fundamental principles of Islamic law, economics, and social relations.",
        "Provides detailed guidance on faith, worship, and practical life matters."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Learn Surah Al-Baqarah, for its learning is a blessing and its abandonment is a cause of grief.'",
      "The last two verses of Al-Baqarah were given to the Prophet from a treasure under the Throne of Allah.",
      "Houses in which Al-Baqarah is recited are not approached by Satan.",
      "It is recommended to recite Ayat al-Kursi after every obligatory prayer for protection."
    ],
    context: "This Surah lays down the fundamental principles of Islamic faith and practice, serving as a comprehensive guide for the Muslim community."
  },
  3: {
    number: 3,
    name: "آل عمران",
    englishName: "Aal-E-Imran",
    revelationType: "Madani",
    numberOfAyahs: 200,
    meta: {
      number: 3,
      verses: 200,
      type: "Madani"
    },
    overview: "Aal-E-Imran (The Family of Imran) is the third chapter of the Quran, focusing on the family of Imran, which includes Mary and Jesus. It addresses interfaith dialogue, particularly with Christians.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Madinah following the Battle of Badr and before the Battle of Uhud.",
        "Addresses the Christian delegation from Najran who came to discuss theological matters with the Prophet ﷺ.",
        "Provides important lessons from the Battle of Uhud and its aftermath."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the true nature of Jesus and Mary in Islamic theology.",
        "Contains important principles about victory and defeat in the cause of Allah.",
        "Emphasizes the unity of divine messages throughout history."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Recite Az-Zahrawain (Al-Baqarah and Aal-E-Imran), for they will come as two clouds on the Day of Resurrection, pleading for those who recited them.'",
      "These two surahs are called 'Az-Zahrawain' (The Two Bright Ones) due to their enlightening guidance.",
      "Regular recitation of this surah brings special blessings and protection."
    ],
    context: "This Surah strengthens the faith of believers through historical narratives and theological discussions."
  },
  4: {
    number: 4,
    name: "النساء",
    englishName: "An-Nisa",
    revelationType: "Madani",
    numberOfAyahs: 176,
    meta: {
      number: 4,
      verses: 176,
      type: "Madani"
    },
    overview: "An-Nisa (The Women) is primarily focused on social reforms, women's rights, family laws, inheritance, and social justice. It provides detailed guidance for building a just and equitable society.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the Battle of Uhud when many Muslims were martyred, creating social issues regarding orphans and widows.",
        "Addresses the rights of women in a time when they were often denied basic human rights.",
        "Provides solutions to various social problems that arose in the growing Muslim community of Madinah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes fundamental rights for women, orphans, and the weak in society.",
        "Contains comprehensive laws of inheritance and family relations.",
        "Addresses important aspects of social justice and community relations."
      ]
    },
    virtues: [
      "This Surah is known as 'An-Nisa Al-Kubra' (The Greater Chapter about Women) due to its extensive coverage of women's rights.",
      "It contains some of the most important verses regarding justice and equality in Islam.",
      "Regular recitation of this surah helps in understanding and implementing social justice."
    ],
    context: "This Surah provides a framework for social reform and establishing justice in society."
  },
  5: {
    number: 5,
    name: "المائدة",
    englishName: "Al-Ma'ida",
    revelationType: "Madani",
    numberOfAyahs: 120,
    meta: {
      number: 5,
      verses: 120,
      type: "Madani"
    },
    overview: "Al-Ma'ida (The Table Spread) is one of the last surahs to be revealed, containing final legislations and completing religious obligations. It addresses interfaith relations and establishes important Islamic laws.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed near the end of the Prophet's ﷺ life, during or after the Farewell Pilgrimage.",
        "Addresses various religious communities living under Islamic rule.",
        "Contains the verse declaring the completion of religion (5:3)."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the final revealed laws and regulations of Islam.",
        "Establishes principles of interfaith relations and dietary laws.",
        "Presents the covenant between Allah and His believers."
      ]
    },
    virtues: [
      "Being among the last revealed surahs, it contains the final divine legislations.",
      "The Prophet ﷺ emphasized the importance of understanding and implementing its rulings.",
      "Contains the verse that declared the perfection of the religion of Islam."
    ],
    context: "This Surah completes many aspects of Islamic legislation and interfaith relations."
  },
  6: {
    number: 6,
    name: "الأنعام",
    englishName: "Al-An'am",
    revelationType: "Makki",
    numberOfAyahs: 165,
    meta: {
      number: 6,
      verses: 165,
      type: "Makki"
    },
    overview: "Al-An'am (The Cattle) focuses on establishing the fundamentals of faith, particularly the concept of monotheism (Tawhid). It was revealed all at once, accompanied by 70,000 angels.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Makkah during a period of intense opposition to the message of Islam.",
        "Addresses the pagan beliefs and practices of the Makkans.",
        "Provides strong arguments against polytheism and idol worship."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes clear proofs for the existence and oneness of Allah.",
        "Refutes various forms of polytheism and superstition.",
        "Contains important principles of halal and haram in food."
      ]
    },
    virtues: [
      "It was revealed all at once, accompanied by a procession of 70,000 angels.",
      "The Prophet ﷺ said it was revealed as one complete surah.",
      "Contains powerful arguments for monotheism and against polytheism."
    ],
    context: "This Surah establishes the foundations of faith and monotheism."
  },
  7: {
    number: 7,
    name: "الأعراف",
    englishName: "Al-A'raf",
    revelationType: "Makki",
    numberOfAyahs: 206,
    meta: {
      number: 7,
      verses: 206,
      type: "Makki"
    },
    overview: "Al-A'raf (The Heights) presents detailed accounts of various prophets and their struggles with their nations. It contains important lessons about divine guidance and human response.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in the later Makkan period when the struggle between truth and falsehood was intense.",
        "Addresses the polytheists of Makkah through historical examples.",
        "Named after the barrier between Paradise and Hell mentioned in the surah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the stories of several prophets as lessons for humanity.",
        "Describes the dialogue between the people of Paradise and Hell.",
        "Establishes the patterns of divine guidance and human response."
      ]
    },
    virtues: [
      "One of the longest Makkan surahs, containing comprehensive guidance.",
      "The Prophet ﷺ often recited this surah in the Maghrib prayer.",
      "Contains verses requiring prostration (Sajdah)."
    ],
    context: "This Surah provides historical examples of the struggle between truth and falsehood."
  },
  8: {
    number: 8,
    name: "الأنفال",
    englishName: "Al-Anfal",
    revelationType: "Madani",
    numberOfAyahs: 75,
    meta: {
      number: 8,
      verses: 75,
      type: "Madani"
    },
    overview: "Al-Anfal (The Spoils of War) primarily deals with the Battle of Badr and its lessons. It provides guidance on warfare, peace, and distribution of war spoils.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the Battle of Badr, the first major confrontation between Muslims and disbelievers.",
        "Addresses the distribution of war spoils and military ethics.",
        "Provides guidance for the newly forming Muslim community in Madinah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes principles of warfare and peace in Islam.",
        "Contains important lessons about unity and discipline.",
        "Provides guidance on dealing with enemies and treaties."
      ]
    },
    virtues: [
      "Contains detailed guidance about the ethics of warfare.",
      "Describes the divine help during the Battle of Badr.",
      "Teaches important lessons about trust in Allah during difficulties."
    ],
    context: "This Surah provides guidance on warfare, peace, and community organization."
  },
  9: {
    number: 9,
    name: "التوبة",
    englishName: "At-Tawbah",
    revelationType: "Madani",
    numberOfAyahs: 129,
    meta: {
      number: 9,
      verses: 129,
      type: "Madani"
    },
    overview: "At-Tawbah (The Repentance) addresses the themes of repentance, hypocrisy, and dealing with enemies. It's the only surah that doesn't begin with Bismillah.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in the ninth year after Hijrah, known as the Year of Delegations.",
        "Addresses the expedition to Tabuk and its challenges.",
        "Deals with the hypocrites and their attempts to undermine the Muslim community."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Only surah in the Quran that doesn't begin with Bismillah.",
        "Contains important principles about dealing with treaties and agreements.",
        "Exposes the characteristics and dangers of hypocrisy."
      ]
    },
    virtues: [
      "Known as Al-Bara'ah (The Disavowal) and Al-Fadhihah (The Exposer).",
      "Cleanses the community from hypocrisy and false faith.",
      "Contains verses about the virtues of spending in Allah's cause."
    ],
    context: "This Surah deals with purification of the Muslim community and relations with others."
  },
  10: {
    number: 10,
    name: "يونس",
    englishName: "Yunus",
    revelationType: "Makki",
    numberOfAyahs: 109,
    meta: {
      number: 10,
      verses: 109,
      type: "Makki"
    },
    overview: "Yunus (Jonah) emphasizes the theme of divine mercy and the importance of believing in Allah's messages. It presents the stories of various prophets, particularly Prophet Yunus.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the later Makkan period when opposition to Islam was intense.",
        "Named after Prophet Yunus, whose story teaches patience and trust in Allah.",
        "Addresses the skepticism of the Makkans about prophethood."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the truth of divine revelation and prophethood.",
        "Contains powerful arguments for belief in the afterlife.",
        "Emphasizes Allah's mercy even after disobedience."
      ]
    },
    virtues: [
      "Named after Prophet Yunus, teaching lessons of patience and repentance.",
      "Contains powerful arguments for the truth of the Quran.",
      "Emphasizes the importance of reflection and contemplation."
    ],
    context: "This Surah emphasizes divine mercy and the importance of believing in Allah's messages."
  }
  
};

export const getSurahIntroduction = (number: number): SurahIntroduction | undefined => {
  return surahIntroductions[number];
};

export default surahIntroductions;