"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { hebrewMatchPairs, englishMatchPairs, MatchPair } from '../_data/matchGameData';

interface Props {
  lang: 'he' | 'en';
}

const TOTAL_ROUNDS = 10;

type OptionState = 'idle' | 'correct' | 'incorrect';

export default function LetterImageMatchGame({ lang }: Props) {
  const dictionary = lang === 'he' ? hebrewMatchPairs : englishMatchPairs;
  const isRtl = lang === 'he';

  const [currentRound, setCurrentRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const [sessionPairs, setSessionPairs] = useState<MatchPair[]>([]);
  const [targetPair, setTargetPair] = useState<MatchPair | null>(null);
  const [options, setOptions] = useState<MatchPair[]>([]);
  const [optionStates, setOptionStates] = useState<OptionState[]>([]);
  
  const [shake, setShake] = useState(false);
  const [showNext, setShowNext] = useState(false);

  // Initialize session
  const initSession = useCallback(() => {
    const shuffled = [...dictionary].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, TOTAL_ROUNDS);
    setSessionPairs(selected);
    return selected;
  }, [dictionary]);

  const generateRound = useCallback((roundIndex: number, pairsArr: MatchPair[]) => {
    const correct = pairsArr[roundIndex];
    if (!correct) return;

    // Pick 3 decoys from the rest of the dictionary
    const decoys = [...dictionary]
      .filter(p => p.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const finalOptions = [correct, ...decoys].sort(() => 0.5 - Math.random());

    setTargetPair(correct);
    setOptions(finalOptions);
    setOptionStates(finalOptions.map(() => 'idle'));
    setShowNext(false);
  }, [dictionary]);

  const startGame = () => {
    const selected = initSession();
    setCurrentRound(1);
    setStreak(0);
    setMaxStreak(0);
    setGameOver(false);
    setGameStarted(true);
    generateRound(0, selected);
  };

  const handleOptionClick = (index: number) => {
    if (showNext || gameOver) return;
    if (optionStates[index] === 'incorrect') return;
    
    const selected = options[index];
    if (selected.id === targetPair?.id) {
      const newOptionStates = [...optionStates];
      newOptionStates[index] = 'correct';
      setOptionStates(newOptionStates);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      setShowNext(true);

      if (currentRound >= TOTAL_ROUNDS) {
        setTimeout(() => setGameOver(true), 1500);
      }
    } else {
      const newOptionStates = [...optionStates];
      newOptionStates[index] = 'incorrect';
      setOptionStates(newOptionStates);
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const nextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      const nr = currentRound + 1;
      setCurrentRound(nr);
      generateRound(nr - 1, sessionPairs);
    }
  };

  const progressPercent = (currentRound / TOTAL_ROUNDS) * 100;

  if (!gameStarted) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-[5rem] mb-4">🧩</div>
        <h2 className="text-3xl font-bold text-[#2d3748] mb-4">
          {lang === 'he' ? 'התאמת תמונות' : 'Picture Matcher'}
        </h2>
        <p className="text-[#4a5568] text-center mb-8">
          {lang === 'he' 
            ? 'מצאו את התמונה שמתחילה באות המופיעה על המסך. האם תצליחו למצוא את כולם ברצף?' 
            : 'Find the picture that starts with the displayed letter. Can you get a perfect streak?'}
        </p>
        <button 
          onClick={startGame}
          className="bg-[#8aab9f] hover:bg-[#78968b] text-white px-10 py-4 rounded-full font-bold text-xl shadow-md hover:shadow-lg transition-all"
        >
          {lang === 'he' ? 'התחל משחק' : 'Start Game'}
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 pointer-events-none flex justify-around animate-pulse opacity-50 text-3xl">
          <span>🎉</span><span className="mt-12">⭐</span><span>🎈</span><span className="mt-24">🏆</span><span>✨</span>
        </div>
        
        <div className="text-[6rem] mb-2 animate-bounce z-10">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-2 z-10">
          {lang === 'he' ? 'כל הכבוד!' : 'Great Job!'}
        </h2>
        <p className="text-xl text-[#8aab9f] font-bold mb-6 z-10">
          {lang === 'he' ? 'סיימתם את המשחק בהצלחה!' : 'You successfully completed the game!'}
        </p>

        <div className="flex gap-4 mb-8 z-10">
          <div className="bg-[#fff0eb] rounded-2xl p-4 flex flex-col items-center shadow-sm">
            <span className="text-sm text-[#4a5568] font-bold">{lang === 'he' ? 'רצף שיא' : 'Best Streak'}</span>
            <span className="text-3xl font-black text-[#ffaa8b]">🔥 {maxStreak}</span>
          </div>
        </div>

        <button 
          onClick={startGame}
          className="bg-[#ffaa8b] hover:bg-[#ff9670] text-white px-10 py-3 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all z-10"
        >
          {lang === 'he' ? 'שחקו שוב' : 'Play Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col w-2/3 max-w-[200px] sm:max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>{lang === 'he' ? 'הִתְקַדְּמוּת' : 'Progress'}</span>
            <span>{currentRound} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8aab9f] transition-all duration-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className={`flex items-center gap-1 font-black text-xl ${streak >= 3 ? 'text-[#ffaa8b] animate-pulse' : 'text-gray-400'}`}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className={`flex flex-col items-center transition-transform duration-300 ${shake ? 'animate-pulse text-red-500' : ''}`}>
        <div className="bg-white border-4 border-[#8aab9f] rounded-3xl w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center shadow-lg mb-10 shrink-0 transform hover:scale-105 transition-transform relative">
           {showNext && <div className="absolute -top-4 -right-4 text-4xl animate-bounce">⭐</div>}
           <span className="text-[5rem] sm:text-[7rem] font-black text-[#2d3748] leading-none">
            {targetPair?.letter}
           </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-2xl px-2">
          {options.map((opt, i) => {
            const state = optionStates[i];
            
            let bgClasses = "bg-white border-gray-200 hover:border-[#8aab9f] hover:bg-[#fcfcfc]";
            if (state === 'correct') bgClasses = "bg-[#eef5f3] border-[#8aab9f] scale-105 shadow-lg ring-4 ring-[#8aab9f]/20";
            if (state === 'incorrect') bgClasses = "bg-gray-50 border-gray-200 opacity-50 grayscale scale-95";

            return (
              <button
                key={i}
                onClick={() => handleOptionClick(i)}
                disabled={showNext || state === 'incorrect'}
                className={`flex flex-col items-center justify-center aspect-square rounded-3xl border-2 transition-all duration-300 shadow-sm ${bgClasses}`}
              >
                 <span className="text-[4rem] sm:text-[5rem] leading-none mb-2 drop-shadow-sm transition-transform group-hover:scale-110">
                   {opt.emoji}
                 </span>
                 <span className="text-sm sm:text-base font-bold text-[#4a5568]">
                   {opt.word}
                 </span>
              </button>
            );
          })}
        </div>

        <div className="h-20 mt-8 flex items-center justify-center p-2">
          {showNext && currentRound < TOTAL_ROUNDS && (
            <button
               onClick={nextRound}
               className="bg-[#8aab9f] hover:bg-[#78968b] text-white px-12 py-3 rounded-full font-bold text-lg shadow-md animate-in slide-in-from-bottom-4 fade-in duration-300"
            >
              {lang === 'he' ? 'הֶמְשֵׁךְ' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
