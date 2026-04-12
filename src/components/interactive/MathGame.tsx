'use client';

import React, { useState } from 'react';

// Fixed question banks for grades 1-6
const GRADE_QUESTIONS: Record<number, Array<{ text: string; answer: number }>> = {
  1: [ // כיתה א'
    { text: "5 + 3 = ?", answer: 8 },
    { text: "12 - 4 = ?", answer: 8 },
    { text: "10 + 7 = ?", answer: 17 },
    { text: "14 - 5 = ?", answer: 9 },
  ],
  2: [ // כיתה ב'
    { text: "25 + 14 = ?", answer: 39 },
    { text: "50 - 20 = ?", answer: 30 },
    { text: "4 x 2 = ?", answer: 8 },
    { text: "85 - 33 = ?", answer: 52 },
  ],
  3: [ // כיתה ג'
    { text: "7 x 8 = ?", answer: 56 },
    { text: "45 / 5 = ?", answer: 9 },
    { text: "100 - 45 = ?", answer: 55 },
    { text: "9 x 6 = ?", answer: 54 },
  ],
  4: [ // כיתה ד'
    { text: "15 x 4 = ?", answer: 60 },
    { text: "120 / 10 = ?", answer: 12 },
    { text: "300 - 125 = ?", answer: 175 },
    { text: "12 x 11 = ?", answer: 132 },
  ],
  5: [ // כיתה ה'
    { text: "5 + 4 x 3 = ?", answer: 17 },
    { text: "(10 - 2) x 5 = ?", answer: 40 },
    { text: "חצי מ-20 = ?", answer: 10 },
    { text: "1.5 + 2.5 = ?", answer: 4 },
  ],
  6: [ // כיתה ו'
    { text: "20% מתוך 50 = ?", answer: 10 },
    { text: "0.5 x 100 = ?", answer: 50 },
    { text: "3 רבעים מ-12 = ?", answer: 9 },
    { text: "10 + 2³ = ?", answer: 18 },
  ]
};

const GRADE_NAMES: Record<number, string> = {
  1: "כִּתָּה א׳",
  2: "כִּתָּה ב׳",
  3: "כִּתָּה ג׳",
  4: "כִּתָּה ד׳",
  5: "כִּתָּה ה׳",
  6: "כִּתָּה ו׳"
};

export default function MathGame() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [status, setStatus] = useState<'playing' | 'error' | 'success'>('playing');
  const [msg, setMsg] = useState('');
  const [stars, setStars] = useState(0);

  // If no grade is selected, show the selection menu
  if (selectedGrade === null) {
    return (
      <div className="flex flex-col items-center w-full" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">לְאֵיזוֹ כִּתָּה עוֹלִים?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl px-4">
          {[1, 2, 3, 4, 5, 6].map(grade => (
            <button
              key={grade}
              onClick={() => {
                setSelectedGrade(grade);
                setQIndex(0);
                resetState();
              }}
              className="bg-white border-2 border-[#7ca79b] text-[#618d7f] hover:bg-[#eaf1ec] hover:scale-105 active:scale-95 transition-all text-2xl font-bold py-6 rounded-[2rem] shadow-sm flex flex-col items-center gap-2"
            >
              <span>{GRADE_NAMES[grade]}</span>
              <span className="text-3xl">🎒</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const questions = GRADE_QUESTIONS[selectedGrade] || [];
  const currentQ = questions[qIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    // We only accept valid numeric input
    const num = parseFloat(inputVal);
    if (num === currentQ.answer) {
      // Success
      setStatus('success');
      setMsg('כָּל הַכָּבוֹד! ⭐😊');
      setStars(s => s + 1);
    } else {
      // Error
      const newFails = failedAttempts + 1;
      setFailedAttempts(newFails);
      setStatus('error');
      if (newFails === 1) {
        setMsg('כִּמְעַט... נַסּוּ שׁוּב 😊');
      } else {
        setMsg(`הַתְּשׁוּבָה הַנְּכוֹנָה הִיא ${currentQ.answer}`);
      }
    }
  };

  function nextQuestion() {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setQIndex(0); // loop back
    }
    resetState();
  }
  
  function resetState() {
    setInputVal('');
    setFailedAttempts(0);
    setStatus('playing');
    setMsg('');
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto" dir="rtl">
      
      {/* Top Bar Navigation */}
      <div className="w-full flex justify-between items-center mb-6 px-4">
         <button 
           onClick={() => setSelectedGrade(null)} 
           className="text-gray-500 hover:text-gray-800 font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
         >
           <span>חֲזֹר לִבְחִירַת כִּתָּה</span> <span>↩</span>
         </button>
         
         <div className="flex items-center gap-3">
           <h2 className="text-xl font-bold text-[#6a8f82]">{GRADE_NAMES[selectedGrade]}</h2>
           <div className="flex items-center justify-center bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-bold font-sans text-sm outline outline-2 outline-yellow-400">
             <span>{stars}</span> <span className="mr-1">⭐</span>
           </div>
         </div>
      </div>

      {/* Main Question Box */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 w-full text-center border-4 border-[#eaf1ed]">
         <div className="text-[3rem] md:text-[4.5rem] font-black text-[#2d3748] mb-6 font-mono select-none" dir="ltr">
            {currentQ.text}
         </div>

         {status !== 'success' && (
           <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
             <input
               type="number"
               step="any"   // Allows decimals if needed
               value={inputVal}
               onChange={e => setInputVal(e.target.value)}
               className="text-center text-3xl w-32 h-16 border-b-4 border-gray-300 focus:border-[#7ca79b] outline-none font-bold text-[#d89c8a] bg-gray-50 rounded-t-xl"
               autoFocus
             />
             <button type="submit" className="bg-[#7ca79b] hover:bg-[#618d7f] text-white px-8 py-3 text-xl font-bold rounded-full shadow-md transition-transform active:scale-95 mt-4">
               בִּדְקוּ אוֹתִי!
             </button>
           </form>
         )}

         {msg && (
           <div className={`mt-6 text-xl md:text-2xl font-bold p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 ${
             status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
           }`}>
             {msg}
           </div>
         )}
         
         {status === 'success' && (
           <button onClick={nextQuestion} className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-8 py-3 text-xl font-bold rounded-full shadow-md transition-transform active:scale-95 bounce">
             לַשְּׁאֵלָה הַבָּאָה 🚀
           </button>
         )}
         
         {status === 'error' && failedAttempts >= 2 && (
           <button onClick={nextQuestion} className="mt-4 text-gray-400 hover:text-gray-600 font-medium underline py-2">
             דַּלְּגוּ לַשְּׁאֵלָה הַבָּאָה
           </button>
         )}
      </div>
    </div>
  );
}
