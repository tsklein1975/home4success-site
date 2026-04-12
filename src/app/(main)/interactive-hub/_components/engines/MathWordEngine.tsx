"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllMathG2WordMC, MathWordMCQuestion } from '../../_data/curriculum/mathCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

export default function MathWordEngine({ definition, onBack }: Props) {
  const isRtl = definition.lang === 'he';
  
  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<MathWordMCQuestion[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const initQuestions = useCallback(() => {
    const all = getAllMathG2WordMC();
    
    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: MathWordMCQuestion[] = [];
    
    if (shuffled.length === 0) {
      selected = Array(10).fill({ 
        passage: 'Sample math story.', 
        question: 'Sample question?', 
        correctAnswer: '33', 
        options: ['33', '10', '20', '30'] 
      });
    } else {
      while (selected.length < TOTAL_ROUNDS) {
        selected.push(...shuffled);
        shuffled = [...all].sort(() => Math.random() - 0.5);
      }
      selected = selected.slice(0, TOTAL_ROUNDS);
    }

    setSessionQuestions(selected);
    setCurrentRound(1);
    setGameOver(false);
    setStreak(0);
    setFeedback('none');
    setSelectedOptIndex(null);
    setAttempts(0);
    setShowCorrectAnswer(false);
  }, []);

  useEffect(() => {
    initQuestions(); 
  }, [initQuestions]);

  const question = sessionQuestions[currentRound - 1];

  const handleNextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameOver(true);
    } else {
      setCurrentRound(r => r + 1);
      setFeedback('none');
      setSelectedOptIndex(null);
      setAttempts(0);
      setShowCorrectAnswer(false);
    }
  }, [currentRound, TOTAL_ROUNDS]);

  const handleOptionClick = (index: number) => {
    if (feedback === 'correct' || showCorrectAnswer || gameOver || !question) return;
    if (selectedOptIndex === index && feedback === 'incorrect') return;
    
    setSelectedOptIndex(index);
    const opt = question.options[index];

    if (opt === question.correctAnswer) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setTimeout(handleNextRound, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (newAttempts >= 3) {
        setFeedback('incorrect');
        setTimeout(() => {
          setShowCorrectAnswer(true);
          setTimeout(handleNextRound, 2500);
        }, 500);
      } else {
        setFeedback('incorrect');
      }
    }
  };

  const resetGame = () => {
    initQuestions();
  };

  if (sessionQuestions.length === 0 || !question) return null;

  const progressPercent = (currentRound / TOTAL_ROUNDS) * 100;

  if (gameOver) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative" dir="rtl">
        <div className="absolute inset-0 pointer-events-none flex justify-around animate-pulse opacity-50 text-3xl">
          <span>🎉</span><span className="mt-12">⭐</span><span>🎈</span><span className="mt-24">🏆</span><span>✨</span>
        </div>
        <div className="text-[6rem] mb-2 animate-bounce z-10">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-2 z-10">כָּל הַכָּבוֹד!</h2>
        <p className="text-xl text-gray-600 mb-8 z-10">סִיַּמְתֶּם אֶת הַלְּמִידָה בְּהַצְלָחָה!</p>
        <button onClick={resetGame} className="bg-[#ffaa8b] hover:bg-[#ff9670] text-white px-10 py-3 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all z-10 mb-4 mt-8">
          שַׂחֲקוּ שׁוּב
        </button>
        <button onClick={onBack} className="text-[#8aab9f] font-bold hover:underline z-10">
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

      <div className="flex items-center justify-between mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col w-2/3 max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>הִתְקַדְּמוּת</span>
            <span>{currentRound} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-2xl relative z-10 ${streak >= 3 ? 'text-[#ffaa8b] animate-pulse drop-shadow-sm' : 'text-gray-300'}`}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[500px]">
        {/* Left Side: Word Problem Passage (Reading Style) */}
        <div className="flex-1 bg-[#fffdf8] border-4 border-[#e6d0a1] rounded-[2rem] p-8 sm:p-12 shadow-md relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f0e8d5] rounded-bl-full opacity-40"></div>
          <h3 className="text-2xl font-black text-[#8aab9f] mb-6 flex items-center gap-3">
            <span className="text-3xl">📝</span> קִרְאוּ אֶת הַבְּעָיָה:
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px] lg:max-h-none">
            <p className="text-2xl sm:text-3xl leading-relaxed text-[#2d3748] font-bold whitespace-pre-wrap">
              {question.passage}
            </p>
          </div>
        </div>

        {/* Right Side: Options (Multiple Choice Style) */}
        <div className={`flex-1 bg-white rounded-[2rem] shadow-xl p-8 sm:p-10 border-4 ${feedback === 'correct' ? 'border-green-300 shadow-green-50' : 'border-[#f0e6ce]'} ${shake ? 'animate-pulse border-red-300' : ''} transition-all flex flex-col justify-center relative`}>
          
          <div className="text-center mb-10 flex flex-col items-center">
            <h4 className="text-xl font-bold text-[#8aab9f] mb-4 uppercase tracking-wider">הַשְּׁאֵלָה:</h4>
            <span className="text-2xl sm:text-3xl font-black text-[#2d3748] whitespace-pre-line leading-snug">
              {question.question}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {question.options.map((opt, i) => {
              const isSelected = selectedOptIndex === i;
              const isCorrectReveal = showCorrectAnswer && opt === question.correctAnswer;
              
              let bgClasses = "bg-gray-50 border-gray-200 text-[#4a5568] hover:bg-white hover:border-[#8aab9f] hover:-translate-y-1";
              
              if (isSelected) {
                if (feedback === 'correct') bgClasses = "bg-green-50 border-green-400 text-green-700 shadow-lg scale-105 z-10";
                if (feedback === 'incorrect') bgClasses = "bg-red-50 border-red-300 text-red-500 opacity-50";
              }

              if (isCorrectReveal) {
                bgClasses = "bg-green-100 border-green-500 text-green-800 shadow-lg scale-105 z-20 animate-bounce";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(i)}
                  disabled={feedback === 'correct' || showCorrectAnswer}
                  className={`border-4 py-5 px-6 rounded-2xl font-black text-2xl transition-all duration-300 flex flex-col items-center justify-center shadow-sm ${bgClasses}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback messages */}
          <div className="h-16 mt-8 flex items-center justify-center">
            {feedback === 'correct' && (
              <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
                <span className="text-xl font-black text-green-600 bg-green-50 px-8 py-3 rounded-full border-2 border-green-200 shadow-sm inline-block">
                  מְצֻיָּן! 🎉 פְתַרְתֶּם נָכוֹן
                </span>
              </div>
            )}
            {showCorrectAnswer && (
              <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
                <span className="text-xl font-black text-blue-600 bg-blue-50 px-8 py-3 rounded-full border-2 border-blue-200 shadow-sm inline-block">
                  הַתְּשׁוּבָה הַנְּכוֹנָה הִיא: {question.correctAnswer}
                </span>
              </div>
            )}
            {feedback === 'incorrect' && !showCorrectAnswer && (
              <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
                <span className="text-xl font-black text-red-500 bg-red-50 px-8 py-3 rounded-full border-2 border-red-200 shadow-sm inline-block">
                  נַסּוּ לַחְשֹׁב שׁוּב 🤔
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-pulse {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
