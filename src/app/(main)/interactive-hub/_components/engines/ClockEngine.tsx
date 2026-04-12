"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllMathG2Clock, ClockQuestion } from '../../_data/curriculum/mathCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

export default function ClockEngine({ definition, onBack }: Props) {
  const TOTAL_ROUNDS = 10;
  const isRtl = definition.lang === 'he';
  
  const [currentRound, setCurrentRound] = useState(1);
  const [questions, setQuestions] = useState<ClockQuestion[]>([]);
  const [hourAngle, setHourAngle] = useState(0); // 0 = 12 o'clock
  const [minuteAngle, setMinuteAngle] = useState(0); // 0 = 0 minutes
  const [draggingHand, setDraggingHand] = useState<'hour' | 'minute' | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize questions
  useEffect(() => {
    const all = getAllMathG2Clock();
    const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    setQuestions(shuffled);
    resetClock();
  }, []);

  const resetClock = () => {
    // Start at 12:00
    setHourAngle(0);
    setMinuteAngle(0);
    setFeedback('none');
    setAttempts(0);
    setShowCorrectAnswer(false);
  };

  const getAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  };

  const handlePointerDown = (hand: 'hour' | 'minute') => {
    setDraggingHand(hand);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingHand) return;
    
    let angle = getAngle(e.clientX, e.clientY);
    
    if (draggingHand === 'hour') {
      // Snap to full hours (30 degrees each)
      const snappedAngle = Math.round(angle / 30) * 30;
      setHourAngle(snappedAngle % 360);
    } else {
      // Snap to 5-minute marks (30 degrees each number)
      const snappedAngle = Math.round(angle / 30) * 30;
      setMinuteAngle(snappedAngle % 360);
    }
  }, [draggingHand]);

  useEffect(() => {
    const onPointerUp = () => setDraggingHand(null);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [handlePointerMove]);

  const handleNextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameOver(true);
    } else {
      setCurrentRound(r => r + 1);
      resetClock();
    }
  }, [currentRound, TOTAL_ROUNDS]);

  const checkAnswer = () => {
    const q = questions[currentRound - 1];
    if (!q || feedback === 'correct' || showCorrectAnswer) return;

    const [targetH, targetM] = q.targetTime.split(':').map(Number);
    
    let currentH = Math.round(hourAngle / 30);
    if (currentH === 0) currentH = 12;

    let currentM = Math.round(minuteAngle / 30) * 5;
    if (currentM === 60) currentM = 0;

    if (currentH === (targetH % 12 || 12) && currentM === targetM) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setTimeout(handleNextRound, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStreak(0);
      setFeedback('incorrect');

      if (newAttempts >= 3) {
        setTimeout(() => {
          setShowCorrectAnswer(true);
          // Snap to correct time
          const hAngle = (targetH % 12) * 30 + (targetM / 60) * 30;
          const mAngle = (targetM / 5) * 30;
          setHourAngle(hAngle);
          setMinuteAngle(mAngle);
          
          setTimeout(handleNextRound, 2500);
        }, 500);
      } else {
        setTimeout(() => setFeedback('none'), 1500);
      }
    }
  };

  if (questions.length === 0) return null;
  const q = questions[currentRound - 1];

  if (gameOver) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8" dir="rtl">
        <div className="text-[6rem] mb-2 animate-bounce">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-2">כָּל הַכָּבוֹד!</h2>
        <p className="text-xl text-gray-600 mb-8">סִיַּמְתֶּם אֶת הַלְּמִידָה בְּהַצְלָחָה!</p>
        <button onClick={() => window.location.reload()} className="bg-[#ffaa8b] hover:bg-[#ff9670] text-white px-10 py-3 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all">
          שַׂחֲקוּ שׁוּב
        </button>
        <button onClick={onBack} className="mt-4 text-[#8aab9f] font-bold hover:underline">
          ← חֲזֹר לַמִּשְׂחָקִים
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 font-sans" dir="rtl">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack} 
          className="text-[#8aab9f] font-bold flex items-center gap-2 hover:underline transition-all"
        >
          <span>←</span>
          <span>חֲזֹר לַמִּשְׂחָקִים</span>
        </button>
      </div>

      {/* Progress Bar & Streak at Top */}
      <div className="flex items-center justify-between mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col w-2/3 max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>הִתְקַדְּמוּת</span>
            <span>{currentRound} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" 
              style={{ width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }}
            />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-2xl relative z-10 ${streak >= 3 ? 'text-[#ffaa8b] animate-pulse drop-shadow-sm' : 'text-gray-300'}`}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Side: Interactive Clock */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border-4 border-[#f0e6ce] flex flex-col items-center">
          <h3 className="text-2xl font-black text-[#2d3748] mb-8 whitespace-pre-line text-center leading-snug">
            {q.instruction}
          </h3>
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 select-none bg-[#fcfaf5] rounded-full p-4 border-8 border-white shadow-inner">
            <svg 
              ref={svgRef}
              viewBox="0 0 200 200" 
              className="w-full h-full drop-shadow-md"
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Clock Face Background */}
              <circle cx="100" cy="100" r="95" fill="white" stroke="#e2e8f0" strokeWidth="1" />
              
              {/* Decorative Inner Ring */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="#f8f9fa" strokeWidth="1" />
              
              {/* Ticks */}
              {[...Array(60)].map((_, i) => (
                <line
                  key={i}
                  x1="100" y1={i % 5 === 0 ? "8" : "12"}
                  x2="100" y2="15"
                  stroke={i % 5 === 0 ? "#4a5568" : "#cbd5e0"}
                  strokeWidth={i % 5 === 0 ? "2" : "1"}
                  transform={`rotate(${i * 6} 100 100)`}
                />
              ))}

              {/* Numbers */}
              {[...Array(12)].map((_, i) => {
                const angle = (i + 1) * 30 * (Math.PI / 180);
                const x = 100 + 72 * Math.sin(angle);
                const y = 100 - 72 * Math.cos(angle);
                return (
                  <text
                    key={i}
                    x={x} y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[14px] font-black fill-[#2d3748] select-none"
                  >
                    {i + 1}
                  </text>
                );
              })}

              {/* Minute Hand (Teal) */}
              <g 
                className="cursor-pointer group"
                onPointerDown={() => handlePointerDown('minute')}
                style={{ 
                  transform: `rotate(${minuteAngle}deg)`, 
                  transformOrigin: '100px 100px', 
                  transition: draggingHand ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                }}
              >
                <line x1="100" y1="100" x2="100" y2="20" stroke="#4fd1c5" strokeWidth="4" strokeLinecap="round" className="group-hover:stroke-[#38b2ac]" />
                <circle cx="100" cy="20" r="6" fill="#4fd1c5" className="group-hover:fill-[#38b2ac] filter drop-shadow-sm" />
              </g>

              {/* Hour Hand (Orange) */}
              <g 
                className="cursor-pointer group"
                onPointerDown={() => handlePointerDown('hour')}
                style={{ 
                  transform: `rotate(${hourAngle}deg)`, 
                  transformOrigin: '100px 100px', 
                  transition: draggingHand ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                }}
              >
                <line x1="100" y1="100" x2="100" y2="45" stroke="#ffaa8b" strokeWidth="7" strokeLinecap="round" className="group-hover:stroke-[#f6ad55]" />
                <circle cx="100" cy="45" r="6" fill="#ffaa8b" className="group-hover:fill-[#f6ad55] filter drop-shadow-sm" />
              </g>

              {/* Center Pin */}
              <circle cx="100" cy="100" r="7" fill="#2d3748" />
              <circle cx="100" cy="100" r="3" fill="#ffffff" />
            </svg>
          </div>

          <div className="mt-10 w-full">
            <button 
              onClick={checkAnswer}
              disabled={feedback === 'correct' || showCorrectAnswer}
              className={`w-full py-5 rounded-2xl font-black text-2xl shadow-lg transition-all transform active:scale-95 ${
                feedback === 'correct' ? 'bg-green-500 text-white shadow-green-100 cursor-default' : 
                showCorrectAnswer ? 'bg-blue-500 text-white shadow-blue-100 cursor-default animate-pulse' :
                feedback === 'incorrect' ? 'bg-red-500 text-white animate-shake' : 
                'bg-[#8aab9f] hover:bg-[#7a9b8f] text-white hover:shadow-xl'
              }`}
            >
              {feedback === 'correct' ? 'מְעֻלֶּה! תְּשׁוּבָה נְכוֹנָה ✅' : 
               showCorrectAnswer ? `הַשָּׁעָה הִיא: ${q.targetTime} ⏰` :
               feedback === 'incorrect' ? 'נַסּוּ שׁוּב ❌' : 
               'בִּדְקוּ תְּשׁוּבָה'}
            </button>
          </div>
        </div>

        {/* Right Side: Pedagogical Support */}
        <div className="relative flex flex-col min-h-[400px]">
          <div className="lg:absolute lg:inset-0 bg-white rounded-[2rem] shadow-xl p-8 border-4 border-[#f0e6ce] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-50">
              <span className="text-3xl">📝</span>
              <h2 className="text-2xl font-black text-[#2d3748]">אֵיךְ קוֹרְאִים שָׁעוֹן?</h2>
            </div>
            
            <div className="space-y-8">
              <section className="bg-[#fff9f9] p-5 rounded-2xl border border-[#fee2e2]">
                <h3 className="text-lg font-bold text-[#e53e3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#ffaa8b] rounded-full inline-block"></span>
                  הַמָּחוֹג הַקָּצָר (שָׁעוֹת)
                </h3>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  הַמָּחוֹג הַקָּצָר וְהֶעָבֶה מַרְאֶה לָנוּ מָה הַשָּׁעָה. הוּא מִתְקַדֵּם בְּאִטִּיּוּת בֵּין הַמִּסְפָּרִים מִ-1 וְעַד 12.
                </p>
              </section>

              <section className="bg-[#f0fff4] p-5 rounded-2xl border border-[#c6f6d5]">
                <h3 className="text-lg font-bold text-[#2f855a] mb-2 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#4fd1c5] rounded-full inline-block"></span>
                  הַמָּחוֹג הָאָרֹךְ (דַּקּוֹת)
                </h3>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  הַמָּחוֹג הָאָרֹךְ וְהַדַּק מַרְאֶה לָנוּ כַּמָּה דַּקּוֹת עָבְרוּ. כָּל מִסְפָּר בַּשָּׁעוֹן שָׁוֶה לִקְפִיצָה שֶׁל 5 דַּקּוֹת.
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white/60 p-2 rounded-lg border border-[#9ae6b4] text-center">
                    <span className="font-bold text-[#2f855a]">מִסְפָּר 1</span> = 5 דַּקּוֹת
                  </div>
                  <div className="bg-white/60 p-2 rounded-lg border border-[#9ae6b4] text-center">
                    <span className="font-bold text-[#2f855a]">מִסְפָּר 3</span> = 15 דַּקּוֹת
                  </div>
                  <div className="bg-white/60 p-2 rounded-lg border border-[#9ae6b4] text-center">
                    <span className="font-bold text-[#2f855a]">מִסְפָּר 6</span> = 30 דַּקּוֹת
                  </div>
                  <div className="bg-white/60 p-2 rounded-lg border border-[#9ae6b4] text-center">
                    <span className="font-bold text-[#2f855a]">מִסְפָּר 9</span> = 45 דַּקּוֹת
                  </div>
                </div>
              </section>

              <div className="bg-[#ebf8ff] p-5 rounded-2xl border-2 border-[#bee3f8] flex gap-4 items-start shadow-sm">
                <span className="text-3xl">💡</span>
                <div className="text-gray-700 font-medium leading-relaxed">
                  <p className="font-black text-[#2b6cb0] mb-1">טִיפּ חָשׁוּב!</p>
                  כְּשֶׁהַמָּחוֹג הָאָרֹךְ מַשְׁלִים סִבּוּב שָׁלֵם (חוֹזֵר לִ-12), עָבְרָה שָׁעָה אַחַת מְדֻיֶּקֶת.
                  בֵּין הַמִּסְפָּרִים יֵשׁ קַוִּים קְטַנִּים - כָּל קַו הוּא דַּקָּה אַחַת.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
