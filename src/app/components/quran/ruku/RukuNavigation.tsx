
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
      router.push(`/quran/ruku/${currentRuku + 1}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrev = () => {
    if (currentRuku > 1) {
      router.push(`/quran/ruku/${currentRuku - 1}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        .ruku-navigation {
          background-color: #f0f8ff;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          position: relative;
          margin: 32px auto;
          max-width: 600px;
        }
        .ruku-navigation-title {
          position: absolute;
          top: -18px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e56ff;
          text-align: center;
          width: 100%;
        }
        .ruku-navigation-counter {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
        }
        .ruku-navigation button {
          background-color: #22c55e;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 8px 18px;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .ruku-navigation button:hover {
          background-color: #16a34a;
          transform: translateY(-1px);
        }
        .ruku-navigation button:active {
          transform: translateY(0);
        }
        .ruku-navigation button:disabled {
          background-color: #e5e7eb;
          color: #888;
          cursor: not-allowed;
        }
        @media (max-width: 480px) {
          .ruku-navigation {
            flex-direction: column;
            gap: 12px;
          }
          .ruku-navigation button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
      <div className="ruku-navigation">
        <div className="ruku-navigation-title">Ruku Navigation</div>
        <button
          onClick={goToPrev}
          disabled={currentRuku === 1}
        >
          ← Previous Ruku
        </button>
        <span className="ruku-navigation-counter">
          Ruku {currentRuku} of {totalRukus}
        </span>
        <button
          onClick={goToNext}
          disabled={currentRuku === totalRukus}
        >
          Next Ruku →
        </button>
      </div>
    </>
  );
}
