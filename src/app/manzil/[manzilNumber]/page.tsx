"use client";
import { Metadata } from 'next';
import Footer from '../../components/Footer';
import * as React from 'react';
import ManzilViewer from './ManzilViewer';
import Navbar from '../../../components/Navbar/Navbar';
import { getManzilData } from '../../../utils/quranSectionApi';
import { toNumber } from '../../../types/app';
import './ManzilViewer.css';
import './manzil-header.css';
import './surah-header.css';
import './surah-controls.css';
import './verse-display.css';
import './retry-button.css';
import './last-page.css';

type ManzilParams = {
  manzilNumber: string;
}

interface PageProps {
  params: ManzilParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Generate metadata for the page
// ...existing code...

export default function ManzilPage({ params }: PageProps) {
  const [manzilNumber, setManzilNumber] = React.useState<number | null>(null);
  React.useEffect(() => {
    (async () => {
      const awaitedParams = await params;
      setManzilNumber(toNumber(awaitedParams.manzilNumber));
    })();
  }, [params]);
  
  if (manzilNumber === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="manzil-page-container">
      <Navbar />
      <main>
        <ManzilViewer manzilNumber={manzilNumber} />
      </main>
    </div>
  );
}