import { Metadata } from 'next';
import QuranicLearnHome from './home/Home';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'QuranicLearn - Home',
  description: 'Learn the Noble Quran with interactive lessons, audio recitations, and guided study plans.'
};

export default function RootPage() {
  return (
    <>
      <QuranicLearnHome />
      <Footer />
    </>
  );
}