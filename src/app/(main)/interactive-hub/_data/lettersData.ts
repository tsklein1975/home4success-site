export interface LetterData {
  id: string;
  char: string;
  name: string;
  strokes: LetterStroke[];
  strokeWidth?: number;
}

export interface LetterStroke {
  path: string;
  instruction: string; // Direction hint shown to user
}

// ─────────────────────────────────────────────────────────────────────────────
// HEBREW LETTERS
// All paths are in a 100×100 viewBox, designed so that at stroke-width=10
// the rendered shape looks like the actual Hebrew print letter.
// Stroke order matches standard Hebrew handwriting.
// ─────────────────────────────────────────────────────────────────────────────
export const hebrewLetters: LetterData[] = [
  {
    id: 'aleph',
    char: 'א',
    name: 'אלף',
    strokeWidth: 9,
    strokes: [
      {
        // Main diagonal slash from top-right to bottom-left
        path: 'M 72 18 L 28 82',
        instruction: 'גרור מימין למטה-שמאל'
      },
      {
        // Upper-right arm: from center-ish going up-right
        path: 'M 50 50 L 70 24',
        instruction: 'גרור מהמרכז למעלה-ימין'
      },
      {
        // Lower-left arm: from center going down-left
        path: 'M 50 50 L 30 76',
        instruction: 'גרור מהמרכז למטה-שמאל'
      }
    ]
  },
  {
    id: 'bet',
    char: 'ב',
    name: 'בית',
    strokeWidth: 9,
    strokes: [
      {
        // ב: starts top-right, goes LEFT across the top, curves DOWN on the left,
        //    then goes RIGHT along the bottom floor.
        path: 'M 72 26 L 30 26 Q 22 26 22 36 L 22 70 Q 22 78 30 78 L 74 78',
        instruction: 'גרור מימין שמאלה, למטה, ואז ימינה לאורך הרצפה'
      }
    ]
  },
  {
    id: 'gimel',
    char: 'ג',
    name: 'גימל',
    strokeWidth: 9,
    strokes: [
      {
        // ג: vertical stroke down on the right side, with a short foot going left at bottom
        path: 'M 55 18 L 55 72 Q 55 80 45 80 L 28 80',
        instruction: 'גרור מלמעלה למטה ואז שמאלה ברגל'
      }
    ]
  },
  {
    id: 'dalet',
    char: 'ד',
    name: 'דלת',
    strokeWidth: 9,
    strokes: [
      {
        // ד: horizontal roof from right, then down on the LEFT side
        path: 'M 70 22 L 28 22 L 28 78',
        instruction: 'גרור מהפינה הימנית שמאלה ואז למטה'
      }
    ]
  },
  {
    id: 'hey',
    char: 'ה',
    name: 'הא',
    strokeWidth: 9,
    strokes: [
      {
        // Right vertical: full height
        path: 'M 68 22 L 68 78',
        instruction: 'גרור את הקו הימני למטה'
      },
      {
        // Horizontal roof from right to left
        path: 'M 68 22 L 28 22',
        instruction: 'גרור את הגג שמאלה'
      },
      {
        // Left vertical: does NOT reach the floor (gap at bottom = distinguishes ה from ח)
        path: 'M 28 22 L 28 56',
        instruction: 'גרור את הקו השמאלי למטה (לא עד הסוף)'
      }
    ]
  },
  {
    id: 'vav',
    char: 'ו',
    name: 'וו',
    strokeWidth: 9,
    strokes: [
      {
        // ו: small rounded head then straight down — like a nail / hook
        path: 'M 50 20 Q 56 20 58 26 L 58 82',
        instruction: 'גרור מהראש למטה'
      }
    ]
  },
  {
    id: 'zayin',
    char: 'ז',
    name: 'זיין',
    strokeWidth: 9,
    strokes: [
      {
        // ז: horizontal top bar then vertical down from right end
        path: 'M 30 22 L 65 22 L 65 82',
        instruction: 'גרור את הגג ימינה, ואז למטה'
      }
    ]
  },
  {
    id: 'chet',
    char: 'ח',
    name: 'חית',
    strokeWidth: 9,
    strokes: [
      {
        // Right vertical — full height to floor
        path: 'M 68 22 L 68 78',
        instruction: 'גרור את הקו הימני למטה'
      },
      {
        // Horizontal arch connecting both verticals at top
        path: 'M 68 22 L 28 22',
        instruction: 'גרור את הגג שמאלה'
      },
      {
        // Left vertical — also full height (distinguishes ח from ה)
        path: 'M 28 22 L 28 78',
        instruction: 'גרור את הקו השמאלי למטה'
      }
    ]
  },
  {
    id: 'tet',
    char: 'ט',
    name: 'טית',
    strokeWidth: 9,
    strokes: [
      {
        // ט outer U-cup: open at the top. Right side DOWN, bottom curves, left side UP.
        path: 'M 68 28 L 68 72 Q 68 80 50 80 Q 32 80 32 72 L 32 28',
        instruction: 'גרור את הצורה החיצונית (U)'
      },
      {
        // Interior vertical stroke: from top-center DOWN inside the cup
        path: 'M 50 28 L 50 70',
        instruction: 'גרור את הקו האמצעי הפנימי למטה'
      }
    ]
  },
  {
    id: 'yod',
    char: 'י',
    name: 'יוד',
    strokeWidth: 9,
    strokes: [
      {
        // י: tiny comma/teardrop — small curved stroke
        path: 'M 50 28 Q 58 26 60 34 Q 60 44 52 52 Q 46 58 48 66',
        instruction: 'גרור את הצורה הקטנה'
      }
    ]
  },
  {
    id: 'kaf',
    char: 'כ',
    name: 'כף',
    strokeWidth: 9,
    strokes: [
      {
        // כ: open to the RIGHT.
        // Starts top-LEFT, goes RIGHT across roof, curves DOWN on the right,
        // then LEFT along the floor.
        path: 'M 30 26 L 68 26 Q 76 26 76 36 L 76 66 Q 76 76 68 76 L 26 76',
        instruction: 'גרור מהפינה השמאלית ימינה, למטה, ואז שמאלה לאורך הרצפה'
      }
    ]
  },
  {
    id: 'lamed',
    char: 'ל',
    name: 'למד',
    strokeWidth: 9,
    strokes: [
      {
        // ל: ascending arm rises on the RIGHT side from mid-letter height,
        //    body curves DOWN and to the LEFT, floor goes left.
        path: 'M 62 12 Q 70 20 70 32 L 70 70 Q 70 80 60 80 L 26 80',
        instruction: 'גרור מהקרן הגבוהה, למטה ושמאלה'
      }
    ]
  },
  {
    id: 'mem',
    char: 'מ',
    name: 'מם',
    strokeWidth: 9,
    strokes: [
      {
        // מ: The open top-left gap is the KEY visual feature.
        // Path: START at top-right, go DOWN right side, LEFT along floor,
        //        UP left side, then RIGHT across the top — but STOP before reaching the start.
        // This traces a C-rotated shape and leaves a visible open gap at top-left.
        path: 'M 68 24 L 68 74 Q 68 80 60 80 L 32 80 Q 26 80 26 74 L 26 32 Q 26 24 36 24',
        instruction: 'גרור מהפינה הימנית למטה, שמאלה, למעלה ואז ימינה (פתח בפינה שמאל-למעלה)'
      }
    ]
  },
  {
    id: 'nun',
    char: 'נ',
    name: 'נון',
    strokeWidth: 9,
    strokes: [
      {
        // נ: short horizontal at top-right, curves down, foot goes left at bottom
        path: 'M 34 24 Q 58 24 62 32 L 62 72 Q 62 80 54 80 L 36 80',
        instruction: 'גרור מהראש ימינה ולמטה'
      }
    ]
  },
  {
    id: 'samech',
    char: 'ס',
    name: 'סמך',
    strokeWidth: 9,
    strokes: [
      {
        // ס: closed rounded rectangle / circle
        path: 'M 50 20 Q 74 20 74 50 Q 74 80 50 80 Q 26 80 26 50 Q 26 20 50 20',
        instruction: 'גרור את הצורה העגולה הסגורה'
      }
    ]
  },
  {
    id: 'ayin',
    char: 'ע',
    name: 'עין',
    strokeWidth: 9,
    strokes: [
      {
        // ע left arm: goes DOWN-LEFT from the center-top junction
        path: 'M 50 22 Q 34 30 30 48 Q 28 64 38 78',
        instruction: 'גרור את הזרוע השמאלית למטה'
      },
      {
        // ע right arm: goes DOWN-RIGHT from same top point, meets left arm at bottom
        path: 'M 50 22 Q 66 30 68 50 Q 68 66 38 78',
        instruction: 'גרור את הזרוע הימנית למטה'
      }
    ]
  },
  {
    id: 'pey',
    char: 'פ',
    name: 'פה',
    strokeWidth: 9,
    strokes: [
      {
        // פ outer frame: like כ (open to the right)
        path: 'M 30 26 L 68 26 Q 76 26 76 36 L 76 66 Q 76 76 66 76 L 26 76',
        instruction: 'גרור את גוף האות'
      },
      {
        // פ inner bump at top-right: the distinctive protrusion
        path: 'M 68 26 Q 78 36 72 46 L 52 46',
        instruction: 'גרור את הגב הפנימי'
      }
    ]
  },
  {
    id: 'tsadi',
    char: 'צ',
    name: 'צדי',
    strokeWidth: 9,
    strokes: [
      {
        // Right arm: diagonal from top-right going down-left to junction
        path: 'M 66 22 Q 56 30 50 42',
        instruction: 'גרור את הזרוע הימנית'
      },
      {
        // Left arm: meets the right arm at the junction point
        path: 'M 36 22 Q 42 30 50 42',
        instruction: 'גרור את הזרוע השמאלית'
      },
      {
        // Body: from junction down then right — the descending tail
        path: 'M 50 42 L 50 72 Q 50 80 60 80 L 74 80',
        instruction: 'גרור את הזנב למטה ואז ימינה'
      }
    ]
  },
  {
    id: 'qof',
    char: 'ק',
    name: 'קוף',
    strokeWidth: 9,
    strokes: [
      {
        // ק: roof + left vertical that goes BELOW the baseline (distinctive)
        path: 'M 66 22 L 30 22 L 30 88',
        instruction: 'גרור מימין שמאלה ולמטה (מתחת לשורה)'
      },
      {
        // Right vertical: from roof down to normal baseline only
        path: 'M 66 22 L 66 74',
        instruction: 'גרור את הקו הימני למטה'
      }
    ]
  },
  {
    id: 'resh',
    char: 'ר',
    name: 'ריש',
    strokeWidth: 9,
    strokes: [
      {
        // ר: horizontal roof from right, curving/dropping on the RIGHT side then straight down.
        path: 'M 68 22 Q 28 22 26 30 L 26 78',
        instruction: 'גרור מהפינה הימנית שמאלה ולמטה'
      }
    ]
  },
  {
    id: 'shin',
    char: 'ש',
    name: 'שין',
    strokeWidth: 9,
    strokes: [
      {
        // Left arm
        path: 'M 26 22 L 26 70 Q 26 78 34 78',
        instruction: 'גרורו את הזרוע השמאלית למטה'
      },
      {
        // Middle arm (shorter)
        path: 'M 50 32 L 50 78',
        instruction: 'גרורו את הזרוע האמצעית למטה'
      },
      {
        // Right arm and the connecting roof
        path: 'M 26 44 Q 38 32 50 32 Q 62 32 74 44 L 74 78',
        instruction: 'גרורו את הקשת למעלה ואת הזרוע הימנית למטה'
      }
    ]
  },
  {
    id: 'tav',
    char: 'ת',
    name: 'תו',
    strokeWidth: 9,
    strokes: [
      {
        // ת: like ח (horizontal arch + two verticals) but right vertical has a foot curving left
        path: 'M 68 22 L 30 22 L 30 78',
        instruction: 'גרורו מימין שמאלה ולמטה'
      },
      {
        path: 'M 68 22 L 68 72 Q 68 80 58 80',
        instruction: 'גרורו את הקו הימני למטה עם הרגל שמאלה'
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH LETTERS A–Z
// All paths in 100×100 viewBox; stroke-width 9 makes them look like real letters
// ─────────────────────────────────────────────────────────────────────────────
export const englishLetters: LetterData[] = [
  {
    id: 'a',
    char: 'A',
    name: 'A',
    strokeWidth: 9,
    strokes: [
      { path: 'M 50 14 L 18 86', instruction: 'Draw the left leg down' },
      { path: 'M 50 14 L 82 86', instruction: 'Draw the right leg down' },
      { path: 'M 30 56 L 70 56', instruction: 'Draw the crossbar' }
    ]
  },
  {
    id: 'b',
    char: 'B',
    name: 'B',
    strokeWidth: 9,
    strokes: [
      { path: 'M 26 14 L 26 86', instruction: 'Draw the vertical stroke down' },
      {
        path: 'M 26 14 Q 62 14 62 32 Q 62 50 26 50',
        instruction: 'Draw the top bump'
      },
      {
        path: 'M 26 50 Q 68 50 68 68 Q 68 86 26 86',
        instruction: 'Draw the bottom bump'
      }
    ]
  },
  {
    id: 'c',
    char: 'C',
    name: 'C',
    strokeWidth: 9,
    strokes: [
      {
        path: 'M 76 28 Q 76 14 50 14 Q 22 14 22 50 Q 22 86 50 86 Q 76 86 76 72',
        instruction: 'Draw the curve from top to bottom'
      }
    ]
  },
  {
    id: 'd',
    char: 'D',
    name: 'D',
    strokeWidth: 9,
    strokes: [
      { path: 'M 26 14 L 26 86', instruction: 'Draw the vertical' },
      {
        path: 'M 26 14 Q 78 14 78 50 Q 78 86 26 86',
        instruction: 'Draw the curve'
      }
    ]
  },
  {
    id: 'e',
    char: 'E',
    name: 'E',
    strokeWidth: 9,
    strokes: [
      { path: 'M 70 14 L 26 14 L 26 86 L 70 86', instruction: 'Draw top, left side, bottom' },
      { path: 'M 26 50 L 62 50', instruction: 'Draw the middle bar' }
    ]
  },
  {
    id: 'f',
    char: 'F',
    name: 'F',
    strokeWidth: 9,
    strokes: [
      { path: 'M 70 14 L 26 14 L 26 86', instruction: 'Draw top, then down' },
      { path: 'M 26 50 L 62 50', instruction: 'Draw the middle bar' }
    ]
  },
  {
    id: 'g',
    char: 'G',
    name: 'G',
    strokeWidth: 9,
    strokes: [
      {
        path: 'M 76 28 Q 76 14 50 14 Q 22 14 22 50 Q 22 86 50 86 Q 74 86 76 72 L 76 52 L 56 52',
        instruction: 'Draw the curve and shelf'
      }
    ]
  },
  {
    id: 'h',
    char: 'H',
    name: 'H',
    strokeWidth: 9,
    strokes: [
      { path: 'M 26 14 L 26 86', instruction: 'Draw the left vertical' },
      { path: 'M 26 50 L 74 50', instruction: 'Draw the crossbar' },
      { path: 'M 74 14 L 74 86', instruction: 'Draw the right vertical' }
    ]
  },
  {
    id: 'i',
    char: 'I',
    name: 'I',
    strokeWidth: 9,
    strokes: [
      { path: 'M 34 14 L 66 14', instruction: 'Draw the top bar' },
      { path: 'M 50 14 L 50 86', instruction: 'Draw the vertical' },
      { path: 'M 34 86 L 66 86', instruction: 'Draw the bottom bar' }
    ]
  },
  {
    id: 'j',
    char: 'J',
    name: 'J',
    strokeWidth: 9,
    strokes: [
      { path: 'M 40 14 L 68 14', instruction: 'Draw the top bar' },
      { path: 'M 60 14 L 60 76 Q 60 88 46 88 Q 30 88 30 76 L 30 68', instruction: 'Draw the hook' }
    ]
  },
  {
    id: 'k',
    char: 'K',
    name: 'K',
    strokeWidth: 9,
    strokes: [
      { path: 'M 26 14 L 26 86', instruction: 'Draw the vertical' },
      { path: 'M 26 52 L 72 14', instruction: 'Draw the upper arm' },
      { path: 'M 50 38 L 74 86', instruction: 'Draw the lower arm' }
    ]
  },
  {
    id: 'l',
    char: 'L',
    name: 'L',
    strokeWidth: 9,
    strokes: [
      { path: 'M 30 14 L 30 86 L 72 86', instruction: 'Draw down then right' }
    ]
  },
  {
    id: 'm',
    char: 'M',
    name: 'M',
    strokeWidth: 9,
    strokes: [
      { path: 'M 18 86 L 18 14 L 50 58 L 82 14 L 82 86', instruction: 'Draw the M shape' }
    ]
  },
  {
    id: 'n',
    char: 'N',
    name: 'N',
    strokeWidth: 9,
    strokes: [
      { path: 'M 22 86 L 22 14 L 78 86 L 78 14', instruction: 'Draw the N shape' }
    ]
  },
  {
    id: 'o',
    char: 'O',
    name: 'O',
    strokeWidth: 9,
    strokes: [
      { path: 'M 50 14 Q 78 14 78 50 Q 78 86 50 86 Q 22 86 22 50 Q 22 14 50 14', instruction: 'Draw the oval' }
    ]
  },
  {
    id: 'p',
    char: 'P',
    name: 'P',
    strokeWidth: 9,
    strokes: [
      { path: 'M 26 86 L 26 14', instruction: 'Draw the vertical' },
      { path: 'M 26 14 Q 74 14 74 35 Q 74 56 26 56', instruction: 'Draw the bump' }
    ]
  },
  {
    id: 'q',
    char: 'Q',
    name: 'Q',
    strokeWidth: 9,
    strokes: [
      { path: 'M 50 14 Q 78 14 78 50 Q 78 86 50 86 Q 22 86 22 50 Q 22 14 50 14', instruction: 'Draw the oval' },
      { path: 'M 60 66 L 78 84', instruction: 'Draw the tail' }
    ]
  },
  {
    id: 'r',
    char: 'R',
    name: 'R',
    strokeWidth: 9,
    strokes: [
      { path: 'M 26 86 L 26 14', instruction: 'Draw the vertical' },
      { path: 'M 26 14 Q 74 14 74 35 Q 74 56 26 56', instruction: 'Draw the bump' },
      { path: 'M 46 56 L 74 86', instruction: 'Draw the leg' }
    ]
  },
  {
    id: 's',
    char: 'S',
    name: 'S',
    strokeWidth: 9,
    strokes: [
      { path: 'M 74 22 Q 74 14 50 14 Q 24 14 24 32 Q 24 50 50 50 Q 76 50 76 68 Q 76 86 50 86 Q 24 86 24 78', instruction: 'Draw the S curve' }
    ]
  },
  {
    id: 't',
    char: 'T',
    name: 'T',
    strokeWidth: 9,
    strokes: [
      { path: 'M 22 14 L 78 14', instruction: 'Draw the top bar' },
      { path: 'M 50 14 L 50 86', instruction: 'Draw the vertical' }
    ]
  },
  {
    id: 'u',
    char: 'U',
    name: 'U',
    strokeWidth: 9,
    strokes: [
      { path: 'M 22 14 L 22 72 Q 22 88 50 88 Q 78 88 78 72 L 78 14', instruction: 'Draw the U shape' }
    ]
  },
  {
    id: 'v',
    char: 'V',
    name: 'V',
    strokeWidth: 9,
    strokes: [
      { path: 'M 18 14 L 50 86 L 82 14', instruction: 'Draw the V shape' }
    ]
  },
  {
    id: 'w',
    char: 'W',
    name: 'W',
    strokeWidth: 9,
    strokes: [
      { path: 'M 12 14 L 28 86 L 50 44 L 72 86 L 88 14', instruction: 'Draw the W shape' }
    ]
  },
  {
    id: 'x',
    char: 'X',
    name: 'X',
    strokeWidth: 9,
    strokes: [
      { path: 'M 20 14 L 80 86', instruction: 'Draw the first diagonal' },
      { path: 'M 80 14 L 20 86', instruction: 'Draw the second diagonal' }
    ]
  },
  {
    id: 'y',
    char: 'Y',
    name: 'Y',
    strokeWidth: 9,
    strokes: [
      { path: 'M 18 14 L 50 52', instruction: 'Draw the left arm' },
      { path: 'M 82 14 L 50 52', instruction: 'Draw the right arm' },
      { path: 'M 50 52 L 50 86', instruction: 'Draw the tail' }
    ]
  },
  {
    id: 'z',
    char: 'Z',
    name: 'Z',
    strokeWidth: 9,
    strokes: [
      { path: 'M 22 14 L 78 14 L 22 86 L 78 86', instruction: 'Draw the Z shape' }
    ]
  }
];
