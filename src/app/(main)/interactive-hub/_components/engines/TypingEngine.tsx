"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllHebrewTyping } from '../../_data/curriculum/hebrewCurriculum';
import { TypingQuestion } from '../../_data/curriculum/englishCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

// Helper to remove niqqud
function removeNiqqud(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

export default function TypingEngine({ definition, onBack }: Props) {
  const TOTAL_ROUNDS = 10;
  const isRtl = definition.lang === 'he';

  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<TypingQuestion[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const initQuestions = useCallback(() => {
    let all: TypingQuestion[] = [];
    if (definition.lang === 'he') {
      all = getAllHebrewTyping(definition.targetDataId);
    }

    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: TypingQuestion[] = [];

    if (shuffled.length === 0) {
      selected = Array(10).fill(null);
    } else {
      while (selected.length < TOTAL_ROUNDS) {
        selected.push(...shuffled);
        shuffled = [...all].sort(() => Math.random() - 0.5);
      }
      selected = selected.slice(0, TOTAL_ROUNDS);
    }

    setSessionQuestions(selected);
    setCurrentRound(1);
    setFeedback('none');
    setInputValue('');
    setAttempts(0);
    setShowCorrectAnswer(false);
    setGameOver(false);
  }, [definition, TOTAL_ROUNDS]);

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
      setInputValue('');
      setAttempts(0);
      setShowCorrectAnswer(false);
      inputRef.current?.focus();
    }
  }, [currentRound, TOTAL_ROUNDS]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (feedback === 'correct' || showCorrectAnswer || gameOver || !question || !inputValue.trim()) return;

    // Compare without niqqud
    const userVal = removeNiqqud(inputValue.trim()).toLowerCase();
    const correctVal = removeNiqqud(question.correctAnswer).toLowerCase();

    if (userVal === correctVal) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setTimeout(handleNextRound, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStreak(0);
      setShake(true);
      setFeedback('incorrect');
      setTimeout(() => setShake(false), 500);

      if (newAttempts >= 3) {
        setTimeout(() => {
          setShowCorrectAnswer(true);
          setInputValue(question.correctAnswer);
          setTimeout(handleNextRound, 2500);
        }, 500);
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
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 pointer-events-none flex justify-around animate-pulse opacity-50 text-3xl">
          <span>🎉</span><span className="mt-12">⭐</span><span>🎈</span><span className="mt-24">🏆</span><span>✨</span>
        </div>
        <div className="text-[6rem] mb-2 animate-bounce z-10">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-2 z-10">
          {isRtl ? 'כָּל הַכָּבוֹד!' : 'Great Job!'}
        </h2>
        <button onClick={resetGame} className="bg-[#ffaa8b] hover:bg-[#ff9670] text-white px-10 py-3 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all z-10 mb-4 mt-8">
          {isRtl ? 'שַׂחֲקוּ שׁוּב' : 'Play Again'}
        </button>
        <button onClick={onBack} className="text-[#8aab9f] font-bold hover:underline z-10">
          {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <button onClick={onBack} className="self-start text-[#8aab9f] font-bold mb-4 block hover:underline">
        {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
      </button>

      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col w-2/3 max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>{isRtl ? 'הִתְקַדְּמוּת' : 'Progress'}</span>
            <span>{currentRound} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
               className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" 
               style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-xl relative z-10 ${streak >= 3 ? 'text-[#ffaa8b] animate-pulse drop-shadow-md' : 'text-gray-400'}`}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className={`w-full bg-white rounded-3xl shadow-lg p-6 sm:p-12 border-4 ${feedback === 'correct' ? 'border-green-300' : 'border-[#f0e6ce]'} ${shake ? 'animate-pulse border-red-300' : ''} transition-colors`}>
        
        <div className="text-center mb-8 flex flex-col items-center">
           <span className="font-black text-[#2d3748] whitespace-pre-line leading-none text-4xl sm:text-5xl mb-4">
              {question.questionDisplay}
           </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 mt-8">
           <input
             ref={inputRef}
             type="text"
             value={inputValue}
             onChange={e => setInputValue(e.target.value)}
             disabled={feedback === 'correct' || showCorrectAnswer}
             className={`w-full max-w-md text-3xl font-bold p-4 text-center rounded-2xl border-4 focus:outline-none transition-all ${
               feedback === 'correct' || showCorrectAnswer ? 'border-green-400 bg-green-50 text-green-700' : 
               feedback === 'incorrect' ? 'border-red-300 bg-red-50 text-red-700' : 
               'border-gray-200 focus:border-[#8aab9f] bg-gray-50'
             }`}
             placeholder={isRtl ? "הַקְלֵד כָּאן..." : "Type here..."}
             autoFocus
           />

           {showCorrectAnswer && (
             <div className="text-xl font-bold text-blue-600 bg-blue-50 px-8 py-3 rounded-full border-2 border-blue-200 animate-bounce">
               {isRtl ? `הַתְּשׁוּבָה הַנְּכוֹנָה הִיא: ${question.correctAnswer}` : `The correct answer is: ${question.correctAnswer}`}
             </div>
           )}

           {attempts >= 1 && feedback !== 'correct' && question.hintExample && (
             <div className="text-xl font-bold text-blue-500 bg-blue-50 px-6 py-2 rounded-xl animate-fade-in mt-2 border border-blue-200">
               {isRtl ? 'לְמָשָׁל:' : 'Like:'} <span dir="rtl">{question.hintExample}</span>
             </div>
           )}

           <button
             onClick={handleSubmit}
             disabled={inputValue === '' || feedback === 'correct'}
             className="bg-[#2d3748] hover:bg-black text-white px-12 py-4 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
           >
             {isRtl ? 'בְּדִיקָה' : 'Check'}
           </button>
        </form>
      </div>
    </div>
  );
}
