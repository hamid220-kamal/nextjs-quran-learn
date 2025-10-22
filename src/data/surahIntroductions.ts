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
  }
};

export const getSurahIntroduction = (number: number): SurahIntroduction | undefined => {
  return surahIntroductions[number];
};

export default surahIntroductions;