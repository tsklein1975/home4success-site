"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllHebrewOrdering } from '../../_data/curriculum/hebrewCurriculum';
import { getAllEnglishOrdering, OrderingQuestion } from '../../_data/curriculum/englishCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

// Utility to shuffle initially
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function OrderingEngine({ definition, onBack }: Props) {
  const isRtl = definition.lang === 'he';

  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<OrderingQuestion[]>([]);
  
  // Game interaction state
  const [availableItems, setAvailableItems] = useState<{ id: number, text: string }[]>([]);
  const [userOrder, setUserOrder] = useState<{ id: number, text: string }[]>([]);
  
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // Initialize and generate session questions
  const initQuestions = useCallback(() => {
    let all: OrderingQuestion[] = [];
    if (definition.lang === 'he') {
      all = getAllHebrewOrdering(definition.targetDataId);
    } else {
      all = getAllEnglishOrdering(definition.targetDataId);
    }
    
    // Shuffle and pick 10. If we have less than 10, cycle them.
    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: OrderingQuestion[] = [];
    
    if (shuffled.length === 0) {
      selected = Array(10).fill({ instruction: 'Sort the items:', items: ['A', 'B', 'C', 'D'] });
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
    // Setup first question
    const q = selected[0];
    const objects = q.items.map((text, i) => ({ id: i, text }));
    setAvailableItems(shuffleArray(objects));
    setUserOrder([]);
    setFeedback('none');
    setAttempts(0);
    setShowCorrectAnswer(false);
  }, [definition]);

  const setupNextRound = useCallback((round: number) => {
    const q = sessionQuestions[round - 1];
    if (q) {
      const objects = q.items.map((text, i) => ({ id: i, text }));
      setAvailableItems(shuffleArray(objects));
      setUserOrder([]);
      setFeedback('none');
      setAttempts(0);
      setShowCorrectAnswer(false);
    }
  }, [sessionQuestions]);

  useEffect(() => {
    initQuestions(); 
  }, [initQuestions]);

  const question = sessionQuestions[currentRound - 1];

  // Click handler: Move from Available to Ordered
  const handleSelectAvailable = (item: { id: number, text: string }) => {
    if (feedback === 'correct' || showCorrectAnswer || gameOver) return;
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    setUserOrder(prev => {
      const newOrder = [...prev, item];
      // Check if full
      if (question && newOrder.length === question.items.length) {
         validateOrder(newOrder);
      }
      return newOrder;
    });
    setFeedback('none'); // reset on any change
  };

  // Click handler: Move from Ordered back to Available
  const handleRemoveOrdered = (item: { id: number, text: string }) => {
    if (feedback === 'correct' || gameOver) return;
    setUserOrder(prev => prev.filter(i => i.id !== item.id));
    setAvailableItems(prev => [...prev, item]); // place at end
    setFeedback('none');
  };

  const validateOrder = (currentOrder: { id: number, text: string }[]) => {
    if (!question) return;
    
    // Map current string texts
    const userStrings = currentOrder.map(i => i.text);
    const correctStrings = question.items;
    
    let isCorrect = true;
    for (let i = 0; i < correctStrings.length; i++) {
       if (userStrings[i] !== correctStrings[i]) isCorrect = false;
    }

    if (isCorrect) {
      setFeedback('correct');
      setStreak(s => s + 1);
      
      if (currentRound >= TOTAL_ROUNDS) {
        setTimeout(() => setGameOver(true), 1500);
      } else {
        setTimeout(() => {
          const nextR = currentRound + 1;
          setCurrentRound(nextR);
          setupNextRound(nextR);
        }, 1500);
      }
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
          // Reveal correct order visually
          const correctIdxMap = question.items.map((text, i) => ({ id: i, text }));
          setUserOrder(correctIdxMap);
          setAvailableItems([]);
          
          setTimeout(() => {
            if (currentRound >= TOTAL_ROUNDS) {
              setGameOver(true);
            } else {
              const nextR = currentRound + 1;
              setCurrentRound(nextR);
              setupNextRound(nextR);
            }
          }, 2500);
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

  // Game Over Success Screen
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

  // Calculate grid cols dynamically based on the length
  const isParagraphs = question.items.some(i => i.length > 15);
  const blockClass = isParagraphs ? 'w-full text-lg block' : 'text-2xl min-w-16';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <button onClick={onBack} className="self-start text-[#8aab9f] font-bold hover:underline mb-4 block">
        {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
      </button>

      {/* Progress & Gamification HUD */}
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

      <div className={`w-full bg-white rounded-3xl shadow-lg p-6 sm:p-12 border-4 ${feedback === 'correct' ? 'border-green-300' : 'border-[#f0e6ce]'} ${shake ? 'animate-pulse border-red-300' : ''} transition-colors flex flex-col items-center`}>
        
        {/* Instruction */}
        <h3 className="text-3xl font-black text-[#8aab9f] mb-8 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
           {question.instruction}
        </h3>

        {/* User Output Canvas */}
        <div className="w-full max-w-2xl bg-gray-50 border-2 border-dashed border-gray-300 min-h-[120px] rounded-3xl p-6 mb-8 flex flex-wrap gap-3 items-center justify-center transition-colors">
           {userOrder.length === 0 && (
              <span className="text-gray-400 font-bold select-none text-center block w-full">
                 {isRtl ? 'לַחֲצוּ עַל בְּלוֹקִים לְמַטָּה כְּדֵי לִבְנוֹת פֹּה...' : 'Click items below to build here...'}
              </span>
           )}
           {userOrder.map((item, idx) => {
              const isWrong = feedback === 'incorrect' && item.text !== question.items[idx];
              return (
              <button
                 key={item.id}
                 onClick={() => handleRemoveOrdered(item)}
                 disabled={feedback === 'correct'}
                 className={`bg-white border-2 text-[#2d3748] font-bold py-3 px-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform animate-in zoom-in duration-200 ${blockClass} cursor-pointer hover:bg-gray-50 
                   ${isWrong ? 'border-red-500 bg-red-100 text-red-600' : 'border-[#8aab9f]'}`}
              >
                 {item.text}
              </button>
            )})}
        </div>

        {/* Available Options Bank */}
        <div className="w-full max-w-2xl border-t border-gray-100 pt-8 flex flex-wrap gap-3 justify-center min-h-[120px]">
           {availableItems.map((item) => (
              <button
                 key={item.id}
                 onClick={() => handleSelectAvailable(item)}
                 disabled={feedback === 'correct'}
                 className={`bg-[#eef5f3] hover:bg-[#8aab9f] hover:text-white border-2 border-transparent text-[#2d3748] font-bold py-3 px-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-all ${blockClass}`}
              >
                 {item.text}
              </button>
           ))}
        </div>

        {/* Feedback Ribbon */}
        {feedback === 'correct' && (
          <div className="mt-8 text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
             <span className="text-xl font-bold text-green-600 bg-green-50 px-8 py-3 rounded-full border border-green-200 shadow-sm inline-block">
               {isRtl ? 'מְעֻלֶּה! סֵדֶר מֻשְׁלָם 🎉' : 'Perfect Order! 🎉'}
             </span>
          </div>
        )}
        {feedback === 'incorrect' && !showCorrectAnswer && (
          <div className="mt-8 text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
             <span className="text-xl font-bold text-red-500 bg-red-50 px-8 py-3 rounded-full border border-red-200 shadow-sm inline-block">
               {isRtl ? 'אוֹפְּס! מַשֶּׁהוּ בַּסֵּדֶר לֹא יוֹשֵׁב טוֹב 🤔' : 'Oops, that sequence isn\'t right! 🤔'}
             </span>
          </div>
        )}
        {showCorrectAnswer && (
          <div className="mt-8 text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <span className="text-xl font-bold text-blue-600 bg-blue-50 px-8 py-3 rounded-full border border-blue-200 shadow-sm inline-block">
               {isRtl ? 'הַסֵּדֶר הַנָּכוֹן הוּא: ' : 'The correct order is: '}
               <span dir={isRtl ? 'rtl' : 'ltr'}>{question.items.join(isRtl ? ' ← ' : ' → ')}</span>
             </span>
          </div>
        )}

      </div>
    </div>
  );
}
