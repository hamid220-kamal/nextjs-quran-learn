export interface Dua {
  id: number;
  name: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reference: string;
  category: string;
  benefits?: string[];
  occasions?: string[];
  audioUrl?: string;
}

export const duas: Dua[] = [
  {
    id: 1,
    name: "Dua for Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْماً",
    translation: "My Lord, increase me in knowledge",
    transliteration: "Rabbi zidni ilma",
    reference: "Surah Ta-Ha, 20:114",
    category: "Knowledge",
    benefits: [
      "Increases wisdom and understanding",
      "Helps in seeking beneficial knowledge",
      "Enhances memory and comprehension"
    ],
    occasions: [
      "Before studying",
      "When seeking knowledge",
      "During research"
    ]
  },
  {
    id: 2,
    name: "Dua for Forgiveness",
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا",
    translation: "Our Lord, forgive us our sins and our transgressions in our task",
    transliteration: "Rabbana-ghfir lana dhunubana wa israfana fi amrina",
    reference: "Surah Al-Imran, 3:147",
    category: "Forgiveness",
    benefits: [
      "Cleanses the soul",
      "Brings peace to the heart",
      "Removes burden of sins"
    ],
    occasions: [
      "After prayers",
      "During night prayer",
      "When feeling remorseful"
    ]
  },
  {
    id: 3,
    name: "Dua for Parents",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيراً",
    translation: "My Lord, have mercy upon them as they brought me up [when I was] small",
    transliteration: "Rabbi-rhamhuma kama rabbayani saghira",
    reference: "Surah Al-Isra, 17:24",
    category: "Family",
    benefits: [
      "Shows gratitude to parents",
      "Strengthens family bonds",
      "Brings mercy upon parents"
    ],
    occasions: [
      "After daily prayers",
      "When thinking of parents",
      "During special occasions"
    ]
  },
  {
    id: 4,
    name: "Dua for Protection",
    arabic: "رَبِّ إِنِّي أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ",
    translation: "My Lord, I seek refuge in You from the incitements of the devils",
    transliteration: "Rabbi inni a'udhu bika min hamazati-sh shayatin",
    reference: "Surah Al-Mu'minun, 23:97",
    category: "Protection",
    benefits: [
      "Protection from evil",
      "Spiritual safety",
      "Mental peace"
    ],
    occasions: [
      "Morning and evening",
      "Before sleep",
      "When feeling vulnerable"
    ]
  },
  {
    id: 5,
    name: "Dua for Guidance",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
    translation: "Our Lord, let not our hearts deviate after You have guided us",
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana",
    reference: "Surah Al-Imran, 3:8",
    category: "Guidance",
    benefits: [
      "Steadfastness in faith",
      "Protection from misguidance",
      "Clarity in decisions"
    ],
    occasions: [
      "During difficult times",
      "When making decisions",
      "After prayers"
    ]
  },
  {
    id: 6,
    name: "Dua for Success",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "My Lord, expand for me my breast [with assurance] and ease for me my task",
    transliteration: "Rabbi-shrah li sadri wa yassir li amri",
    reference: "Surah Ta-Ha, 20:25-26",
    category: "Success",
    benefits: [
      "Removal of difficulties",
      "Ease in tasks",
      "Mental clarity"
    ],
    occasions: [
      "Before important tasks",
      "During challenges",
      "When feeling overwhelmed"
    ]
  },
  {
    id: 7,
    name: "Dua for Entering Home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا",
    translation: "In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust",
    transliteration: "Bismillahi walajna wa bismillahi kharajna wa'ala rabbina tawakkalna",
    reference: "Abu Dawud",
    category: "Daily Life",
    benefits: [
      "Protection for home",
      "Blessing in household",
      "Safety for family"
    ],
    occasions: [
      "When entering home",
      "When leaving home",
      "Moving to new house"
    ]
  },
  {
    id: 8,
    name: "Dua for Relief from Anxiety",
    arabic: "لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
    reference: "Surah Al-Anbya, 21:87",
    category: "Mental Health",
    benefits: [
      "Relief from distress",
      "Emotional healing",
      "Peace of mind"
    ],
    occasions: [
      "During anxiety",
      "Times of distress",
      "When feeling overwhelmed"
    ]
  },
  {
    id: 9,
    name: "Dua for Marriage",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil muttaqina imama",
    reference: "Surah Al-Furqan, 25:74",
    category: "Family",
    benefits: [
      "Blessed marriage",
      "Righteous offspring",
      "Family harmony"
    ],
    occasions: [
      "For marriage",
      "Family gatherings",
      "When seeking spouse"
    ]
  },
  {
    id: 10,
    name: "Dua for Rizq (Provision)",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقًا طَيِّبًا، وَعِلْمًا نَافِعًا، وَعَمَلًا مُتَقَبَّلًا",
    translation: "O Allah, I ask You for good provision, beneficial knowledge, and accepted deeds",
    transliteration: "Allahumma inni as'aluka rizqan tayyiban, wa 'ilman nafi'an, wa 'amalan mutaqabbalan",
    reference: "Ibn Majah",
    category: "Provision",
    benefits: [
      "Increased sustenance",
      "Blessed earnings",
      "Financial stability"
    ],
    occasions: [
      "Morning and evening",
      "Before work",
      "During financial difficulty"
    ]
  }
];