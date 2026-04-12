"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  interactiveCatalog,
  SubjectType,
  GradeType,
  GameDefinition,
} from '../_data/curriculum/gameCatalog';

import LettersView from './LettersView';
import MultipleChoiceEngine from './engines/MultipleChoiceEngine';
import MathEngine from './engines/MathEngine';
import MemoryEngine from './engines/MemoryEngine';
import OrderingEngine from './engines/OrderingEngine';
import ReadingEngine from './engines/ReadingEngine';
import WordScrambleGame from '../../../../components/interactive/WordScrambleGame';
import NotebookTracingGame from '../../../../components/interactive/NotebookTracingGame';
import AlphabetOrderGame from '../../../../components/interactive/AlphabetOrderGame';
import SortingEngine from './engines/SortingEngine';
import TypingEngine from './engines/TypingEngine';
import MultiSelectEngine from './engines/MultiSelectEngine';
import InlineSelectEngine from './engines/InlineSelectEngine';
import ClockEngine from './engines/ClockEngine';
import MathWordEngine from './engines/MathWordEngine';
import { hebrewLetters, englishLetters } from '../_data/lettersData';

// ─── DATA ──────────────────────────────────────────────────────────────────
const SUBJECTS: {
  id: SubjectType;
  he: string;       // Hebrew label (always shown)
  icon: string;
  bg: string;       // inactive background
  active: string;   // active text / border color
  activeBg: string; // active pill background
}[] = [
  { id: 'hebrew',  he: 'עִבְרִית',   icon: 'א', bg: '#f0f8f5', active: '#5e9e8c', activeBg: '#5e9e8c' },
  { id: 'english', he: 'אַנְגְּלִית',  icon: 'A', bg: '#fdf3ee', active: '#d4784a', activeBg: '#d4784a' },
  { id: 'math',    he: 'מָתֶמָטִיקָה', icon: '÷', bg: '#f2eefb', active: '#8a64c8', activeBg: '#8a64c8' },
];

const GRADE_LABELS: Record<GradeType, string> = {
  1: 'כִּתָּה א׳', 2: 'כִּתָּה ב׳', 3: 'כִּתָּה ג׳',
  4: 'כִּתָּה ד׳', 5: 'כִּתָּה ה׳', 6: 'כִּתָּה ו׳',
};

const GRADES: GradeType[] = [1, 2, 3, 4, 5, 6];

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function LearningHub() {
  const searchParams = useSearchParams();
  const showAll = searchParams.get('showAll') === 'true';

  const [subject, setSubject] = useState<SubjectType>('hebrew');
  const [grade,   setGrade]   = useState<GradeType | null>(null);
  const [game,    setGame]    = useState<GameDefinition | null>(null);

  const isRestricted = (g: number) => !showAll && g > 2;

  const s = SUBJECTS.find(x => x.id === subject)!;

  // Navigation helpers
  const changeSubject = (next: SubjectType) => { setSubject(next); setGrade(null); setGame(null); };
  const openGrade     = (g: GradeType)       => { setGrade(g); setGame(null); };
  const openGame      = (g: GameDefinition)  => setGame(g);
  const backToSubject = ()                   => { setGrade(null); setGame(null); };
  const backToGames   = ()                   => setGame(null);

  const goBack = () => {
    if (game)  { backToGames();   return; }
    if (grade) { backToSubject(); return; }
  };

  const canGoBack = !!(game || grade);

  // ── SHARED TOP NAV BAR ─────────────────────────────────────────────────
  // RTL: children render right → left
  //   1st child (rightmost) = Subject tabs
  //   2nd child (center, flex-1) = Breadcrumbs
  //   3rd child (leftmost) = Back button
  const TopBar = () => (
    <header
      className="sticky top-[128px] z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-5 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">

        {/* ① SUBJECT TABS — rightmost */}
        <nav
          className="flex gap-0.5 shrink-0 bg-gray-100 p-1 rounded-2xl"
          aria-label="תְּחוּמֵי לִמּוּד"
        >
          {SUBJECTS.map(sub => {
            const active = sub.id === subject;
            return (
              <button
                key={sub.id}
                onClick={() => changeSubject(sub.id)}
                aria-current={active ? 'page' : undefined}
                style={active ? { backgroundColor: sub.activeBg, color: '#fff' } : {}}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm leading-none transition-all whitespace-nowrap ${
                  active ? 'shadow-md' : 'text-[#4a5568] hover:bg-white'
                }`}
              >
                <span className="text-base">{sub.icon}</span>
                <span className="hidden sm:inline">{sub.he}</span>
              </button>
            );
          })}
        </nav>

        {/* ② BREADCRUMBS — center, flex-1, scrollable */}
        <ol
          className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto no-scrollbar"
          dir="rtl"
          aria-label="מִקּוּם נוֹכְחִי"
        >
          {/* Level 0: subject (always shown, clickable when deeper) */}
          <li className="flex items-center gap-1 shrink-0">
            <button
              onClick={backToSubject}
              className={`font-bold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                grade ? 'text-[#8aab9f] hover:text-[#5e8e7e]' : 'text-[#2d3748] cursor-default'
              }`}
              disabled={!grade}
            >
              {s.he}
            </button>
          </li>

          {/* Level 1: grade */}
          {grade && (
            <>
              <li className="text-gray-300 text-xs shrink-0" aria-hidden>/</li>
              <li className="flex items-center gap-1 shrink-0">
                <button
                  onClick={backToGames}
                  className={`font-bold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                    game ? 'text-[#8aab9f] hover:text-[#5e8e7e]' : 'text-[#2d3748] cursor-default'
                  }`}
                  disabled={!game}
                >
                  {GRADE_LABELS[grade]}
                </button>
              </li>
            </>
          )}

          {/* Level 2: game */}
          {game && (
            <>
              <li className="text-gray-300 text-xs shrink-0" aria-hidden>/</li>
              <li className="shrink-0 max-w-[120px] sm:max-w-[220px] overflow-hidden">
                <span className="font-black text-[#2d3748] text-xs sm:text-sm block truncate" title={game.title}>
                  {game.title}
                </span>
              </li>
            </>
          )}
        </ol>

        {/* ③ BACK BUTTON — leftmost */}
        <button
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="חֲזֹר לְאָחוֹר"
          className={`shrink-0 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            canGoBack
              ? 'text-[#5e9e8c] hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-200 cursor-default'
          }`}
        >
          <span className="text-base leading-none">←</span>
          <span>חֲזֹר</span>
        </button>
      </div>
    </header>
  );

  // ── SCREEN A: GRADE SELECTION ───────────────────────────────────────────
  if (!grade) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafaf7]" dir="rtl">
        <TopBar />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">

          {/* Subject hero */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl font-black mb-4 shadow-sm"
              style={{ backgroundColor: s.bg, color: s.active }}
            >
              {s.icon}
            </div>
            <h1 className="text-3xl font-black text-[#2d3748]">{s.he}</h1>
            <p className="text-[#718096] mt-2 text-lg font-medium">לְאֵיזוֹ כִּתָּה תִּרְצוּ לְהִכָּנֵס?</p>
          </div>

          {/* Grade grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
            {GRADES.map(g => {
              const restricted = isRestricted(g);
              
              return (
                <button
                  key={g}
                  onClick={() => !restricted && openGrade(g)}
                  className={`bg-white border-4 border-transparent hover:-translate-y-1 text-[#2d3748] p-5 sm:p-7 rounded-3xl shadow-md hover:shadow-xl transition-all flex flex-col items-center group relative ${restricted ? 'opacity-80 grayscale-[0.5] cursor-not-allowed' : ''}`}
                  style={{ '--hover-c': s.active } as React.CSSProperties}
                  onMouseEnter={e => !restricted && (e.currentTarget.style.borderColor = s.active)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                >
                  {/* Status Badge */}
                  {restricted && (
                    <div className="absolute top-3 left-3 bg-[#e6b3a6] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      בְּקָרוֹב
                    </div>
                  )}

                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 transition-all group-hover:brightness-95"
                    style={{ backgroundColor: s.bg }}
                  >
                    <span className="text-2xl sm:text-3xl font-black" style={{ color: s.active }}>{g}</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold">{GRADE_LABELS[g]}</span>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ── SCREEN B: GAME LIST ─────────────────────────────────────────────────
  if (!game) {
    const games = interactiveCatalog[subject][grade] || [];

    return (
      <div className="flex flex-col min-h-screen bg-[#fafaf7]" dir="rtl">
        <TopBar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">

          {/* Screen title */}
          <h2 className="text-2xl font-black text-[#2d3748] mb-8 text-center">
            {s.he} — {GRADE_LABELS[grade]}
          </h2>

          {games.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center gap-4">
              <span className="text-7xl animate-bounce">🚧</span>
              <p className="text-xl font-bold text-[#718096]">הַמִּשְׂחָקִים לְכִתָּה זוֹ יַגִּיעוּ בְּקָרוֹב</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {games.map(g => (
                <button
                  key={g.id}
                  onClick={() => openGame(g)}
                  className="bg-white border-2 border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm transition-all group relative overflow-hidden"
                  onMouseEnter={e => {
                    (e.currentTarget.style.borderColor = s.active);
                    (e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.10)');
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.style.borderColor = '#f0f0f0');
                    (e.currentTarget.style.boxShadow = '');
                  }}
                >
                  {/* Subject-colored top accent */}
                  <div
                    className="absolute top-0 inset-x-0 h-1 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: s.active }}
                  />
                  {g.icon.startsWith('/') || g.icon.startsWith('http') ? (
                    <img 
                      src={g.icon} 
                      alt={g.title} 
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-5 transform group-hover:scale-110 group-hover:rotate-3 transition-transform" 
                    />
                  ) : (
                    <span className="text-6xl mb-5 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      {g.icon}
                    </span>
                  )}
                  <span className="text-xl font-black text-[#2d3748] mb-1">{g.title}</span>
                  <span className="text-sm font-medium text-[#718096] leading-snug">{g.subtitle}</span>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── SCREEN C: ACTIVE GAME ───────────────────────────────────────────────
  const renderGame = () => {
    switch (game.type) {
      case 'tracing': {
        const letters = subject === 'english' ? englishLetters : hebrewLetters;
        const title   = subject === 'english' ? 'English Letters' : 'אוֹתִיּוֹת עִבְרִיּוֹת';
        return <LettersView letters={letters} title={title} lang={game.lang} onBack={backToGames} />;
      }
      case 'notebook-tracing': return <NotebookTracingGame onBack={backToGames} />;
      case 'memory':          return <MemoryEngine          definition={game} onBack={backToGames} />;
      case 'multiple-choice': return <MultipleChoiceEngine  definition={game} onBack={backToGames} />;
      case 'math':
      case 'math-numpad':     return <MathEngine            definition={game} onBack={backToGames} />;
      case 'ordering':        return <OrderingEngine        definition={game} onBack={backToGames} />;
      case 'reading':         return <ReadingEngine         definition={game} onBack={backToGames} />;
      case 'scramble':        return <WordScrambleGame      onBack={backToGames} />;
      case 'typing':          return <TypingEngine          definition={game} onBack={backToGames} />;
      case 'multi-select':    return <MultiSelectEngine     definition={game} onBack={backToGames} />;
      case 'inline-select':   return <InlineSelectEngine    definition={game} onBack={backToGames} />;
      case 'sorting': 
        if (game.subject === 'math') return <SortingEngine definition={game} onBack={backToGames} />;
        return <AlphabetOrderGame onBack={backToGames} />;
      case 'clock':           return <ClockEngine           definition={game} onBack={backToGames} />;
      case 'math-word-mc':    return <MathWordEngine        definition={game} onBack={backToGames} />;
      default:
        return (
          <div className="py-24 text-center flex flex-col items-center gap-4" dir="rtl">
            <span className="text-6xl">🚧</span>
            <p className="text-xl font-bold text-[#718096]">מָנוֹעַ זֶה עֲדַיִן בְּפִתּוּחַ</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf7]">
      <TopBar />
      <main className="flex-1 w-full">
        {renderGame()}
      </main>
    </div>
  );
}
