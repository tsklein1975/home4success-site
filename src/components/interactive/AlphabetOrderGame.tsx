'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const FULL_ALEFBET = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

interface AlphabetRound {
  fullSlice: string[];
  blankedIndices: number[];
  missingLetters: string[];
}

function generateRoundData(startIndex: number): AlphabetRound {
  const sliceLen = 5 + Math.floor(Math.random() * 3); // 5-7
  // Ensure we don't go out of bounds
  const start = Math.min(startIndex, FULL_ALEFBET.length - sliceLen);
  const fullSlice = FULL_ALEFBET.slice(start, start + sliceLen);

  const blankCount = Math.min(2 + Math.floor(Math.random() * 2), sliceLen - 2);
  const indices = fullSlice.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const blankedIndices = indices.slice(0, blankCount).sort((a, b) => a - b);
  const missingLetters = blankedIndices.map(i => fullSlice[i]);

  return { fullSlice, blankedIndices, missingLetters };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_ROUNDS = 10;

export default function AlphabetOrderGame({ onBack }: { onBack?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [sessionStarts, setSessionStarts] = useState<number[]>([]);
  const [round, setRound] = useState<AlphabetRound | null>(null);
  const [bank, setBank] = useState<{ id: string; char: string }[]>([]);
  const [slots, setSlots] = useState<({ char: string; status: 'correct' | 'wrong' | 'neutral' } | null)[]>([]);
  const [roundComplete, setRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [dragging, setDragging] = useState<{
    id: string; char: string; source: 'bank' | 'slot'; sourceIndex: number;
    x: number; y: number;
  } | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const initSession = useCallback(() => {
    // There are 22 letters. Slices are 5-7 long.
    // We can pick 10 different starting points to ensure variety.
    const possibleStarts = Array.from({ length: 16 }, (_, i) => i); // 0 to 15
    const selectedStarts = shuffle(possibleStarts).slice(0, TOTAL_ROUNDS);
    setSessionStarts(selectedStarts);
    return selectedStarts;
  }, []);

  const initRound = useCallback((index: number, starts: number[]) => {
    const startIdx = starts[index];
    const r = generateRoundData(startIdx);
    setRound(r);
    setRoundComplete(false);
    
    const adjacentLetters = FULL_ALEFBET.filter(l => !r.fullSlice.includes(l));
    const extras = shuffle(adjacentLetters).slice(0, 2);
    const allBank = shuffle([...r.missingLetters, ...extras]).map((char, i) => ({
      id: `${char}-${i}-${Date.now()}`,
      char,
    }));
    setBank(allBank);
    setSlots(new Array(r.blankedIndices.length).fill(null));
  }, []);

  useEffect(() => {
    const starts = initSession();
    initRound(0, starts);
  }, [initSession, initRound]);

  useEffect(() => {
    if (roundComplete || !round) return;
    if (slots.length === 0) return;
    const allFilled = slots.every(s => s !== null);
    if (!allFilled) return;
    const allCorrect = slots.every(s => s?.status === 'correct');
    if (allCorrect) {
      setRoundComplete(true);
      setScore(prev => prev + 1);
      setTimeout(() => {
        if (roundIndex + 1 >= TOTAL_ROUNDS) {
          setGameOver(true);
        } else {
          const nextIdx = roundIndex + 1;
          setRoundIndex(nextIdx);
          initRound(nextIdx, sessionStarts);
        }
      }, 1800);
    }
  }, [slots, roundComplete, roundIndex, round, sessionStarts, initRound]);

  const handlePointerDown = (e: React.PointerEvent, id: string, char: string, source: 'bank' | 'slot', sourceIndex: number) => {
    e.preventDefault();
    setDragging({ id, char, source, sourceIndex, x: e.clientX, y: e.clientY });
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  };
  const handlePointerUp = () => {
    if (!dragging || !round) return;
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
        const expectedLetter = round.missingLetters[droppedSlot];
        const isCorrect = dragging.char === expectedLetter;
        const newStatus = isCorrect ? 'correct' : 'wrong';
        const newSlots = [...slots];
        if (existingInSlot) setBank(prev => [...prev, { id: `returned-${existingInSlot.char}-${Date.now()}`, char: existingInSlot.char }]);
        newSlots[droppedSlot] = { char: dragging.char, status: newStatus };
        if (dragging.source === 'bank') setBank(prev => prev.filter(b => b.id !== dragging.id));
        setSlots(newSlots);
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

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500" dir="rtl">
        <div className="text-8xl mb-6">🎉</div>
        <h2 className="text-4xl font-black text-[#518274] mb-4">כָּל הַכָּבוֹד!</h2>
        <p className="text-2xl text-[#718096] mb-2">סִיַּמְתֶּם אֶת כָּל הַשְּׁלָבִים!</p>
        <p className="text-3xl font-bold text-[#e8a745] mb-8">{score} / {TOTAL_ROUNDS} ✅</p>
        <div className="flex gap-4">
          <button onClick={() => { setRoundIndex(0); setScore(0); setGameOver(false); const s = initSession(); initRound(0, s); }}
            className="px-8 py-3 bg-[#518274] text-white rounded-full font-bold text-lg hover:bg-[#3d6359] transition-all shadow-md">
            שַׂחֲקוּ שׁוּב 🔄
          </button>
          {onBack && <button onClick={onBack} className="px-8 py-3 bg-white text-[#7ca79b] rounded-full font-bold text-lg hover:bg-[#eaf1ed] transition-all shadow-md">← חֲזָרָה</button>}
        </div>
      </div>
    );
  }

  if (!round) return null;

  return (
    <div
      className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8 select-none"
      dir="rtl"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragging(null)}
      style={{ touchAction: 'none' }}
    >
      {onBack && <button onClick={onBack} className="self-start text-[#8aab9f] font-bold mb-4 block hover:underline">← חֲזֹר לַמִּשְׂחָקִים</button>}

      <div className="w-full flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col w-2/3 max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>הִתְקַדְּמוּת</span>
            <span>{roundIndex + 1} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" style={{ width: `${((roundIndex + 1) / TOTAL_ROUNDS) * 100}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-xl relative z-10 ${score >= 3 ? 'text-[#ffaa8b] animate-pulse drop-shadow-md' : 'text-gray-400'}`}>
          <span>🔥</span>
          <span>{score}</span>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-[#518274] mb-2 text-center">סֵדֶר הָא"בּ 📏</h2>
      <p className="text-lg text-[#718096] mb-6 text-center">הַשְׁלִימוּ אֶת הָאוֹתִיּוֹת הַחֲסֵרוֹת</p>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-[#e2e8f0] p-6 md:p-8 mb-8 w-full">
        <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
          {round.fullSlice.map((letter, idx) => {
            const blankIdx = round.blankedIndices.indexOf(idx);
            if (blankIdx < 0) {
              return <div key={idx} className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#eaf1ed] to-[#d5e8de] rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-extrabold text-[#518274] shadow-sm border-2 border-[#c5ddd0]">{letter}</div>;
            }
            const filledItem = slots[blankIdx];
            const isEmpty = !filledItem;
            const isCorrect = filledItem?.status === 'correct';
            const isWrong = filledItem?.status === 'wrong';
            return (
              <div
                key={idx}
                ref={el => { slotRefs.current[blankIdx] = el; }}
                onPointerDown={(e) => {
                  if (filledItem && filledItem.status !== 'correct') {
                    e.preventDefault();
                    setDragging({ id: `slot-${blankIdx}`, char: filledItem.char, source: 'slot', sourceIndex: blankIdx, x: e.clientX, y: e.clientY });
                    const newSlots = [...slots];
                    newSlots[blankIdx] = null;
                    setSlots(newSlots);
                  }
                }}
                onClick={() => !isEmpty && !isCorrect && returnToBank(blankIdx)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-extrabold border-3 transition-all duration-300 ${
                  isEmpty ? 'bg-[#fafafa] border-dashed border-[#cbd5e0] text-[#cbd5e0] cursor-default'
                  : isCorrect ? 'bg-green-100 border-green-400 text-green-700 cursor-default scale-105'
                  : isWrong ? 'bg-red-50 border-red-400 text-red-600 cursor-grab active:cursor-grabbing animate-wrongShake'
                  : 'bg-[#fef9f4] border-[#e8a745] text-[#c0855a] cursor-grab active:cursor-grabbing'
                }`}
              >
                {filledItem?.char || '?'}
              </div>
            );
          })}
        </div>
      </div>

      {!roundComplete && (
        <div className="bg-[#fef9f4] rounded-3xl shadow-md border-2 border-[#fde8d0] p-6 w-full">
          <p className="text-center text-[#a0855a] font-bold mb-4 text-lg">גִּרְרוּ אֶת הָאוֹת הַנְּכוֹנָה לַמָּקוֹם הָרִיק</p>
          <div className="flex items-center justify-center gap-3 flex-wrap min-h-[64px]">
            {bank.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => handlePointerDown(e, item.id, item.char, 'bank', -1)}
                className={`w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-extrabold text-[#4a4a4a] shadow-md cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-lg transition-all border-2 border-[#e2e8f0] hover:border-[#e8a745] ${dragging?.id === item.id ? 'opacity-40' : ''}`}
              >
                {item.char}
              </div>
            ))}
          </div>
        </div>
      )}

      {dragging && (
        <div className="fixed z-50 pointer-events-none" style={{ left: dragging.x - 28, top: dragging.y - 28 }}>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#e8a745] text-white rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-extrabold shadow-2xl scale-110 rotate-3">{dragging.char}</div>
        </div>
      )}

      {roundComplete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-in zoom-in-95 fade-in duration-500 pointer-events-auto">
            <div className="text-7xl mb-4">🌟</div>
            <h3 className="text-3xl font-black text-[#518274] mb-2">כָּל הַכָּבוֹד!</h3>
            <p className="text-xl text-[#718096]">{roundIndex + 1 < TOTAL_ROUNDS ? 'מַמְשִׁיכִים לַשָּׁלָב הַבָּא...' : 'סִיַּמְתֶּם אֶת כָּל הַשְּׁלָבִים!'}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-wrongShake { animation: wrongShake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
