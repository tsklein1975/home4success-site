const fs = require('fs');

const hebrewLetters = {
  'א': ['M 35 25 Q 50 45 65 75', 'M 65 25 Q 55 35 45 45', 'M 45 55 Q 35 65 25 75'],
  'ב': ['M 30 25 L 60 25 Q 70 25 70 35 L 70 75', 'M 75 75 L 25 75'],
  'ג': ['M 55 25 L 55 50 Q 55 65 45 75', 'M 50 55 Q 40 65 35 75'],
  'ד': ['M 35 25 L 70 25', 'M 65 25 L 65 75'],
  'ה': ['M 35 25 L 60 25 L 60 75', 'M 40 45 L 40 75'],
  'ו': ['M 45 25 L 50 25 L 50 75'],
  'ז': ['M 45 25 L 55 25', 'M 50 25 L 50 75'],
  'ח': ['M 65 75 L 65 25 L 35 25 L 35 75'],
  'ט': ['M 65 30 L 65 55 Q 65 75 50 75 Q 35 75 35 55 L 35 30 L 45 30'],
  'י': ['M 45 25 Q 50 25 50 35 Q 50 45 45 45'],
  'כ': ['M 65 25 Q 30 25 30 50 Q 30 75 65 75'],
  'ל': ['M 40 10 Q 55 -5 60 20 Q 60 40 45 55 Q 25 70 35 80 Q 45 85 55 75'],
  'מ': ['M 35 25 L 65 25 Q 70 25 70 30 L 70 75', 'M 35 75 L 70 75', 'M 35 25 L 35 55 Q 35 60 40 60'],
  'נ': ['M 35 25 L 60 25 L 60 75 L 35 75'],
  'ס': ['M 50 25 Q 70 25 70 50 Q 70 75 50 75 Q 30 75 30 50 Q 30 25 50 25'],
  'ע': ['M 65 25 Q 55 45 50 60 L 50 75', 'M 35 25 Q 45 45 50 60'],
  'פ': ['M 65 25 Q 30 25 30 50 Q 30 75 65 75 L 65 45 Q 55 45 55 55'],
  'צ': ['M 65 25 Q 55 45 45 55 L 45 75', 'M 45 75 L 35 75', 'M 35 25 Q 40 35 45 45'],
  'ק': ['M 65 25 L 35 25 Q 25 25 25 40 Q 25 55 35 55 L 65 55', 'M 45 30 L 45 95'],
  'ר': ['M 35 25 L 60 25 Q 65 25 65 30 L 65 75'],
  'ש': ['M 70 25 L 70 55 Q 70 75 50 75 L 50 25', 'M 50 75 Q 30 75 30 55 L 30 25'],
  'ת': ['M 30 25 L 60 25 Q 65 25 65 30 L 65 75', 'M 45 25 L 45 65 Q 45 75 30 75']
};

let svgOutput = '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" style="background:#fff;">';

let index = 0;
for (const [letter, paths] of Object.entries(hebrewLetters)) {
    const xOffset = (index % 5) * 150 + 50;
    const yOffset = Math.floor(index / 5) * 150 + 50;
    
    svgOutput += `<g transform="translate(${xOffset}, ${yOffset})">`;
    // Background light gray exact letter bounding debug
    svgOutput += `<text x="50" y="75" font-family="Assistant, Arial" font-size="80" text-anchor="middle" fill="#eee" font-weight="bold">${letter}</text>`;
    
    for (const path of paths) {
        svgOutput += `<path d="${path}" fill="none" stroke="green" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    svgOutput += `</g>`;
    index++;
}

svgOutput += '</svg>';

fs.writeFileSync('/Users/tsvikaklein/.gemini/antigravity/brain/e595a3db-1081-4892-be4b-91720a28a297/test_curves.svg', svgOutput);
console.log('Artifact Created!');
