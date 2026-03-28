/**
 * Guided Letter Data — stroke definitions for the tracing engine.
 *
 * Every letter has explicit, manually defined stroke paths.
 * Coordinates live in a 0–100 SVG viewBox.
 *
 * Strokes are ordered by writing sequence.
 */

export interface StrokeData {
  id: number;
  path: string;          // SVG <path> d attribute
  startX: number;        // start point X in viewBox 0-100
  startY: number;        // start point Y in viewBox 0-100
}

export interface LetterData {
  char: string;
  language: 'he' | 'en';
  strokes: StrokeData[];
}

// ═══════════════════════════════════════════════
//  HEBREW LETTERS (all 22 print letters)
// ═══════════════════════════════════════════════

export const hebrewLetterData: Record<string, LetterData> = {
  'א': {
    char: 'א', language: 'he',
    strokes: [
      { id: 1, path: 'M 66,24 L 34,76', startX: 66, startY: 24 },
      { id: 2, path: 'M 40,30 Q 30,22 28,36', startX: 40, startY: 30 },
      { id: 3, path: 'M 60,66 Q 72,76 70,62', startX: 60, startY: 66 },
    ],
  },
  'ב': {
    char: 'ב', language: 'he',
    strokes: [
      { id: 1, path: 'M 70,26 L 30,26', startX: 70, startY: 26 },
      { id: 2, path: 'M 70,26 L 70,76', startX: 70, startY: 26 },
      { id: 3, path: 'M 70,76 L 26,76', startX: 70, startY: 76 },
    ],
  },
  'ג': {
    char: 'ג', language: 'he',
    strokes: [
      { id: 1, path: 'M 56,20 L 56,68', startX: 56, startY: 20 },
      { id: 2, path: 'M 56,68 L 38,82', startX: 56, startY: 68 },
    ],
  },
  'ד': {
    char: 'ד', language: 'he',
    strokes: [
      { id: 1, path: 'M 70,26 L 30,26', startX: 70, startY: 26 },
      { id: 2, path: 'M 70,26 L 70,76', startX: 70, startY: 26 },
    ],
  },
  'ה': {
    char: 'ה', language: 'he',
    strokes: [
      { id: 1, path: 'M 72,26 L 28,26', startX: 72, startY: 26 },
      { id: 2, path: 'M 72,26 L 72,76', startX: 72, startY: 26 },
      { id: 3, path: 'M 34,40 L 34,76', startX: 34, startY: 40 },
    ],
  },
  'ו': {
    char: 'ו', language: 'he',
    strokes: [
      { id: 1, path: 'M 52,20 L 52,78', startX: 52, startY: 20 },
    ],
  },
  'ז': {
    char: 'ז', language: 'he',
    strokes: [
      { id: 1, path: 'M 62,26 L 38,26', startX: 62, startY: 26 },
      { id: 2, path: 'M 50,26 L 50,78', startX: 50, startY: 26 },
    ],
  },
  'ח': {
    char: 'ח', language: 'he',
    strokes: [
      { id: 1, path: 'M 72,26 L 28,26', startX: 72, startY: 26 },
      { id: 2, path: 'M 72,26 L 72,76', startX: 72, startY: 26 },
      { id: 3, path: 'M 28,26 L 28,76', startX: 28, startY: 26 },
    ],
  },
  'ט': {
    char: 'ט', language: 'he',
    strokes: [
      { id: 1, path: 'M 28,76 L 28,38 Q 28,20 50,20', startX: 28, startY: 76 },
      { id: 2, path: 'M 50,20 Q 72,20 72,38 L 72,58', startX: 50, startY: 20 },
    ],
  },
  'י': {
    char: 'י', language: 'he',
    strokes: [
      { id: 1, path: 'M 55,30 Q 50,40 48,50', startX: 55, startY: 30 },
    ],
  },
  'כ': {
    char: 'כ', language: 'he',
    strokes: [
      { id: 1, path: 'M 70,26 Q 70,20 50,26 L 30,35', startX: 70, startY: 26 },
      { id: 2, path: 'M 30,35 Q 28,50 40,65 L 68,78', startX: 30, startY: 35 },
    ],
  },
  'ל': {
    char: 'ל', language: 'he',
    strokes: [
      { id: 1, path: 'M 58,82 L 58,40 Q 58,16 38,16', startX: 58, startY: 82 },
    ],
  },
  'מ': {
    char: 'מ', language: 'he',
    strokes: [
      { id: 1, path: 'M 70,20 L 70,76', startX: 70, startY: 20 },
      { id: 2, path: 'M 70,76 Q 52,84 32,70', startX: 70, startY: 76 },
      { id: 3, path: 'M 32,70 L 32,30', startX: 32, startY: 70 },
    ],
  },
  'נ': {
    char: 'נ', language: 'he',
    strokes: [
      { id: 1, path: 'M 62,26 Q 60,45 40,65', startX: 62, startY: 26 },
      { id: 2, path: 'M 40,65 L 40,78', startX: 40, startY: 65 },
    ],
  },
  'ס': {
    char: 'ס', language: 'he',
    strokes: [
      { id: 1, path: 'M 50,20 Q 72,20 72,50 Q 72,78 50,78 Q 28,78 28,50 Q 28,20 50,20', startX: 50, startY: 20 },
    ],
  },
  'ע': {
    char: 'ע', language: 'he',
    strokes: [
      { id: 1, path: 'M 50,22 L 30,78', startX: 50, startY: 22 },
      { id: 2, path: 'M 50,22 L 70,78', startX: 50, startY: 22 },
    ],
  },
  'פ': {
    char: 'פ', language: 'he',
    strokes: [
      { id: 1, path: 'M 72,26 L 28,26 L 28,76 L 72,76', startX: 72, startY: 26 },
      { id: 2, path: 'M 60,42 Q 45,42 45,55 Q 45,65 60,65', startX: 60, startY: 42 },
    ],
  },
  'צ': {
    char: 'צ', language: 'he',
    strokes: [
      { id: 1, path: 'M 65,78 L 65,30 Q 65,18 55,18', startX: 65, startY: 78 },
      { id: 2, path: 'M 40,50 L 35,78', startX: 40, startY: 50 },
    ],
  },
  'ק': {
    char: 'ק', language: 'he',
    strokes: [
      { id: 1, path: 'M 28,26 L 70,26 L 70,76', startX: 28, startY: 26 },
      { id: 2, path: 'M 35,26 L 35,82', startX: 35, startY: 26 },
    ],
  },
  'ר': {
    char: 'ר', language: 'he',
    strokes: [
      { id: 1, path: 'M 70,26 L 32,26', startX: 70, startY: 26 },
      { id: 2, path: 'M 70,26 Q 72,50 68,76', startX: 70, startY: 26 },
    ],
  },
  'ש': {
    char: 'ש', language: 'he',
    strokes: [
      { id: 1, path: 'M 68,78 L 60,30', startX: 68, startY: 78 },
      { id: 2, path: 'M 50,78 L 50,22', startX: 50, startY: 78 },
      { id: 3, path: 'M 32,78 L 40,30', startX: 32, startY: 78 },
    ],
  },
  'ת': {
    char: 'ת', language: 'he',
    strokes: [
      { id: 1, path: 'M 72,26 L 28,26', startX: 72, startY: 26 },
      { id: 2, path: 'M 72,26 L 72,76', startX: 72, startY: 26 },
      { id: 3, path: 'M 36,26 L 30,76', startX: 36, startY: 26 },
    ],
  },
};

// ═══════════════════════════════════════════════
//  ENGLISH UPPERCASE LETTERS (A–Z)
// ═══════════════════════════════════════════════

export const englishLetterData: Record<string, LetterData> = {
  'A': {
    char: 'A', language: 'en',
    strokes: [
      { id: 1, path: 'M 50,15 L 25,75', startX: 50, startY: 15 },
      { id: 2, path: 'M 50,15 L 75,75', startX: 50, startY: 15 },
      { id: 3, path: 'M 35,55 L 65,55', startX: 35, startY: 55 },
    ],
  },
  'B': {
    char: 'B', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75', startX: 30, startY: 15 },
      { id: 2, path: 'M 30,15 L 60,15 C 80,15 80,45 60,45 C 85,45 85,75 60,75 L 30,75', startX: 30, startY: 15 },
    ],
  },
  'C': {
    char: 'C', language: 'en',
    strokes: [
      { id: 1, path: 'M 75,25 C 65,5 25,5 25,45 C 25,85 65,85 75,65', startX: 75, startY: 25 },
    ],
  },
  'D': {
    char: 'D', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75', startX: 30, startY: 15 },
      { id: 2, path: 'M 30,15 L 50,15 C 80,15 80,75 50,75 L 30,75', startX: 30, startY: 15 },
    ],
  },
  'E': {
    char: 'E', language: 'en',
    strokes: [
      { id: 1, path: 'M 75,15 L 30,15 L 30,75 L 75,75', startX: 75, startY: 15 },
      { id: 2, path: 'M 30,45 L 65,45', startX: 30, startY: 45 },
    ],
  },
  'F': {
    char: 'F', language: 'en',
    strokes: [
      { id: 1, path: 'M 75,15 L 30,15 L 30,75', startX: 75, startY: 15 },
      { id: 2, path: 'M 30,45 L 65,45', startX: 30, startY: 45 },
    ],
  },
  'G': {
    char: 'G', language: 'en',
    strokes: [
      { id: 1, path: 'M 75,25 C 65,5 25,5 25,45 C 25,85 70,85 75,60 L 50,60', startX: 75, startY: 25 },
    ],
  },
  'H': {
    char: 'H', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75', startX: 30, startY: 15 },
      { id: 2, path: 'M 75,15 L 75,75', startX: 75, startY: 15 },
      { id: 3, path: 'M 30,45 L 75,45', startX: 30, startY: 45 },
    ],
  },
  'I': {
    char: 'I', language: 'en',
    strokes: [
      { id: 1, path: 'M 50,15 L 50,75', startX: 50, startY: 15 },
      { id: 2, path: 'M 35,15 L 65,15', startX: 35, startY: 15 },
      { id: 3, path: 'M 35,75 L 65,75', startX: 35, startY: 75 },
    ],
  },
  'J': {
    char: 'J', language: 'en',
    strokes: [
      { id: 1, path: 'M 65,15 L 65,65 C 65,85 35,85 35,65', startX: 65, startY: 15 },
    ],
  },
  'K': {
    char: 'K', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75', startX: 30, startY: 15 },
      { id: 2, path: 'M 75,15 L 30,45', startX: 75, startY: 15 },
      { id: 3, path: 'M 45,45 L 75,75', startX: 45, startY: 45 },
    ],
  },
  'L': {
    char: 'L', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75 L 75,75', startX: 30, startY: 15 },
    ],
  },
  'M': {
    char: 'M', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,75 L 25,15 L 50,45 L 75,15 L 75,75', startX: 25, startY: 75 },
    ],
  },
  'N': {
    char: 'N', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,75 L 25,15 L 75,75 L 75,15', startX: 25, startY: 75 },
    ],
  },
  'O': {
    char: 'O', language: 'en',
    strokes: [
      { id: 1, path: 'M 50,15 C 85,15 85,75 50,75 C 15,75 15,15 50,15', startX: 50, startY: 15 },
    ],
  },
  'P': {
    char: 'P', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75', startX: 30, startY: 15 },
      { id: 2, path: 'M 30,15 L 60,15 C 80,15 80,45 60,45 L 30,45', startX: 30, startY: 15 },
    ],
  },
  'Q': {
    char: 'Q', language: 'en',
    strokes: [
      { id: 1, path: 'M 50,15 C 85,15 85,75 50,75 C 15,75 15,15 50,15', startX: 50, startY: 15 },
      { id: 2, path: 'M 60,60 L 80,80', startX: 60, startY: 60 },
    ],
  },
  'R': {
    char: 'R', language: 'en',
    strokes: [
      { id: 1, path: 'M 30,15 L 30,75', startX: 30, startY: 15 },
      { id: 2, path: 'M 30,15 L 60,15 C 80,15 80,45 60,45 L 30,45', startX: 30, startY: 15 },
      { id: 3, path: 'M 50,45 L 75,75', startX: 50, startY: 45 },
    ],
  },
  'S': {
    char: 'S', language: 'en',
    strokes: [
      { id: 1, path: 'M 75,25 C 75,5 25,5 30,30 C 35,60 75,50 75,65 C 75,85 25,85 30,65', startX: 75, startY: 25 },
    ],
  },
  'T': {
    char: 'T', language: 'en',
    strokes: [
      { id: 1, path: 'M 20,15 L 80,15', startX: 20, startY: 15 },
      { id: 2, path: 'M 50,15 L 50,75', startX: 50, startY: 15 },
    ],
  },
  'U': {
    char: 'U', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,15 L 25,55 C 25,85 75,85 75,55 L 75,15', startX: 25, startY: 15 },
    ],
  },
  'V': {
    char: 'V', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,15 L 50,75 L 75,15', startX: 25, startY: 15 },
    ],
  },
  'W': {
    char: 'W', language: 'en',
    strokes: [
      { id: 1, path: 'M 20,15 L 35,75 L 50,45 L 65,75 L 80,15', startX: 20, startY: 15 },
    ],
  },
  'X': {
    char: 'X', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,15 L 75,75', startX: 25, startY: 15 },
      { id: 2, path: 'M 75,15 L 25,75', startX: 75, startY: 15 },
    ],
  },
  'Y': {
    char: 'Y', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,15 L 50,45', startX: 25, startY: 15 },
      { id: 2, path: 'M 75,15 L 50,45', startX: 75, startY: 15 },
      { id: 3, path: 'M 50,45 L 50,75', startX: 50, startY: 45 },
    ],
  },
  'Z': {
    char: 'Z', language: 'en',
    strokes: [
      { id: 1, path: 'M 25,15 L 75,15 L 25,75 L 75,75', startX: 25, startY: 15 },
    ],
  },
};

// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════

export const HEBREW_CHARS = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
export const ENGLISH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function getLetterData(char: string, lang: 'he' | 'en'): LetterData | null {
  if (lang === 'he') return hebrewLetterData[char] ?? null;
  return englishLetterData[char] ?? null;
}
