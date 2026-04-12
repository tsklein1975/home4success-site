"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllHebrewMultiSelect } from '../../_data/curriculum/hebrewCurriculum';
import { MultiSelectQuestion } from '../../_data/curriculum/englishCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

export default function MultiSelectEngine({ definition, onBack }: Props) {
  const TOTAL_ROUNDS = 10;
  const isRtl = definition.lang === 'he';

  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<MultiSelectQuestion[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const initQuestions = useCallback(() => {
    let all: MultiSelectQuestion[] = [];
    if (definition.lang === 'he') {
      all = getAllHebrewMultiSelect(definition.targetDataId);
    }

    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: MultiSelectQuestion[] = [];

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
    setSelectedIndices(new Set());
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
      setSelectedIndices(new Set());
      setAttempts(0);
      setShowCorrectAnswer(false);
    }
  }, [currentRound, TOTAL_ROUNDS]);

  const handleToggle = (index: number) => {
    if (feedback === 'correct' || showCorrectAnswer || gameOver || !question) return;
    
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSubmit = () => {
    if (feedback === 'correct' || showCorrectAnswer || gameOver || !question) return;

    if (selectedIndices.size === 0) return;

    const userSelectedTexts = Array.from(selectedIndices).map(idx => question.options[idx]);
    const correctAnswersSet = new Set(question.correctAnswers);
    
    const isCorrect = userSelectedTexts.length === correctAnswersSet.size && 
                      userSelectedTexts.every(txt => correctAnswersSet.has(txt));

    if (isCorrect) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setTimeout(handleNextRound, 2000);
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
          // Auto-select the correct ones
          const correctIdxs = new Set<number>();
          question.options.forEach((opt, idx) => {
            if (question.correctAnswers.includes(opt)) correctIdxs.add(idx);
          });
          setSelectedIndices(correctIdxs);
          setTimeout(handleNextRound, 3000);
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
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
           <span className="font-black text-[#2d3748] whitespace-pre-line leading-none text-3xl sm:text-4xl mb-4">
              {question.questionDisplay}
           </span>
           <span className="text-lg text-gray-400 font-bold">
             {isRtl ? 'סַמְּנוּ אֶת כָּל הַתְּשׁוּבוֹת הַנְּכוֹנוֹת' : 'Select all correct answers'}
           </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {question.options.map((opt, i) => {
              const isSelected = selectedIndices.has(i);
              const isActuallyCorrect = question.correctAnswers.includes(opt);
              const isCorrectReveal = showCorrectAnswer && isActuallyCorrect;
              
              let bgClasses = "bg-gray-50 border-gray-200 text-[#4a5568] hover:bg-white hover:border-[#8aab9f]";
              
              if (isSelected) {
                if (feedback === 'none' || feedback === 'incorrect') {
                  bgClasses = "bg-[#eaf1ef] border-[#8aab9f] text-[#2d3748] shadow-sm";
                } else if (feedback === 'correct' || showCorrectAnswer) {
                  bgClasses = "bg-green-50 border-green-400 text-green-700 shadow-md scale-105";
                }
              }

              if (isCorrectReveal) {
                bgClasses = "bg-green-100 border-green-500 text-green-800 shadow-lg scale-105 z-20 animate-bounce";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleToggle(i)}
                  disabled={feedback === 'correct' || showCorrectAnswer}
                  className={`relative border-2 py-4 px-4 rounded-2xl font-bold text-2xl transition-all duration-300 flex flex-col items-center justify-center ${bgClasses} ${feedback === 'incorrect' && !showCorrectAnswer && isSelected && !isActuallyCorrect ? 'border-red-400 text-red-500 bg-red-50 opacity-70' : ''}`}
                >
                  {opt}
                </button>
              );
            })}
        </div>
        
        <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={selectedIndices.size === 0 || feedback === 'correct' || showCorrectAnswer}
              className="bg-[#2d3748] hover:bg-black text-white px-12 py-4 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {showCorrectAnswer ? (isRtl ? 'הַתְּשׁוּבוֹת הַנְּכוֹנוֹת' : 'Correct Answers') : (isRtl ? 'בְּדִיקָה' : 'Check')}
            </button>
        </div>
      </div>
    </div>
  );
}
