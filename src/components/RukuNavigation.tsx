"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface RukuNavigationProps {
  currentRuku: number;
  totalRukus: number;
}

export default function RukuNavigation({ currentRuku, totalRukus }: RukuNavigationProps) {
  const router = useRouter();

  const goToNext = () => {
    if (currentRuku < totalRukus) {
      router.push(`/ruku/${currentRuku + 1}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrev = () => {
    if (currentRuku > 1) {
      router.push(`/ruku/${currentRuku - 1}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm py-4 px-6 my-6">
      <div className="flex flex-wrap items-center justify-between max-w-4xl mx-auto gap-4">
        <button
          onClick={goToPrev}
          disabled={currentRuku === 1}
          className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Previous Ruku
        </button>

        <span className="text-slate-700 font-semibold text-sm">
          Ruku {currentRuku} of {totalRukus}
        </span>

        <button
          onClick={goToNext}
          disabled={currentRuku === totalRukus}
          className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
        >
          Next Ruku →
        </button>
      </div>
    </div>
  );
}
