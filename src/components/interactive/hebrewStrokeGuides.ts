/**
 * Educational stroke guides for Hebrew letters.
 *
 * These define the TEACHING path (how to write the letter),
 * NOT the exact glyph outline. Coordinates are in a 0–100 viewBox
 * that overlays the canvas-rendered gray letter.
 */

export interface HebrewStroke {
  path: string;   // SVG path d-attribute
  startX: number; // start point X (viewBox 0-100)
  startY: number; // start point Y (viewBox 0-100)
}

export interface HebrewLetterGuide {
  strokes: HebrewStroke[];
}

const hebrewStrokeGuides: Record<string, HebrewLetterGuide> = {

  // ─── א (Alef) — 3 strokes ───
  'א': {
    strokes: [
      // 1. Main diagonal stroke: upper-right → lower-left
      { path: 'M 66,24 L 34,76', startX: 66, startY: 24 },
      // 2. Upper-left yud: small curve
      { path: 'M 40,30 Q 30,22 28,36', startX: 40, startY: 30 },
      // 3. Lower-right yud: small curve
      { path: 'M 60,66 Q 72,76 70,62', startX: 60, startY: 66 },
    ],
  },

  // ─── ב (Bet) — 3 strokes ───
  'ב': {
    strokes: [
      // 1. Top horizontal bar: right → left
      { path: 'M 70,26 L 30,26', startX: 70, startY: 26 },
      // 2. Right vertical: top → bottom
      { path: 'M 70,26 L 70,76', startX: 70, startY: 26 },
      // 3. Bottom horizontal bar: right → left
      { path: 'M 70,76 L 26,76', startX: 70, startY: 76 },
    ],
  },

  // ─── ג (Gimel) — 2 strokes ───
  'ג': {
    strokes: [
      // 1. Main vertical stroke: top → bottom
      { path: 'M 56,20 L 56,68', startX: 56, startY: 20 },
      // 2. Foot: diagonal going left-down
      { path: 'M 56,68 L 38,82', startX: 56, startY: 68 },
    ],
  },

  // ─── ד (Dalet) — 2 strokes ───
  'ד': {
    strokes: [
      // 1. Top horizontal bar: right → left
      { path: 'M 70,26 L 30,26', startX: 70, startY: 26 },
      // 2. Right vertical: top → bottom
      { path: 'M 70,26 L 70,76', startX: 70, startY: 26 },
    ],
  },

  // ─── ה (He) — 3 strokes ───
  'ה': {
    strokes: [
      // 1. Top horizontal bar: right → left
      { path: 'M 72,26 L 28,26', startX: 72, startY: 26 },
      // 2. Right vertical: top → bottom
      { path: 'M 72,26 L 72,76', startX: 72, startY: 26 },
      // 3. Left short vertical (detached): top → bottom
      { path: 'M 34,40 L 34,76', startX: 34, startY: 40 },
    ],
  },

  // ─── ו (Vav) — 1 stroke ───
  'ו': {
    strokes: [
      { path: 'M 52,20 L 52,78', startX: 52, startY: 20 },
    ],
  },

  // ─── ז (Zayin) — 2 strokes ───
  'ז': {
    strokes: [
      // 1. Top horizontal: right → left
      { path: 'M 62,26 L 38,26', startX: 62, startY: 26 },
      // 2. Vertical down from center
      { path: 'M 50,26 L 50,78', startX: 50, startY: 26 },
    ],
  },

  // ─── ט (Tet) — 2 strokes ───
  'ט': {
    strokes: [
      // 1. Left side: bottom → up, curve right at top
      { path: 'M 28,76 L 28,38 Q 28,20 50,20', startX: 28, startY: 76 },
      // 2. Right side: continue from top, curve down
      { path: 'M 50,20 Q 72,20 72,38 L 72,58', startX: 50, startY: 20 },
    ],
  },

  // ─── י (Yud) — 1 stroke ───
  'י': {
    strokes: [
      { path: 'M 55,30 Q 50,40 48,50', startX: 55, startY: 30 },
    ],
  },

  // ─── כ (Kaf) — 2 strokes ───
  'כ': {
    strokes: [
      // 1. Top-right curve going left
      { path: 'M 70,26 Q 70,20 50,26 L 30,35', startX: 70, startY: 26 },
      // 2. Curve continuing down to bottom right
      { path: 'M 30,35 Q 28,50 40,65 L 68,78', startX: 30, startY: 35 },
    ],
  },

  // ─── ל (Lamed) — 1 stroke ───
  'ל': {
    strokes: [
      // Ascending stroke: bottom → up, curves left at top
      { path: 'M 58,82 L 58,40 Q 58,16 38,16', startX: 58, startY: 82 },
    ],
  },

  // ─── מ (Mem open) — 3 strokes ───
  'מ': {
    strokes: [
      // 1. Right vertical: top → bottom
      { path: 'M 70,20 L 70,76', startX: 70, startY: 20 },
      // 2. Bottom curve: right → left
      { path: 'M 70,76 Q 52,84 32,70', startX: 70, startY: 76 },
      // 3. Left vertical: bottom → up
      { path: 'M 32,70 L 32,30', startX: 32, startY: 70 },
    ],
  },

  // ─── נ (Nun) — 2 strokes ───
  'נ': {
    strokes: [
      // 1. Top-right to bottom-left diagonal/curve
      { path: 'M 62,26 Q 60,45 40,65', startX: 62, startY: 26 },
      // 2. Bottom horizontal: left → right
      { path: 'M 40,65 L 40,78', startX: 40, startY: 65 },
    ],
  },

  // ─── ס (Samekh) — 1 stroke (closed shape) ───
  'ס': {
    strokes: [
      { path: 'M 50,20 Q 72,20 72,50 Q 72,78 50,78 Q 28,78 28,50 Q 28,20 50,20', startX: 50, startY: 20 },
    ],
  },

  // ─── ע (Ayin) — 2 strokes ───
  'ע': {
    strokes: [
      // 1. Left branch going down-left
      { path: 'M 50,22 L 30,78', startX: 50, startY: 22 },
      // 2. Right branch going down-right
      { path: 'M 50,22 L 70,78', startX: 50, startY: 22 },
    ],
  },

  // ─── פ (Pe) — 2 strokes ───
  'פ': {
    strokes: [
      // 1. Outer shape: top bar and right side going down
      { path: 'M 72,26 L 28,26 L 28,76 L 72,76', startX: 72, startY: 26 },
      // 2. Inner curve (the mouth)
      { path: 'M 60,42 Q 45,42 45,55 Q 45,65 60,65', startX: 60, startY: 42 },
    ],
  },

  // ─── צ (Tsadi) — 2 strokes ───
  'צ': {
    strokes: [
      // 1. Right side: ascending stroke
      { path: 'M 65,78 L 65,30 Q 65,18 55,18', startX: 65, startY: 78 },
      // 2. Left side: shorter stroke
      { path: 'M 40,50 L 35,78', startX: 40, startY: 50 },
    ],
  },

  // ─── ק (Qof) — 2 strokes ───
  'ק': {
    strokes: [
      // 1. Top + right side
      { path: 'M 28,26 L 70,26 L 70,76', startX: 28, startY: 26 },
      // 2. Left descending line (goes below baseline)
      { path: 'M 35,26 L 35,82', startX: 35, startY: 26 },
    ],
  },

  // ─── ר (Resh) — 2 strokes ───
  'ר': {
    strokes: [
      // 1. Top horizontal
      { path: 'M 70,26 L 32,26', startX: 70, startY: 26 },
      // 2. Right curve going down
      { path: 'M 70,26 Q 72,50 68,76', startX: 70, startY: 26 },
    ],
  },

  // ─── ש (Shin) — 3 strokes ───
  'ש': {
    strokes: [
      // 1. Right branch
      { path: 'M 68,78 L 60,30', startX: 68, startY: 78 },
      // 2. Center branch
      { path: 'M 50,78 L 50,22', startX: 50, startY: 78 },
      // 3. Left branch
      { path: 'M 32,78 L 40,30', startX: 32, startY: 78 },
    ],
  },

  // ─── ת (Tav) — 3 strokes ───
  'ת': {
    strokes: [
      // 1. Top horizontal: right → left
      { path: 'M 72,26 L 28,26', startX: 72, startY: 26 },
      // 2. Right vertical: top → bottom
      { path: 'M 72,26 L 72,76', startX: 72, startY: 26 },
      // 3. Left leg: starts from top bar, goes down
      { path: 'M 36,26 L 30,76', startX: 36, startY: 26 },
    ],
  },

  // ─── ח (Chet) — 3 strokes ───
  'ח': {
    strokes: [
      // 1. Top horizontal: right → left
      { path: 'M 72,26 L 28,26', startX: 72, startY: 26 },
      // 2. Right vertical: top → bottom
      { path: 'M 72,26 L 72,76', startX: 72, startY: 26 },
      // 3. Left vertical: top → bottom
      { path: 'M 28,26 L 28,76', startX: 28, startY: 26 },
    ],
  },
};

export default hebrewStrokeGuides;
