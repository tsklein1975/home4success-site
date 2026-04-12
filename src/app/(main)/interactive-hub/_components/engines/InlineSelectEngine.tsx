"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllHebrewMultipleChoice } from '../../_data/curriculum/hebrewCurriculum';
import { MultipleChoiceQuestion } from '../../_data/curriculum/englishCurriculum';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

export default function InlineSelectEngine({ definition, onBack }: Props) {
  const TOTAL_ROUNDS = 10;
  const isRtl = definition.lang === 'he';

  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const initQuestions = useCallback(() => {
    let all: MultipleChoiceQuestion[] = [];
    if (definition.lang === 'he') {
      all = getAllHebrewMultipleChoice(definition.targetDataId);
    } // English optionally

    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: MultipleChoiceQuestion[] = [];

    if (shuffled.length === 0) {
      selected = Array(10).fill({ questionDisplay: '', options: [] });
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
    setGameOver(false);
    setSelectedValue('');
    setAttempts(0);
    setShowCorrectAnswer(false);
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
      setSelectedValue('');
      setAttempts(0);
      setShowCorrectAnswer(false);
    }
  }, [currentRound, TOTAL_ROUNDS]);

  const handleSelection = (value: string) => {
    if (feedback === 'correct' || showCorrectAnswer || gameOver || !question) return;

    setSelectedValue(value);
    
    if (value === question.correctAnswer.text) {
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
          setSelectedValue(question.correctAnswer.text);
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

  // extract the original sentence by removing the prefix we used previously "הוסיפו נקודה או סימן שאלה..."
  // Because it might be easier just to display it, or let's clean it up if it has a newline.
  let sentence = question.questionDisplay.split('\n').pop() || question.questionDisplay;

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

      <div className={`w-full bg-white rounded-3xl shadow-lg p-6 sm:p-12 border-4 ${feedback === 'correct' ? 'border-green-300' : 'border-[#f0e6ce]'} ${shake ? 'animate-pulse border-red-300' : ''} transition-colors min-h-[300px] flex flex-col justify-center`}>
        
        <div className="text-center mb-10 flex flex-col items-center">
           <h3 className="text-xl sm:text-2xl font-bold text-[#8aab9f] mb-4">
             {isRtl ? 'בַּחֲרוּ נְקוּדָה אוֹ סִימַן שְׁאֵלָה לְסִיּוּם הַמִּשְׁפָּט:' : 'Choose a dot or question mark for the sentence:'}
           </h3>
           <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-3xl sm:text-4xl text-[#2d3748] font-black" dir="rtl">
             
             {/* Render sentence logic here */}
             <span className="leading-relaxed bg-gray-50 border-b-2 border-gray-100 px-4 py-2 rounded-xl">
               {sentence}
             </span>
             
             {/* Inline Dropdown/Select */}
             {(() => {
               let selectClasses = 'mx-2 text-3xl px-3 py-1 font-bold rounded-2xl cursor-pointer text-center outline-none transition-all appearance-none border-4 outline-0 ';
               if (feedback === 'correct' || showCorrectAnswer) {
                 selectClasses += 'border-green-400 text-green-600 bg-green-50 scale-105 shadow-sm focus:border-green-400';
               } else if (feedback === 'incorrect' && !showCorrectAnswer) {
                 selectClasses += 'border-red-500 text-red-600 bg-red-50 shadow-sm focus:border-red-500';
               } else if (!selectedValue) {
                 selectClasses += 'border-dashed border-gray-300 text-gray-400 bg-white focus:border-[#8aab9f]';
               } else {
                 selectClasses += 'border-[#8aab9f] text-[#2d3748] bg-[#eef5f3] focus:border-[#8aab9f]';
               }

               return (
                 <select 
                   value={selectedValue}
                   onChange={(e) => handleSelection(e.target.value)}
                   disabled={feedback === 'correct' || showCorrectAnswer}
                   className={selectClasses}
                   dir="ltr"
                 >
                   <option value="" disabled>___</option>
                   {question.options?.map(opt => (
                     <option key={opt.text} value={opt.text}>{opt.text}</option>
                   ))}
                 </select>
               );
             })()}

           </div>
        </div>
      </div>
    </div>
  );
}
