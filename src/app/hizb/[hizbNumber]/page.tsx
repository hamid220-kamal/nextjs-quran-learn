
// --- SERVER COMPONENT ---
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../components/Footer';

const TRANSLATION_EDITION = "en.asad";
const ARABIC_EDITION = "quran-uthmani";
const AUDIO_EDITION = "ar.alafasy";

export async function generateStaticParams() {
  return Array.from({ length: 60 }, (_, i) => ({ hizbNumber: String(i + 1) }));
}

async function fetchQuarter(quarter, edition) {
  const res = await fetch(`https://api.alquran.cloud/v1/hizbQuarter/${quarter}/${edition}`);
  if (!res.ok) throw new Error(`Failed to fetch hizbQuarter ${quarter} ${edition}`);
  const json = await res.json();
  return json.data?.ayahs ?? [];
}

export default async function HizbPage({ params }) {
  const hizbId = Number(params.hizbNumber);
  const firstQuarter = (hizbId - 1) * 4 + 1;
  const quarters = [firstQuarter, firstQuarter + 1, firstQuarter + 2, firstQuarter + 3];


  // Ayah type for type safety
  type Ayah = {
    number: number;
    surah: any;
    text: string;
    translation?: string | null;
    audio?: string | null;
  };

  let arabic: Ayah[] = [], translation: Ayah[] = [], audio: Ayah[] = [];
  let error: string | null = null;
  try {
    const [arabicArrays, translationArrays, audioArrays] = await Promise.all([
      Promise.all(quarters.map((q) => fetchQuarter(q, ARABIC_EDITION))),
      Promise.all(quarters.map((q) => fetchQuarter(q, TRANSLATION_EDITION))),
      Promise.all(quarters.map((q) => fetchQuarter(q, AUDIO_EDITION))),
    ]);
    arabic = arabicArrays.flat();
    translation = translationArrays.flat();
    audio = audioArrays.flat();
  } catch (e: any) {
    error = e.message || "Failed to load Hizb data.";
  }

  const audioMap = new Map<number, any>(audio.map((a) => [a.number, a]));
  const transMap = new Map<number, any>(translation.map((t) => [t.number, t]));
  const merged: Ayah[] = arabic.map((a) => {
    const num = a.number;
    const translation = transMap.get(num)?.text;
    return {
      number: num,
      surah: a.surah,
      text: a.text,
      translation: typeof translation === "string" ? translation : undefined,
      audio: audioMap.get(num)?.audio ?? undefined,
    };
  });

  // Pass data to client component
  const HizbViewerClient = (await import("./HizbViewerClient")).default;
  return <HizbViewerClient hizb={hizbId} ayahs={merged} />;
}