'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Shuffle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface GameWord {
  letters: string[];
  emoji: string;
}

const WORDS: GameWord[] = [
  { letters: ['פִּ', 'י', 'ל'], emoji: '🐘' },
  { letters: ['ח', 'וּ', 'לְ', 'צָ', 'ה'], emoji: '👕' },
  { letters: ['כִּ', 'י', 'סֵּ', 'א'], emoji: '🪑' },
  { letters: ['מַ', 'תָּ', 'נָ', 'ה'], emoji: '🎁' },
  { letters: ['כֶּ', 'לֶ', 'ב'], emoji: '🐶' },
  { letters: ['חָ', 'תּ', 'וּ', 'ל'], emoji: '🐱' },
  { letters: ['תַּ', 'פּ', 'וּ', 'חַ'], emoji: '🍎' },
  { letters: ['כַּ', 'דּ', 'וּ', 'ר'], emoji: '⚽' },
  { letters: ['שֶׁ', 'מֶ', 'שׁ'], emoji: '☀️' },
  { letters: ['פֶּ', 'רַ', 'ח'], emoji: '🌸' },
];

const TOTAL_ROUNDS = 10;

export default function WordScrambleGame({ onBack }: { onBack?: () => void }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [sessionWords, setSessionWords] = useState<GameWord[]>([]);
  const [success, setSuccess] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [bank, setBank] = useState<{ id: string; char: string; isDragging?: boolean }[]>([]);
  const [slots, setSlots] = useState<({ id: string; char: string } | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [draggingItem, setDraggingItem] = useState<{
    id: string; char: string; source: 'bank' | 'slot'; sourceIndex: number; x: number; y: number;
  } | null>(null);

  const initSession = useCallback(() => {
    const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
    setSessionWords(shuffled);
    return shuffled;
  }, []);

  const initRound = useCallback((roundIndex: number, wordsArr: GameWord[]) => {
    const word = wordsArr[roundIndex - 1];
    if (!word) return;

    setSuccess(false);
    const lettersWithIds = word.letters.map((char, index) => ({
      id: `${char}-${index}`,
      char,
    }));
    
    // Shuffle the letters
    for (let i = lettersWithIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lettersWithIds[i], lettersWithIds[j]] = [lettersWithIds[j], lettersWithIds[i]];
    }

    setBank(lettersWithIds);
    setSlots(new Array(word.letters.length).fill(null));
  }, []);

  useEffect(() => {
    const selected = initSession();
    initRound(1, selected);
  }, [initSession, initRound]);

  const currentWord = sessionWords[currentRound - 1];

  useEffect(() => {
    if (success || !currentWord) return;
    const isFull = slots.every((s) => s !== null);
    if (!isFull) return;

    const currentString = slots.map((s) => s!.char).join('');
    const targetString = currentWord.letters.join('');

    if (currentString === targetString) {
      setSuccess(true);
      setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          setGameOver(true);
        } else {
          const nextR = currentRound + 1;
          setCurrentRound(nextR);
          initRound(nextR, sessionWords);
        }
      }, 2000);
    }
  }, [slots, success, currentRound, currentWord, sessionWords, initRound]);

  const handlePointerDown = (e: React.PointerEvent, item: { id: string; char: string }, source: 'bank' | 'slot', sourceIndex: number) => {
    if (success) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (source === 'bank') {
      setBank((prev) => prev.map((l, i) => (i === sourceIndex ? { ...l, isDragging: true } : l)));
    } else {
      setSlots((prev) => prev.map((l, i) => (i === sourceIndex ? null : l)));
    }
    setDraggingItem({ ...item, source, sourceIndex, x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingItem) return;
    setDraggingItem((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingItem) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    let dropIndex = -1;
    slotRefs.current.forEach((slotInfo, index) => {
      if (!slotInfo) return;
      const rect = slotInfo.getBoundingClientRect();
      if (e.clientX >= rect.left - 20 && e.clientX <= rect.right + 20 && e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 20) {
        dropIndex = index;
      }
    });

    if (dropIndex !== -1) {
      const existingInSlot = slots[dropIndex];
      const newSlots = [...slots];
      newSlots[dropIndex] = { id: draggingItem.id, char: draggingItem.char };
      setSlots(newSlots);
      setBank((prev) => {
        let newBank = [...prev];
        if (draggingItem.source === 'bank') newBank = newBank.filter((l) => l.id !== draggingItem.id);
        if (existingInSlot) newBank.push(existingInSlot);
        return newBank.map(l => ({...l, isDragging: false}));
      });
    } else {
      setBank((prev) => {
        let newBank = [...prev];
        if (draggingItem.source === 'bank') return newBank.map(l => l.id === draggingItem.id ? { ...l, isDragging: false } : l);
        newBank.push({ id: draggingItem.id, char: draggingItem.char });
        return newBank;
      });
    }
    setDraggingItem(null);
  };

  const resetGame = () => {
    const selected = initSession();
    setCurrentRound(1);
    setGameOver(false);
    initRound(1, selected);
  };

  if (!currentWord && !gameOver) return null;

  if (gameOver) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative" dir="rtl">
        <div className="absolute inset-0 pointer-events-none flex justify-around animate-pulse opacity-50 text-3xl">
          <span>🎉</span><span className="mt-12">⭐</span><span>🎈</span><span className="mt-24">🏆</span><span>✨</span>
        </div>
        <div className="text-[6rem] mb-2 animate-bounce z-10">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-2 z-10">כָּל הַכָּבוֹד! סִיַּמְתֶּם!</h2>
        <button onClick={resetGame} className="bg-[#ffaa8b] hover:bg-[#ff9670] text-white px-10 py-3 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all z-10 mb-4 mt-8">שַׂחֲקוּ שׁוּב</button>
        {onBack && <button onClick={onBack} className="text-[#8aab9f] font-bold hover:underline z-10">← חֲזֹר לַמִּשְׂחָקִים</button>}
      </div>
    );
  }

  const progressPercent = (currentRound / TOTAL_ROUNDS) * 100;

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-2xl mx-auto flex flex-col items-center select-none touch-none rounded-3xl p-4 md:p-6 transition-colors duration-500 ${success ? 'bg-green-50' : 'bg-[#fffcf9]'}`}
      dir="rtl"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {onBack && <button onClick={onBack} className="self-start text-[#8aab9f] font-bold hover:underline mb-2 flex items-center gap-1"><span>←</span><span>חֲזֹר לַמִּשְׂחָקִים</span></button>}

      <div className="flex items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 w-full relative overflow-hidden">
        <div className="flex flex-col w-2/3 max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>הִתְקַדְּמוּת</span>
            <span>{currentRound} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-xl relative z-10 ${currentRound > 1 ? 'text-[#ffaa8b] animate-pulse drop-shadow-md' : 'text-gray-400'}`}>
          <span>🔥</span>
          <span>{currentRound - 1}</span>
        </div>
      </div>

      <div className="flex w-full justify-between items-center mb-2">
        <h2 className="text-2xl md:text-3xl font-black text-[#518274]">אוֹתִיּוֹת מְבֻלְבָּלוֹת</h2>
        <button onClick={() => initRound(currentRound, sessionWords)} className="p-3 bg-white rounded-full text-[#7ca79b] hover:bg-[#7ca79b] hover:text-white transition-colors shadow-sm" title="לְהַתְחִיל מֵחָדָשׁ"><RefreshCw size={24} /></button>
      </div>

      <p className="text-base md:text-lg text-gray-600 font-medium mb-3 text-center max-w-sm">סַדְּרוּ אֶת הָאוֹתִיּוֹת כְּדֵי שֶׁתְּקַבְּלוּ אֶת הַמִּילָה הַנְּכוֹנָה</p>

      <div className="text-[72px] md:text-[96px] drop-shadow-xl mb-4 animate-in zoom-in duration-500">{currentWord.emoji}</div>

      <div className="flex gap-3 md:gap-5 mb-6 justify-center w-full">
        {slots.map((slot, index) => (
          <div
            key={`slot-${index}`}
            ref={(el) => { slotRefs.current[index] = el; }}
            className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl border-b-4 flex items-center justify-center text-4xl md:text-5xl font-bold bg-white transition-all
              ${slot ? 'border-[#7ca79b] shadow-[0_4px_10px_rgb(0,0,0,0.1)] text-[#3b6255]' : 'border-gray-200 bg-gray-50/50'}`}
            onPointerDown={(e) => { if (slot && !success) handlePointerDown(e, slot, 'slot', index); }}
          >
            {slot ? slot.char : ''}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center w-full min-h-[100px]">
        {bank.map((letter, index) => (
          <div
            key={letter.id}
            className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl border-2 flex items-center justify-center text-4xl md:text-5xl font-bold bg-white cursor-grab active:cursor-grabbing transition-transform
              ${letter.isDragging ? 'opacity-0 scale-50' : 'opacity-100 scale-100 hover:scale-110 shadow-md border-[#e2d5cd] text-[#4a4a4a]'}`}
            onPointerDown={(e) => handlePointerDown(e, letter, 'bank', index)}
          >
            {letter.char}
          </div>
        ))}
      </div>

      {draggingItem && (
        <div className="fixed pointer-events-none w-16 h-20 md:w-20 md:h-24 rounded-2xl border-2 border-[#7ca79b] flex items-center justify-center text-4xl md:text-5xl font-bold bg-white shadow-2xl text-[#3b6255] z-50 scale-110" style={{ left: draggingItem.x, top: draggingItem.y, transform: 'translate(-50%, -50%)' }}>
          {draggingItem.char}
        </div>
      )}

      {success && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300 pointer-events-none">
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-500 delay-150">
            <CheckCircle2 size={80} className="text-[#8bc34a]" />
            <span className="text-3xl font-black text-[#518274]">כָּל הַכָּבוֹד!</span>
          </div>
        </div>
      )}
    </div>
  );
}
