// ─────────────────────────────────────────────────────────────
// Shared vocabulary pool (used across multiple grades)
// ─────────────────────────────────────────────────────────────
export const ENGLISH_WORD_POOL = [
  { text: 'Apple',      icon: '🍎', letter: 'A' },
  { text: 'Ant',        icon: '🐜', letter: 'A' },
  { text: 'Ball',       icon: '⚽', letter: 'B' },
  { text: 'Bunny',      icon: '🐰', letter: 'B' },
  { text: 'Cat',        icon: '🐱', letter: 'C' },
  { text: 'Car',        icon: '🚗', letter: 'C' },
  { text: 'Dog',        icon: '🐶', letter: 'D' },
  { text: 'Drum',       icon: '🥁', letter: 'D' },
  { text: 'Elephant',   icon: '🐘', letter: 'E' },
  { text: 'Egg',        icon: '🥚', letter: 'E' },
  { text: 'Fish',       icon: '🐟', letter: 'F' },
  { text: 'Frog',       icon: '🐸', letter: 'F' },
  { text: 'Guitar',     icon: '🎸', letter: 'G' },
  { text: 'Grapes',     icon: '🍇', letter: 'G' },
  { text: 'Hat',        icon: '🎩', letter: 'H' },
  { text: 'House',      icon: '🏠', letter: 'H' },
  { text: 'Ice Cream',  icon: '🍦', letter: 'I' },
  { text: 'Igloo',      icon: '🧊', letter: 'I' },
  { text: 'Juice',      icon: '🧃', letter: 'J' },
  { text: 'Jellyfish',  icon: '🪼', letter: 'J' },
  { text: 'Kite',       icon: '🪁', letter: 'K' },
  { text: 'Key',        icon: '🔑', letter: 'K' },
  { text: 'Lion',       icon: '🦁', letter: 'L' },
  { text: 'Lemon',      icon: '🍋', letter: 'L' },
  { text: 'Monkey',     icon: '🐒', letter: 'M' },
  { text: 'Moon',       icon: '🌙', letter: 'M' },
  { text: 'Nest',       icon: '🪹', letter: 'N' },
  { text: 'Nose',       icon: '👃', letter: 'N' },
  { text: 'Orange',     icon: '🍊', letter: 'O' },
  { text: 'Owl',        icon: '🦉', letter: 'O' },
  { text: 'Pizza',      icon: '🍕', letter: 'P' },
  { text: 'Pencil',     icon: '✏️', letter: 'P' },
  { text: 'Queen',      icon: '👑', letter: 'Q' },
  { text: 'Rabbit',     icon: '🐰', letter: 'R' },
  { text: 'Rainbow',    icon: '🌈', letter: 'R' },
  { text: 'Sun',        icon: '☀️', letter: 'S' },
  { text: 'Snake',      icon: '🐍', letter: 'S' },
  { text: 'Turtle',     icon: '🐢', letter: 'T' },
  { text: 'Telephone',  icon: '☎️', letter: 'T' },
  { text: 'Umbrella',   icon: '☂️', letter: 'U' },
  { text: 'Violin',     icon: '🎻', letter: 'V' },
  { text: 'Whale',      icon: '🐋', letter: 'W' },
  { text: 'Window',     icon: '🪟', letter: 'W' },
  { text: 'Xylophone',  icon: '🎹', letter: 'X' },
  { text: 'Yo-yo',      icon: '🪀', letter: 'Y' },
  { text: 'Zebra',      icon: '🦓', letter: 'Z' },
];

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface MultipleChoiceQuestion {
  questionDisplay: string;
  audioText?: string;
  correctAnswer: { text: string; icon?: string; audioText?: string };
  options: { text: string; icon?: string; audioText?: string }[];
  type?: 'text-only' | 'icon-only' | 'mixed';
  icon?: string;
}

export interface OrderingQuestion {
  instruction: string;
  items: string[];          // items IN CORRECT ORDER — engine shuffles
}

export interface ReadingQuestion {
  passage: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface TypingQuestion {
  questionDisplay: string;
  correctAnswer: string;
  hintExample?: string;
}

export interface MultiSelectQuestion {
  questionDisplay: string;
  options: string[];
  correctAnswers: string[];
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export function getAllEnglishMultipleChoice(targetDataId: string): MultipleChoiceQuestion[] {
  switch (targetDataId) {
    case 'en_grade1_match': {
      return ENGLISH_WORD_POOL.map(correct => {
        const distractors = pick(ENGLISH_WORD_POOL.filter(w => w.letter !== correct.letter), 3);
        return {
          questionDisplay: correct.letter,
          correctAnswer: { text: correct.text, icon: correct.icon },
          options: shuffle([{ text: correct.text, icon: correct.icon }, ...distractors.map(d => ({ text: d.text, icon: d.icon }))]),
          type: 'icon-only',
        };
      });
    }

    case 'en_grade2_articles': {
      const vowelStarters = ['Apple','Egg','Elephant','Ice Cream','Igloo','Orange','Umbrella','Ant','Owl','Orange'];
      const consStarters = ['Ball','Cat','Dog','Fish','Guitar','Hat','Kite','Lion','Monkey','Rabbit','Snake','Tree'];
      const all = [...vowelStarters.map(w => ({ word: w, res: 'an' })), ...consStarters.map(w => ({ word: w, res: 'a' }))];
      return all.map(item => ({
        questionDisplay: `___ ${item.word}`,
        correctAnswer: { text: item.res },
        options: shuffle([{ text: 'a' }, { text: 'an' }, { text: 'the' }, { text: 'some' }]),
        type: 'text-only',
      }));
    }

    case 'en_grade3_vocab': {
      return ENGLISH_WORD_POOL.map(correct => {
        const distractors = pick(ENGLISH_WORD_POOL.filter(w => w.text !== correct.text), 3);
        return {
          questionDisplay: correct.text,
          correctAnswer: { text: correct.text, icon: correct.icon },
          options: shuffle([{ text: correct.text, icon: correct.icon }, ...distractors.map(d => ({ text: d.text, icon: d.icon }))]),
          type: 'icon-only',
        };
      });
    }

    case 'en_grade3_numbers': {
      const nums = [
        { num: '1', word: 'One' }, { num: '2', word: 'Two' }, { num: '3', word: 'Three' },
        { num: '4', word: 'Four' }, { num: '5', word: 'Five' }, { num: '6', word: 'Six' },
        { num: '7', word: 'Seven' }, { num: '8', word: 'Eight' }, { num: '9', word: 'Nine' }, { num: '10', word: 'Ten' },
      ];
      return nums.map(correct => {
        const distractors = pick(nums.filter(n => n.num !== correct.num), 3);
        return {
          questionDisplay: correct.num,
          correctAnswer: { text: correct.word },
          options: shuffle([{ text: correct.word }, ...distractors.map(d => ({ text: d.word }))]),
          type: 'text-only',
        };
      });
    }

    case 'en_grade4_questions': {
      const qs = [
        { sentence: '___ is your name?', answer: 'What' },
        { sentence: '___ are you from?', answer: 'Where' },
        { sentence: '___ did you do that?', answer: 'Why' },
        { sentence: '___ gave you the book?', answer: 'Who' },
        { sentence: '___ is the party?', answer: 'When' },
        { sentence: '___ do you go to school?', answer: 'How' },
        { sentence: '___ of these is correct?', answer: 'Which' },
      ];
      return qs.map(correct => ({
        questionDisplay: correct.sentence,
        correctAnswer: { text: correct.answer },
        options: shuffle(['Who', 'What', 'Where', 'When', 'Why', 'How', 'Which'].slice(0, 4).map(t => ({ text: t }))),
        type: 'text-only',
      }));
    }

    case 'en_grade4_grammar': {
      const qs = [
        { s: 'He ___ a red car.', a: 'has', d: ['have', 'having', 'is'] },
        { s: 'They ___ playing football.', a: 'are', d: ['is', 'am', 'was'] },
        { s: 'I ___ a student.', a: 'am', d: ['is', 'are', 'be'] },
        { s: 'She ___ to school every day.', a: 'goes', d: ['go', 'going', 'gone'] },
        { s: 'We ___ happy today!', a: 'are', d: ['is', 'am', 'be'] },
        { s: 'The cat ___ sleeping.', a: 'is', d: ['are', 'am', 'be'] },
        { s: 'You ___ my best friend.', a: 'are', d: ['is', 'am', 'be'] },
        { s: 'It ___ a beautiful day.', a: 'is', d: ['are', 'am', 'be'] },
        { s: 'Birds ___ in the sky.', a: 'fly', d: ['flies', 'flying', 'flew'] },
        { s: 'The sun ___ in the east.', a: 'rises', d: ['rise', 'rising', 'rose'] },
      ];
      return qs.map(q => ({
        questionDisplay: q.s,
        correctAnswer: { text: q.a },
        options: shuffle([{ text: q.a }, ...q.d.map(t => ({ text: t }))]),
        type: 'text-only',
      }));
    }

    default: return [getEnglishMultipleChoice(targetDataId)];
  }
}

export function getEnglishMultipleChoice(targetDataId: string): MultipleChoiceQuestion {
  const all = getAllEnglishMultipleChoice(targetDataId);
  return all[Math.floor(Math.random() * all.length)];
}

export function getAllEnglishOrdering(targetDataId: string): OrderingQuestion[] {
  switch (targetDataId) {
    case 'en_grade2_wordbuild': {
      const words = [
        { word: 'CAT', hint: 'A soft furry animal 🐱' },
        { word: 'DOG', hint: 'A loyal pet 🐶' },
        { word: 'SUN', hint: 'Shines in the sky ☀️' },
        { word: 'HAT', hint: 'You wear it on your head 🎩' },
        { word: 'BEE', hint: 'Makes honey 🐝' },
        { word: 'CUP', hint: 'You drink from it ☕' },
        { word: 'MAP', hint: 'Shows you where to go 🗺️' },
        { word: 'BOX', hint: 'You put things inside 📦' },
        { word: 'FUN', hint: 'Feeling happy 😊' },
        { word: 'RAT', hint: 'Small rodent 🐀' },
      ];
      return words.map(w => ({ instruction: `Spell: ${w.hint}`, items: w.word.split('') }));
    }
    case 'en_grade3_scramble': {
      const sentences = [
        'The cat sat on the mat',
        'I like to eat apples',
        'We are going to school',
        'My dog is very happy',
        'The sun is bright today',
        'She reads a book each night',
        'He plays football with friends',
        'The bird flies in the sky',
        'I have a blue pen',
        'Water is good for you',
      ];
      return sentences.map(s => ({ instruction: 'Build the correct sentence:', items: s.split(' ') }));
    }
    default: return [];
  }
}

export function getEnglishOrdering(targetDataId: string): OrderingQuestion {
  const all = getAllEnglishOrdering(targetDataId);
  return all[Math.floor(Math.random() * all.length)] || { instruction: 'Order:', items: [] };
}

export function getAllEnglishReading(targetDataId: string): ReadingQuestion[] {
  switch (targetDataId) {
    case 'en_grade4_reading': {
      return [
        {
          passage: 'Tom has a small white dog named Buddy. Buddy loves to run in the park and chase birds. One sunny day, Buddy found a big red ball under a tree. He brought it back to Tom, and they played all afternoon.',
          question: 'What did Buddy find under the tree?',
          correctAnswer: 'A big red ball',
          options: shuffle(['A bone', 'A big red ball', 'A bird', 'A stick']),
        },
        {
          passage: 'Sarah loves to read books about planets. Her favorite is Mars because it is red and has giant volcanoes. One day she wants to travel to space and see Mars herself.',
          question: "Why is Mars Sarah's favorite planet?",
          correctAnswer: 'It is red and has giant volcanoes',
          options: shuffle(['It is the biggest', 'It is the closest', 'It is red and has giant volcanoes', 'It has rings']),
        },
      ];
    }
    default: return [];
  }
}

export function getEnglishReading(targetDataId: string): ReadingQuestion {
  const all = getAllEnglishReading(targetDataId);
  return all[Math.floor(Math.random() * all.length)] || { passage: '', question: '', correctAnswer: '', options: [] };
}
