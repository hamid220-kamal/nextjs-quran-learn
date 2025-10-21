import { Metadata } from 'next';
import JuzDataDemo from '../../../components/quran/JuzDataDemo';

export const metadata: Metadata = {
  title: 'Juz Data Demo - Quran Learn',
  description: 'Demonstration of enhanced Juz data fetching from AlQuran.cloud API',
};

export default function JuzDataDemoPage() {
  return (
    <div className="container">
      <JuzDataDemo />
    </div>
  );
}