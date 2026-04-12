export interface MathQuestionData {
  equation: string;
  correctAnswer: number;
  correctAnswers?: number[]; // For consecutive [before, after]
  options?: number[];
  type?: 'visual' | 'equation' | 'word' | 'fraction' | 'consecutive';
  visualObject?: string;
  fractionOptions?: string[];   // text labels like "1/2", "1/4"
  correctFractionAnswer?: string;
  beforeNumber?: number;
  afterNumber?: number;
}

import { getAllMathG1Numpad } from './mathCurriculum';

// Helper to get a random item from an array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateOptions(correct: number, count: number = 4, spread = 5): number[] {
  const options = new Set<number>();
  options.add(correct);
  let attempts = 0;
  while (options.size < count && attempts < 200) {
    attempts++;
    const offset = randInt(-spread, spread);
    const candidate = correct + offset;
    if (offset !== 0 && candidate > 0 && candidate !== correct) {
      options.add(candidate);
    }
  }
  // Fallback if too similar
  while (options.size < count) {
    options.add(correct + options.size * 2);
  }
  return shuffle(Array.from(options));
}

export function generateMathQuestion(targetDataId: string): MathQuestionData {
  switch (targetDataId) {

    // ──────── GRADE 1 ────────
    case 'math_1_completing_10':
    case 'math_1_add_sub_20':
    case 'math_1_add_sub_100_tens': {
      const pool = getAllMathG1Numpad(targetDataId);
      return getRandomItem(pool);
    }

    // ──────── GRADE 2 ────────
    case 'math_2_addsub100': {
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        const a = randInt(12, 55); const b = randInt(11, 40);
        return { equation: `${a} + ${b} = ?`, correctAnswer: a + b };
      } else {
        const a = randInt(25, 99); const b = randInt(11, a - 10);
        return { equation: `${a} − ${b} = ?`, correctAnswer: a - b };
      }
    }
    case 'math_2_mult_intro': {
      const a = randInt(2, 5); const b = randInt(2, 5);
      const templates = [
        `${a} קְבוּצוֹת שֶׁל ${b}, כַּמָּה בְּסַךְ הַכֹּל?`,
        `${a} × ${b} = ?`,
        `${b} + ${b}${a > 2 ? ` + ${b}` : ''}${a > 3 ? ` + ${b}` : ''}${a > 4 ? ` + ${b}` : ''} = ?`,
      ];
      return { equation: templates[randInt(0, templates.length - 1)], correctAnswer: a * b, type: 'word' };
    }
    case 'math_2_word': {
      const names = ['דני', 'שירה', 'יוסי', 'מיה', 'נועם', 'הילה'];
      const objects = ['תפוחים', 'כדורים', 'ספרים', 'ממתקים', 'פרחים'];
      const n = names[randInt(0, names.length-1)];
      const obj = objects[randInt(0, objects.length-1)];
      const isAdd = Math.random() > 0.5;
      const a1 = randInt(10, 40); const a2 = randInt(5, 20);
      if (isAdd) {
        return { equation: `לְ${n} יֵשׁ ${a1} ${obj}. הוּא/הִיא מְקַבֵּל עוֹד ${a2}. כַּמָּה יֵשׁ?`, correctAnswer: a1 + a2, type: 'word' };
      } else {
        return { equation: `לְ${n} הָיָה ${a1} ${obj}. הוּא/הִיא נָתַן ${a2}. כַּמָּה נִשְׁאֲרוּ?`, correctAnswer: a1 - a2, type: 'word' };
      }
    }

    // ──────── GRADE 3 ────────
    case 'math_3_multdiv': {
      const isMult = Math.random() > 0.4;
      const a = randInt(2, 9); const b = randInt(2, 9);
      if (isMult) {
        return { equation: `${a} × ${b} = ?`, correctAnswer: a * b, options: generateOptions(a * b, 4, 8) };
      } else {
        const product = a * b;
        return { equation: `${product} ÷ ${a} = ?`, correctAnswer: b, options: generateOptions(b, 4, 4) };
      }
    }
    case 'math_3_order': {
      const a = randInt(2, 6); const b = randInt(2, 6); const c = randInt(2, 6);
      const hasDiv = Math.random() > 0.5;
      if (hasDiv) {
        const d = randInt(2, 4); const e = d * randInt(1, 4);
        return { equation: `${e} ÷ ${d} + ${a} = ?`, correctAnswer: (e / d) + a, options: generateOptions((e / d) + a, 4, 4) };
      }
      return { equation: `(${a} + ${b}) × ${c} = ?`, correctAnswer: (a + b) * c, options: generateOptions((a + b) * c, 4, 8) };
    }
    case 'math_3_fractions': {
      const fracPool = [
        { label: 'חֵצִי', text: '½', value: 0.5, visual: '🍕 חֵצִי פִּיצָה' },
        { label: 'רֶבַע', text: '¼', value: 0.25, visual: '🍰 רֶבַע עוּגָה' },
        { label: 'שְׁלִישׁ', text: '⅓', value: 0.333, visual: '🟩 שְׁלִישׁ רִבּוּעַ' },
        { label: 'שָׁלֵם אֶחָד', text: '1', value: 1, visual: '🔵 שָׁלֵם אֶחָד' },
      ];
      const correct = fracPool[randInt(0, fracPool.length - 1)];
      const wrongPool = fracPool.filter(f => f.text !== correct.text);
      const opts = shuffle([correct, ...wrongPool.slice(0, 3)]);
      return {
        equation: `אֵיזֶה שֶׁבֶר מְיַצֵּג: "${correct.visual}"?`,
        correctAnswer: 0,
        type: 'fraction',
        fractionOptions: opts.map(o => o.text),
        correctFractionAnswer: correct.text,
      };
    }

    // ──────── GRADE 4 ────────
    case 'math_4_longdiv': {
      const divisor = randInt(3, 9); const quotient = randInt(10, 40);
      return { equation: `${divisor * quotient} ÷ ${divisor} = ?`, correctAnswer: quotient, options: generateOptions(quotient, 4, 6) };
    }
    case 'math_4_multistep': {
      const a = randInt(4, 12); const b = randInt(2, 5); const c = randInt(3, 20);
      const isAddAfter = Math.random() > 0.5;
      if (isAddAfter) {
        return { equation: `${a} × ${b} + ${c} = ?`, correctAnswer: a * b + c, options: generateOptions(a * b + c, 4, 10) };
      } else {
        return { equation: `${a} × ${b} − ${c} = ?`, correctAnswer: a * b - c, options: generateOptions(a * b - c, 4, 10) };
      }
    }
    case 'math_4_time': {
      const hours = ['7', '8', '9', '10', '11'];
      const startH = hours[randInt(0, hours.length - 1)];
      const startM = ['00', '15', '30', '45'][randInt(0, 3)];
      const addMin = [30, 45, 60, 90][randInt(0, 3)];
      const startTotal = parseInt(startH) * 60 + parseInt(startM);
      const endTotal = startTotal + addMin;
      const endH = Math.floor(endTotal / 60);
      const endMin = endTotal % 60;
      return {
        equation: `השיעור התחיל ב-${startH}:${startM}. נמשך ${addMin} דקות. מתי יסתיים?`,
        correctAnswer: endH * 100 + endMin,
        options: shuffle([endH * 100 + endMin, (endH-1)*100+endMin, endH*100+((endMin+15)%60), (endH+1)*100+endMin]),
        type: 'word',
      };
    }

    // ──────── GRADE 5 ────────
    case 'math_5_frac_ops': {
      const pairs = [
        { eq: '½ + ¼', ans: '¾', other: ['¼', '1', '⅓'] },
        { eq: '⅔ − ⅓', ans: '⅓', other: ['½', '⅔', '1'] },
        { eq: '¾ − ¼', ans: '½', other: ['¼', '⅓', '1'] },
        { eq: '⅓ + ⅓', ans: '⅔', other: ['⅓', '½', '¾'] },
      ];
      const q = pairs[randInt(0, pairs.length - 1)];
      const opts = shuffle([q.ans, ...q.other]);
      return { equation: `${q.eq} = ?`, correctAnswer: 0, type: 'fraction', fractionOptions: opts, correctFractionAnswer: q.ans };
    }
    case 'math_5_decimals': {
      const a = randInt(1, 9); const b = randInt(1, 9);
      const sum = (a + b) / 10;
      const distractors = shuffle([
        (a + b + 1) / 10, (a + b - 1) / 10, (a + b + 2) / 10, sum
      ]).slice(0, 4);
      return { equation: `0.${a} + 0.${b} = ?`, correctAnswer: sum, options: distractors.map(d => parseFloat(d.toFixed(2))) };
    }
    case 'math_5_multistep_word': {
      const price = randInt(8, 20); const qty = randInt(3, 6); const extra = randInt(5, 20);
      const names = ['יעל', 'אמיר', 'רון', 'לי'];
      const n = names[randInt(0, names.length - 1)];
      return {
        equation: `ל${n} יש ${price * qty + extra} ₪. כרטיס עולה ${price} ₪. כמה כרטיסים יכול/ה לקנות?`,
        correctAnswer: qty,
        options: generateOptions(qty, 4, 2),
        type: 'word',
      };
    }

    // ──────── GRADE 6 ────────
    case 'math_6_percentages': {
      const percents = [10, 20, 25, 50, 75];
      const p = percents[randInt(0, percents.length - 1)];
      const base = randInt(2, 10) * 20;
      const ans = (p / 100) * base;
      return { equation: `${p}% מתוך ${base} = ?`, correctAnswer: ans, options: generateOptions(ans, 4, Math.ceil(ans * 0.3)) };
    }
    case 'math_6_ratios': {
      const a = randInt(2, 5); const b = a * randInt(2, 4);
      const total = randInt(3, 6) * (a + b / a);
      const part = Math.round(total * (a / (a + b / a)));
      return { equation: `ביחס ${a}:${b/a}, מתוך ${a + b/a} פריטים, כמה שייכים לחלק הראשון?`, correctAnswer: a, options: generateOptions(a, 4, 2), type: 'word' };
    }
    case 'math_6_algebra': {
      const x = randInt(2, 12); const a = randInt(2, 5); const b = randInt(3, 20);
      return { equation: `${a}x + ${b} = ${a * x + b}\nמצא את x`, correctAnswer: x, options: generateOptions(x, 4, 3) };
    }

    default:
      return { equation: '3 + 4 = ?', correctAnswer: 7, options: [5, 6, 7, 8] };
  }
}
