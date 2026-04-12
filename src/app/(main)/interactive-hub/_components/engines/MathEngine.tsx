"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameDefinition } from '../../_data/curriculum/gameCatalog';
import { generateMathQuestion, MathQuestionData } from '../../_data/curriculum/mathGenerators';

interface Props {
  definition: GameDefinition;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

export default function MathEngine({ definition, onBack }: Props) {
  const isRtl = definition.lang === 'he';
  const [currentRound, setCurrentRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<MathQuestionData[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswerBefore, setUserAnswerBefore] = useState('');
  const [userAnswerAfter, setUserAnswerAfter] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<'before' | 'after' | 'main'>('main');
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // 1. Static Curriculum Fetchers
  const { getAllMathG1Numpad } = require('../../_data/curriculum/mathCurriculum');

  const initQuestions = useCallback(() => {
    let selected: MathQuestionData[] = [];
    
    // Check if we have a static pool first
    const staticPool = getAllMathG1Numpad(definition.targetDataId);
    
    if (staticPool && staticPool.length > 0) {
      // Shuffled pool
      let shuffled = [...staticPool].sort(() => Math.random() - 0.5);
      while (selected.length < TOTAL_ROUNDS) {
        selected.push(...shuffled);
        shuffled = [...staticPool].sort(() => Math.random() - 0.5);
      }
      selected = selected.slice(0, TOTAL_ROUNDS);
    } else {
      // Dynamic generation (for other grades)
      const uniqueEquations = new Set<string>();
      let attempts = 0;
      while (selected.length < TOTAL_ROUNDS && attempts < 200) {
        const q = generateMathQuestion(definition.targetDataId);
        if (!uniqueEquations.has(q.equation)) {
          uniqueEquations.add(q.equation);
          selected.push(q);
        }
        attempts++;
      }
      // Fallback if unable to generate 10 unique
      while (selected.length < TOTAL_ROUNDS) {
        selected.push(generateMathQuestion(definition.targetDataId));
      }
    }

    setSessionQuestions(selected);
    setCurrentRound(1);
    setGameOver(false);
    setCorrectCount(0);
    setStars(0);
    setStreak(0);
    setAttempts(0);
    setShowCorrectAnswer(false);
  }, [definition.targetDataId]);

  useEffect(() => { 
    initQuestions();
  }, [initQuestions]);

  const question = sessionQuestions[currentRound - 1];

  const handleNextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      const earned = correctCount === TOTAL_ROUNDS ? 3 : correctCount >= 7 ? 2 : 1;
      setStars(earned);
      setTimeout(() => setGameOver(true), 1000);
    } else {
      setCurrentRound(r => r + 1);
      setUserAnswer('');
      setUserAnswerBefore('');
      setUserAnswerAfter('');
      setFeedback('none');
      setSelectedOpt(null);
      setActiveInput('before');
      setAttempts(0);
      setShowCorrectAnswer(false);
    }
  }, [currentRound, TOTAL_ROUNDS, correctCount]);

  const checkAnswer = (answer: string) => {
    if (!question || feedback === 'correct' || showCorrectAnswer) return;
    
    let isCorrect = false;
    if (question.type === 'consecutive') {
      const b = parseFloat(userAnswerBefore);
      const a = parseFloat(userAnswerAfter);
      isCorrect = b === question.correctAnswers?.[0] && a === question.correctAnswers?.[1];
    } else {
      isCorrect = question.type === 'fraction'
        ? answer === question.correctFractionAnswer
        : parseFloat(answer) === question.correctAnswer;
    }

    if (isCorrect) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setCorrectCount(prev => prev + 1);
      setTimeout(handleNextRound, 1400);
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
        setTimeout(() => setFeedback('none'), 1000);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (question.type === 'consecutive') {
      if (userAnswerBefore !== '' && userAnswerAfter !== '') checkAnswer('');
    } else {
      if (userAnswer !== '') checkAnswer(userAnswer);
    }
  };

  const resetGame = () => {
    initQuestions();
  };

  if (!question) return null;

  const progressPercent = (currentRound / TOTAL_ROUNDS) * 100;
  const isMCQ = question.type === 'fraction' || (question.options && question.options.length > 0);
  const isNumpad = definition.type === 'math-numpad' && !isMCQ;

  if (gameOver) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 pointer-events-none flex justify-around items-start pt-4 text-4xl opacity-40 animate-pulse">
          {'🎉🌟✨🎈🏆'.split('').map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div className="text-8xl mb-4 animate-bounce z-10">🏆</div>
        <h2 className="text-4xl font-black text-[#2d3748] mb-2 z-10">{isRtl ? 'כָּל הַכָּבוֹד!' : 'Well Done!'}</h2>
        <div className="flex gap-2 text-4xl my-3 z-10">
          {[1,2,3].map(s => <span key={s} className={s <= stars ? 'opacity-100 animate-bounce' : 'opacity-20'} style={{ animationDelay: `${s * 0.15}s` }}>⭐</span>)}
        </div>
        <p className="text-[#718096] mb-6 font-medium z-10">{isRtl ? `${correctCount}/${TOTAL_ROUNDS} תְּשׁוּבוֹת נְכוֹנוֹת` : `${correctCount}/${TOTAL_ROUNDS} correct`}</p>
        <div className="flex gap-3 z-10 flex-wrap justify-center">
          <button onClick={resetGame} className="bg-[#8aab9f] hover:bg-[#7a9b8f] text-white px-8 py-3 rounded-full font-bold text-lg shadow-md">
            {isRtl ? '🔄 שַׂחֲקוּ שׁוּב' : '🔄 Play Again'}
          </button>
          <button onClick={onBack} className="bg-gray-100 hover:bg-gray-200 text-[#4a5568] px-8 py-3 rounded-full font-bold text-lg">
            {isRtl ? '← חֲזֹר' : '← Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <button onClick={onBack} className="text-[#8aab9f] font-bold mb-4 block hover:underline">
        {isRtl ? '← חֲזֹר לַמִּשְׂחָקִים' : '← Back'}
      </button>

      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col w-2/3 max-w-[200px] sm:max-w-md relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#8aab9f] mb-2">
            <span>{isRtl ? 'שְׁאֵלָה' : 'Question'}</span>
            <span>{currentRound} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#8aab9f] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-1 font-black text-xl ${streak >= 3 ? 'text-[#ffaa8b] animate-pulse' : 'text-gray-300'}`}>
          🔥 <span>{streak}</span>
        </div>
      </div>

      <div className={`w-full bg-white rounded-3xl shadow-lg border-4 p-6 sm:p-10 transition-all ${shake ? 'border-red-300 animate-pulse' : feedback === 'correct' ? 'border-green-300' : 'border-[#f0e6ce]'}`}>

        {question.type === 'visual' && question.visualObject && (
          <div className="flex flex-wrap justify-center gap-3 text-5xl mb-8 bg-[#fcfaf5] p-6 rounded-2xl">
            {Array.from({ length: question.correctAnswer }).map((_, i) => (
              <span key={i}>{question.visualObject}</span>
            ))}
          </div>
        )}

        {!isNumpad && question.type !== 'consecutive' && (
          <div className="text-center mb-8">
            <span className={`font-black text-[#2d3748] whitespace-pre-line leading-snug ${question.type === 'word' ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-5xl'}`} dir="ltr">
              {question.equation}
            </span>
          </div>
        )}

        {question.type === 'fraction' && question.fractionOptions && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {question.fractionOptions.map(opt => {
              const isSelected = selectedOpt === opt;
              let cls = 'bg-gray-50 border-gray-200 hover:border-[#8aab9f] hover:bg-white text-[#2d3748]';
              if (isSelected && feedback === 'correct') cls = 'bg-green-50 border-green-400 text-green-700 scale-105';
              if (isSelected && feedback === 'incorrect') cls = 'bg-red-50 border-red-300 text-red-500';
              return (
                <button key={opt} onClick={() => { setSelectedOpt(opt); checkAnswer(opt); }}
                  disabled={feedback === 'correct'} dir="ltr"
                  className={`border-2 py-6 rounded-2xl font-black text-4xl transition-all ${cls}`}
                >{opt}</button>
              );
            })}
          </div>
        )}

        {!question.fractionOptions && isMCQ && question.options && (
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {question.options.map(opt => {
              const key = String(opt);
              const isSelected = selectedOpt === key;
              let cls = 'bg-gray-50 border-gray-200 hover:border-[#8aab9f] hover:bg-white text-[#2d3748]';
              if (isSelected && feedback === 'correct') cls = 'bg-green-50 border-green-400 text-green-700 scale-105';
              if (isSelected && feedback === 'incorrect') cls = 'bg-red-50 border-red-300 text-red-500';
              return (
                <button key={key} onClick={() => { setSelectedOpt(key); checkAnswer(key); }}
                  disabled={feedback === 'correct'} dir="ltr"
                  className={`border-2 py-6 rounded-2xl font-black text-2xl transition-all ${cls}`}
                >{opt}</button>
              );
            })}
          </div>
        )}

        {isNumpad && (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            {question.type === 'consecutive' ? (
              <div className="flex items-center justify-center gap-6 sm:gap-10" dir="ltr">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={userAnswerBefore}
                    onChange={e => { setUserAnswerBefore(e.target.value); setFeedback('none'); }}
                    onFocus={() => setActiveInput('before')}
                    className={`text-center text-4xl sm:text-6xl font-black border-b-8 outline-none w-24 sm:w-32 pb-2 bg-transparent transition-colors ${activeInput === 'before' ? 'border-[#8aab9f] text-[#2d3748]' : 'border-gray-200 text-gray-400'}`}
                    placeholder="?"
                    disabled={feedback === 'correct'}
                  />
                  <span className="text-xs font-bold text-[#8aab9f] mt-2 uppercase tracking-widest">{isRtl ? 'לִפְנֵי' : 'Before'}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-[#fcfaf5] w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center shadow-inner border-4 border-[#f0e6ce]">
                    <span className="text-4xl sm:text-6xl font-black text-[#2d3748]">{question.equation}</span>
                  </div>
                  {/* Spacer to match label height on sides */}
                  <span className="text-xs mt-2 opacity-0 select-none uppercase tracking-widest">SPACER</span>
                </div>

                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={userAnswerAfter}
                    onChange={e => { setUserAnswerAfter(e.target.value); setFeedback('none'); }}
                    onFocus={() => setActiveInput('after')}
                    className={`text-center text-4xl sm:text-6xl font-black border-b-8 outline-none w-24 sm:w-32 pb-2 bg-transparent transition-colors ${activeInput === 'after' ? 'border-[#8aab9f] text-[#2d3748]' : 'border-gray-200 text-gray-400'}`}
                    placeholder="?"
                    disabled={feedback === 'correct'}
                  />
                  <span className="text-xs font-bold text-[#8aab9f] mt-2 uppercase tracking-widest">{isRtl ? 'אַחֲרֵי' : 'After'}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-center gap-4 flex-wrap text-5xl sm:text-7xl font-black text-[#2d3748]" dir="ltr">
                {(() => {
                  const parts = question.equation.split(/__|\?/);
                  if (parts.length === 2) {
                    return (
                      <>
                        {parts[0]}
                        <input
                          type="number" step="any"
                          value={userAnswer}
                          onChange={e => { setUserAnswer(e.target.value); setFeedback('none'); }}
                          className="text-center border-b-8 border-[#8aab9f] focus:border-[#6b8b7f] outline-none w-24 sm:w-32 pb-2 bg-transparent transition-all"
                          autoFocus dir="ltr"
                          disabled={feedback === 'correct'}
                        />
                        {parts[1]}
                      </>
                    );
                  }
                  
                  return (
                    <div className="flex flex-col items-center gap-6">
                      <span>{question.equation}</span>
                      <input
                        type="number" step="any"
                        value={userAnswer}
                        onChange={e => { setUserAnswer(e.target.value); setFeedback('none'); }}
                        className="text-center border-b-8 border-[#8aab9f] focus:border-[#6b8b7f] outline-none w-32 sm:w-48 pb-2 bg-transparent transition-all"
                        placeholder="___" autoFocus dir="ltr"
                        disabled={feedback === 'correct'}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {feedback !== 'correct' && (
              <button 
                type="submit" 
                disabled={question.type === 'consecutive' ? (userAnswerBefore === '' || userAnswerAfter === '') : userAnswer === ''}
                className={`px-12 py-5 rounded-full font-black text-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
                  (question.type === 'consecutive' ? (userAnswerBefore !== '' && userAnswerAfter !== '') : userAnswer !== '')
                    ? 'bg-[#8aab9f] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isRtl ? 'בִּדְקוּ תְּשׁוּבָה' : 'Check'}
              </button>
            )}
          </form>
        )}

        {feedback === 'correct' && (
          <div className="mt-6 text-center animate-in fade-in zoom-in duration-300">
            <span className="text-lg font-bold text-green-600 bg-green-50 px-6 py-2 rounded-full border border-green-200 inline-block">
              {isRtl ? '✅ מְעֻלֶּה! תְּשׁוּבָה נְכוֹנָה' : '✅ Correct!'}
            </span>
          </div>
        )}
        {feedback === 'incorrect' && !showCorrectAnswer && (
          <div className="mt-6 text-center animate-in fade-in zoom-in duration-300">
            <span className="text-lg font-bold text-red-500 bg-red-50 px-6 py-2 rounded-full border border-red-200 inline-block">
              {isRtl ? '❌ אוֹפְּס! נַסּוּ שׁוּב' : '❌ Oops, try again!'}
            </span>
          </div>
        )}
        {showCorrectAnswer && (
          <div className="mt-6 text-center animate-in fade-in zoom-in duration-300">
            <span className="text-lg font-bold text-blue-600 bg-blue-50 px-6 py-2 rounded-full border border-blue-200 inline-block">
              {isRtl ? 'הַתְּשׁוּבָה הַנְּכוֹנָה הִיא: ' : 'Correct answer is: '}
              {question.type === 'consecutive' 
                ? `${question.correctAnswers?.[0]}, ${question.equation}, ${question.correctAnswers?.[1]}`
                : question.type === 'fraction' ? question.correctFractionAnswer : question.correctAnswer}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
