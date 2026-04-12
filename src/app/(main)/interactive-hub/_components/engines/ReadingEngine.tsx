"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllHebrewReading } from '../../_data/curriculum/hebrewCurriculum';
import { getAllEnglishReading, ReadingQuestion } from '../../_data/curriculum/englishCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

export default function ReadingEngine({ definition, onBack }: Props) {
  const isRtl = definition.lang === 'he';
  
  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<ReadingQuestion[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const initQuestions = useCallback(() => {
    let all: ReadingQuestion[] = [];
    if (definition.lang === 'he') {
      all = getAllHebrewReading(definition.targetDataId);
    } else {
      all = getAllEnglishReading(definition.targetDataId);
    }
    
    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: ReadingQuestion[] = [];
    
    if (shuffled.length === 0) {
      selected = Array(10).fill({ passage: 'Sample passage.', question: 'Sample question?', correctAnswer: 'A', options: ['A', 'B', 'C', 'D'] });
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
  }, [definition]);

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

      <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[500px]">
         <div className="flex-1 bg-[#fffdf8] border border-[#e6d0a1] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#f0e8d5] rounded-bl-full opacity-50"></div>
            <h3 className="text-xl font-bold text-[#8aab9f] mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span> {isRtl ? 'קִרְאוּ בְּעִיּוּן:' : 'Read carefully:'}
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px] lg:max-h-none">
              <p className="text-xl sm:text-2xl leading-relaxed text-[#2d3748] font-medium whitespace-pre-wrap">
                 {question.passage}
              </p>
            </div>
         </div>

         <div className={`flex-1 bg-white rounded-3xl shadow-lg p-6 sm:p-8 border-4 ${feedback === 'correct' ? 'border-green-300' : 'border-[#f0e6ce]'} ${shake ? 'animate-pulse border-red-300' : ''} transition-colors flex flex-col justify-center`}>
            
            <div className="text-center mb-8 flex flex-col items-center">
               <span className="text-2xl sm:text-3xl font-black text-[#2d3748] whitespace-pre-line leading-snug">
                  {question.question}
               </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {question.options.map((opt, i) => {
                  const isSelected = selectedOptIndex === i;
                  const isCorrectReveal = showCorrectAnswer && opt === question.correctAnswer;
                  
                  let bgClasses = "bg-gray-50 border-gray-200 text-[#4a5568] hover:bg-white hover:border-[#8aab9f]";
                  
                  if (isSelected) {
                    if (feedback === 'correct') bgClasses = "bg-green-50 border-green-400 text-green-700 shadow-lg scale-105";
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
                      className={`border-2 py-4 px-4 rounded-2xl font-bold text-xl transition-all duration-300 flex flex-col items-center justify-center ${bgClasses}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
               })}
            </div>

            {feedback === 'correct' && (
              <div className="mt-6 text-center animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                 <span className="text-lg font-bold text-green-600 bg-green-50 px-6 py-2 rounded-full border border-green-200 shadow-sm inline-block">
                   {isRtl ? 'הֲבָנָה מְצֻיֶּנֶת! 🎉' : 'Excellent reading! 🎉'}
                 </span>
              </div>
            )}
            {feedback === 'incorrect' && !showCorrectAnswer && (
              <div className="mt-6 text-center animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                 <span className="text-lg font-bold text-red-500 bg-red-50 px-6 py-2 rounded-full border border-red-200 shadow-sm inline-block">
                   {isRtl ? 'נַסּוּ לְחַפֵּשׂ בַּטֶּקְסְט שׁוּב 🤔' : 'Check the text again! 🤔'}
                 </span>
              </div>
            )}
            {showCorrectAnswer && (
              <div className="mt-6 text-center animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                 <span className="text-lg font-bold text-blue-600 bg-blue-50 px-6 py-2 rounded-full border border-blue-200 shadow-sm inline-block">
                   {isRtl ? `הַתְּשׁוּבָה הַנְּכוֹנָה הִיא: ${question.correctAnswer}` : `The correct answer is: ${question.correctAnswer}`}
                 </span>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
