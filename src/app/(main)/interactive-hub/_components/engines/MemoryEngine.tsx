"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { hebrewMatchPairs, englishMatchPairs, MatchPair } from '../../_data/matchGameData';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

interface CardState {
  uniqueId: string;
  pairId: string;
  display: string;   // emoji character or letter
  type: 'letter' | 'emoji';
  isFlipped: boolean;
  isMatched: boolean;
}

// ─── Helpers ────────────────────────────────────────────────

function getPairs(lang: 'he' | 'en', pairCount: number): MatchPair[] {
  const pool = lang === 'he' ? hebrewMatchPairs : englishMatchPairs;
  
  // Shuffle, then keep exactly ONE pair per letter so the board is always unambiguous.
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const seen = new Set<string>();
  const unique = shuffled.filter(p => {
    if (seen.has(p.letter)) return false;
    seen.add(p.letter);
    return true;
  });
  return unique.slice(0, Math.min(pairCount, unique.length));
}

function buildBoard(pairs: MatchPair[]): CardState[] {
  const cards: CardState[] = [];
  pairs.forEach(pair => {
    cards.push({
      uniqueId: `letter-${pair.id}`,
      pairId: pair.id,
      display: pair.letter,
      type: 'letter',
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      uniqueId: `emoji-${pair.id}`,
      pairId: pair.id,
      display: pair.emoji,
      type: 'emoji',
      isFlipped: false,
      isMatched: false,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

// ─── Emoji image card face ────────────────────────────────────
function EmojiCardFace({ emoji }: { emoji: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span
        className="leading-none select-none"
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
          fontSize: 'clamp(2.5rem, 14vw, 5.5rem)',
          display: 'block',
          textAlign: 'center',
        }}
      >
        {emoji}
      </span>
    </div>
  );
}

// ─── Main Engine ─────────────────────────────────────────────
export default function MemoryEngine({ definition, onBack }: Props) {
  const isRtl = definition.lang === 'he';
  
  // Level selection state
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'advanced' | null>(null);
  
  const [cards, setCards] = useState<CardState[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState(0);

  const initGame = useCallback((levelOverride?: 'beginner' | 'advanced') => {
    const level = levelOverride || selectedLevel;
    if (!level) return;

    const pairCount = level === 'beginner' ? 6 : 10;
    const pairs = getPairs(definition.lang, pairCount);
    
    setCards(buildBoard(pairs));
    setFlipped([]);
    setLocked(false);
    setMoves(0);
    setStreak(0);
    setMatchedCount(0);
    setGameOver(false);
    setStars(0);
  }, [definition.lang, selectedLevel]);

  // Restart game flow
  const handleRestart = () => {
    initGame();
  };

  const handleReturnToLevels = () => {
    setSelectedLevel(null);
    setCards([]);
    setGameOver(false);
  };

  const handleSelectLevel = (level: 'beginner' | 'advanced') => {
    setSelectedLevel(level);
    initGame(level);
  };

  const totalPairs = cards.length / 2 || 0;

  const handleFlip = (uniqueId: string) => {
    if (locked) return;
    if (flipped.includes(uniqueId)) return;
    const card = cards.find(c => c.uniqueId === uniqueId);
    if (!card || card.isMatched || card.isFlipped) return;

    const newFlipped = [...flipped, uniqueId];
    setCards(prev => prev.map(c => c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(id => cards.find(c => c.uniqueId === id)!);

      if (a.pairId === b.pairId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === a.pairId ? { ...c, isMatched: true } : c
          ));
          setFlipped([]);
          setLocked(false);
          setStreak(s => s + 1);
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);
          if (newMatched === totalPairs) {
            const ratio = (moves + 1) / totalPairs;
            setStars(ratio <= 1.4 ? 3 : ratio <= 2.2 ? 2 : 1);
            setGameOver(true);
          }
        }, 600);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.uniqueId) ? { ...c, isFlipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
          setStreak(0);
        }, 1000);
      }
    }
  };

  const cols =
    totalPairs <= 6  ? 'grid-cols-3 sm:grid-cols-4'
    : totalPairs <= 8 ? 'grid-cols-4'
    : 'grid-cols-4 sm:grid-cols-5';

  // ── 1. Level Selection Screen ──
  if (!selectedLevel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <button onClick={onBack} className="self-start text-[#8aab9f] font-bold mb-4 block hover:underline">
          {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
        </button>

        <div className="w-full flex flex-col items-center justify-center py-12 px-6 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="text-[5rem] mb-4">🧠</div>
          <h2 className="text-3xl font-black text-[#2d3748] mb-2 text-center">
            {isRtl ? 'בַּחֲרוּ רָמָה' : 'Choose Level'}
          </h2>
          <p className="text-[#718096] mb-10 text-center font-medium">
            {isRtl ? 'כַּמָּה זוּגוֹת תִּרְצוּ לִמְצֹא?' : 'How many pairs would you like to find?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
            <button
              onClick={() => handleSelectLevel('beginner')}
              className="flex flex-col items-center p-8 bg-[#f0f9f6] border-4 border-transparent hover:border-[#8aab9f] rounded-3xl transition-all group"
            >
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🌱</span>
              <span className="text-xl font-black text-[#5e9e8c]">{isRtl ? 'מַתְחִילִים' : 'Beginner'}</span>
              <span className="text-sm text-[#8aab9f] font-bold mt-1">{isRtl ? '6 זוּגוֹת' : '6 Pairs'}</span>
            </button>

            <button
              onClick={() => handleSelectLevel('advanced')}
              className="flex flex-col items-center p-8 bg-[#fff5f2] border-4 border-transparent hover:border-[#ffaa8b] rounded-3xl transition-all group"
            >
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🚀</span>
              <span className="text-xl font-black text-[#d4784a]">{isRtl ? 'מִתְקַדְּמִים' : 'Advanced'}</span>
              <span className="text-sm text-[#ffaa8b] font-bold mt-1">{isRtl ? '10 זוּגוֹת' : '10 Pairs'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Game Over Screen ──
  if (gameOver) {
    return (
      <div
        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="absolute inset-0 pointer-events-none flex justify-around items-start pt-8 text-4xl opacity-20 animate-pulse select-none">
          {'🎉🌟✨🎈🏆'.split('').map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div className="text-8xl mb-4 animate-bounce z-10">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-1 z-10">
          {isRtl ? 'כָּל הַכָּבוֹד!' : 'Amazing!'}
        </h2>
        <div className="flex gap-1 text-5xl my-4 z-10">
          {[1, 2, 3].map(s => (
            <span
              key={s}
              className={s <= stars ? 'opacity-100 animate-bounce' : 'opacity-20'}
              style={{ animationDelay: `${s * 0.15}s` }}
            >⭐</span>
          ))}
        </div>
        <p className="text-lg text-[#718096] mb-2 z-10 font-medium">
          {isRtl ? `${moves} מַהֲלָכִים` : `${moves} moves`}
        </p>
        <div className="flex gap-3 mt-4 z-10 flex-wrap justify-center">
          <button
            onClick={handleRestart}
            className="bg-[#8aab9f] hover:bg-[#7a9b8f] text-white px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all"
          >
            {isRtl ? '🔄 שַׂחֲקוּ שׁוּב' : '🔄 Play Again'}
          </button>
          <button
            onClick={handleReturnToLevels}
            className="bg-white border-2 border-[#8aab9f] text-[#8aab9f] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-50 transition-all"
          >
            {isRtl ? '📊 הַחֲלֵף רָמָה' : '📊 Change Level'}
          </button>
          <button
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 text-[#4a5568] px-8 py-3 rounded-full font-bold text-lg transition-all"
          >
            {isRtl ? '← תַּפְרִיט' : '← Menu'}
          </button>
        </div>
      </div>
    );
  }

  // ── 3. Active Gameplay Board ──
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Global Top-Right Navigation */}
      <button onClick={onBack} className="self-start text-[#8aab9f] font-bold mb-4 block hover:underline">
        {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
      </button>

      {/* Internal Navigation & Level Label */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={handleReturnToLevels} className="text-[#8aab9f] font-bold text-sm hover:underline flex items-center gap-1">
           <span>←</span>
           <span>{isRtl ? 'הַחֲלֵף רָמָה' : 'Change Level'}</span>
        </button>
        <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${selectedLevel === 'beginner' ? 'bg-[#f0f9f6] text-[#5e9e8c]' : 'bg-[#fff5f2] text-[#d4784a]'}`}>
           {selectedLevel === 'beginner' ? (isRtl ? 'מַתְחִילִים' : 'Beginner') : (isRtl ? 'מִתְקַדְּמִים' : 'Advanced')}
        </span>
      </div>

      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-8 mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[#8aab9f]">{isRtl ? 'זוּגוֹת שֶׁנִּמְצְאוּ' : 'Pairs Found'}</span>
          <div className="w-32 sm:w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8aab9f] rounded-full transition-all duration-500"
              style={{ width: `${(matchedCount / totalPairs) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{matchedCount} / {totalPairs}</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <div className="text-2xl font-black text-[#2d3748]">{moves}</div>
            <div className="text-xs text-gray-400 font-medium">{isRtl ? 'מַהֲלָכִים' : 'Moves'}</div>
          </div>
          <div className={`flex items-center gap-1 font-black text-xl ${streak >= 3 ? 'text-[#ffaa8b] animate-pulse' : 'text-gray-200'}`}>
            <span>🔥</span><span>{streak}</span>
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className={`grid ${cols} gap-2 sm:gap-3`}>
        {cards.map(card => {
          const visible = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.uniqueId}
              onClick={() => handleFlip(card.uniqueId)}
              disabled={card.isMatched || card.isFlipped || locked}
              className={[
                'relative rounded-2xl border-4 shadow-md transition-all duration-200',
                'flex flex-col items-center justify-center select-none overflow-hidden aspect-square',
                card.isMatched
                  ? 'bg-green-50 border-green-300 scale-95 shadow-none cursor-default'
                  : card.isFlipped
                  ? 'bg-white border-[#8aab9f] shadow-xl scale-[1.04]'
                  : 'bg-[#8aab9f] border-[#7a9b8f] hover:bg-[#98bab4] hover:-translate-y-0.5 cursor-pointer',
              ].join(' ')}
            >
              {visible ? (
                card.type === 'emoji' ? (
                  <EmojiCardFace emoji={card.display} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f0f9f6]">
                    <span
                      className="font-black text-[#2d3748] leading-none"
                      style={{ fontSize: 'clamp(2.5rem, 14vw, 6rem)' }}
                    >
                      {card.display}
                    </span>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-white font-black opacity-50 leading-none"
                    style={{ fontSize: 'clamp(1.5rem, 8vw, 3rem)' }}
                  >
                    ?
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
