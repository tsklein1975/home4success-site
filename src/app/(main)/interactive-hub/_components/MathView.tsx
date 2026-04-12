"use client";

import React, { useState, useEffect } from 'react';
import { generateMathProblem, MathProblem } from '../_data/mathData';

export default function MathView() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  const grades = [
    { level: 1, name: 'כִּתָּה א׳', desc: 'חִבּוּר וְחִסּוּר עַד 10' },
    { level: 2, name: 'כִּתָּה ב׳', desc: 'חִבּוּר דּוּ-סִפְרָתִי בְּקַלּוּת' },
    { level: 3, name: 'כִּתָּה ג׳', desc: 'לוּחַ הַכֶּפֶל וְחִלּוּק בְּסִיסִי' },
    { level: 4, name: 'כִּתָּה ד׳', desc: 'כֶּפֶל וְחִבּוּר מִתְקַדֵּם' },
    { level: 5, name: 'כִּתָּה ה׳', desc: 'אֲחוּזִים בְּסִיסִיִּים' },
    { level: 6, name: 'כִּתָּה ו׳', desc: 'הַשְׁלָמַת מְשׁוּוָאוֹת (אַלְגֶּבְּרָה)' },
  ];

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    setProblem(generateMathProblem(grade));
    setUserAnswer('');
    setFeedback('none');
  };

  const calculateResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || userAnswer.trim() === '') return;
    
    if (parseFloat(userAnswer) === problem.correctAnswer) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const nextProblem = () => {
    if (selectedGrade) {
      setProblem(generateMathProblem(selectedGrade));
      setUserAnswer('');
      setFeedback('none');
    }
  };

  if (selectedGrade && problem) {
    return (
      <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center" dir="rtl">
        <div className="flex w-full justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#2d3748]">כִּתָּה {selectedGrade}׳</h2>
          <button onClick={() => setSelectedGrade(null)} className="text-[#8aab9f] font-bold px-4 py-2 bg-white border-2 border-transparent hover:border-[#8aab9f] rounded-full transition-all">
            חֲזֹר ➔
          </button>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-lg p-8 sm:p-12 mb-8 border-4 border-[#f0e6ce] text-center">
          <div className="text-4xl sm:text-5xl font-bold text-[#8aab9f] mb-8" dir="ltr">
            {problem.equation}
          </div>
          
          <form onSubmit={calculateResult} className="flex flex-col items-center gap-6">
            <input 
              type="number"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setFeedback('none');
              }}
              className="text-center text-3xl font-bold border-b-4 border-[#e6b3a6] focus:border-[#d48c77] outline-none w-32 pb-2 text-[#2d3748] bg-transparent"
              placeholder="___"
              autoFocus
              dir="ltr"
            />
            {feedback === 'none' && (
              <button type="submit" className="w-full bg-[#8aab9f] text-white px-8 py-4 rounded-full font-bold text-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 mt-4">
                בִּדְקוּ תְּשׁוּבָה
              </button>
            )}
          </form>
          
          {feedback === 'correct' && (
            <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
              <span className="text-xl font-bold text-green-500 bg-green-50 px-6 py-2 rounded-full">מְעֻלֶּה! תְּשׁוּבָה נְכוֹנָה 🎉</span>
              <button onClick={nextProblem} className="w-full bg-[#e6b3a6] text-white px-8 py-4 rounded-full font-bold text-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
                תַּרְגִּיל הַבָּא
              </button>
            </div>
          )}
          
          {feedback === 'incorrect' && (
            <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
              <span className="text-xl font-bold text-red-500 bg-red-50 px-6 py-2 rounded-full">אוֹפְּס! נַסּוּ שׁוּב 🤔</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <h2 className="text-3xl font-bold text-[#2d3748] mb-8 text-center">אִימּוּן מָתֶמָטִיקָה</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {grades.map(grade => (
          <button
            key={grade.level}
            onClick={() => handleGradeSelect(grade.level)}
            className="bg-white hover:bg-[#eef5f3] rounded-3xl p-8 flex flex-col items-start justify-center shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#8aab9f] text-right group"
          >
            <span className="text-2xl font-bold text-[#2d3748] mb-2 group-hover:text-[#8aab9f] transition-colors">{grade.name}</span>
            <span className="text-[#4a5568]">{grade.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
