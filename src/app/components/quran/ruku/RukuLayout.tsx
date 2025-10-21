import Head from 'next/head';
import { ReactNode } from 'react';

interface RukuLayoutProps {
  rukuNumber: number;
  children: ReactNode;
  edition: string;
  description?: string;
}

const RukuLayout = ({ rukuNumber, children, edition, description }: RukuLayoutProps) => {
  const pageTitle = `Quran Ruku ${rukuNumber} | Read & Listen Online`;
  const metaDescription = description || `Read Ruku ${rukuNumber} of the Quran in Arabic and English with verse-by-verse audio.`;
  const canonicalUrl = `https://yourdomain.com/quran/ruku/${rukuNumber}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
  <main className="max-w-xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
};

export default RukuLayout;
