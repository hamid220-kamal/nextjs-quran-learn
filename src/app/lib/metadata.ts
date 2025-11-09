import { Metadata } from 'next';

export const generateMetadata = (page: string): Metadata => {
  const baseTitle = 'QuranicLearn';
  const basePath = 'https://quraniclearn.com';

  const pages = {
    home: {
      title: `${baseTitle} - Learn the Noble Quran | Interactive Quranic Education`,
      description: 'Embark on a transformative journey with the Holy Quran through our comprehensive learning platform.',
      path: '/',
    },
    quran: {
      title: `${baseTitle} - Read and Study the Holy Quran`,
      description: 'Read the Holy Quran with translations, tafsir, and audio recitations.',
      path: '/quran',
    },
    player: {
      title: `${baseTitle} - Quran Audio Player with Translations`,
      description: 'Listen to beautiful Quran recitations with multiple translations and reciters.',
      path: '/quran-player',
    },
    courses: {
      title: `${baseTitle} - Structured Quran Learning Courses`,
      description: 'Learn Quran through structured courses designed for all levels.',
      path: '/courses',
    },
    hifz: {
      title: `${baseTitle} - Quran Memorization Program`,
      description: 'Memorize the Quran with our structured Hifz program and expert guidance.',
      path: '/hifz',
    },
    duas: {
      title: `${baseTitle} - Collection of Quranic Duas`,
      description: 'Comprehensive collection of authentic duas from the Holy Quran with translations.',
      path: '/duas',
    },
    community: {
      title: `${baseTitle} - Join Our Quran Learning Community`,
      description: 'Connect with fellow learners, share insights, and grow together in your Quranic journey.',
      path: '/community',
    },
  };

  const pageData = pages[page as keyof typeof pages];

  return {
    title: pageData.title,
    description: pageData.description,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: `${basePath}${pageData.path}`,
      siteName: baseTitle,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.description,
    },
    alternates: {
      canonical: `${basePath}${pageData.path}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};