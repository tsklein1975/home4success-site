/**
 * MatchPair — each pair = one Hebrew/English letter matched to one clear illustrated word.
 * imgCode = OpenMoji hex code → rendered as:
 *   https://openmoji.org/data/color/svg/{imgCode}.svg
 * This gives clear, colorful, child-friendly illustrations instead of
 * system emoji which render inconsistently across devices.
 */
export type MatchPair = {
  id: string;
  letter: string;
  word: string;      // word shown beneath the image on the card
  emoji: string;     // emoji text — used as fallback if image fails
  imgCode: string;   // OpenMoji SVG hex code (uppercase, no variation selectors)
};

// ─── HEBREW PAIRS ───────────────────────────────────────────
// Rules:
//   • One unique letter per entry (no two entries share the same letter)
//   • Word clearly starts with and represents that letter
//   • Image must be instantly recognisable to a young Israeli child
export const hebrewMatchPairs: MatchPair[] = [
  { id: 'h01', letter: 'א', word: 'ארנב',    emoji: '🐰', imgCode: '1F430' }, // rabbit
  { id: 'h02', letter: 'ב', word: 'בלון',    emoji: '🎈', imgCode: '1F388' }, // balloon
  { id: 'h03', letter: 'ג', word: 'גיטרה',   emoji: '🎸', imgCode: '1F3B8' }, // guitar
  { id: 'h04', letter: 'ד', word: 'דג',      emoji: '🐟', imgCode: '1F41F' }, // fish
  { id: 'h05', letter: 'ה', word: 'הר',      emoji: '⛰️', imgCode: '26F0'  }, // mountain
  { id: 'h06', letter: 'ו', word: 'וופל',    emoji: '🧇', imgCode: '1F9C7' }, // waffle
  { id: 'h07', letter: 'ז', word: 'זברה',    emoji: '🦓', imgCode: '1F993' }, // zebra
  { id: 'h08', letter: 'ח', word: 'חתול',    emoji: '🐱', imgCode: '1F431' }, // cat
  { id: 'h09', letter: 'ט', word: 'טיל',     emoji: '🚀', imgCode: '1F680' }, // rocket
  { id: 'h10', letter: 'י', word: 'יונה',    emoji: '🕊️', imgCode: '1F54A' }, // dove
  { id: 'h11', letter: 'כ', word: 'כדור',    emoji: '⚽', imgCode: '26BD'  }, // football
  { id: 'h12', letter: 'ל', word: 'לב',      emoji: '❤️', imgCode: '2764'  }, // heart
  { id: 'h13', letter: 'מ', word: 'מכונית',  emoji: '🚗', imgCode: '1F697' }, // car
  { id: 'h14', letter: 'נ', word: 'נחש',     emoji: '🐍', imgCode: '1F40D' }, // snake
  { id: 'h15', letter: 'ס', word: 'סוס',     emoji: '🐴', imgCode: '1F434' }, // horse
  { id: 'h16', letter: 'ע', word: 'עכבר',    emoji: '🐭', imgCode: '1F42D' }, // mouse
  { id: 'h17', letter: 'פ', word: 'פיצה',    emoji: '🍕', imgCode: '1F355' }, // pizza
  { id: 'h18', letter: 'צ', word: 'צב',      emoji: '🐢', imgCode: '1F422' }, // turtle
  { id: 'h19', letter: 'ק', word: 'קוף',     emoji: '🐒', imgCode: '1F412' }, // monkey
  { id: 'h20', letter: 'ר', word: 'רכבת',    emoji: '🚂', imgCode: '1F682' }, // train
  { id: 'h21', letter: 'ש', word: 'שמש',     emoji: '☀️', imgCode: '2600'  }, // sun
  { id: 'h22', letter: 'ת', word: 'תפוח',    emoji: '🍎', imgCode: '1F34E' }, // apple
];

// ─── ENGLISH PAIRS ──────────────────────────────────────────
// Rules: same — one unique letter, most recognisable word+image for young learners.
export const englishMatchPairs: MatchPair[] = [
  { id: 'e01', letter: 'A', word: 'Apple',     emoji: '🍎', imgCode: '1F34E' },
  { id: 'e02', letter: 'B', word: 'Bee',        emoji: '🐝', imgCode: '1F41D' },
  { id: 'e03', letter: 'C', word: 'Cat',        emoji: '🐱', imgCode: '1F431' },
  { id: 'e04', letter: 'D', word: 'Dog',        emoji: '🐶', imgCode: '1F436' },
  { id: 'e05', letter: 'E', word: 'Elephant',   emoji: '🐘', imgCode: '1F418' },
  { id: 'e06', letter: 'F', word: 'Fish',       emoji: '🐟', imgCode: '1F41F' },
  { id: 'e07', letter: 'G', word: 'Grapes',     emoji: '🍇', imgCode: '1F347' },
  { id: 'e08', letter: 'H', word: 'Horse',      emoji: '🐴', imgCode: '1F434' },
  { id: 'e09', letter: 'I', word: 'Ice Cream',  emoji: '🍦', imgCode: '1F366' },
  { id: 'e10', letter: 'J', word: 'Juice',      emoji: '🧃', imgCode: '1F9C3' },
  { id: 'e11', letter: 'K', word: 'Key',        emoji: '🔑', imgCode: '1F511' },
  { id: 'e12', letter: 'L', word: 'Lion',       emoji: '🦁', imgCode: '1F981' },
  { id: 'e13', letter: 'M', word: 'Moon',       emoji: '🌙', imgCode: '1F319' },
  { id: 'e14', letter: 'N', word: 'Nose',       emoji: '👃', imgCode: '1F443' },
  { id: 'e15', letter: 'O', word: 'Orange',     emoji: '🍊', imgCode: '1F34A' },
  { id: 'e16', letter: 'P', word: 'Pig',        emoji: '🐷', imgCode: '1F437' },
  { id: 'e17', letter: 'Q', word: 'Queen',      emoji: '👑', imgCode: '1F451' },
  { id: 'e18', letter: 'R', word: 'Rainbow',    emoji: '🌈', imgCode: '1F308' },
  { id: 'e19', letter: 'S', word: 'Star',       emoji: '⭐', imgCode: '2B50'  },
  { id: 'e20', letter: 'T', word: 'Tiger',      emoji: '🐯', imgCode: '1F42F' },
  { id: 'e21', letter: 'U', word: 'Umbrella',   emoji: '☂️', imgCode: '2602'  },
  { id: 'e22', letter: 'V', word: 'Violin',     emoji: '🎻', imgCode: '1F3BB' },
  { id: 'e23', letter: 'W', word: 'Whale',      emoji: '🐋', imgCode: '1F40B' },
  { id: 'e24', letter: 'X', word: 'X-ray',      emoji: '🩻', imgCode: '1FA7B' },
  { id: 'e25', letter: 'Y', word: 'Yo-yo',      emoji: '🪀', imgCode: '1FA80' },
  { id: 'e26', letter: 'Z', word: 'Zebra',      emoji: '🦓', imgCode: '1F993' },
];
