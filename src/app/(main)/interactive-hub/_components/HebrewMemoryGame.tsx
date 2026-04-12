"use client";

import React, { useState, useEffect, useCallback } from 'react';

import { hebrewMatchPairs as PAIRS_DATA } from '../_data/matchGameData';

type CardItem = {
  uniqueId: string;
  pairId: string;
  type: 'letter' | 'image';
  content: string; // the Hebrew letter, or the emoji
  label?: string; // used for the image card to show the word under emoji
};

const PAIRS_PER_GAME = 10; // Sub-sample to keep board child-friendly and mobile responsive

export default function HebrewMemoryGame() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const initGame = useCallback(() => {
    // 1. Shuffle and pick PAIRS_PER_GAME random pairs with UNIQUE letters
    //    so the child doesn't get confused by two identical 'ב' cards.
    const shuffledPairs = [...PAIRS_DATA].sort(() => 0.5 - Math.random());
    const uniquePairs: typeof PAIRS_DATA = [];
    const usedLetters = new Set<string>();
    
    for (const pair of shuffledPairs) {
      if (!usedLetters.has(pair.letter)) {
        usedLetters.add(pair.letter);
        uniquePairs.push(pair);
      }
      if (uniquePairs.length === PAIRS_PER_GAME) break;
    }

    // 2. Generate two cards per pair
    const deck: CardItem[] = [];
    uniquePairs.forEach((pair) => {
      // Letter Card
      deck.push({
        uniqueId: `letter-${pair.id}-${Math.random()}`,
        pairId: pair.id,
        type: 'letter',
        content: pair.letter,
      });
      // Image Card
      deck.push({
        uniqueId: `image-${pair.id}-${Math.random()}`,
        pairId: pair.id,
        type: 'image',
        content: pair.emoji,
        label: pair.word,
      });
    });

    // 3. Shuffle the final deck
    deck.sort(() => 0.5 - Math.random());

    setCards(deck);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setIsLocked(false);
    setIsWin(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (flippedIndices.includes(index)) return; // Already flipped
    if (matchedPairs.includes(cards[index].pairId)) return; // Already matched

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        setTimeout(() => {
          setMatchedPairs((prev) => {
            const newMatched = [...prev, firstCard.pairId];
            if (newMatched.length === PAIRS_PER_GAME) {
              setIsWin(true);
            }
            return newMatched;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 500); // Small delay to let them see it
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1200); // give them 1.2s to memorize
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col items-center" dir="rtl">
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#2d3748] mb-2">משחק זיכרון</h2>
        <p className="text-[#4a5568] text-sm max-w-lg mx-auto leading-relaxed">
          הפכו שני קלפים בכל פעם ונסו למצוא התאמה בין האות לבין התמונה שמתחילה באותה אות
        </p>
      </div>

      {isWin ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#eef5f3] rounded-3xl w-full max-w-md animate-in fade-in zoom-in duration-500 shadow-sm border border-[#8aab9f]">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-[#2d3748] mb-2 text-center">
            כל הכבוד!
          </h3>
          <p className="text-[#8aab9f] font-medium text-lg mb-6 text-center">
            מצאתם את כל הזוגות!
          </p>
          <button
            onClick={initGame}
            className="bg-[#ffaa8b] hover:bg-[#ff9670] text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            שחקו שוב
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full px-1 sm:px-2">
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.pairId);
            const isMatched = matchedPairs.includes(card.pairId);

            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(index)}
                className="relative aspect-[4/5] w-full [perspective:1000px] group focus:outline-none"
                aria-label="פתח קלף זיכרון"
              >
                <div
                  className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Front logic (what child sees when facedown) */}
                  <div className="absolute inset-0 w-full h-full bg-[#8aab9f] border-4 border-white rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center [backface-visibility:hidden] hover:bg-[#78968b] transition-colors">
                    <span className="text-white/40 text-5xl sm:text-6xl w-full text-center drop-shadow-sm">★</span>
                  </div>

                  {/* Back logic (the actual letter or image) */}
                  <div
                    className={`absolute inset-0 w-full h-full bg-white border-2 rounded-xl sm:rounded-2xl shadow-md flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all ${
                      isMatched ? 'border-[#ffaa8b] bg-opacity-70 opacity-70' : 'border-[#8aab9f]'
                    }`}
                  >
                    {card.type === 'letter' ? (
                      <span className="text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] font-black text-[#2d3748] leading-none mb-1 drop-shadow-sm">
                        {card.content}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full pt-2">
                        <span className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] leading-none drop-shadow-sm">
                          {card.content}
                        </span>
                        <span className="mt-2 text-sm sm:text-base md:text-lg font-bold text-[#4a5568]">
                          {card.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Re-roll button visible strictly on the bottom if they want a new board early */}
      {!isWin && (
        <button
          onClick={initGame}
          className="mt-8 text-sm text-[#4a5568] hover:text-[#8aab9f] underline decoration-dotted transition-colors"
        >
          התחל משחק חדש
        </button>
      )}
    </div>
  );
}
