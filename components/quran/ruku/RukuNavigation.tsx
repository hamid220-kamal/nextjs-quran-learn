import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface RukuNavigationProps {
  currentRuku: number;
  totalRukus?: number;
}

const RUKU_MIN = 1;
const RUKU_MAX = 556;

const RukuNavigation = ({ currentRuku, totalRukus = RUKU_MAX }: RukuNavigationProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(currentRuku.toString());

  const goToRuku = (ruku: number) => {
    if (ruku >= RUKU_MIN && ruku <= totalRukus) {
      router.push(`/quran/ruku/${ruku}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ruku = parseInt(inputValue, 10);
    if (!isNaN(ruku)) goToRuku(ruku);
  };

  return (
    <nav className="flex items-center justify-between my-4 gap-2">
      <Link href={`/quran/ruku/${Math.max(currentRuku - 1, RUKU_MIN)}`}
        className={`btn px-3 py-1 rounded ${currentRuku === RUKU_MIN ? 'opacity-50 pointer-events-none' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-disabled={currentRuku === RUKU_MIN}
      >
        Previous
      </Link>
      <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
        <label htmlFor="ruku-input" className="sr-only">Go to Ruku</label>
        <input
          id="ruku-input"
          type="number"
          min={RUKU_MIN}
          max={RUKU_MAX}
          value={inputValue}
          onChange={handleInputChange}
          className="w-20 px-2 py-1 border rounded text-center"
        />
        <button type="submit" className="btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Go</button>
      </form>
      <Link href={`/quran/ruku/${Math.min(currentRuku + 1, RUKU_MAX)}`}
        className={`btn px-3 py-1 rounded ${currentRuku === RUKU_MAX ? 'opacity-50 pointer-events-none' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-disabled={currentRuku === RUKU_MAX}
      >
        Next
      </Link>
    </nav>
  );
};

export default RukuNavigation;
