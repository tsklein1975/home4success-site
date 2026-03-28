'use client';

import React, { useState } from 'react';
import GuidedTracingEngine from './GuidedTracingEngine';
import MathGame from './MathGame';
import { HEBREW_CHARS, ENGLISH_CHARS } from './guidedLetterData';

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState<'he' | 'en' | 'math'>('he');

  return (
    <div className="min-h-[80vh] flex flex-col bg-[#fef5f1] py-6 md:py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center">
        <h1 className="text-[2rem] md:text-[3rem] font-black text-center text-[#d5968b] mb-6 drop-shadow-sm tracking-wide">
          למידה אינטראקטיבית
        </h1>
        
        {/* Tabs */}
        <div className="flex justify-center gap-3 md:gap-4 mb-6 flex-wrap">
          <button 
            onClick={() => setActiveTab('he')}
            className={`px-5 py-2 md:px-8 md:py-3 rounded-[2rem] font-bold text-lg md:text-xl transition-all shadow-sm ${activeTab === 'he' ? 'bg-[#7ca79b] text-white scale-105 shadow-md' : 'bg-white text-[#7ca79b] hover:bg-[#eaf1ed] border-2 border-transparent hover:border-[#7ca79b]'}`}
          >
            עברית
          </button>
          <button 
            onClick={() => setActiveTab('en')}
            className={`px-6 py-3 md:px-10 md:py-4 rounded-[2rem] font-bold text-xl md:text-2xl transition-all shadow-sm ${activeTab === 'en' ? 'bg-[#7ca79b] text-white scale-105 shadow-md' : 'bg-white text-[#7ca79b] hover:bg-[#eaf1ed] border-2 border-transparent hover:border-[#7ca79b]'}`}
            dir="ltr"
          >
            English
          </button>
          <button 
            onClick={() => setActiveTab('math')}
            className={`px-6 py-3 md:px-10 md:py-4 rounded-[2rem] font-bold text-xl md:text-2xl transition-all shadow-sm ${activeTab === 'math' ? 'bg-[#7ca79b] text-white scale-105 shadow-md' : 'bg-white text-[#7ca79b] hover:bg-[#eaf1ed] border-2 border-transparent hover:border-[#7ca79b]'}`}
          >
            חשבון
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-[#f0ded5] min-h-[400px] w-full max-w-4xl flex justify-center items-start">
          {activeTab === 'he' && (
            <GuidedTracingEngine title="בחרו אות להתחיל לצייר:" letters={HEBREW_CHARS} lang="he" />
          )}
          {activeTab === 'en' && (
            <GuidedTracingEngine title="Choose a letter to trace:" letters={ENGLISH_CHARS} lang="en" />
          )}
          {activeTab === 'math' && (
            <MathGame />
          )}
        </div>
      </div>
    </div>
  );
}
