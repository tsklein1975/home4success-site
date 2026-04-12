"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllMathG1Sorting, SortingQuestion } from '../../_data/curriculum/mathCurriculum';
import { getAllHebrewOrdering } from '../../_data/curriculum/hebrewCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SortingEngine({ definition, onBack }: Props) {
  const isRtl = definition.lang === 'he';
  // Math sequences are LTR even in Hebrew
  const isMath = definition.targetDataId.startsWith('math_');
  const forceLtr = isMath;

  const [roundIndex, setRoundIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<SortingQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState<SortingQuestion | null>(null);
  
  const [bank, setBank] = useState<{ id: string; char: string }[]>([]);
  const [slots, setSlots] = useState<({ char: string; status: 'correct' | 'wrong' | 'neutral' } | null)[]>([]);
  const [roundComplete, setRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const [dragging, setDragging] = useState<{
    id: string; char: string; source: 'bank' | 'slot'; sourceIndex: number;
    x: number; y: number;
  } | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const initSession = useCallback(() => {
    let all: SortingQuestion[] = [];
    if (isMath) {
        all = getAllMathG1Sorting(definition.targetDataId);
    } else {
        // Cast as any or SortingQuestion[] because we know the curriculum returns expected shape for this engine
        all = getAllHebrewOrdering(definition.targetDataId) as unknown as SortingQuestion[];
    }
    
    // Pick 10, shuffle
    let shuffled = shuffle(all);
    let selected: SortingQuestion[] = [];
    if (shuffled.length === 0) {
        selected = Array(10).fill({ instruction: 'Sort it:', items: ['1','2','3'], blankedIndices: [0,2] });
    } else {
        while (selected.length < TOTAL_ROUNDS) {
            selected.push(...shuffled);
            shuffled = shuffle(all);
        }
        selected = selected.slice(0, TOTAL_ROUNDS);
    }
    setSessionQuestions(selected);
    return selected;
  }, [definition.targetDataId, isMath]);

  const initRound = useCallback((index: number, questions: SortingQuestion[]) => {
    const q = questions[index];
    if (!q) return;
    setCurrentRound(q);
    setRoundComplete(false);
    
    const missingLetters = q.blankedIndices.map(i => q.items[i]);
    // Add 1-2 extra distractors if it's long, or just the missing ones
    const extraOptions: string[] = [];
    const allBankChars = shuffle([...missingLetters, ...extraOptions]);
    
    const allBank = allBankChars.map((char, i) => ({
      id: `${char}-${i}-${Date.now()}`,
      char,
    }));
    
    setBank(allBank);
    setSlots(new Array(q.blankedIndices.length).fill(null));
    setAttempts(0);
    setShowCorrectAnswer(false);
  }, []);

  useEffect(() => {
    const qs = initSession();
    initRound(0, qs);
  }, [initSession, initRound]);

  const handleNextRound = useCallback(() => {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      setGameOver(true);
    } else {
      const nextIdx = roundIndex + 1;
      setRoundIndex(nextIdx);
      initRound(nextIdx, sessionQuestions);
    }
  }, [roundIndex, sessionQuestions, initRound]);

  useEffect(() => {
    if (roundComplete || showCorrectAnswer || !currentRound) return;
    if (slots.length === 0) return;
    const allFilled = slots.every(s => s !== null);
    if (!allFilled) return;
    const allCorrect = slots.every(s => s?.status === 'correct');
    if (allCorrect) {
      setRoundComplete(true);
      setScore(prev => prev + 1);
      setTimeout(handleNextRound, 1800);
    }
  }, [slots, roundComplete, showCorrectAnswer, roundIndex, currentRound, sessionQuestions, initRound, handleNextRound]);

  const handlePointerDown = (e: React.PointerEvent, id: string, char: string, source: 'bank' | 'slot', sourceIndex: number) => {
    if (roundComplete) return;
    e.preventDefault();
    setDragging({ id, char, source, sourceIndex, x: e.clientX, y: e.clientY });
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  };
  const handlePointerUp = () => {
    if (!dragging || !currentRound) return;
    let droppedSlot = -1;
    for (let i = 0; i < slotRefs.current.length; i++) {
        const el = slotRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (dragging.x >= rect.left && dragging.x <= rect.right && dragging.y >= rect.top && dragging.y <= rect.bottom) {
            droppedSlot = i;
            break;
        }
    }
    if (droppedSlot >= 0) {
        const existingInSlot = slots[droppedSlot];
        if (existingInSlot?.status === 'correct') {
            if (dragging.source === 'slot') setBank(prev => [...prev, { id: `returned-${dragging.char}-${Date.now()}`, char: dragging.char }]);
            setDragging(null);
            return;
        }
        const expectedVal = currentRound.items[currentRound.blankedIndices[droppedSlot]];
        const isCorrect = dragging.char === expectedVal;
        const newSlots = [...slots];
        if (existingInSlot) setBank(prev => [...prev, { id: `returned-${existingInSlot.char}-${Date.now()}`, char: existingInSlot.char }]);
        newSlots[droppedSlot] = { char: dragging.char, status: isCorrect ? 'correct' : 'wrong' };
        if (dragging.source === 'bank') setBank(prev => prev.filter(b => b.id !== dragging.id));
        setSlots(newSlots);

        if (!isCorrect) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= 3) {
            setTimeout(() => {
              setShowCorrectAnswer(true);
              // Fill all missing correctly
              const revealedSlots = currentRound.blankedIndices.map(idx => ({
                char: currentRound.items[idx],
                status: 'correct' as const
              }));
              setSlots(revealedSlots);
              setBank([]);
              setTimeout(handleNextRound, 2500);
            }, 500);
          }
        }
    } else {
        if (dragging.source === 'slot') setBank(prev => [...prev, { id: `returned-${dragging.char}-${Date.now()}`, char: dragging.char }]);
    }
    setDragging(null);
  };

  const returnToBank = (slotIndex: number) => {
    const item = slots[slotIndex];
    if (!item || item.status === 'correct') return;
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setBank(prev => [...prev, { id: `${item.char}-returned-${Date.now()}`, char: item.char }]);
  };

  const resetGame = () => {
    setRoundIndex(0);
    setScore(0);
    setGameOver(false);
    const qs = initSession();
    initRound(0, qs);
  };

  if (gameOver) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-[6rem] mb-2 animate-bounce">🏆</div>
        <h2 className="text-4xl font-black text-[#518274] mb-4">{isRtl ? 'כָּל הַכָּבוֹד!' : 'Great Job!'}</h2>
        <p className="text-2xl text-[#718096] mb-8">{score} / {TOTAL_ROUNDS} ✅</p>
        <div className="flex gap-4">
          <button onClick={resetGame} className="px-8 py-3 bg-[#518274] text-white rounded-full font-bold text-lg shadow-md hover:bg-[#3d6359] transition-all">{isRtl ? 'שַׂחֲקוּ שׁוּב 🔄' : 'Play Again 🔄'}</button>
          <button onClick={onBack} className="px-8 py-3 bg-gray-100 text-[#7ca79b] rounded-full font-bold text-lg hover:bg-gray-200 transition-all">{isRtl ? '← חֲזָרָה' : '← Back'}</button>
        </div>
      </div>
    );
  }

  if (!currentRound) return null;

  return (
    <div
      className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragging(null)}
      style={{ touchAction: 'none' }}
    >
      <button onClick={onBack} className="self-start text-[#8aab9f] font-bold mb-4 block hover:underline">
        {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
      </button>

      {/* Progress HUD */}
      <div className="w-full flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
        <div className="flex flex-col w-2/3 max-w-md">
          <div className="flex justify-between text-xs font-bold text-[#8aab9f] mb-2">
            <span>{isRtl ? 'הִתְקַדְּמוּת' : 'Progress'}</span>
            <span>{roundIndex + 1} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" style={{ width: `${((roundIndex + 1) / TOTAL_ROUNDS) * 100}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-xl ${score >= 3 ? 'text-[#ffaa8b] animate-pulse' : 'text-gray-400'}`}>
          <span>🔥</span><span>{score}</span>
        </div>
      </div>

      <div className={`w-full bg-white rounded-3xl shadow-lg border-4 transition-all duration-500 p-8 flex flex-col items-center ${roundComplete ? 'border-green-300' : showCorrectAnswer ? 'border-blue-300' : 'border-[#f0f9f6]'}`}>
        <h3 className="text-3xl font-black text-[#8aab9f] mb-8 text-center">{currentRound.instruction}</h3>

        {/* Sorting Track */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-12 py-4" dir={forceLtr ? 'ltr' : 'rtl'}>
          {currentRound.items.map((val, idx) => {
            const blankIdx = currentRound.blankedIndices.indexOf(idx);
            if (blankIdx < 0) {
              return (
                <div key={idx} className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100/50 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-3xl sm:text-4xl font-black text-[#5e9e8c]">
                  {val}
                </div>
              );
            }
            const filled = slots[blankIdx];
            const isEmpty = !filled;
            const isCorrect = filled?.status === 'correct';
            const isWrong = filled?.status === 'wrong';
            return (
              <div
                key={idx}
                ref={el => { slotRefs.current[blankIdx] = el; }}
                onPointerDown={(e) => {
                  if (filled && !isCorrect) {
                    handlePointerDown(e, `slot-${blankIdx}`, filled.char, 'slot', blankIdx);
                    const newSlots = [...slots];
                    newSlots[blankIdx] = null;
                    setSlots(newSlots);
                  }
                }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all duration-200 border-4 border-dashed relative
                  ${isEmpty ? 'bg-gray-50/50 border-gray-300' : 
                    isCorrect ? 'bg-green-50 border-green-400 text-green-700 scale-105 shadow-md border-solid' :
                    isWrong ? 'bg-red-50 border-red-400 text-red-600 animate-shake border-solid' : 
                    'bg-[#fef9f4] border-[#8aab9f] text-[#2d3748] border-solid shadow-sm cursor-grab'}
                `}
              >
                {filled?.char || <span className="opacity-20">?</span>}
              </div>
            );
          })}
        </div>

        {/* Options Bank */}
        <div className="bg-[#f0f9f6]/30 p-6 rounded-3xl w-full max-w-2xl border-2 border-[#8aab9f]/10">
          <p className="text-center font-bold text-[#8aab9f] mb-4">{isRtl ? 'גְּרֹר אֶל הַמְּקוֹמוֹת הַמַּתְאִימִים:' : 'Drag to correct slots:'}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {bank.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => handlePointerDown(e, item.id, item.char, 'bank', -1)}
                className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-[#2d3748] shadow-md border-2 border-gray-100 cursor-grab active:cursor-grabbing hover:scale-105 hover:border-[#8aab9f] transition-all
                  ${dragging?.id === item.id ? 'opacity-40' : ''}
                `}
              >
                {item.char}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Drag Representation */}
      {dragging && (
        <div className="fixed z-[100] pointer-events-none" style={{ left: dragging.x - 40, top: dragging.y - 40 }}>
           <div className="w-20 h-20 bg-[#8aab9f] text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-2xl rotate-3 scale-110">
              {dragging.char}
           </div>
        </div>
      )}

      {/* Correct Popup */}
      {roundComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px] pointer-events-none animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-in zoom-in-90 duration-500 scale-110">
              <div className="text-6xl mb-2">🌟</div>
              <h4 className="text-3xl font-black text-[#518274]">{isRtl ? 'מְעֻלֶּה!' : 'Awesome!'}</h4>
           </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
