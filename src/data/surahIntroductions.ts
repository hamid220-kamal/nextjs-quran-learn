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
    revelationType: "Makki",
    numberOfAyahs: 7,
    meta: {
      number: 1,
      verses: 7,
      type: "Makki"
    },
    overview: "Surah Al-Fatiha, also known as 'The Opening', is the first chapter of the Quran. It is recited in every unit of Muslim prayer and encapsulates the core message of the entire Quran.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Mecca during the early period of prophethood.",
        "It was among the first complete chapters revealed to Prophet Muhammad ﷺ.",
        "Known as 'Umm al-Kitab' (Mother of the Book) and 'As-Sab' al-Mathani' (The Seven Oft-Repeated Verses)."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Serves as the essence of the Quran's message, covering praise of Allah, worship, and seeking guidance.",
        "Essential component of daily prayers (Salah), recited in every rak'ah.",
        "Establishes the fundamental relationship between the Creator and creation."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'By Him in Whose Hand my soul is, nothing like it has been revealed in the Torah, the Gospel, the Psalms, or the Quran' (Sahih Muslim).",
      "Considered the greatest surah in the Quran according to numerous hadith.",
      "Essential for the validity of prayer according to all schools of Islamic jurisprudence.",
      "Known as 'Ash-Shifa' (The Cure) for its healing properties when recited with faith."
    ],
    context: "This Surah is the foundation of Islamic prayer and the essence of the Quranic message."
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
    overview: "Al-Baqarah is the longest chapter of the Quran, revealed over approximately ten years in Medina. It provides comprehensive guidance covering faith, law, ethics, and social organization.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed gradually in Medina during the formation of the first Muslim community.",
        "Addresses the Jewish tribes of Medina and responds to their theological questions.",
        "Named after the story of the cow sacrificed by the Israelites (verses 67-73)."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains Ayat al-Kursi (verse 255), considered one of the greatest verses of the Quran.",
        "Establishes fundamental Islamic laws regarding prayer, fasting, charity, and pilgrimage.",
        "Provides detailed guidance on family law, business transactions, and inheritance."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Do not turn your houses into graves. Indeed, Satan flees from the house in which Surah Al-Baqarah is recited' (Sahih Muslim).",
      "The last two verses provide protection from evil when recited at night.",
      "Known as 'Fustat al-Quran' (the tent of the Quran) due to its comprehensive nature."
    ],
    context: "This Surah laid the foundation for Islamic civilization in Medina."
  },
  3: {
    number: 3,
    name: "آل عمران",
    englishName: "Ali 'Imran",
    revelationType: "Madani",
    numberOfAyahs: 200,
    meta: {
      number: 3,
      verses: 200,
      type: "Madani"
    },
    overview: "Surah Ali 'Imran, revealed after the Battle of Uhud, focuses on strengthening the faith of Muslims through lessons from previous prophets and their communities.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the Battle of Uhud (3 AH) to address the lessons from the Muslim setback.",
        "Responds to Christian delegations from Najran who came for theological discussions.",
        "Emphasizes the continuity of divine revelation through Abraham, Jesus, and Muhammad."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the Islamic position on Jesus and Mary, affirming Jesus as a prophet while rejecting divinity.",
        "Contains important verses about steadfastness and learning from historical examples.",
        "Emphasizes the unity of divine messages throughout history."
      ]
    },
    virtues: [
      "The Prophet ﷺ said about Al-Baqarah and Ali 'Imran: 'They will come on the Day of Resurrection like two clouds or two shades, or two flocks of birds in ranks, pleading for those who recited them' (Sahih Muslim).",
      "Known as 'Az-Zahrawain' (The Two Luminous Ones) along with Al-Baqarah."
    ],
    context: "This Surah strengthened Muslim morale after military setbacks and clarified theological positions."
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
    overview: "Surah An-Nisa primarily deals with social justice, women's rights, family law, and inheritance, establishing a comprehensive social framework for the Muslim community.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the Battle of Uhud when many Muslim men were martyred, creating social challenges.",
        "Addressed the protection of orphans, widows, and vulnerable members of society.",
        "Established revolutionary reforms in women's rights and inheritance in 7th century Arabia."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Revolutionized women's rights by granting inheritance rights and legal protections.",
        "Established detailed laws of inheritance (Ilm al-Fara'id).",
        "Provided comprehensive guidance on family relations and social justice."
      ]
    },
    virtues: [
      "Contains fundamental verses establishing justice and fairness in society.",
      "Provides comprehensive guidance on protecting the rights of women and orphans.",
      "Known for its detailed legislation on family and social matters."
    ],
    context: "This Surah transformed social structures by establishing rights for women and vulnerable groups."
  },
  5: {
    number: 5,
    name: "المائدة",
    englishName: "Al-Ma'idah",
    revelationType: "Madani",
    numberOfAyahs: 120,
    meta: {
      number: 5,
      verses: 120,
      type: "Madani"
    },
    overview: "Al-Ma'idah, one of the last chapters revealed, completes the message of Islam with final legal injunctions, dietary laws, and principles for relations with other faith communities.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the final years of the Prophet's life, around the Farewell Pilgrimage.",
        "Contains the verse declaring the completion of the religion (5:3).",
        "Addresses the practical challenges of governing a multi-religious society in Medina."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the declaration: 'This day I have perfected for you your religion' (5:3).",
        "Establishes final laws regarding permissible and prohibited foods.",
        "Provides guidelines for treaties and relations with People of the Book."
      ]
    },
    virtues: [
      "Contains the verse of completion of the religion (5:3).",
      "Provides comprehensive guidance on halal and haram in food and drinks.",
      "Establishes principles of justice and testimony in Islamic law."
    ],
    context: "This Surah represents the completion of Islamic legislation."
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
    overview: "Surah Al-An'am comprehensively addresses the fundamentals of Islamic belief, particularly Tawhid (monotheism), while refuting polytheism and establishing logical arguments for God's existence.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed entirely in one revelation in Mecca according to authentic narrations.",
        "Addresses the pagan beliefs of the Quraysh and their objections to Islam.",
        "Named after the cattle that the pagans used in their superstitious practices."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Presents systematic arguments against polytheism and for monotheism.",
        "Contains the declaration of pure monotheism: 'Say, indeed my prayer, my sacrifice, my living and my dying are for Allah' (6:162).",
        "Establishes the principle of following divine guidance rather than ancestral traditions."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah Al-An'am was revealed accompanied by seventy thousand angels' (Tirmidhi).",
      "Known for its powerful arguments establishing Tawhid.",
      "Recited by the Prophet ﷺ in its entirety during night prayers."
    ],
    context: "This Surah systematically dismantles polytheistic beliefs and establishes pure monotheism."
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
    overview: "Surah Al-A'raf takes its name from the heights between Paradise and Hell and presents detailed stories of previous prophets and their communities as lessons for humanity.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in the late Meccan period during intense persecution of Muslims.",
        "Contains the longest continuous narrative about Prophet Moses and the Israelites.",
        "Named after the barrier (Al-A'raf) between Paradise and Hell described in the surah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Provides comprehensive lessons from the stories of Adam, Noah, Hud, Salih, Lot, Shu'ayb, and Moses.",
        "Describes the dialogue between people of Paradise, Hell, and those on the Heights.",
        "Emphasizes the consequences of rejecting divine messengers."
      ]
    },
    virtues: [
      "Contains verses requiring prostration (verse 206).",
      "The Prophet ﷺ frequently recited this surah in Friday and Eid prayers.",
      "Provides profound lessons about the nature of human temptation and redemption."
    ],
    context: "This Surah uses historical examples to demonstrate patterns of divine guidance and human response."
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
    overview: "Surah Al-Anfal, meaning 'The Spoils of War', was revealed after the Battle of Badr and provides comprehensive guidance on warfare, unity, and distribution of war spoils in Islam.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the Battle of Badr (2 AH), the first major military engagement for Muslims.",
        "Addresses the distribution of spoils from the battle, which caused some disputes.",
        "Marks the transition from peaceful propagation to defensive warfare for Muslims."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes Islamic principles of warfare, including rules of engagement and treatment of prisoners.",
        "Emphasizes that victory comes from Allah, not numerical strength or equipment.",
        "Provides lessons about unity, discipline, and trust in Allah during difficulties."
      ]
    },
    virtues: [
      "Contains fundamental principles of Islamic military ethics.",
      "Emphasizes the importance of obedience to leadership during warfare.",
      "Provides timeless lessons about divine help during times of difficulty."
    ],
    context: "This Surah established the Islamic legal framework for defensive warfare."
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
    overview: "Surah At-Tawbah, the only chapter not beginning with Bismillah, deals with themes of repentance, exposing hypocrisy, and establishing clear relations with polytheists and treaty obligations.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the 9th year after Hijrah, known as the 'Year of Delegations'.",
        "Announced during the Hajj season by Abu Bakr, then later by Ali ibn Abi Talib.",
        "Deals with the expedition to Tabuk and exposes the hypocrites who failed to participate."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "The only surah that doesn't begin with Bismillah, reflecting its severe tone.",
        "Establishes principles for treaty obligations and relations with hostile groups.",
        "Contains the verse of jizyah (9:29) regulating relations with People of the Book."
      ]
    },
    virtues: [
      "Known as 'Al-Fadhihah' (The Exposer) for revealing hypocrites' characteristics.",
      "Contains important verses about repentance and returning to Allah.",
      "Provides clear guidelines for distinguishing between believers and hypocrites."
    ],
    context: "This Surah purified the Muslim community by exposing hypocrisy and establishing clear principles for external relations."
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
    overview: "Surah Yunus emphasizes Allah's signs in creation and the consequences faced by those who reject prophets, using the story of Prophet Jonah to highlight Allah's mercy and the importance of timely repentance.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period when persecution of Muslims intensified.",
        "Named after Prophet Yunus (Jonah) whose story demonstrates Allah's acceptance of repentance.",
        "Addresses the Meccans' demands for miracles and their rejection of the Quran's message."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Emphasizes that Allah's mercy encompasses everything and He accepts repentance.",
        "Contains powerful arguments for the truth of resurrection and accountability.",
        "Highlights the patterns of how communities respond to divine messengers."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Yunus will be given rewards equal to the number of people who believed in Yunus or rejected him' (Majma' al-Bayan).",
      "Known for its profound verses about Allah's mercy and signs in creation.",
      "Provides comfort through the story of Yunus and Allah's acceptance of repentance."
    ],
    context: "This Surah emphasizes divine mercy and the importance of believing before it's too late."
  },
  11: {
    number: 11,
    name: "هود",
    englishName: "Hud",
    revelationType: "Makki",
    numberOfAyahs: 123,
    meta: {
      number: 11,
      verses: 123,
      type: "Makki"
    },
    overview: "Surah Hud provides detailed accounts of various prophets and their struggles, emphasizing the consequences faced by disbelieving nations and offering consolation to Prophet Muhammad during difficult times.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the 'Year of Sorrow' when the Prophet faced intense persecution and personal losses.",
        "Named after Prophet Hud sent to the people of 'Ad.",
        "Provided comfort and reassurance to the Prophet during extremely challenging times."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains detailed stories of Noah, Hud, Salih, Abraham, Lot, Shu'ayb, and Moses.",
        "Emphasizes the principle: 'So remain on a right course as you have been commanded' (11:112).",
        "Demonstrates the historical pattern of divine punishment for those who reject messengers."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah Hud and its sisters have made me old' due to their serious warnings (Tirmidhi).",
      "Provides profound lessons about patience during adversity.",
      "Known for its powerful narratives about divine justice and mercy."
    ],
    context: "This Surah strengthened the Prophet and early Muslims during periods of intense difficulty."
  },
  12: {
    number: 12,
    name: "يوسف",
    englishName: "Yusuf",
    revelationType: "Makki",
    numberOfAyahs: 111,
    meta: {
      number: 12,
      verses: 111,
      type: "Makki"
    },
    overview: "Surah Yusuf presents the complete story of Prophet Joseph in a single narrative, highlighting themes of patience, divine planning, forgiveness, and the ultimate triumph of righteousness over阴谋.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Mecca during the 'Year of Sorrow' to comfort the Prophet and early Muslims.",
        "The Jews challenged the Prophet to tell them about Joseph, and this surah was revealed in response.",
        "Presents a complete, continuous story unlike other prophetic narratives in the Quran."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Described by the Prophet as 'the most beautiful of stories'.",
        "Demonstrates how Allah's plan unfolds despite human conspiracies and difficulties.",
        "Teaches lessons about patience, forgiveness, and trusting in divine wisdom."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Teach your relatives the Surah of Yusuf, for any Muslim who recites it and teaches it to his family and slaves, Allah will ease for him the pangs of death' (Al-Durr al-Manthur).",
      "Known as 'Ahsan al-Qasas' (The Most Beautiful Story).",
      "Provides profound lessons about patience, dream interpretation, and family reconciliation."
    ],
    context: "This Surah provided hope and consolation to early Muslims facing persecution."
  },
  13: {
    number: 13,
    name: "الرعد",
    englishName: "Ar-Ra'd",
    revelationType: "Madani",
    numberOfAyahs: 43,
    meta: {
      number: 13,
      verses: 43,
      type: "Madani"
    },
    overview: "Surah Ar-Ra'd (The Thunder) emphasizes Allah's power as manifested in nature, the reality of revelation, and the contrast between truth and falsehood, using natural phenomena as signs for reflection.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in early Medina, addressing both Muslims and the remaining polytheists.",
        "Named after the thunder that glorifies Allah with His praise (verse 13).",
        "Addresses objections from disbelievers about prophethood and revelation."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Highlights Allah's signs in nature and the universe as proof of His existence and power.",
        "Emphasizes that the Quran is the true guidance from the Lord of the worlds.",
        "Contrasts the state of believers who find peace in remembrance of Allah with disbelievers."
      ]
    },
    virtues: [
      "Contains profound verses about the nature of revelation and divine signs.",
      "Emphasizes the connection between faith and recognizing Allah's signs in creation.",
      "Known for its powerful description of thunder and natural phenomena glorifying Allah."
    ],
    context: "This Surah uses natural phenomena to demonstrate Allah's power and the truth of revelation."
  },
  14: {
    number: 14,
    name: "إبراهيم",
    englishName: "Ibrahim",
    revelationType: "Makki",
    numberOfAyahs: 52,
    meta: {
      number: 14,
      verses: 52,
      type: "Makki"
    },
    overview: "Surah Ibrahim focuses on the fundamental message of all prophets - worship of Allah alone - through the example of Prophet Abraham's prayers for Mecca and his descendants.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Mecca during the period of intense opposition to Islam.",
        "Named after Prophet Ibrahim (Abraham) whose legacy the Meccans claimed to follow.",
        "Reminds the Quraysh of Abraham's true message which they had corrupted."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains Abraham's famous prayers for Mecca and his descendants.",
        "Uses the metaphor of a good word being like a good tree with firm roots.",
        "Emphasizes the consistent message of all prophets throughout history."
      ]
    },
    virtues: [
      "Contains the beautiful prayers of Prophet Ibrahim for Mecca and his progeny.",
      "Provides the metaphor of the good word being like a firm tree (14:24-25).",
      "Emphasizes the importance of gratitude and the danger of ingratitude to Allah."
    ],
    context: "This Surah reestablishes the pure monotheism of Abraham against Meccan paganism."
  },
  15: {
    number: 15,
    name: "الحجر",
    englishName: "Al-Hijr",
    revelationType: "Makki",
    numberOfAyahs: 99,
    meta: {
      number: 15,
      verses: 99,
      type: "Makki"
    },
    overview: "Surah Al-Hijr reassures the Prophet about the protection of the Quran and relates the stories of previous messengers who faced rejection, emphasizing Allah's ultimate control over all affairs.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during intense Meccan persecution when Muslims faced severe opposition.",
        "Named after the stone city of the Thamud people in northwestern Arabia.",
        "Addresses the accusations of soothsaying and poetry made against the Prophet."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains Allah's promise to protect the Quran from corruption.",
        "Relates the stories of Abraham, Lot, the People of Al-Hijr, and others.",
        "Emphasizes that the Prophet's role is only to convey the message clearly."
      ]
    },
    virtues: [
      "Contains the divine promise: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian' (15:9).",
      "Provides reassurance during times of persecution and rejection.",
      "Emphasizes Allah's complete knowledge and control over all creation."
    ],
    context: "This Surah provided reassurance about divine protection of the message during difficult times."
  },
  16: {
    number: 16,
    name: "النحل",
    englishName: "An-Nahl",
    revelationType: "Makki",
    numberOfAyahs: 128,
    meta: {
      number: 16,
      verses: 128,
      type: "Makki"
    },
    overview: "Surah An-Nahl (The Bee) extensively details Allah's blessings in nature, using the bee as an example of divine wisdom, while addressing objections about revelation and emphasizing gratitude.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period before the migration to Abyssinia.",
        "Named after the bee which exemplifies divine wisdom in creation.",
        "Addresses the polytheists' attribution of Allah's blessings to other deities."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Comprehensively details Allah's blessings in nature as proofs of His existence and mercy.",
        "Contains the verse: 'And your Lord inspired the bee...' (16:68-69) showing divine wisdom.",
        "Emphasizes the importance of gratitude and the consequences of ingratitude."
      ]
    },
    virtues: [
      "Known as 'Surah of Blessings' for its extensive detailing of divine favors.",
      "Contains the famous 'verse of invitation' calling to wisdom and good instruction (16:125).",
      "Emphasizes the importance of reflecting on natural phenomena as signs of Allah."
    ],
    context: "This Surah directs attention to Allah's signs in creation as evidence for monotheism."
  },
  17: {
    number: 17,
    name: "الإسراء",
    englishName: "Al-Isra",
    revelationType: "Makki",
    numberOfAyahs: 111,
    meta: {
      number: 17,
      verses: 111,
      type: "Makki"
    },
    overview: "Surah Al-Isra, also known as Bani Israel, commemorates the Night Journey of Prophet Muhammad from Mecca to Jerusalem and contains fundamental moral teachings and warnings to humanity.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed about one year before the Hijrah (Migration to Medina).",
        "Commemorates the Isra (Night Journey) and Mi'raj (Ascension) of the Prophet.",
        "Named after the Children of Israel who are extensively addressed in the surah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the account of the Prophet's Night Journey from Mecca to Jerusalem.",
        "Includes the fundamental ethical teachings often called the 'Children of Israel commandments'.",
        "Establishes the Quran as a source of healing and mercy for believers."
      ]
    },
    virtues: [
      "Contains Ayat al-Kursi's equivalent in virtue according to some scholars (verse 111).",
      "Includes the beautiful verse: 'And say: My Lord, cause me to enter in a goodly entrance...' (17:80).",
      "Known for its comprehensive moral guidance and spiritual teachings."
    ],
    context: "This Surah marks the spiritual ascension of the Prophet and contains core ethical teachings."
  },
  18: {
    number: 18,
    name: "الكهف",
    englishName: "Al-Kahf",
    revelationType: "Makki",
    numberOfAyahs: 110,
    meta: {
      number: 18,
      verses: 110,
      type: "Makki"
    },
    overview: "Surah Al-Kahf provides protection from the Dajjal (Anti-Christ) and contains four profound stories: the People of the Cave, the Two Garden Owners, Moses with Khidr, and Dhul-Qarnayn.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in response to the Quraysh's questions posed to the Prophet through Jewish scholars.",
        "The questions concerned the People of the Cave, the Spirit, and Dhul-Qarnayn.",
        "Provides timeless lessons about faith, knowledge, power, and wealth."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "The Prophet ﷺ emphasized reciting it every Friday for protection from the Dajjal.",
        "Contains four major stories each conveying profound spiritual lessons.",
        "Teaches about the temporary nature of this world and the permanence of the hereafter."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever memorizes ten verses from the beginning of Surah Al-Kahf will be protected from the Dajjal' (Sahih Muslim).",
      "Reciting it on Friday brings light between two Fridays.",
      "Contains the fundamental principle: 'So whoever hopes for the meeting with his Lord...' (18:110)."
    ],
    context: "This Surah provides spiritual protection and addresses fundamental tests of faith."
  },
  19: {
    number: 19,
    name: "مريم",
    englishName: "Maryam",
    revelationType: "Makki",
    numberOfAyahs: 98,
    meta: {
      number: 19,
      verses: 98,
      type: "Makki"
    },
    overview: "Surah Maryam emphasizes Allah's mercy and power through the miraculous stories of Prophets Zachariah, John, Jesus, and others, while affirming the truth of resurrection and accountability.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed before the migration to Abyssinia to strengthen the Muslims there.",
        "The recitation of this surah moved the Negus and his bishops to tears.",
        "Provides the Islamic narrative about Jesus and Mary, countering Christian doctrines."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Presents the true stories of Jesus and Mary from an Islamic perspective.",
        "Emphasizes Allah's power to do anything, including giving children to barren couples.",
        "Uses the refrain 'How easily Allah creates and resurrects' throughout the surah."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'The weariness of old age resulted from Surah Hud, its sisters have made me old' referring to Surah Maryam and others (Tirmidhi).",
      "Known for its moving narratives that soften hearts and strengthen faith.",
      "The recitation of this surah led to the Christian Negus accepting the Muslim migrants."
    ],
    context: "This Surah provided comfort to Muslim migrants and established the Islamic position on Jesus."
  },
  20: {
    number: 20,
    name: "طه",
    englishName: "Taha",
    revelationType: "Makki",
    numberOfAyahs: 135,
    meta: {
      number: 20,
      verses: 135,
      type: "Makki"
    },
    overview: "Surah Taha was revealed to comfort and reassure Prophet Muhammad during difficult times, focusing on the story of Moses as encouragement and providing spiritual solace.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during a period of intense persecution in Mecca.",
        "The opening verses directly address and comfort the Prophet.",
        "Umar ibn al-Khattab accepted Islam after hearing this surah recited by his sister."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with the comforting address: 'We have not sent down the Quran upon you to cause you distress'.",
        "Contains the detailed story of Moses from birth to his mission to Pharaoh.",
        "Emphasizes the importance of prayer as a means of spiritual strength."
      ]
    },
    virtues: [
      "Known as 'the name of the Prophet' as Taha is one of his names.",
      "The recitation of this surah led to Umar ibn al-Khattab's conversion to Islam.",
      "Contains the beautiful verse: 'Indeed, I am Allah. There is no deity except Me, so worship Me...' (20:14)."
    ],
    context: "This Surah provided spiritual comfort and strength during periods of intense difficulty."
  },
    21: {
    number: 21,
    name: "الأنبياء",
    englishName: "Al-Anbiya",
    revelationType: "Makki",
    numberOfAyahs: 112,
    meta: {
      number: 21,
      verses: 112,
      type: "Makki"
    },
    overview: "Surah Al-Anbiya focuses on the stories of various prophets and their struggles, emphasizing the ultimate triumph of truth and the reality of the Hereafter.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period when persecution was at its peak.",
        "Addresses the disbelievers' mockery of the concept of resurrection.",
        "Named 'The Prophets' as it mentions numerous messengers of Allah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains stories of Abraham, Moses, Aaron, Lot, Noah, David, Solomon, Job, and others.",
        "Emphasizes that all prophets brought the same essential message of monotheism.",
        "Affirms the reality of the Hereafter and accountability for deeds."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Anbiya, Allah will make the accounting easy for him on Day of Judgment' (Al-Durr al-Manthur).",
      "Contains the verse: 'We did not send you except as a mercy to the worlds' (21:107).",
      "Known for its comprehensive coverage of prophetic stories and lessons."
    ],
    context: "This Surah strengthens faith through prophetic narratives and affirms resurrection."
  },
  22: {
    number: 22,
    name: "الحج",
    englishName: "Al-Hajj",
    revelationType: "Madani",
    numberOfAyahs: 78,
    meta: {
      number: 22,
      verses: 78,
      type: "Madani"
    },
    overview: "Surah Al-Hajj deals with the pilgrimage rites, the reality of resurrection, and permission for defensive fighting, combining Meccan and Medinan themes.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Contains both Meccan and Medinan verses, revealed over different periods.",
        "Addresses the institution of Hajj and its spiritual significance.",
        "Revealed when permission for defensive fighting was granted to Muslims."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains detailed instructions about Hajj rituals and their meanings.",
        "Establishes the principle of defensive warfare in Islam.",
        "Emphasizes Allah's support for those who struggle in His cause."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Hajj will get the reward of Hajj and Umrah according to the number of people who performed Hajj and Umrah' (Thawab al-A'mal).",
      "Contains two prostrations of recitation (verses 18 and 77).",
      "Known for its comprehensive coverage of worship and jihad."
    ],
    context: "This Surah establishes the rites of Hajj and principles of defensive warfare."
  },
  23: {
    number: 23,
    name: "المؤمنون",
    englishName: "Al-Mu'minun",
    revelationType: "Makki",
    numberOfAyahs: 118,
    meta: {
      number: 23,
      verses: 118,
      type: "Makki"
    },
    overview: "Surah Al-Mu'minun describes the qualities of successful believers and provides evidence of Allah's power through human creation and natural phenomena.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Addresses the fundamental characteristics that lead to spiritual success.",
        "Provides logical arguments for resurrection and accountability."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with the qualities of successful believers: humility in prayer, avoidance of vain talk, etc.",
        "Details the stages of human creation as signs of Allah's power.",
        "Contains the story of Prophet Noah and his people."
      ]
    },
    virtues: [
      "The Prophet ﷺ found great comfort in reciting this surah, especially its opening verses.",
      "Contains the beautiful description of believer's qualities that lead to success.",
      "Known for its powerful arguments about creation and resurrection."
    ],
    context: "This Surah outlines the path to spiritual success and provides evidence for Islamic beliefs."
  },
  24: {
    number: 24,
    name: "النور",
    englishName: "An-Nur",
    revelationType: "Madani",
    numberOfAyahs: 64,
    meta: {
      number: 24,
      verses: 64,
      type: "Madani"
    },
    overview: "Surah An-Nur establishes Islamic moral and social laws, particularly regarding family purity, modesty, and the incident of slander against Aisha (ra).",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the incident of slander (al-ifk) against Aisha (ra).",
        "Establishes laws for maintaining social purity and moral standards.",
        "Addresses the importance of evidence and avoiding suspicion."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the verse of Light (Ayat an-Nur) describing divine guidance.",
        "Establishes laws of modesty, hijab, and gender interaction.",
        "Provides guidelines for household etiquette and privacy."
      ]
    },
    virtues: [
      "Contains the magnificent 'Verse of Light' (24:35) describing divine guidance.",
      "The Prophet ﷺ said: 'Teach your women Surah An-Nur' (Abu Dawud).",
      "Provides comprehensive guidance for maintaining moral society."
    ],
    context: "This Surah established Islamic moral code and addressed a critical incident in Islamic history."
  },
  25: {
    number: 25,
    name: "الفرقان",
    englishName: "Al-Furqan",
    revelationType: "Makki",
    numberOfAyahs: 77,
    meta: {
      number: 25,
      verses: 77,
      type: "Makki"
    },
    overview: "Surah Al-Furqan addresses the objections of disbelievers against the Quran and Prophet Muhammad, establishing the Quran as the criterion between truth and falsehood.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during intense Meccan opposition to Islam.",
        "Responds to the disbelievers' demands for miracles and their criticisms of the Prophet.",
        "Named 'The Criterion' as it distinguishes truth from falsehood."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the characteristics of the 'Servants of the Most Merciful'.",
        "Refutes various objections raised by disbelievers against Islam.",
        "Emphasizes that the Quran itself is the greatest miracle."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'A person who recites Surah Al-Furqan will come on Day of Judgment believing that the Hour has come, and he will enter Paradise without accounting' (Al-Durr al-Manthur).",
      "Contains beautiful description of the qualities of true believers.",
      "Known for its powerful refutation of polytheistic arguments."
    ],
    context: "This Surah addresses Meccan opposition and establishes the Quran as the ultimate criterion."
  },
  26: {
    number: 26,
    name: "الشعراء",
    englishName: "Ash-Shu'ara",
    revelationType: "Makki",
    numberOfAyahs: 227,
    meta: {
      number: 26,
      verses: 227,
      type: "Makki"
    },
    overview: "Surah Ash-Shu'ara presents stories of various prophets and their peoples, emphasizing the consistent pattern of how communities respond to divine guidance.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Addresses the accusation that the Prophet was a poet or soothsayer.",
        "Uses historical examples to comfort the Prophet and early Muslims."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains stories of Moses, Abraham, Noah, Hud, Salih, Lot, and Shu'ayb.",
        "Each prophetic story follows a similar pattern with the refrain: 'Indeed in that is a sign, but most of them are not believers'.",
        "Emphasizes that the Quran is not poetry but divine revelation."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Ash-Shu'ara will get the reward of ten times the number of all those who believed in the prophets and denied them' (Thawab al-A'mal).",
      "Provides comfort through the stories of prophets who faced similar challenges.",
      "Known for its rhythmic style and powerful narratives."
    ],
    context: "This Surah comforts believers by showing prophets faced similar rejection."
  },
  27: {
    number: 27,
    name: "النمل",
    englishName: "An-Naml",
    revelationType: "Makki",
    numberOfAyahs: 93,
    meta: {
      number: 27,
      verses: 93,
      type: "Makki"
    },
    overview: "Surah An-Naml focuses on the story of Prophet Solomon and the Queen of Sheba, highlighting how true guidance leads to submission to Allah.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named after the ants in Solomon's story.",
        "Addresses the themes of knowledge, power, and submission to Allah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the complete story of Prophet Solomon and the Queen of Sheba.",
        "Includes the story of the hoopoe bird that brought news to Solomon.",
        "Begins with the mysterious letters 'Ta-Seen' and mentions the Quran as guidance."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah An-Naml will be credited with ten good deeds for every believer and every denier of Solomon, the hoopoe, and the Queen of Sheba' (Al-Durr al-Manthur).",
      "Contains the verse: 'My Lord, indeed I have wronged myself, and I submit with Solomon to Allah' (27:44).",
      "Known for its beautiful narrative of the Queen's eventual submission."
    ],
    context: "This Surah demonstrates how true knowledge leads to recognition of Allah's sovereignty."
  },
  28: {
    number: 28,
    name: "القصص",
    englishName: "Al-Qasas",
    revelationType: "Makki",
    numberOfAyahs: 88,
    meta: {
      number: 28,
      verses: 88,
      type: "Makki"
    },
    overview: "Surah Al-Qasas details the story of Prophet Moses from birth to prophethood, drawing parallels with Prophet Muhammad's experience and providing comfort to Muslims.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period before migration to Abyssinia.",
        "Provides comfort to persecuted Muslims by showing Moses' similar struggles.",
        "Named 'The Stories' for its detailed narrative of Moses' life."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the most detailed account of Moses' early life in the Quran.",
        "Draws parallels between Pharaoh's oppression and Meccan persecution.",
        "Emphasizes that ultimate victory belongs to Allah's servants."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Qasas will get the reward of ten good deeds for every believer and disbeliever in the time of Moses' (Thawab al-A'mal).",
      "Contains the comforting verse: 'And do not call to any other god with Allah' (28:88).",
      "Provides hope and consolation during times of oppression."
    ],
    context: "This Surah provided hope to early Muslims through Moses' similar experiences."
  },
  29: {
    number: 29,
    name: "العنكبوت",
    englishName: "Al-Ankabut",
    revelationType: "Makki",
    numberOfAyahs: 69,
    meta: {
      number: 29,
      verses: 69,
      type: "Makki"
    },
    overview: "Surah Al-Ankabut emphasizes the testing of believers' faith and uses the metaphor of the spider's web to describe the weakness of false beliefs.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period when persecution intensified.",
        "Addresses the tests and trials that purify believers' faith.",
        "Named after the spider whose web represents the fragility of false gods."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with the fundamental principle: 'Do people think they will be left alone because they say we believe?'",
        "Contains stories of Noah, Abraham, Lot, and others who were tested.",
        "Uses the spider's web as a metaphor for the weakness of polytheism."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Ankabut will be given rewards equal to the number of all believers and hypocrites' (Al-Durr al-Manthur).",
      "Contains the verse: 'And those who strive in Our cause - We will surely guide them to Our paths' (29:69).",
      "Provides strength and patience during times of testing."
    ],
    context: "This Surah prepares believers for the tests that purify and strengthen faith."
  },
  30: {
    number: 30,
    name: "الروم",
    englishName: "Ar-Rum",
    revelationType: "Makki",
    numberOfAyahs: 60,
    meta: {
      number: 30,
      verses: 60,
      type: "Makki"
    },
    overview: "Surah Ar-Rum prophesied the victory of Romans over Persians and emphasizes Allah's signs in creation and the alternation of day and night.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when Persians defeated Romans, and the prophecy was given of Roman victory.",
        "The prophecy was fulfilled a few years later, strengthening Muslim faith.",
        "Named after the Romans whose victory was prophesied."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the prophecy of Roman victory that was fulfilled.",
        "Emphasizes Allah's signs in creation and the universe.",
        "Highlights the temporary nature of worldly power and ultimate divine control."
      ]
    },
    virtues: [
      "The Prophet ﷺ recited this surah in Maghrib prayer according to some narrations.",
      "Contains the famous verse: 'So direct your face toward the religion, inclining to truth' (30:30).",
      "Known for its prophecy that strengthened the believers' faith when fulfilled."
    ],
    context: "This Surah contained prophecies that demonstrated the Quran's divine origin."
  },
  31: {
    number: 31,
    name: "لقمان",
    englishName: "Luqman",
    revelationType: "Makki",
    numberOfAyahs: 34,
    meta: {
      number: 31,
      verses: 34,
      type: "Makki"
    },
    overview: "Surah Luqman contains the wise advice of Luqman to his son, covering fundamental aspects of faith, morality, and proper conduct in life.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named after the wise man Luqman, known for his wisdom in Arabian tradition.",
        "Addresses the importance of parental guidance and moral upbringing."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains Luqman's comprehensive advice to his son about monotheism and morality.",
        "Emphasizes the importance of gratitude to Allah and parents.",
        "Forbids arrogance and enjoins moderation in walking and speaking."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Luqman was not a prophet but he was a thankful slave' (Ahmad).",
      "Contains fundamental ethical teachings for Muslim upbringing.",
      "Known for its beautiful advice about proper conduct and avoidance of pride."
    ],
    context: "This Surah provides timeless wisdom for moral and spiritual development."
  },
  32: {
    number: 32,
    name: "السجدة",
    englishName: "As-Sajdah",
    revelationType: "Makki",
    numberOfAyahs: 30,
    meta: {
      number: 32,
      verses: 30,
      type: "Makki"
    },
    overview: "Surah As-Sajdah emphasizes the reality of creation, revelation, and resurrection, containing a mandatory prostration during recitation.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Addresses the disbelievers' denial of resurrection and revelation.",
        "Named 'The Prostration' for the mandatory sajdah in verse 15."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the creation of Adam and the nature of human existence.",
        "Emphasizes that the Quran is truly from Allah without any doubt.",
        "Contains a mandatory prostration that demonstrates submission to Allah."
      ]
    },
    virtues: [
      "The Prophet ﷺ used to recite this surah in Fajr prayer on Fridays.",
      "Contains a mandatory prostration that earns great reward.",
      "The Prophet ﷺ said: 'When a person prostrates after reciting this surah, Satan withdraws weeping' (Sahih Muslim)."
    ],
    context: "This Surah affirms fundamental beliefs through logical arguments and submission."
  },
  33: {
    number: 33,
    name: "الأحزاب",
    englishName: "Al-Ahzab",
    revelationType: "Madani",
    numberOfAyahs: 73,
    meta: {
      number: 33,
      verses: 73,
      type: "Madani"
    },
    overview: "Surah Al-Ahzab addresses the Battle of the Trench and related events, establishing important social laws and clarifying the status of the Prophet's family.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during and after the Battle of the Trench (5 AH).",
        "Addresses the incident of the slander against Aisha and the marriage to Zaynab.",
        "Named 'The Confederates' after the allied tribes that attacked Medina."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the Prophet's wives as 'Mothers of the Believers' with special responsibilities.",
        "Contains the verse of purification regarding the Prophet's household.",
        "Addresses the adoption system and establishes biological family ties."
      ]
    },
    virtues: [
      "Contains the 'Verse of Purification' (33:33) about the Prophet's household.",
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Ahzab and teaches it to his family, he will be saved from the punishment of the grave' (Thawab al-A'mal).",
      "Establishes important social reforms in early Muslim society."
    ],
    context: "This Surah addressed critical social and military challenges in Medina."
  },
  34: {
    number: 34,
    name: "سبأ",
    englishName: "Saba",
    revelationType: "Makki",
    numberOfAyahs: 54,
    meta: {
      number: 34,
      verses: 54,
      type: "Makki"
    },
    overview: "Surah Saba tells the story of the people of Sheba and their punishment for ingratitude, emphasizing Allah's blessings and the consequences of disbelief.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named after the people of Sheba in Yemen known for their advanced civilization.",
        "Addresses the themes of gratitude, power, and accountability."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the story of the people of Sheba and their miraculous dams.",
        "Emphasizes that all power and wealth ultimately belong to Allah.",
        "Refutes the disbelievers' denial of resurrection and accountability."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Saba, Allah will give him the reward of ten times the number of all those who believed in Solomon and those who disbelieved in him' (Al-Durr al-Manthur).",
      "Contains powerful arguments about the temporary nature of worldly power.",
      "Known for its emphasis on gratitude and warning against arrogance."
    ],
    context: "This Surah warns against arrogance and ingratitude through historical examples."
  },
  35: {
    number: 35,
    name: "فاطر",
    englishName: "Fatir",
    revelationType: "Makki",
    numberOfAyahs: 45,
    meta: {
      number: 35,
      verses: 45,
      type: "Makki"
    },
    overview: "Surah Fatir emphasizes Allah's power as the Originator of creation and uses natural phenomena as signs for reflection and recognition of the Creator.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Originator' which is one of Allah's beautiful names.",
        "Addresses the polytheists' attribution of partners to Allah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins by praising Allah as the Originator of the heavens and earth.",
        "Uses various natural phenomena as signs pointing to the Creator.",
        "Emphasizes that only Allah deserves worship and gratitude."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Fatir, he will have three doors of Paradise open for him to enter from whichever he wishes' (Al-Durr al-Manthur).",
      "Contains beautiful descriptions of Allah's creative power.",
      "Known for its logical arguments for monotheism through nature."
    ],
    context: "This Surah directs attention to Allah's signs in creation as proof of His oneness."
  },
  36: {
    number: 36,
    name: "يس",
    englishName: "Yaseen",
    revelationType: "Makki",
    numberOfAyahs: 83,
    meta: {
      number: 36,
      verses: 83,
      type: "Makki"
    },
    overview: "Surah Yaseen is known as the 'Heart of the Quran' and addresses the fundamental beliefs of Islam: monotheism, prophethood, and resurrection.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Considered one of the most important surahs in the Quran.",
        "Addresses the people of a town who rejected messengers sent to them."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains powerful arguments for resurrection and accountability.",
        "Presents the story of a town that rejected three messengers.",
        "Emphasizes the Quran as a warning and reminder for humanity."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Everything has a heart, and the heart of the Quran is Yaseen' (Tirmidhi).",
      "The Prophet ﷺ said: 'Whoever recites Yaseen seeking Allah's pleasure, his past sins will be forgiven' (Al-Durr al-Manthur).",
      "Traditionally recited for the deceased and during difficult times."
    ],
    context: "This Surah is considered the spiritual heart of the Quran's message."
  },
  37: {
    number: 37,
    name: "الصافات",
    englishName: "As-Saffat",
    revelationType: "Makki",
    numberOfAyahs: 182,
    meta: {
      number: 37,
      verses: 182,
      type: "Makki"
    },
    overview: "Surah As-Saffat begins with the oath of angels arranged in ranks and contains stories of various prophets, emphasizing their devotion and struggles.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named after the angels standing in rows for Allah's service.",
        "Addresses the polytheists' false claims about angels being Allah's daughters."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains stories of Noah, Abraham, Moses, Aaron, Elijah, and Lot.",
        "Refutes the pagan concept of angels being female deities.",
        "Emphasizes the unity of Allah and the devotion of His prophets."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah As-Saffat on Friday, he will be protected from all afflictions and shaitan' (Al-Durr al-Manthur).",
      "Contains the beautiful refrain: 'Peace be upon the messengers, and praise to Allah, Lord of the worlds'.",
      "Known for its powerful refutation of polytheistic beliefs."
    ],
    context: "This Surah affirms monotheism and the true status of prophets and angels."
  },
  38: {
    number: 38,
    name: "ص",
    englishName: "Sad",
    revelationType: "Makki",
    numberOfAyahs: 88,
    meta: {
      number: 38,
      verses: 88,
      type: "Makki"
    },
    overview: "Surah Sad begins with the mysterious letter Sad and focuses on the stories of David and Solomon, emphasizing repentance and Allah's forgiveness.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period.",
        "Named after the Arabic letter Sad that begins the surah.",
        "Addresses the disbelievers' rejection and provides consolation through prophetic stories."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the stories of David and Solomon and their tests.",
        "Emphasizes the importance of repentance and Allah's forgiveness.",
        "Includes the story of Job and his patience during trial."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah Sad is the one that made the leaders weep' referring to its effect on the companions (Bukhari).",
      "Contains the beautiful prayer of David: 'And he sought forgiveness and fell down bowing and repenting' (38:24).",
      "Known for its emphasis on repentance and divine forgiveness."
    ],
    context: "This Surah consoles the Prophet and emphasizes repentance through prophetic examples."
  },
  39: {
    number: 39,
    name: "الزمر",
    englishName: "Az-Zumar",
    revelationType: "Makki",
    numberOfAyahs: 75,
    meta: {
      number: 39,
      verses: 75,
      type: "Makki"
    },
    overview: "Surah Az-Zumar emphasizes the seriousness of shirk (polytheism) and the exclusivity of sincere devotion to Allah alone.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period.",
        "Named 'The Groups' referring to how people will be divided in the Hereafter.",
        "Addresses the need for sincere, exclusive worship of Allah."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Emphasizes that worship must be purely for Allah without any partners.",
        "Describes the grouping of people in the Hereafter based on their beliefs.",
        "Contains the beautiful verse: 'Say, O My servants who have transgressed against themselves...' (39:53)."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Az-Zumar, Allah will honor him in this world and the next' (Al-Durr al-Manthur).",
      "Contains the comprehensive verse of forgiveness giving hope to sinners.",
      "Known for its powerful emphasis on pure monotheism."
    ],
    context: "This Surah establishes the seriousness of shirk and exclusivity of tawhid."
  },
  40: {
    number: 40,
    name: "غافر",
    englishName: "Ghafir",
    revelationType: "Makki",
    numberOfAyahs: 85,
    meta: {
      number: 40,
      verses: 85,
      type: "Makki"
    },
    overview: "Surah Ghafir, also known as Al-Mu'min (The Believer), tells the story of a believer from Pharaoh's people who defended Moses secretly.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period.",
        "Named 'The Forgiver' which is one of Allah's names.",
        "Also called 'Al-Mu'min' after the believing man from Pharaoh's family."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the story of the secret believer in Pharaoh's court.",
        "Emphasizes Allah's attribute as the Forgiver of sins.",
        "Describes the fate of previous nations who rejected their messengers."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Ghafir, his past and future sins will be forgiven, and he will be given the reward of those who fear Allah and who spend in charity' (Al-Durr al-Manthur).",
      "Contains the story of the courageous believer in Pharaoh's court.",
      "Known for its emphasis on Allah's forgiveness and mercy."
    ],
    context: "This Surah provides hope through stories of secret believers in hostile environments."
  },
    41: {
    number: 41,
    name: "فصلت",
    englishName: "Fussilat",
    revelationType: "Makki",
    numberOfAyahs: 54,
    meta: {
      number: 41,
      verses: 54,
      type: "Makki"
    },
    overview: "Surah Fussilat, also known as 'Ha-Meem As-Sajdah', emphasizes the detailed revelation of the Quran and contains a mandatory prostration verse.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'Explained in Detail' referring to the Quran's clear guidance.",
        "Addresses the Meccans' rejection of the Quran and their demand for miracles."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains a mandatory prostration in verse 38.",
        "Emphasizes that the Quran is a detailed explanation of all things.",
        "Describes the gradual revelation of the Quran as a mercy to humanity."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Fussilat will get the reward of ten good deeds for every letter revealed in it' (Al-Durr al-Manthur).",
      "Contains a mandatory prostration that demonstrates submission to Allah.",
      "Known for its beautiful description of the Quran's guidance."
    ],
    context: "This Surah emphasizes the Quran as detailed guidance for humanity."
  },
  42: {
    number: 42,
    name: "الشورى",
    englishName: "Ash-Shura",
    revelationType: "Makki",
    numberOfAyahs: 53,
    meta: {
      number: 42,
      verses: 53,
      type: "Makki"
    },
    overview: "Surah Ash-Shura emphasizes consultation in Muslim affairs and establishes principles of divine guidance and decision-making.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period.",
        "Named 'The Consultation' after the principle established in verse 38.",
        "Addresses the unity of divine message through different prophets."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the principle of consultation (shura) in Muslim affairs.",
        "Emphasizes that all prophets brought the same essential message.",
        "Contains the beautiful names of Allah in the opening verses."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Ash-Shura will be among those angels who glorify Allah until the Day of Judgment' (Al-Durr al-Manthur).",
      "Establishes the important Islamic principle of consultation.",
      "Known for its emphasis on unity among believers."
    ],
    context: "This Surah establishes consultation as a fundamental Islamic principle."
  },
  43: {
    number: 43,
    name: "الزخرف",
    englishName: "Az-Zukhruf",
    revelationType: "Makki",
    numberOfAyahs: 89,
    meta: {
      number: 43,
      verses: 89,
      type: "Makki"
    },
    overview: "Surah Az-Zukhruf refutes the disbelievers' attachment to worldly ornaments and emphasizes the superiority of the Hereafter's eternal blessings.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Ornaments of Gold' referring to worldly attractions.",
        "Addresses the Quraysh's pride in their wealth and status."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contrasts temporary worldly ornaments with eternal blessings of Paradise.",
        "Refutes the pagans' claim that angels are Allah's daughters.",
        "Contains the story of Abraham and his father's people."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Az-Zukhruf will be told on Day of Judgment: O servants of Allah, there is no fear upon you today' (Al-Durr al-Manthur).",
      "Contains powerful arguments against materialism and pride.",
      "Known for its emphasis on the superiority of the Hereafter."
    ],
    context: "This Surah warns against attachment to worldly ornaments and status."
  },
  44: {
    number: 44,
    name: "الدخان",
    englishName: "Ad-Dukhan",
    revelationType: "Makki",
    numberOfAyahs: 59,
    meta: {
      number: 44,
      verses: 59,
      type: "Makki"
    },
    overview: "Surah Ad-Dukhan describes the smoke that will appear before the Day of Judgment and emphasizes the Quran's revelation during the blessed night.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Smoke' referring to one of the signs of the Day of Judgment.",
        "Addresses the disbelievers' denial of resurrection and accountability."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the smoke that will envelop people before the Hour.",
        "Emphasizes that the Quran was revealed in a blessed night.",
        "Contains the story of Pharaoh and his people's destruction."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Ad-Dukhan at night, seventy thousand angels will ask forgiveness for him until morning' (Tirmidhi).",
      "Known for its description of the blessed night of revelation.",
      "Contains warnings about the consequences of rejecting truth."
    ],
    context: "This Surah warns of coming punishment and emphasizes the Quran's blessed revelation."
  },
  45: {
    number: 45,
    name: "الجاثية",
    englishName: "Al-Jathiyah",
    revelationType: "Makki",
    numberOfAyahs: 37,
    meta: {
      number: 45,
      verses: 37,
      type: "Makki"
    },
    overview: "Surah Al-Jathiyah emphasizes the signs of Allah in creation and describes the kneeling position of people on the Day of Judgment.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period.",
        "Named 'The Kneeling' referring to the position of people on Judgment Day.",
        "Addresses those who reject Allah's signs in the universe."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes how every nation will be kneeling on the Day of Judgment.",
        "Emphasizes the clear signs of Allah in creation and revelation.",
        "Warns against following desires without knowledge."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Jathiyah, Allah will conceal his faults and give him security from the punishment of the grave' (Al-Durr al-Manthur).",
      "Contains powerful descriptions of the Day of Judgment.",
      "Known for its emphasis on reflecting on Allah's signs."
    ],
    context: "This Surah emphasizes accountability through signs in creation and revelation."
  },
  46: {
    number: 46,
    name: "الأحقاف",
    englishName: "Al-Ahqaf",
    revelationType: "Makki",
    numberOfAyahs: 35,
    meta: {
      number: 46,
      verses: 35,
      type: "Makki"
    },
    overview: "Surah Al-Ahqaf tells the story of the people of 'Ad who lived in the sand dunes and emphasizes the importance of treating parents kindly.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the late Meccan period.",
        "Named 'The Sand Dunes' where the people of 'Ad lived.",
        "The last of the 'Ha-Meem' series of surahs."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains the story of the people of 'Ad and Prophet Hud.",
        "Emphasizes kind treatment of parents, especially in old age.",
        "Mentions the jinn who heard the Quran and believed."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Ahqaf, Allah will give him the reward of ten good deeds for every sand dune in this world' (Al-Durr al-Manthur).",
      "Contains important teachings about parental rights.",
      "Known for the story of jinn who accepted the Quran."
    ],
    context: "This Surah warns through historical examples and emphasizes family values."
  },
  47: {
    number: 47,
    name: "محمد",
    englishName: "Muhammad",
    revelationType: "Madani",
    numberOfAyahs: 38,
    meta: {
      number: 47,
      verses: 38,
      type: "Madani"
    },
    overview: "Surah Muhammad, also known as Al-Qital (The Fighting), establishes the principles of warfare in Islam and contrasts believers with hypocrites.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the Battle of Badr when fighting was prescribed.",
        "Named after Prophet Muhammad ﷺ, the only surah named after him.",
        "Addresses the conduct of Muslims in warfare and relations with enemies."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes rules of engagement and treatment of prisoners in war.",
        "Contrasts the state of believers with that of hypocrites.",
        "Emphasizes that truth will ultimately prevail over falsehood."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Muhammad, it is as if he was with me when we fought at Badr and Hunayn' (Al-Durr al-Manthur).",
      "Contains important principles of Islamic warfare.",
      "Known for its clear distinction between believers and hypocrites."
    ],
    context: "This Surah established the Islamic legal framework for defensive warfare."
  },
  48: {
    number: 48,
    name: "الفتح",
    englishName: "Al-Fath",
    revelationType: "Madani",
    numberOfAyahs: 29,
    meta: {
      number: 48,
      verses: 29,
      type: "Madani"
    },
    overview: "Surah Al-Fath was revealed after the Treaty of Hudaybiyyah, prophesying future victories and describing the qualities of true believers.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed upon return from Hudaybiyyah (6 AH).",
        "Named 'The Victory' though no military victory had occurred yet.",
        "Prophesied the conquest of Mecca and other future victories."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the Treaty of Hudaybiyyah as a clear victory.",
        "Contains the prophecy of Mecca's conquest and other victories.",
        "Describes the qualities of the sincere companions."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Tonight there has been revealed to me a surah which is dearer to me than that on which the sun shines' referring to Surah Al-Fath (Bukhari).",
      "Considered a glad tiding of future victories for Muslims.",
      "Known for its description of the sincere companions' qualities."
    ],
    context: "This Surah turned apparent setback into prophesied victory."
  },
  49: {
    number: 49,
    name: "الحجرات",
    englishName: "Al-Hujurat",
    revelationType: "Madani",
    numberOfAyahs: 18,
    meta: {
      number: 49,
      verses: 18,
      type: "Madani"
    },
    overview: "Surah Al-Hujurat establishes etiquette for dealing with the Prophet, community relations, and defines true faith beyond mere claims.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when some Bedouins called the Prophet loudly from outside his rooms.",
        "Named 'The Rooms' referring to the wives' chambers around the mosque.",
        "Addresses proper social conduct in the Muslim community."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes proper etiquette with the Prophet and in social relations.",
        "Defines true faith as involving heart belief, not just verbal claims.",
        "Forbids mockery, suspicion, and backbiting among Muslims."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Teach your children three things: the love of their Prophet, the love of his family, and the recitation of Quran, for the bearers of the Quran will be in the shade of Allah' (Al-Durr al-Manthur).",
      "Contains comprehensive social ethics for Muslim society.",
      "Known for defining the concept of true faith and brotherhood."
    ],
    context: "This Surah established Islamic social etiquette and community ethics."
  },
  50: {
    number: 50,
    name: "ق",
    englishName: "Qaf",
    revelationType: "Makki",
    numberOfAyahs: 45,
    meta: {
      number: 50,
      verses: 45,
      type: "Makki"
    },
    overview: "Surah Qaf begins with the mysterious letter Qaf and emphatically affirms the reality of resurrection through logical arguments.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named after the Arabic letter Qaf that begins the surah.",
        "The Prophet frequently recited this surah in Friday and Eid prayers."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Emphatically affirms the reality of resurrection and creation.",
        "Describes the state of dying person and recording angels.",
        "Emphasizes that Allah's power to create includes power to resurrect."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Qaf, Allah will make easy for him the agonies of death' (Tirmidhi).",
      "The Prophet frequently recited it in public gatherings.",
      "Known for its powerful arguments for resurrection."
    ],
    context: "This Surah strongly affirms resurrection against Meccan denial."
  },
  51: {
    number: 51,
    name: "الذاريات",
    englishName: "Adh-Dhariyat",
    revelationType: "Makki",
    numberOfAyahs: 60,
    meta: {
      number: 51,
      verses: 60,
      type: "Makki"
    },
    overview: "Surah Adh-Dhariyat begins with oaths by winds and emphasizes the certainty of Allah's promise and the stories of previous prophets.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Scattering Winds' that begin the surah.",
        "Addresses the disbelievers' denial of resurrection and prophets."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by natural phenomena carrying profound meanings.",
        "Contains stories of Abraham, Moses, Noah, and the people of 'Ad and Thamud.",
        "Emphasizes that Allah's promise is certainly true."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Adh-Dhariyat, Allah will give him ten good deeds for every wind that blows' (Al-Durr al-Manthur).",
      "Contains the beautiful description of true believers' characteristics.",
      "Known for its powerful oaths and emphatic affirmations."
    ],
    context: "This Surah affirms divine promises through natural phenomena and history."
  },
  52: {
    number: 52,
    name: "الطور",
    englishName: "At-Tur",
    revelationType: "Makki",
    numberOfAyahs: 49,
    meta: {
      number: 52,
      verses: 49,
      type: "Makki"
    },
    overview: "Surah At-Tur begins with oaths by Mount Tur and describes the scenes of Paradise and Hell, affirming the reality of the Hereafter.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Mount' where Allah spoke to Moses.",
        "Addresses the disbelievers' mockery of the Prophet and the Quran."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by significant creations of Allah.",
        "Describes the blessings of Paradise and punishments of Hell.",
        "Affirms that the Quran is truly from the Lord of the worlds."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah At-Tur, it will be a light for him on the Day of Judgment' (Al-Durr al-Manthur).",
      "Contains beautiful descriptions of Paradise's blessings.",
      "Known for its powerful response to the disbelievers' mockery."
    ],
    context: "This Surah responds to mockery with descriptions of ultimate realities."
  },
  53: {
    number: 53,
    name: "النجم",
    englishName: "An-Najm",
    revelationType: "Makki",
    numberOfAyahs: 62,
    meta: {
      number: 53,
      verses: 62,
      type: "Makki"
    },
    overview: "Surah An-Najm describes the Prophet's ascension experience and establishes that the Quran is revelation, not the Prophet's own speech.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the early Meccan period.",
        "Named 'The Star' referring to the oath at the beginning.",
        "Contains the first verses that required prostration during recitation."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the Prophet's experience of receiving revelation.",
        "Contains the first mandatory prostration in the Quran.",
        "Affirms that the Prophet does not speak from his own desire."
      ]
    },
    virtues: [
      "This was the first surah revealed entirely at once according to some reports.",
      "The Prophet ﷺ and companions prostrated when it was first revealed.",
      "Known for its beautiful description of divine revelation."
    ],
    context: "This Surah established the divine nature of revelation early in prophethood."
  },
  54: {
    number: 54,
    name: "القمر",
    englishName: "Al-Qamar",
    revelationType: "Makki",
    numberOfAyahs: 55,
    meta: {
      number: 54,
      verses: 55,
      type: "Makki"
    },
    overview: "Surah Al-Qamar describes the splitting of the moon as a sign and recounts stories of previous nations destroyed for rejecting their messengers.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when the moon was split as a miracle for the Quraysh.",
        "Named 'The Moon' after the miraculous event.",
        "Addresses the persistent rejection of the Meccan disbelievers."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Mentions the splitting of the moon as a witnessed miracle.",
        "Contains stories of Noah, 'Ad, Thamud, Lot, and Pharaoh's people.",
        "Emphasizes that the Quran is easy to understand and remember."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'My hour and the splitting of the moon have drawn near each other' referring to this surah's theme.",
      "Contains the refrain: 'And We have certainly made the Quran easy for remembrance'.",
      "Known for its emphasis on learning from historical lessons."
    ],
    context: "This Surah warns through historical examples of divine punishment."
  },
  55: {
    number: 55,
    name: "الرحمن",
    englishName: "Ar-Rahman",
    revelationType: "Madani",
    numberOfAyahs: 78,
    meta: {
      number: 55,
      verses: 78,
      type: "Madani"
    },
    overview: "Surah Ar-Rahman repeatedly asks 'Which of the favors of your Lord would you deny?' while describing Allah's blessings in creation and Paradise.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina according to majority opinion.",
        "Named 'The Most Merciful' - one of Allah's beautiful names.",
        "Addresses both jinn and humans as responsible beings."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Repeats the refrain 'Which of the favors of your Lord would you deny?' 31 times.",
        "Describes Allah's blessings in creation and rewards in Paradise.",
        "Addresses both jinn and mankind as accountable creatures."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Everything has a bride, and the bride of the Quran is Surah Ar-Rahman' (Baihaqi).",
      "Known for its beautiful rhythmic style and profound meaning.",
      "The companions considered it the 'bride of the Quran' for its beauty."
    ],
    context: "This Surah emphasizes gratitude through enumeration of divine blessings."
  },
  56: {
    number: 56,
    name: "الواقعة",
    englishName: "Al-Waqi'ah",
    revelationType: "Makki",
    numberOfAyahs: 96,
    meta: {
      number: 56,
      verses: 96,
      type: "Makki"
    },
    overview: "Surah Al-Waqi'ah describes the three groups of people on Judgment Day and emphasizes the reality of resurrection and Quran's truth.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Inevitable Event' referring to the Day of Judgment.",
        "Addresses the fundamental belief in resurrection and accountability."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Divides people into three groups: foremost, companions of right, companions of left.",
        "Provides logical arguments for resurrection and creation.",
        "Emphasizes the Quran's divine origin and preservation."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Waqi'ah every night, poverty will never afflict him' (Al-Durr al-Manthur).",
      "Known for its powerful description of Judgment Day scenes.",
      "The companions recommended it for protection from poverty."
    ],
    context: "This Surah vividly describes the reality of the Hereafter."
  },
  57: {
    number: 57,
    name: "الحديد",
    englishName: "Al-Hadid",
    revelationType: "Madani",
    numberOfAyahs: 29,
    meta: {
      number: 57,
      verses: 29,
      type: "Madani"
    },
    overview: "Surah Al-Hadid emphasizes spending in Allah's cause and describes the nature of this world compared to the Hereafter.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina during the period of establishing the Muslim state.",
        "Named 'The Iron' which is mentioned as a blessing from Allah.",
        "Encourages financial sacrifice for the cause of Islam."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Emphasizes spending wealth in Allah's cause for eternal reward.",
        "Describes the temporary nature of worldly life.",
        "Contains the verse about Allah sending messengers with clear proofs."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah Al-Hadid is the one that exposed the hypocrites' for its emphasis on spending (Al-Durr al-Manthur).",
      "Contains the beautiful description of believers' hearts softening for Allah.",
      "Known for its emphasis on charity and detachment from worldliness."
    ],
    context: "This Surah encouraged financial support for the growing Muslim community."
  },
  58: {
    number: 58,
    name: "المجادلة",
    englishName: "Al-Mujadilah",
    revelationType: "Madani",
    numberOfAyahs: 22,
    meta: {
      number: 58,
      verses: 22,
      type: "Madani"
    },
    overview: "Surah Al-Mujadilah addresses the incident of a woman who pleaded her case to the Prophet and establishes laws regarding zihar (pre-Islamic divorce).",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning Khaulah bint Tha'labah's case of zihar.",
        "Named 'The Pleading Woman' after the woman who argued her case.",
        "Abolished the pre-Islamic practice of zihar."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Abolished the Jahiliyyah practice of zihar (declaring wife as mother).",
        "Establishes laws for expiation of zihar.",
        "Contains teachings about secret counsels and charity before meetings."
      ]
    },
    virtues: [
      "The first surah to begin with 'Allah has heard' emphasizing divine response to pleas.",
      "Establishes important family laws and women's rights.",
      "Known for its emphasis on justice and fair treatment of women."
    ],
    context: "This Surah established women's rights in marriage and abolished harmful practices."
  },
  59: {
    number: 59,
    name: "الحشر",
    englishName: "Al-Hashr",
    revelationType: "Madani",
    numberOfAyahs: 24,
    meta: {
      number: 59,
      verses: 24,
      type: "Madani"
    },
    overview: "Surah Al-Hashr describes the exile of Banu Nadir and establishes laws for distribution of war booty, ending with the beautiful names of Allah.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after the exile of Jewish tribe Banu Nadir from Medina (4 AH).",
        "Named 'The Exile' referring to the banishment of Banu Nadir.",
        "Addresses the distribution of fai' (booty without fighting)."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes laws for distribution of fai' (booty without battle).",
        "Describes the characteristics of hypocrites and their plots.",
        "Ends with the most beautiful names of Allah."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites the last three verses of Surah Al-Hashr, Allah will send seventy thousand angels to send blessings upon him until evening' (Tirmidhi).",
      "Contains the comprehensive description of Allah's attributes.",
      "Known for its powerful ending with Allah's beautiful names."
    ],
    context: "This Surah addressed the aftermath of Banu Nadir's exile and established booty laws."
  },
  60: {
    number: 60,
    name: "الممتحنة",
    englishName: "Al-Mumtahanah",
    revelationType: "Madani",
    numberOfAyahs: 13,
    meta: {
      number: 60,
      verses: 13,
      type: "Madani"
    },
    overview: "Surah Al-Mumtahanah establishes principles for relations with non-Muslim relatives and tests the faith of migrating women.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning Hatib ibn Abi Balta'ah who tried to inform Mecca.",
        "Named 'The Examined Woman' after the test for migrating women.",
        "Addresses relations with non-Muslim family members during war."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes that loyalty should be to Allah and Muslims, not disbelievers.",
        "Allows maintaining good relations with non-Muslim relatives.",
        "Sets conditions for accepting women migrants from Mecca."
      ]
    },
    virtues: [
      "Contains the example of Abraham and his people as ideal Muslim conduct.",
      "Establishes balanced principles for relations with non-Muslims.",
      "Known for its guidance on maintaining family ties across religious lines."
    ],
    context: "This Surah established principles for testing faith and cross-religious family relations."
  },
    61: {
    number: 61,
    name: "الصف",
    englishName: "As-Saff",
    revelationType: "Madani",
    numberOfAyahs: 14,
    meta: {
      number: 61,
      verses: 14,
      type: "Madani"
    },
    overview: "Surah As-Saff emphasizes the importance of unity and standing firm in ranks for Allah's cause, using the metaphor of solid structure.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina during the period of military campaigns.",
        "Named 'The Ranks' referring to Muslims standing united.",
        "Addresses the need for consistency between words and actions."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Criticizes those who say what they don't do.",
        "Uses the metaphor of solid structure for united believers.",
        "Contains Jesus' prophecy about a messenger to come after him."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah As-Saff and Al-Mujadilah are two sisters, and I love them as I love Surah Al-Baqarah and Ali 'Imran' (Al-Durr al-Manthur).",
      "Contains the call to 'help Allah' meaning help His religion.",
      "Known for its emphasis on unity and consistency in faith."
    ],
    context: "This Surah called for unity and commitment to Islamic cause."
  },
  62: {
    number: 62,
    name: "الجمعة",
    englishName: "Al-Jumu'ah",
    revelationType: "Madani",
    numberOfAyahs: 11,
    meta: {
      number: 62,
      verses: 11,
      type: "Madani"
    },
    overview: "Surah Al-Jumu'ah establishes the Friday prayer and criticizes those who abandon prayer for worldly pursuits.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when Friday prayer was prescribed in Medina.",
        "Named 'The Friday' after the congregational prayer.",
        "Addresses an incident when people left prayer for a trade caravan."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the obligation of Friday congregational prayer.",
        "Describes the role of Prophet Muhammad as warner and bearer of good news.",
        "Criticizes prioritizing worldly gains over religious obligations."
      ]
    },
    virtues: [
      "The Prophet ﷺ frequently recited this surah in Friday prayers.",
      "Contains the command to leave business for Friday prayer.",
      "Known for establishing the weekly Muslim congregation."
    ],
    context: "This Surah institutionalized the Friday congregational prayer."
  },
  63: {
    number: 63,
    name: "المنافقون",
    englishName: "Al-Munafiqun",
    revelationType: "Madani",
    numberOfAyahs: 11,
    meta: {
      number: 63,
      verses: 11,
      type: "Madani"
    },
    overview: "Surah Al-Munafiqun exposes the characteristics of hypocrites and warns against being deceived by their outward appearances.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning Abdullah ibn Ubayy and other hypocrites.",
        "Named 'The Hypocrites' exposing their true nature.",
        "Addresses their attempts to undermine Muslim unity."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Exposes the hypocrites' oath-taking as deception.",
        "Warns against being distracted by wealth and children from Allah's remembrance.",
        "Encourages spending in charity before death approaches."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Munafiqun, it will be a protection for him from hypocrisy' (Al-Durr al-Manthur).",
      "Provides clear signs to identify hypocritical behavior.",
      "Known for its warning against worldly distractions."
    ],
    context: "This Surah protected the Muslim community from hypocrites' influence."
  },
  64: {
    number: 64,
    name: "التغابن",
    englishName: "At-Taghabun",
    revelationType: "Madani",
    numberOfAyahs: 18,
    meta: {
      number: 64,
      verses: 18,
      type: "Madani"
    },
    overview: "Surah At-Taghabun emphasizes the Day of Mutual Loss and Gain where believers gain and disbelievers lose, calling to faith before it's too late.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina during the period of community building.",
        "Named 'The Mutual Loss and Gain' referring to Judgment Day.",
        "Addresses the fundamental choice between belief and disbelief."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the Day of Taghabun where some gain at others' loss.",
        "Emphasizes that true wealth and children are those that benefit in Hereafter.",
        "Calls to spend from what Allah has provided."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'When a person recites Surah At-Taghabun, Allah will protect him from the loss of this world and the Hereafter' (Al-Durr al-Manthur).",
      "Contains the call to fear Allah as He should be feared.",
      "Known for its emphasis on the real meaning of gain and loss."
    ],
    context: "This Surah defines true success and failure in spiritual terms."
  },
  65: {
    number: 65,
    name: "الطلاق",
    englishName: "At-Talaq",
    revelationType: "Madani",
    numberOfAyahs: 12,
    meta: {
      number: 65,
      verses: 12,
      type: "Madani"
    },
    overview: "Surah At-Talaq provides comprehensive laws of divorce, emphasizing proper treatment of women and observance of waiting periods.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed to establish proper divorce procedures in Muslim society.",
        "Named 'The Divorce' as it deals extensively with divorce laws.",
        "Addresses the rights of women during and after divorce."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Establishes the Islamic laws of divorce and waiting period (iddah).",
        "Emphasizes proper treatment of wives even during divorce.",
        "Provides for maintenance and dignified separation."
      ]
    },
    virtues: [
      "Known as 'The Lesser Women' (An-Nisa As-Sughra) for its focus on women's rights.",
      "Establishes comprehensive divorce legislation in Islam.",
      "Emphasizes justice and compassion in marital separation."
    ],
    context: "This Surah established dignified procedures for marital dissolution."
  },
  66: {
    number: 66,
    name: "التحريم",
    englishName: "At-Tahrim",
    revelationType: "Madani",
    numberOfAyahs: 12,
    meta: {
      number: 66,
      verses: 12,
      type: "Madani"
    },
    overview: "Surah At-Tahrim addresses an incident involving the Prophet's household and provides examples of righteous and wicked women.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning an incident with the Prophet's wives.",
        "Named 'The Prohibition' referring to something the Prophet prohibited on himself.",
        "Addresses proper conduct within the Prophet's household."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Provides examples of believing women (Pharaoh's wife, Mary) and disbelieving women (Noah's wife, Lot's wife).",
        "Emphasizes the importance of repentance and seeking forgiveness.",
        "Contains the call to protect oneself and family from Hellfire."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah At-Tahrim is among the ones that exposed me' for its personal nature.",
      "Contains powerful examples of righteous women in history.",
      "Known for its emphasis on family protection from spiritual harm."
    ],
    context: "This Surah guided the Prophet's household and provided examples for believers."
  },
  67: {
    number: 67,
    name: "الملك",
    englishName: "Al-Mulk",
    revelationType: "Makki",
    numberOfAyahs: 30,
    meta: {
      number: 67,
      verses: 30,
      type: "Makki"
    },
    overview: "Surah Al-Mulk emphasizes Allah's absolute sovereignty over creation and serves as protection from the punishment of the grave.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Mecca during early prophethood.",
        "Named 'The Sovereignty' highlighting Allah's complete control.",
        "Addresses the disbelievers' denial of resurrection."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Emphasizes Allah's perfect creation and control over everything.",
        "Warns of the punishment for those who reject the truth.",
        "Serves as intercession for the reciter in the grave."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'There is a surah in the Quran of thirty verses that will intercede for its reciter until he is forgiven: Surah Al-Mulk' (Tirmidhi).",
      "The Prophet recommended reciting it every night before sleep.",
      "Known as 'The Protector' for its saving quality from grave punishment."
    ],
    context: "This Surah affirms divine sovereignty and provides spiritual protection."
  },
  68: {
    number: 68,
    name: "القلم",
    englishName: "Al-Qalam",
    revelationType: "Makki",
    numberOfAyahs: 52,
    meta: {
      number: 68,
      verses: 52,
      type: "Makki"
    },
    overview: "Surah Al-Qalam begins with the oath by the pen and defends the Prophet's character against accusations of madness.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "One of the earliest surahs revealed in Mecca.",
        "Named 'The Pen' emphasizing knowledge and writing.",
        "Defends the Prophet against claims of being possessed or mad."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oath by the pen, emphasizing knowledge.",
        "Defends the Prophet's noble character and manners.",
        "Contains the story of the garden owners as a lesson."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah Al-Qalam was revealed in defense of my character' (Al-Durr al-Manthur).",
      "Contains the description of the Prophet's excellent character.",
      "Known for its early defense of the Prophet's mission."
    ],
    context: "This Surah defended the Prophet's character early in his mission."
  },
  69: {
    number: 69,
    name: "الحاقة",
    englishName: "Al-Haqqah",
    revelationType: "Makki",
    numberOfAyahs: 52,
    meta: {
      number: 69,
      verses: 52,
      type: "Makki"
    },
    overview: "Surah Al-Haqqah describes the reality of the Day of Judgment and affirms the divine origin of the Quran.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named 'The Reality' referring to the certainty of Judgment Day.",
        "Addresses the disbelievers' denial of resurrection."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the catastrophic events of Judgment Day.",
        "Affirms that the Quran is revelation from Allah, not poetry.",
        "Mentions the fate of previous destroyed nations."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Haqqah, Allah will make easy for him the accounting on Day of Judgment' (Al-Durr al-Manthur).",
      "Contains powerful descriptions of the Hereafter's reality.",
      "Known for its emphatic affirmation of Quran's divine origin."
    ],
    context: "This Surah emphasizes the certainty of resurrection and accountability."
  },
  70: {
    number: 70,
    name: "المعارج",
    englishName: "Al-Ma'arij",
    revelationType: "Makki",
    numberOfAyahs: 44,
    meta: {
      number: 70,
      verses: 44,
      type: "Makki"
    },
    overview: "Surah Al-Ma'arij describes the ascent of angels and souls to Allah and addresses the impatient nature of human beings.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in response to disbelievers' challenge to bring punishment.",
        "Named 'The Ascending Stairways' referring to angels' ascent.",
        "Addresses human impatience for punishment or reward."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the ascent of angels in a day measuring 50,000 years.",
        "Analyzes human nature - impatient in hardship, reluctant in good.",
        "Except for those who are constant in prayer."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Ma'arij, Allah will give him the reward of those who affirm the truth and deny the falsehood' (Al-Durr al-Manthur).",
      "Contains profound analysis of human psychology.",
      "Known for its description of the praying believers' qualities."
    ],
    context: "This Surah addresses human nature and the reality of divine timing."
  },
  71: {
    number: 71,
    name: "نوح",
    englishName: "Nuh",
    revelationType: "Makki",
    numberOfAyahs: 28,
    meta: {
      number: 71,
      verses: 28,
      type: "Makki"
    },
    overview: "Surah Nuh presents the comprehensive story of Prophet Noah and his prolonged mission to his people, ending with his prayer against them.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the middle Meccan period.",
        "Named after Prophet Noah, containing his complete story.",
        "Provides consolation to the Prophet through Noah's similar experience."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Contains Noah's detailed account of his 950-year mission.",
        "Describes his various approaches in inviting his people.",
        "Ends with Noah's prayer for destruction of his rejectful people."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Nuh, he will be among the believers whom Noah took in the ship' (Al-Durr al-Manthur).",
      "Provides the most detailed account of Noah's prophetic mission.",
      "Known for its lessons in patience and persistence in da'wah."
    ],
    context: "This Surah comforted the Prophet through Noah's similar struggles."
  },
  72: {
    number: 72,
    name: "الجن",
    englishName: "Al-Jinn",
    revelationType: "Makki",
    numberOfAyahs: 28,
    meta: {
      number: 72,
      verses: 28,
      type: "Makki"
    },
    overview: "Surah Al-Jinn describes how a group of jinn heard the Quran, believed in it, and returned to warn their people.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when the Prophet was praying at Ukaz and jinn heard him.",
        "Named 'The Jinn' as it describes their conversion to Islam.",
        "Demonstrates the universal message of Islam for both jinn and humans."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the jinn's reaction to hearing the Quran.",
        "Affirms that Muhammad is prophet for both jinn and humans.",
        "Contains the jinn's testimony about the Quran's greatness."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Jinn, he will be given the reward of giving charity to every believing jinn and human' (Al-Durr al-Manthur).",
      "Demonstrates the universal nature of Islamic message.",
      "Known for its unique perspective from the jinn's experience."
    ],
    context: "This Surah showed the universal impact of the Quran's message."
  },
  73: {
    number: 73,
    name: "المزمل",
    englishName: "Al-Muzzammil",
    revelationType: "Makki",
    numberOfAyahs: 20,
    meta: {
      number: 73,
      verses: 20,
      type: "Makki"
    },
    overview: "Surah Al-Muzzammil was among the first revelations, instructing the Prophet to prepare for his mission through night prayers.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Among the very first surahs revealed in Mecca.",
        "Named 'The Enwrapped One' referring to the Prophet wrapped in his cloak.",
        "Contains initial instructions for the Prophet's spiritual preparation."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Instructs the Prophet to stand in prayer at night.",
        "Commands patience with the disbelievers' rejection.",
        "Later verses modified the initial night prayer instructions."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Muzzammil, Allah will give him peace in this world and the Hereafter' (Al-Durr al-Manthur).",
      "Contains the initial spiritual training for prophethood.",
      "Known for its emphasis on night prayers and patience."
    ],
    context: "This Surah provided the initial spiritual preparation for prophethood."
  },
  74: {
    number: 74,
    name: "المدثر",
    englishName: "Al-Muddathir",
    revelationType: "Makki",
    numberOfAyahs: 56,
    meta: {
      number: 74,
      verses: 56,
      type: "Makki"
    },
    overview: "Surah Al-Muddathir marks the beginning of public proclamation of Islam after the initial private period.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after a brief pause in revelation, starting public da'wah.",
        "Named 'The Cloaked One' referring to the Prophet wrapped in his garment.",
        "Marks the transition from private to public propagation."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Commands the Prophet to begin public warning.",
        "Describes the characteristics of those destined for Hell.",
        "Affirms the Quran as reminder for those who will take heed."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Muddathir, Allah will count him among those who believed in Muhammad and supported him' (Al-Durr al-Manthur).",
      "Marks the beginning of public Islamic propagation.",
      "Known for its strong warning to the rejecters."
    ],
    context: "This Surah inaugurated the public phase of Islamic mission."
  },
  75: {
    number: 75,
    name: "القيامة",
    englishName: "Al-Qiyamah",
    revelationType: "Makki",
    numberOfAyahs: 40,
    meta: {
      number: 75,
      verses: 40,
      type: "Makki"
    },
    overview: "Surah Al-Qiyamah emphatically affirms the reality of resurrection and describes the state of people on Judgment Day.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Resurrection' addressing the disbelievers' denial.",
        "Describes the physical and psychological states on Judgment Day."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Strongly affirms the reality of bodily resurrection.",
        "Describes the overwhelming nature of Judgment Day.",
        "Contains the instruction about Quran's revelation and recitation."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever wishes to look at the Day of Resurrection as if he is seeing it with his own eyes, let him recite Surah Al-Qiyamah' (Tirmidhi).",
      "Contains powerful imagery of the Resurrection.",
      "Known for its emphatic denial of the disbelievers' claims."
    ],
    context: "This Surah strongly affirmed the reality of resurrection."
  },
  76: {
    number: 76,
    name: "الإنسان",
    englishName: "Al-Insan",
    revelationType: "Madani",
    numberOfAyahs: 31,
    meta: {
      number: 76,
      verses: 31,
      type: "Madani"
    },
    overview: "Surah Al-Insan describes the creation of humanity and the rewards of the righteous in Paradise, particularly the Ahl al-Bayt's charity.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina concerning the Prophet's family.",
        "Named 'The Human' describing human creation and purpose.",
        "Describes an incident when Ali, Fatima, and their children gave charity."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the stages of human creation and guidance.",
        "Details the magnificent rewards for the righteous in Paradise.",
        "Emphasizes gratitude and fulfillment of vows."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Insan, his reward will be gardens of Paradise and silk garments' (Al-Durr al-Manthur).",
      "Known as 'Al-Dahr' (The Time) and 'Hal Ata' (Has There Come).",
      "Contains beautiful descriptions of Paradise's rewards."
    ],
    context: "This Surah highlights the virtues of the Prophet's household."
  },
  77: {
    number: 77,
    name: "المرسلات",
    englishName: "Al-Mursalat",
    revelationType: "Makki",
    numberOfAyahs: 50,
    meta: {
      number: 77,
      verses: 50,
      type: "Makki"
    },
    overview: "Surah Al-Mursalat begins with oaths by winds and emphatically warns deniers of the coming punishment.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during middle Meccan period.",
        "Named 'The Emissaries' referring to winds or angels.",
        "Uses powerful oaths and repetition for emphasis."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with series of oaths by natural phenomena.",
        "Repeats 'Woe that Day to the deniers' as a powerful refrain.",
        "Describes the scenes of Judgment Day and past punishments."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Mursalat, Allah will count him among those who testified to the truth' (Al-Durr al-Manthur).",
      "Known for its powerful rhythmic style and repeated warnings.",
      "Contains emphatic affirmation of resurrection's reality."
    ],
    context: "This Surah strongly warns deniers through powerful imagery."
  },
  78: {
    number: 78,
    name: "النبأ",
    englishName: "An-Naba",
    revelationType: "Makki",
    numberOfAyahs: 40,
    meta: {
      number: 78,
      verses: 40,
      type: "Makki"
    },
    overview: "Surah An-Naba addresses the great news of resurrection that people dispute about, describing Allah's signs in creation.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Tidings' referring to the news of resurrection.",
        "Addresses the fundamental point of dispute among people."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Addresses the 'great news' that people dispute about - resurrection.",
        "Describes Allah's power through creation of earth, mountains, etc.",
        "Contrasts the fate of believers and disbelievers."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah An-Naba, Allah will give him to drink from the sealed nectar in Paradise' (Al-Durr al-Manthur).",
      "Known for its logical arguments from creation to resurrection.",
      "Contains comprehensive description of Judgment Day scenes."
    ],
    context: "This Surah addresses the fundamental dispute about afterlife."
  },
  79: {
    number: 79,
    name: "النازعات",
    englishName: "An-Nazi'at",
    revelationType: "Makki",
    numberOfAyahs: 46,
    meta: {
      number: 79,
      verses: 46,
      type: "Makki"
    },
    overview: "Surah An-Nazi'at begins with oaths by angels and tells the story of Moses and Pharaoh as a lesson.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during middle Meccan period.",
        "Named 'The Extractors' referring to angels extracting souls.",
        "Provides consolation through Moses' similar experience."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by angels who take souls violently or gently.",
        "Contains the story of Moses and Pharaoh's confrontation.",
        "Affirms the reality of Hour and resurrection."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah An-Nazi'at, his standing before Allah on Judgment Day will be like the standing of a day from the days of this world' (Al-Durr al-Manthur).",
      "Contains the powerful story of Moses' mission.",
      "Known for its description of different ways souls are taken."
    ],
    context: "This Surah comforts through historical examples of prophetic struggles."
  },
  80: {
    number: 80,
    name: "عبس",
    englishName: "Abasa",
    revelationType: "Makki",
    numberOfAyahs: 42,
    meta: {
      number: 80,
      verses: 42,
      type: "Makki"
    },
    overview: "Surah Abasa gently reproaches the Prophet for frowning at a blind man while busy with influential disbelievers, emphasizing equal attention to all seekers.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when the Prophet was teaching influential Quraysh leaders.",
        "Named 'He Frowned' referring to the incident with Abdullah ibn Umm Maktum.",
        "Teaches the importance of equal attention to all truth-seekers."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Teaches that outward appearances shouldn't determine attention to truth-seekers.",
        "Emphasizes the Quran as reminder for whoever wills to remember.",
        "Describes human ingratitude despite Allah's blessings."
      ]
    },
    virtues: [
      "This surah teaches important lessons about da'wah ethics and equality.",
      "Demonstrates how revelation corrected the Prophet's behavior.",
      "Known for its emphasis on the value of sincere seeking over social status."
    ],
    context: "This Surah established the Islamic principle of equal access to knowledge."
  },
    81: {
    number: 81,
    name: "التكوير",
    englishName: "At-Takwir",
    revelationType: "Makki",
    numberOfAyahs: 29,
    meta: {
      number: 81,
      verses: 29,
      type: "Makki"
    },
    overview: "Surah At-Takwir describes the cosmic events of the Day of Judgment and affirms the divine nature of the Quran's revelation.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Folding Up' describing the sun being folded.",
        "Addresses the disbelievers' denial of revelation and resurrection."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes catastrophic events when the sun loses its light.",
        "Affirms that the Quran is revelation from the Lord of the worlds.",
        "Emphasizes that the Prophet is not mad but truly receives revelation."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever wishes to look at the Day of Resurrection as if seeing it with his eyes, let him recite Surah At-Takwir' (Tirmidhi).",
      "Contains powerful imagery of the end of the universe.",
      "Known for its emphatic affirmation of the Quran's truth."
    ],
    context: "This Surah vividly describes Judgment Day and affirms revelation."
  },
  82: {
    number: 82,
    name: "الإنفطار",
    englishName: "Al-Infitar",
    revelationType: "Makki",
    numberOfAyahs: 19,
    meta: {
      number: 82,
      verses: 19,
      type: "Makki"
    },
    overview: "Surah Al-Infitar describes the splitting of the sky and the recording of deeds, calling humanity to reflect on their creation.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Cleaving' referring to the sky splitting apart.",
        "Addresses human ingratitude despite clear blessings."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the sky cleaving and stars scattering.",
        "Reveals that recording angels note every human deed.",
        "Calls humans to reflect on what deluded them about their Lord."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Infitar, Allah will secure him from the sky falling on the Day of Resurrection' (Al-Durr al-Manthur).",
      "Contains profound questions about human ingratitude.",
      "Known for its description of the recording angels."
    ],
    context: "This Surah emphasizes accountability through cosmic signs."
  },
  83: {
    number: 83,
    name: "المطففين",
    englishName: "Al-Mutaffifin",
    revelationType: "Makki",
    numberOfAyahs: 36,
    meta: {
      number: 83,
      verses: 36,
      type: "Makki"
    },
    overview: "Surah Al-Mutaffifin condemns those who cheat in measurement and describes the records of the righteous and wicked.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when Meccan merchants were cheating in measurements.",
        "Named 'The Defrauding' referring to commercial fraud.",
        "Addresses economic injustice and its spiritual consequences."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Condemns fraud in weights and measures.",
        "Describes the different records: Illiyin for righteous, Sijjin for wicked.",
        "Contrasts the treatment of righteous and wicked in the Hereafter."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'There is no punishment harder on the Day of Judgment than that of those who cheat in measurement' (Muslim).",
      "Contains important teachings about commercial ethics.",
      "Known for its description of the records of deeds."
    ],
    context: "This Surah established Islamic business ethics early in Mecca."
  },
  84: {
    number: 84,
    name: "الإنشقاق",
    englishName: "Al-Inshiqaq",
    revelationType: "Makki",
    numberOfAyahs: 25,
    meta: {
      number: 84,
      verses: 25,
      type: "Makki"
    },
    overview: "Surah Al-Inshiqaq describes the splitting of the sky and earth, and the different states of people based on their records.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Splitting Open' describing cosmic events.",
        "Addresses the ultimate fate of humans based on their deeds."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the sky splitting and earth casting out its contents.",
        "Contrasts those receiving their record in right hand vs behind back.",
        "Emphasizes that humans are inevitably returning to their Lord."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Inshiqaq, Allah will make easy for him the accounting of his deeds' (Al-Durr al-Manthur).",
      "Contains the beautiful description of human journey to Allah.",
      "Known for its logical progression from creation to accountability."
    ],
    context: "This Surah describes the cosmic events preceding Judgment."
  },
  85: {
    number: 85,
    name: "البروج",
    englishName: "Al-Buruj",
    revelationType: "Makki",
    numberOfAyahs: 22,
    meta: {
      number: 85,
      verses: 22,
      type: "Makki"
    },
    overview: "Surah Al-Buruj tells the story of people of the ditch who burned believers, affirming Allah's protection of believers.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning persecuted believers in pre-Islamic Arabia.",
        "Named 'The Mansions of the Stars' referring to the oath at beginning.",
        "Provides comfort to early Muslims facing persecution."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Tells the story of believers thrown in fire for their faith.",
        "Affirms that Allah will punish persecutors and reward believers.",
        "Describes the glorious Quran preserved in a guarded tablet."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Buruj, Allah will give him the reward of ten good deeds for every star in the sky' (Al-Durr al-Manthur).",
      "Provides comfort to persecuted believers throughout history.",
      "Known for its powerful story of faith under persecution."
    ],
    context: "This Surah comforted early Muslims facing severe persecution."
  },
  86: {
    number: 86,
    name: "الطارق",
    englishName: "At-Tariq",
    revelationType: "Makki",
    numberOfAyahs: 17,
    meta: {
      number: 86,
      verses: 17,
      type: "Makki"
    },
    overview: "Surah At-Tariq begins with the oath by the night visitor and emphasizes Allah's power to resurrect humans.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Night Comer' referring to stars that appear at night.",
        "Addresses the disbelievers' denial of resurrection."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oath by the sky and night visitor.",
        "Describes human creation from fluid and power to resurrect.",
        "Affirms the Quran as decisive word, not amusement."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah At-Tariq, Allah will give him the reward of ten good deeds for every star in the sky' (Al-Durr al-Manthur).",
      "Contains powerful arguments for resurrection from human creation.",
      "Known for its scientific insight into human embryology."
    ],
    context: "This Surah provides logical arguments for resurrection."
  },
  87: {
    number: 87,
    name: "الأعلى",
    englishName: "Al-A'la",
    revelationType: "Makki",
    numberOfAyahs: 19,
    meta: {
      number: 87,
      verses: 19,
      type: "Makki"
    },
    overview: "Surah Al-A'la glorifies Allah's perfection and emphasizes the importance of remembering Allah and the eternal Hereafter.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Most High' glorifying Allah's supreme attributes.",
        "The Prophet recommended reciting it in Friday and Eid prayers."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Glorifies Allah who creates and proportions perfectly.",
        "Emphasizes that the Hereafter is better and more lasting.",
        "Contains the promise that the Quran will be preserved in memory."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Glorify the Name of your Lord the Most High' referring to this surah (Abu Dawud).",
      "The Prophet frequently recited it in Friday and Witr prayers.",
      "Known for its comprehensive glorification of Allah's attributes."
    ],
    context: "This Surah emphasizes divine perfection and remembrance."
  },
  88: {
    number: 88,
    name: "الغاشية",
    englishName: "Al-Ghashiyah",
    revelationType: "Makki",
    numberOfAyahs: 26,
    meta: {
      number: 88,
      verses: 26,
      type: "Makki"
    },
    overview: "Surah Al-Ghashiyah describes the overwhelming event of Judgment Day and calls to reflect on Allah's signs in creation.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Overwhelming' referring to Judgment Day's event.",
        "Addresses the need for reflection on natural phenomena."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes faces humbled and faces joyful on Judgment Day.",
        "Calls to reflect on camels, sky, mountains and earth as signs.",
        "Emphasizes that the reminder benefits only those who accept."
      ]
    },
    virtues: [
      "The Prophet ﷺ frequently recited this surah in Friday prayers.",
      "The Prophet said: 'It has overwhelmed me' referring to its impact.",
      "Known for its powerful contrast between blessed and punished."
    ],
    context: "This Surah describes Judgment Day and calls to reflection."
  },
  89: {
    number: 89,
    name: "الفجر",
    englishName: "Al-Fajr",
    revelationType: "Makki",
    numberOfAyahs: 30,
    meta: {
      number: 89,
      verses: 30,
      type: "Makki"
    },
    overview: "Surah Al-Fajr begins with oaths by dawn and describes the fate of arrogant nations, emphasizing the importance of caring for orphans.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Dawn' after the oath at beginning.",
        "Addresses the Meccan elite's arrogance and neglect of poor."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by dawn, ten nights, even and odd.",
        "Describes destruction of 'Ad, Thamud, and Pharaoh.",
        "Criticizes those who love wealth and neglect orphans and poor."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Fajr, he will be among the close ones on the Day of Judgment' (Al-Durr al-Manthur).",
      "Contains important social teachings about wealth distribution.",
      "Known for its criticism of materialism and neglect of poor."
    ],
    context: "This Surah warns arrogant nations and emphasizes social justice."
  },
  90: {
    number: 90,
    name: "البلد",
    englishName: "Al-Balad",
    revelationType: "Makki",
    numberOfAyahs: 20,
    meta: {
      number: 90,
      verses: 20,
      type: "Makki"
    },
    overview: "Surah Al-Balad addresses human struggle in life and defines the steep path of righteousness through specific good deeds.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The City' referring to Mecca where the Prophet struggled.",
        "Addresses the human condition and path to righteousness."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oath by Mecca, the secure city.",
        "Describes human creation into struggle and difficulty.",
        "Defines the steep path as freeing slaves, feeding hungry, etc."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Balad, Allah will secure him from His anger on the Day of Judgment' (Al-Durr al-Manthur).",
      "Contains the comprehensive definition of righteousness.",
      "Known for its realistic view of human struggle and solution."
    ],
    context: "This Surah defines the true path of righteousness practically."
  },
  91: {
    number: 91,
    name: "الشمس",
    englishName: "Ash-Shams",
    revelationType: "Makki",
    numberOfAyahs: 15,
    meta: {
      number: 91,
      verses: 15,
      type: "Makki"
    },
    overview: "Surah Ash-Shams begins with oaths by cosmic phenomena and tells the story of Thamud's she-camel, emphasizing self-purification.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Sun' after the first oath.",
        "Uses Thamud's story as warning for Meccan disbelievers."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with series of oaths by sun, moon, day, night, etc.",
        "Tells the story of Thamud killing the she-camel.",
        "Emphasizes that success comes through purifying the soul."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Ash-Shams, it is as if he has given charity to everything the sun and moon shine upon' (Al-Durr al-Manthur).",
      "Contains the fundamental principle of spiritual success.",
      "Known for its powerful oaths and moral lesson from history."
    ],
    context: "This Surah emphasizes self-purification through historical example."
  },
  92: {
    number: 92,
    name: "الليل",
    englishName: "Al-Layl",
    revelationType: "Makki",
    numberOfAyahs: 21,
    meta: {
      number: 92,
      verses: 21,
      type: "Makki"
    },
    overview: "Surah Al-Layl contrasts the paths of those who spend in charity and purify themselves with those who are stingy and deny goodness.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Night' after the first oath.",
        "Addresses the different types of human choices and their outcomes."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by night, day, and creation of male/female.",
        "Contrasts the righteous who give charity and seek Allah's pleasure.",
        "Warns the stingy who considers himself self-sufficient."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'By the One in Whose Hand is my soul, Surah Al-Layl makes its reciter rich' meaning content with what Allah gives.",
      "Contains the principle that true wealth is spiritual, not material.",
      "Known for its beautiful contrast between spiritual states."
    ],
    context: "This Surah defines true wealth and poverty in spiritual terms."
  },
  93: {
    number: 93,
    name: "الضحى",
    englishName: "Ad-Duha",
    revelationType: "Makki",
    numberOfAyahs: 11,
    meta: {
      number: 93,
      verses: 11,
      type: "Makki"
    },
    overview: "Surah Ad-Duha comforts the Prophet during a pause in revelation and reminds him of Allah's continuous blessings and care.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed after a brief pause in revelation that saddened the Prophet.",
        "Named 'The Morning Brightness' after the oath at beginning.",
        "Provides comfort and reassurance to the Prophet."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by morning brightness and night.",
        "Assures the Prophet that his Lord has not abandoned him.",
        "Reminds of Allah's blessings from orphanhood to guidance."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Ad-Duha, Allah will forgive him his sins even if they are like the foam of the sea' (Al-Durr al-Manthur).",
      "Provides comfort during times of spiritual anxiety.",
      "Known for its beautiful reassurance and remembrance of blessings."
    ],
    context: "This Surah comforted the Prophet during a difficult period."
  },
  94: {
    number: 94,
    name: "الشرح",
    englishName: "Ash-Sharh",
    revelationType: "Makki",
    numberOfAyahs: 8,
    meta: {
      number: 94,
      verses: 8,
      type: "Makki"
    },
    overview: "Surah Ash-Sharh, also known as Al-Inshirah, celebrates the opening of the Prophet's heart and the removal of his burdens.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed as continuation of comfort after Surah Ad-Duha.",
        "Named 'The Relief' or 'The Opening' of the heart.",
        "Commemorates the spiritual opening of the Prophet's heart."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Reminds of the opening of the Prophet's heart and removal of burden.",
        "Assures that with difficulty comes ease.",
        "Commands to strive and turn to Lord when free from duties."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Wasn't your heart opened and your burden removed?' referring to this surah's blessings.",
      "Contains the famous principle: 'Indeed with hardship comes ease'.",
      "Known for its comforting message and promise of relief."
    ],
    context: "This Surah celebrates the spiritual preparation of the Prophet."
  },
  95: {
    number: 95,
    name: "التين",
    englishName: "At-Tin",
    revelationType: "Makki",
    numberOfAyahs: 8,
    meta: {
      number: 95,
      verses: 8,
      type: "Makki"
    },
    overview: "Surah At-Tin begins with oaths by the fig and olive, affirming human creation in the best stature and ultimate justice.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Fig' after the first oath.",
        "Addresses human dignity and ultimate accountability."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with oaths by fig, olive, Mount Sinai, and secure city.",
        "Affirms human creation in best stature then reduction to lowest.",
        "Emphasizes that Allah is the Most Just of judges."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah At-Tin, Allah will give him the reward of reading all the previous scriptures' (Al-Durr al-Manthur).",
      "Contains profound truth about human nature and destiny.",
      "Known for its comprehensive view of human spiritual journey."
    ],
    context: "This Surah affirms human dignity and divine justice."
  },
  96: {
    number: 96,
    name: "العلق",
    englishName: "Al-Alaq",
    revelationType: "Makki",
    numberOfAyahs: 19,
    meta: {
      number: 96,
      verses: 19,
      type: "Makki"
    },
    overview: "Surah Al-Alaq contains the very first revelation to Prophet Muhammad, commanding reading in the name of the Lord who created.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "The first five verses were the very first revelation in Cave Hira.",
        "Named 'The Clot' referring to early stage of human creation.",
        "Marks the beginning of prophethood and Islamic revelation."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Commands reading in the name of the Lord who created.",
        "Describes human creation from a clinging clot.",
        "Warns the one who prevents a servant from praying."
      ]
    },
    virtues: [
      "The first revelation that began the prophethood of Muhammad ﷺ.",
      "The Prophet said: 'It was the first thing revealed to me' (Bukhari).",
      "Contains the fundamental Islamic emphasis on knowledge."
    ],
    context: "This Surah marks the beginning of Quranic revelation and prophethood."
  },
  97: {
    number: 97,
    name: "القدر",
    englishName: "Al-Qadr",
    revelationType: "Makki",
    numberOfAyahs: 5,
    meta: {
      number: 97,
      verses: 5,
      type: "Makki"
    },
    overview: "Surah Al-Qadr describes the Night of Decree (Laylat al-Qadr) which is better than a thousand months in value and blessing.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed to inform about the value of Laylat al-Qadr.",
        "Named 'The Decree' referring to the night of divine decrees.",
        "Describes the most blessed night in Ramadan."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Reveals that Quran was sent down in Laylat al-Qadr.",
        "Describes the peace that prevails until dawn.",
        "Emphasizes the immense value of this special night."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Qadr, he will get the reward of fasting Ramadan and standing in prayer on Laylat al-Qadr' (Al-Durr al-Manthur).",
      "Reveals the most blessed night in Islamic calendar.",
      "Known for its description of angels descending with divine decrees."
    ],
    context: "This Surah reveals the immense value of Laylat al-Qadr."
  },
  98: {
    number: 98,
    name: "البينة",
    englishName: "Al-Bayyinah",
    revelationType: "Madani",
    numberOfAyahs: 8,
    meta: {
      number: 98,
      verses: 8,
      type: "Madani"
    },
    overview: "Surah Al-Bayyinah emphasizes that People of the Book weren't divided until after the clear proof came to them.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina concerning People of the Book.",
        "Named 'The Clear Proof' referring to Prophet Muhammad.",
        "Addresses the divisions among previous religious communities."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "States that People of Book weren't divided until clear proof came.",
        "Defines the true religion as worshiping Allah sincerely.",
        "Describes the rewards of righteous believers."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'If people knew what is in Surah Al-Bayyinah, they would leave everything to learn it' (Al-Durr al-Manthur).",
      "Contains the essential definition of pure monotheism.",
      "Known for its clear statement about religious divisions."
    ],
    context: "This Surah addresses the response of People of Book to Islam."
  },
  99: {
    number: 99,
    name: "الزلزلة",
    englishName: "Az-Zalzalah",
    revelationType: "Madani",
    numberOfAyahs: 8,
    meta: {
      number: 99,
      verses: 8,
      type: "Madani"
    },
    overview: "Surah Az-Zalzalah describes the earthquake of the Hour when earth reveals its burdens and people see the consequences of their deeds.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed in Medina according to majority opinion.",
        "Named 'The Earthquake' describing the earth's quaking on Judgment Day.",
        "Emphasizes complete accountability for even smallest deeds."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the earth shaking and throwing out its burdens.",
        "Reveals that earth will testify to all deeds done upon it.",
        "Affirms that even atom's weight of good or evil will be seen."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Az-Zalzalah, it is equivalent to half of the Quran for him' (Tirmidhi).",
      "Contains the comprehensive principle of complete accountability.",
      "Known for its powerful imagery of earth testifying against humans."
    ],
    context: "This Surah emphasizes complete accountability on Judgment Day."
  },
  100: {
    number: 100,
    name: "العاديات",
    englishName: "Al-Adiyat",
    revelationType: "Makki",
    numberOfAyahs: 11,
    meta: {
      number: 100,
      verses: 11,
      type: "Makki"
    },
    overview: "Surah Al-Adiyat begins with oaths by charging horses and describes human ingratitude despite clear knowledge.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Chargers' referring to war horses in battle.",
        "Addresses human nature of ingratitude and love for wealth."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Begins with powerful oaths by panting chargers.",
        "Describes the scene of horses in battle at dawn.",
        "Reveals that human knows what is in graves will be exposed."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Adiyat, he will get the reward of giving ten horses in charity for every breath they take' (Al-Durr al-Manthur).",
      "Contains powerful imagery and profound psychological insight.",
      "Known for its dramatic description and moral lesson."
    ],
    context: "This Surah uses powerful imagery to teach about ingratitude."
  },
  101: {
    number: 101,
    name: "القارعة",
    englishName: "Al-Qari'ah",
    revelationType: "Makki",
    numberOfAyahs: 11,
    meta: {
      number: 101,
      verses: 11,
      type: "Makki"
    },
    overview: "Surah Al-Qari'ah describes the stunning blow of the Hour and the weighing of deeds that determines eternal fate.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Striking Calamity' referring to Judgment Day.",
        "Addresses the ultimate reality that people ignore."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes the striking calamity that stuns people.",
        "Presents the scene of scattered moths and molten mountains.",
        "Contrasts those with heavy good deeds vs light evil deeds."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Qari'ah, Allah will secure him from the terror of the Day of Resurrection' (Al-Durr al-Manthur).",
      "Contains vivid imagery of Judgment Day's overwhelming nature.",
      "Known for its dramatic contrast between successful and doomed."
    ],
    context: "This Surah vividly portrays the overwhelming Day of Judgment."
  },
  102: {
    number: 102,
    name: "التكاثر",
    englishName: "At-Takathur",
    revelationType: "Makki",
    numberOfAyahs: 8,
    meta: {
      number: 102,
      verses: 8,
      type: "Makki"
    },
    overview: "Surah At-Takathur criticizes the competitive accumulation of wealth and distractions until visiting graves becomes reality.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning tribes competing in wealth and numbers.",
        "Named 'The Rivalry' referring to competition in worldly gains.",
        "Addresses the human tendency toward materialism."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Criticizes rivalry in worldly increase distracting from Hereafter.",
        "Warns that people will certainly see Hellfire.",
        "Emphasizes that certainty of knowledge will come on Judgment Day."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Surah At-Takathur is equivalent to one thousand verses' in its warning against materialism.",
      "Contains powerful criticism of worldly competition.",
      "Known for its direct address to human weakness for accumulation."
    ],
    context: "This Surah warns against materialism and worldly competition."
  },
  103: {
    number: 103,
    name: "العصر",
    englishName: "Al-Asr",
    revelationType: "Makki",
    numberOfAyahs: 3,
    meta: {
      number: 103,
      verses: 3,
      type: "Makki"
    },
    overview: "Surah Al-Asr declares that humanity is in loss except those with faith, good deeds, truth, and patience.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during early Meccan period.",
        "Named 'The Time' referring to the oath at beginning.",
        "Contains the most comprehensive definition of salvation."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Declares that all humanity is in state of loss.",
        "Provides the comprehensive formula for salvation.",
        "Includes four essential qualities for success."
      ]
    },
    virtues: [
      "Companions would never part without reciting Surah Al-Asr to each other.",
      "Imam Shafi'i said: 'If people reflected on this surah, it would suffice them'.",
      "Known for its comprehensive and concise guidance to salvation."
    ],
    context: "This Surah provides the essential formula for human success."
  },
  104: {
    number: 104,
    name: "الهمزة",
    englishName: "Al-Humazah",
    revelationType: "Makki",
    numberOfAyahs: 9,
    meta: {
      number: 104,
      verses: 9,
      type: "Makki"
    },
    overview: "Surah Al-Humazah condemns the slanderer and backbiter who amasses wealth thinking it will make him immortal.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning specific individuals who mocked Muslims.",
        "Named 'The Slanderer' referring to those who backbite and slander.",
        "Addresses the evil of backbiting and love for wealth."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Condemns the slanderer and backbiter who collects wealth.",
        "Warns of crushing fire that penetrates to the hearts.",
        "Exposes the illusion that wealth provides security."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Humazah, it will be a protection for him from backbiting and slander' (Al-Durr al-Manthur).",
      "Contains strong condemnation of social evils.",
      "Known for its powerful warning against backbiting and materialism."
    ],
    context: "This Surah condemns social evils and false security in wealth."
  },
  105: {
    number: 105,
    name: "الفيل",
    englishName: "Al-Fil",
    revelationType: "Makki",
    numberOfAyahs: 5,
    meta: {
      number: 105,
      verses: 5,
      type: "Makki"
    },
    overview: "Surah Al-Fil describes the miraculous destruction of the Army of the Elephant that came to destroy the Kaaba.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning Abraha's army with elephants (Year of Elephant).",
        "Named 'The Elephant' after the war elephants in the army.",
        "Describes the miraculous protection of Kaaba that Meccans witnessed."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes how Allah sent birds in flocks against the army.",
        "Stones struck them making them like eaten straw.",
        "Demonstrates Allah's protection of His sacred house."
      ]
    },
    virtues: [
      "The Prophet ﷺ was born in the Year of Elephant this surah describes.",
      "Demonstrates Allah's protection of Mecca and Kaaba.",
      "Known for its historical account of divine intervention."
    ],
    context: "This Surah describes Allah's protection of Mecca before Islam."
  },
  106: {
    number: 106,
    name: "قريش",
    englishName: "Quraysh",
    revelationType: "Makki",
    numberOfAyahs: 4,
    meta: {
      number: 106,
      verses: 4,
      type: "Makki"
    },
    overview: "Surah Quraysh reminds the Quraysh tribe of Allah's blessings of security and provision, calling them to worship Lord of this House.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed addressing the Quraysh tribe specifically.",
        "Named after the Prophet's tribe that guarded Kaaba.",
        "Reminds them of their privileged position and obligations."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Reminds Quraysh of their secure journeys in winter and summer.",
        "Calls them to worship Lord of this House (Kaaba).",
        "Connects their security and provision to worship of Allah."
      ]
    },
    virtues: [
      "Considered a continuation of the previous surah about Elephant.",
      "Connects material blessings with spiritual obligations.",
      "Known for its direct address to the Quraysh's privileges."
    ],
    context: "This Surah calls the Quraysh to recognize Allah's blessings."
  },
  107: {
    number: 107,
    name: "الماعون",
    englishName: "Al-Ma'un",
    revelationType: "Makki",
    numberOfAyahs: 7,
    meta: {
      number: 107,
      verses: 7,
      type: "Makki"
    },
    overview: "Surah Al-Ma'un describes the character of one who denies judgment and lists specific behaviors showing lack of true faith.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed concerning specific individuals in Mecca.",
        "Named 'The Small Kindnesses' referring to basic good deeds.",
        "Addresses the connection between faith and social behavior."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Describes one who denies the Judgment Day.",
        "Lists characteristics: repelling orphan, not feeding poor.",
        "Exposes those who pray only for show and refuse small kindnesses."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Ma'un, Allah will count him among the successful on the Day of Judgment' (Al-Durr al-Manthur).",
      "Contains practical tests for genuine faith.",
      "Known for its clear connection between belief and social ethics."
    ],
    context: "This Surah defines true faith through practical social behavior."
  },
  108: {
    number: 108,
    name: "الكوثر",
    englishName: "Al-Kawthar",
    revelationType: "Makki",
    numberOfAyahs: 3,
    meta: {
      number: 108,
      verses: 3,
      type: "Makki"
    },
    overview: "Surah Al-Kawthar gives the Prophet glad tidings of abundance and commands him to pray and sacrifice to his Lord alone.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when the Prophet was mocked for having no sons.",
        "Named 'The Abundance' referring to the river in Paradise.",
        "Provides comfort and honor to the Prophet."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Gives the Prophet the glad tidings of Al-Kawthar.",
        "Commands prayer and sacrifice purely for Allah.",
        "Declares that the criticizer is cut off from good."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Al-Kawthar is a river in Paradise whose banks are of gold' (Bukhari).",
      "The shortest surah in the Quran with profound meaning.",
      "Known for its comfort to the Prophet and declaration of his honor."
    ],
    context: "This Surah honored the Prophet against his detractors' mockery."
  },
  109: {
    number: 109,
    name: "الكافرون",
    englishName: "Al-Kafirun",
    revelationType: "Makki",
    numberOfAyahs: 6,
    meta: {
      number: 109,
      verses: 6,
      type: "Makki"
    },
    overview: "Surah Al-Kafirun establishes the absolute distinction between Islamic monotheism and polytheism, allowing no compromise in worship.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when Quraysh offered temporary compromise in worship.",
        "Named 'The Disbelievers' as it addresses them directly.",
        "Establishes the non-negotiable principle of pure monotheism."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Declares complete disassociation from polytheistic worship.",
        "Establishes 'to you your religion, to me my religion'.",
        "Emphasizes that worship is exclusively for Allah alone."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'Reciting Surah Al-Kafirun is equivalent to reciting one-fourth of the Quran' (Tirmidhi).",
      "The Prophet frequently recited it in sunnah prayers of Fajr.",
      "Known for its clear declaration of Islamic monotheism."
    ],
    context: "This Surah established the non-negotiable principle of tawhid."
  },
  110: {
    number: 110,
    name: "النصر",
    englishName: "An-Nasr",
    revelationType: "Madani",
    numberOfAyahs: 3,
    meta: {
      number: 110,
      verses: 3,
      type: "Madani"
    },
    overview: "Surah An-Nasr prophesies the help of Allah and people entering Islam in crowds, signaling the completion of the Prophet's mission.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed during the Farewell Pilgrimage, near the end of Prophet's life.",
        "Named 'The Divine Support' referring to Allah's help.",
        "Signaled to the Prophet that his mission was nearing completion."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Prophesies Allah's help and people entering Islam in multitudes.",
        "Commands glorification of Allah and seeking His forgiveness.",
        "Indicates the approaching end of the Prophet's mission."
      ]
    },
    virtues: [
      "Umar understood from this surah that the Prophet's life was ending.",
      "The Prophet increased in seeking forgiveness after its revelation.",
      "Known as the 'farewell surah' signaling completion of mission."
    ],
    context: "This Surah signaled the completion of the prophetic mission."
  },
  111: {
    number: 111,
    name: "المسد",
    englishName: "Al-Masad",
    revelationType: "Makki",
    numberOfAyahs: 5,
    meta: {
      number: 111,
      verses: 5,
      type: "Makki"
    },
    overview: "Surah Al-Masad condemns Abu Lahab and his wife for their hostility to Islam, prophesying their entry into blazing fire.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when Abu Lahab openly opposed the Prophet's message.",
        "Named 'The Palm Fiber' referring to the rope in Hell.",
        "Specifically names Abu Lahab, the Prophet's uncle who opposed him."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Declares the destruction of Abu Lahab's hands and himself.",
        "Condemns his wife who carried wood-thorns to harm Muslims.",
        "Prophesies their eternal punishment in flaming fire."
      ]
    },
    virtues: [
      "Contains a specific prophecy that was fulfilled during Abu Lahab's lifetime.",
      "Demonstrates the Quran's divine knowledge of future events.",
      "Known for its specific address to the Prophet's strongest opponent."
    ],
    context: "This Surah condemned the Prophet's most hostile relative."
  },
  112: {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    revelationType: "Makki",
    numberOfAyahs: 4,
    meta: {
      number: 112,
      verses: 4,
      type: "Makki"
    },
    overview: "Surah Al-Ikhlas is the pure declaration of Allah's oneness and uniqueness, equivalent to one-third of the Quran in value.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when pagans asked about Allah's ancestry.",
        "Named 'The Sincerity' for its pure declaration of tawhid.",
        "Contains the most comprehensive definition of divine oneness."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Declares Allah as the One and Only.",
        "Affirms that He begets not nor was He begotten.",
        "States that none is comparable to Him."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'By the One in Whose Hand is my soul, it is equivalent to one-third of the Quran' (Bukhari).",
      "Reciting it three times equals reciting the whole Quran.",
      "Known as the foundation of Islamic belief in Allah's oneness."
    ],
    context: "This Surah contains the pure essence of Islamic monotheism."
  },
  113: {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    revelationType: "Makki",
    numberOfAyahs: 5,
    meta: {
      number: 113,
      verses: 5,
      type: "Makki"
    },
    overview: "Surah Al-Falaq seeks protection from various evils including darkness, magic, and envy, forming one of the protective surahs.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed when the Prophet was affected by magic.",
        "Named 'The Daybreak' after seeking refuge by the daybreak.",
        "One of the last two surahs revealed for protection."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Seeks refuge with Lord of the daybreak.",
        "Protection from evil of creation, darkness, knots-blowers.",
        "Protection from envier when he envies."
      ]
    },
    virtues: [
      "The Prophet ﷺ said: 'No one ever sought refuge with anything like these two surahs (Al-Falaq and An-Nas)' (Abu Dawud).",
      "The Prophet recited them for protection and recommended for ruqyah.",
      "Known as 'Al-Mu'awwidhatain' - the two protectors."
    ],
    context: "This Surah provides comprehensive protection from various evils."
  },
  114: {
    number: 114,
    name: "الناس",
    englishName: "An-Nas",
    revelationType: "Makki",
    numberOfAyahs: 6,
    meta: {
      number: 114,
      verses: 6,
      type: "Makki"
    },
    overview: "Surah An-Nas, the final chapter of the Quran, seeks protection from the whisperings of Satan and evil jinn and humans.",
    historicalContext: {
      title: "Historical Context",
      content: [
        "Revealed as one of the last surahs for spiritual protection.",
        "Named 'The Mankind' as it seeks protection for humans.",
        "Completes the Quran with comprehensive spiritual protection."
      ]
    },
    significance: {
      title: "Significance",
      content: [
        "Seeks refuge with Lord of mankind.",
        "Protection from whisperer who withdraws.",
        "Protection from jinn and humans who whisper evil."
      ]
    },
    virtues: [
      "The final surah of the Quran, completing the divine revelation.",
      "The Prophet ﷺ recited it with Al-Falaq for protection before sleep.",
      "Known as the comprehensive protection from all evil whisperings."
    ],
    context: "This Surah completes the Quran with comprehensive spiritual protection."
  }
};

export const getSurahIntroduction = (number: number): SurahIntroduction | undefined => {
  return surahIntroductions[number];
};

export default surahIntroductions;