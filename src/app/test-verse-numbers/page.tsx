'use client';

/**
 * Test script to verify the absolute verse number calculation works correctly
 */


import { getAbsoluteVerseNumber } from "../../utils/quranVerseMapping";
import Footer from '../../components/Footer';

// Test a few well-known verses
const testCases = [
  { surah: 1, ayah: 1, expected: 1 }, // First verse of the Quran (Al-Fatiha)
  { surah: 1, ayah: 7, expected: 7 }, // Last verse of Al-Fatiha
  { surah: 2, ayah: 1, expected: 8 }, // First verse of Al-Baqarah
  { surah: 5, ayah: 2, expected: 683 }, // The problematic verse we're fixing
  { surah: 114, ayah: 6, expected: 6236 } // Last verse of the Quran
];

  const results = testCases.map(test => {
    try {
      const calculated = getAbsoluteVerseNumber(test.surah, test.ayah);
      const passed = calculated === test.expected;
      return {
        ...test,
        calculated,
        passed,
        error: null
      };
    } catch (error) {
      return {
        ...test,
        calculated: null,
        passed: false,
        error: error.message
      };
    }
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
  // ...existing code...
  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        {/* ...existing content... */}
      </div>
      <Footer />
    </>
  );
      <h1 className="text-2xl font-bold mb-4">Verse Number Calculation Test</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p>This page tests the accuracy of the absolute verse number calculation used for Quran audio URLs.</p>
      </div>
      
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Surah</th>
            <th className="border p-2">Ayah</th>
            <th className="border p-2">Expected</th>
            <th className="border p-2">Calculated</th>
            <th className="border p-2">Result</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className={result.passed ? "bg-green-50" : "bg-red-50"}>
              <td className="border p-2">{result.surah}</td>
              <td className="border p-2">{result.ayah}</td>
              <td className="border p-2">{result.expected}</td>
              <td className="border p-2">{result.calculated || "Error"}</td>
              <td className="border p-2">
                {result.passed ? (
                  <span className="text-green-600">✓ Passed</span>
                ) : (
                  <span className="text-red-600">✗ Failed</span>
                )}
                {result.error && <div className="text-xs text-red-500">{result.error}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2 className="text-xl font-bold mt-8 mb-4">Audio URLs Test</h2>
      <div className="space-y-6">
        {testCases.map((test, index) => (
          <div key={index} className="bg-white p-4 rounded border">
            <h3 className="font-bold">Surah {test.surah}, Ayah {test.ayah}</h3>
            <div className="mt-2 space-y-2">
              {(() => {
                try {
                  const absoluteNumber = getAbsoluteVerseNumber(test.surah, test.ayah);
                  const paddedSurah = test.surah.toString().padStart(3, '0');
                  const paddedAyah = test.ayah.toString().padStart(3, '0');
                  
                  return (
                    <>
                      <div>
                        <strong>Islamic Network (Absolute):</strong>
                        <div className="text-sm text-blue-600 break-all">
                          https://cdn.islamic.network/quran/audio/128/ar.alafasy/{absoluteNumber}.mp3
                        </div>
                        <audio controls src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${absoluteNumber}.mp3`} className="mt-1"></audio>
                      </div>
                      
                      <div>
                        <strong>EveryAyah Format:</strong>
                        <div className="text-sm text-blue-600 break-all">
                          https://www.everyayah.com/data/Alafasy_128kbps/{paddedSurah}{paddedAyah}.mp3
                        </div>
                        <audio controls src={`https://www.everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`} className="mt-1"></audio>
                      </div>
                    </>
                  );
                } catch (error) {
                  return <div className="text-red-500">Error: {error.message}</div>;
                }
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}