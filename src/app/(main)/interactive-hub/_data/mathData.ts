export interface MathProblem {
  equation: string;
  correctAnswer: number;
}

export function generateMathProblem(grade: number): MathProblem {
  switch (grade) {
    case 1: {
      // Grade 1: Single digit addition/subtraction
      const isAdd = Math.random() > 0.5;
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      if (isAdd) {
        return { equation: `${a} + ${b} =`, correctAnswer: a + b };
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        return { equation: `${max} - ${min} =`, correctAnswer: max - min };
      }
    }
    case 2: {
      // Grade 2: Two-digit addition/subtraction without complex carry
      const isAdd = Math.random() > 0.5;
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 40) + 10;
      if (isAdd) {
        return { equation: `${a} + ${b} =`, correctAnswer: a + b };
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        return { equation: `${max} - ${min} =`, correctAnswer: max - min };
      }
    }
    case 3: {
      // Grade 3: Multiplication up to 10s and basic division
      const isMult = Math.random() > 0.5;
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      if (isMult) {
        return { equation: `${a} × ${b} =`, correctAnswer: a * b };
      } else {
        const prod = a * b;
        return { equation: `${prod} ÷ ${a} =`, correctAnswer: b };
      }
    }
    case 4: {
      // Grade 4: Larger multiplication or additions with 3 digits
      const isMult = Math.random() > 0.5;
      if (isMult) {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 20) + 10;
        return { equation: `${a} × ${b} =`, correctAnswer: a * b };
      } else {
        const a = Math.floor(Math.random() * 500) + 100;
        const b = Math.floor(Math.random() * 500) + 100;
        return { equation: `${a} + ${b} =`, correctAnswer: a + b };
      }
    }
    case 5: {
      // Grade 5: Basic percentages / decimals
      // Currently implemented as clean arithmetic since inputting decimals on mobile might be tricky.
      // E.g. 50% of 120
      const options = [10, 20, 25, 50, 75];
      const p = options[Math.floor(Math.random() * options.length)];
      const base = (Math.floor(Math.random() * 10) + 2) * 20; // Ensure whole numbers
      return { equation: `${p}% × ${base} =`, correctAnswer: (p / 100) * base };
    }
    case 6: {
      // Grade 6: Algebra basics (solve for X) visually expressed simply.
      // E.g. "X + 15 = 40" -> ask user to input X
      const x = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 30) + 10;
      const total = x + b;
      return { equation: `_ + ${b} = ${total}`, correctAnswer: x };
    }
    default:
      return { equation: `1 + 1 =`, correctAnswer: 2 };
  }
}
