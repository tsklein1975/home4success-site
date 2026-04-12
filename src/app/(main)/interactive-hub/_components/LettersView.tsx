"use client";

import React, { useState } from 'react';
import { LetterData } from '../_data/lettersData';
import TracingEngine from './TracingEngine';

interface LettersViewProps {
  letters: LetterData[];
  title?: string;
  lang?: 'he' | 'en';
  onBack?: () => void;
}

export default function LettersView({
  letters,
  title = "אוֹתִיּוֹת",
  lang = 'he',
  onBack,
}: LettersViewProps) {
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);

  if (selectedLetter) {
    return (
      <TracingEngine
        letter={selectedLetter}
        lang={lang}
        onClose={() => setSelectedLetter(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <button onClick={onBack} className="text-[#8aab9f] font-bold mb-4 block hover:underline">
        {lang === 'he' ? '← חֲזָרָה לַמִּשְׂחָקִים' : '← Back to games'}
      </button>
      <h2 className="text-3xl font-bold text-[#2d3748] mb-2 text-center">{title}</h2>
      <p className="text-[#4a5568] text-center mb-8 text-sm">
        {lang === 'he' ? 'בַּחֲרוּ אוֹת כְּדֵי לְהַתְחִיל לַעֲקֹב' : 'Select a letter to start tracing'}
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {letters.map(letter => (
          <button
            key={letter.id}
            onClick={() => setSelectedLetter(letter)}
            className="group bg-white hover:bg-[#eef5f3] rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#8aab9f]"
          >
            <span className="text-3xl sm:text-4xl font-bold text-[#2d3748] mb-1 group-hover:text-[#8aab9f] group-hover:scale-110 transition-all">
              {letter.char}
            </span>
            {letter.name !== letter.char && (
              <span className="text-[10px] text-[#4a5568] leading-tight text-center">
                {letter.name}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
