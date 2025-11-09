import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Duas & Supplications - Learn Quran',
  description: 'Collection of authentic duas and supplications from the Quran and Sunnah with translations and transliterations.',
  keywords: ['duas', 'supplications', 'islamic prayers', 'quran', 'sunnah', 'dhikr'],
  openGraph: {
    title: 'Duas & Supplications - Learn Quran',
    description: 'Collection of authentic duas and supplications from the Quran and Sunnah.',
    type: 'website',
  },
};

export default function DuaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}