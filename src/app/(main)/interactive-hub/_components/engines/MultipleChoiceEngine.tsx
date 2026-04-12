"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { getAllHebrewMultipleChoice } from '../../_data/curriculum/hebrewCurriculum';
import { getAllEnglishMultipleChoice, MultipleChoiceQuestion } from '../../_data/curriculum/englishCurriculum';
import { getAllMathG1MC } from '../../_data/curriculum/mathCurriculum';
import GeometricShape, { ShapeType } from './GeometricShape';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

export default function MultipleChoiceEngine({ definition, onBack }: Props) {
  const TOTAL_ROUNDS = 10;
  const isRtl = definition.lang === 'he';
  
  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);

  // Initialize session questions
  const initQuestions = useCallback(() => {
    let all: MultipleChoiceQuestion[] = [];
    if (definition.targetDataId.startsWith('math_')) {
      const mathAll = getAllMathG1MC(definition.targetDataId);
      all = mathAll.map(q => ({
        questionDisplay: q.question,
        icon: q.icon, // Passing icon for rendering
        correctAnswer: { text: q.correctAnswer },
        options: q.options.map(o => ({ text: o })),
        type: q.icon ? 'mixed' : 'text-only'
      }));
    } else if (definition.lang === 'he') {
      all = getAllHebrewMultipleChoice(definition.targetDataId);
    } else {
      all = getAllEnglishMultipleChoice(definition.targetDataId);
    }

    // Shuffle and pick 10. If we have less than 10, cycle them.
    let shuffled = [...all].sort(() => Math.random() - 0.5);
    let selected: MultipleChoiceQuestion[] = [];
    
    if (shuffled.length === 0) {
      // Fallback if no questions
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
    setSelectedOptIndex(null);
    setGameOver(false);
    setAttempts(0);
    setShowCorrectAnswer(false);
  }, [definition, TOTAL_ROUNDS]);

  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

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

  const playAudio = useCallback((text: string, e: React.MouseEvent, forceType?: 'words' | 'letters') => {
    e.stopPropagation();
    
    if (definition.lang === 'he') {
      const tryPlay = (type: 'words' | 'letters', fallback?: () => void) => {
        const audioPath = `/audio/hebrew/${type}/${text}.mp3`;
        const audio = new Audio(audioPath);
        
        audio.play().then(() => {
          console.log(`Playing local audio: ${audioPath}`);
        }).catch(() => {
          if (fallback) {
            fallback();
          } else {
            console.warn(`Local audio failed (${audioPath}), falling back to browser TTS`);
            fallbackTTS(text);
          }
        });
      };

      if (forceType) {
        tryPlay(forceType);
      } else {
        tryPlay('words', () => tryPlay('letters'));
      }
      return;
    }

    fallbackTTS(text);
  }, [definition.lang]);

  const fallbackTTS = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = definition.lang === 'he' ? 'he-IL' : 'en-US';
    
    utterance.pitch = 1.3;
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const specificVoices = voices.filter(v => v.lang.includes(definition.lang === 'he' ? 'he' : 'en'));
    const femaleVoice = specificVoices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.includes('Carmit') || 
      v.name.includes('Siri') || 
      v.name.includes('Samantha') || 
      v.name.includes('Google')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else if (specificVoices.length > 0) {
      utterance.voice = specificVoices[0];
    }
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleOptionClick = (index: number) => {
    if (feedback === 'correct' || showCorrectAnswer || gameOver || !question) return;
    if (selectedOptIndex === index && feedback === 'incorrect') return;
    
    setSelectedOptIndex(index);
    const opt = question.options[index];

    if (opt.text === question.correctAnswer.text) {
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

      <div className={`w-full bg-white rounded-3xl shadow-lg p-6 sm:p-12 border-4 ${feedback === 'correct' ? 'border-green-300' : 'border-[#f0e6ce]'} ${shake ? 'animate-pulse border-red-300' : ''} transition-colors`}>
        
        <div className="text-center mb-8 flex flex-col items-center">
           {question.icon && (
             <div className="mb-6">
                {['circle', 'square', 'triangle', 'rectangle', 'diamond', 'trapezoid', 'pentagon', 'hexagon'].includes(question.icon) ? (
                   <GeometricShape shape={question.icon as ShapeType} size={160} />
                ) : (
                   <div className="text-[6rem] animate-in zoom-in duration-500">
                      {question.icon}
                   </div>
                )}
             </div>
           )}
           <span className={`font-black text-[#2d3748] whitespace-pre-line leading-none ${question.type === 'icon-only' ? 'text-[6rem] mb-2' : 'text-4xl sm:text-5xl mb-4'}`}>
              {question.questionDisplay}
           </span>
           {question.audioText && (
             <button
               onClick={(e) => playAudio(question.audioText!, e)}
               className="bg-[#f0e6ce] hover:bg-[#e6d0a1] w-14 h-14 flex items-center justify-center rounded-full shadow-sm text-2xl transition-transform hover:scale-110 active:scale-95"
               aria-label="Play sound"
             >
               🔊
             </button>
           )}
        </div>

        <div className={`grid gap-4 mt-8 ${question.type === 'icon-only' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
           {question.options.map((opt, i) => {
              const isSelected = selectedOptIndex === i;
              const isCorrectReveal = showCorrectAnswer && opt.text === question.correctAnswer.text;
              
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
                  className={`relative border-2 py-6 px-4 rounded-2xl font-bold transition-all duration-300 flex flex-col items-center justify-center ${bgClasses}`}
                >
                  {opt.icon && <span className="text-[4rem] mb-2 leading-none drop-shadow-sm">{opt.icon}</span>}
                  {opt.text && (question.type !== 'icon-only' || !opt.icon) && <span className={`${opt.icon ? 'text-lg' : 'text-[3.5rem] leading-none'}`}>{opt.text}</span>}
                  {opt.audioText && (
                    <div 
                      onClick={(e) => playAudio(opt.audioText!, e)}
                      className="absolute top-2 left-2 cursor-pointer bg-white/80 hover:bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm text-lg hover:scale-110 transition-transform active:scale-95"
                      aria-label="Play letter sound"
                    >
                      🔊
                    </div>
                  )}
                </button>
              );
           })}
        </div>
      </div>
    </div>
  );
}
